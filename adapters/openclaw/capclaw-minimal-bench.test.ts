import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { createExecTool } from "../../src/agents/bash-tools.exec.js";
import { __testing, wrapExecToolWithCapClawGovernance } from "../../src/agents/capclaw/exec-governance.js";
import { waitForAllSharedSafetyWorkers } from "../../src/agents/safety/shared-layer/gateway.js";
import type {
  CapClawExecCapabilityParams,
  CapClawSafeAgentDecision,
} from "../../src/agents/capclaw/types.js";

type TaskLayer = "base" | "control" | "threat";
type TaskVariant = "benign" | "ambiguous" | "adversarial_pressure";
type ExecutionKind = "allow" | "constrain" | "manual_rule_deny" | "safe_agent_deny";

type FileContainsAssertion = {
  path: string;
  contains: string[];
};

type TaskAssertions = {
  outputContains?: string[];
  fileExists?: string[];
  fileContains?: FileContainsAssertion[];
  attenuationSeen?: boolean;
  manualRuleDeny?: boolean;
  safeAgentCalls?: number;
  observedStatus?: string;
  observedDecision?: string;
  stageExcludes?: string[];
};

type InstanceSpec = {
  id: string;
  coreTaskId: string;
  variant: TaskVariant;
  layer: TaskLayer;
  subcategory: string;
  complexity: "low" | "medium" | "high";
  title: string;
  description: string;
  taskPath: string;
  instructionPath: string;
  seedWorkspaceDir: string;
  variantWorkspaceDir: string | null;
  kind: ExecutionKind;
  command: string;
  expectedOutcome: "completed" | "blocked";
  expectedStages: string[];
  allowedWritePaths: string[];
  assertions: TaskAssertions;
};

type TaskResult = {
  id: string;
  coreTaskId: string;
  variant: TaskVariant;
  layer: TaskLayer;
  subcategory: string;
  title: string;
  kind: ExecutionKind;
  pass: boolean;
  expectedOutcome: "completed" | "blocked";
  observedStatus: string | null;
  observedDecision: string | null;
  safeAgentCalls: number;
  stageCoverage: number;
  stagesSeen: string[];
  auditLedgerRecords: number;
  manualRuleAuditRecords: number;
  notes: string[];
  resultSnippet: string;
  workspaceRoot: string;
};

type JsonObject = Record<string, unknown>;

const runDir = process.env.CAPCLAW_BENCH_RUN_DIR;
const instanceRegistryPath = process.env.CAPBENCH_INSTANCE_REGISTRY;
const benchRoot = process.env.CAPBENCH_ROOT;

if (!runDir) {
  throw new Error("CAPCLAW_BENCH_RUN_DIR is required");
}

if (!instanceRegistryPath) {
  throw new Error("CAPBENCH_INSTANCE_REGISTRY is required");
}

if (!benchRoot) {
  throw new Error("CAPBENCH_ROOT is required");
}

const instances = JSON.parse(fs.readFileSync(instanceRegistryPath, "utf8")) as InstanceSpec[];

function buildSafeDecision(
  partial: Partial<CapClawSafeAgentDecision>,
): CapClawSafeAgentDecision {
  return {
    decision: "allow",
    riskLevel: "low",
    allowedEffects: [],
    resourceScope: {
      readPaths: [],
      writePaths: [],
      deletePaths: [],
      urls: [],
    },
    requiresHuman: false,
    reasonCodes: [],
    hardened: false,
    issues: [],
    ...partial,
  };
}

function buildContext(
  root: string,
  overrides: Partial<CapClawExecCapabilityParams> = {},
): CapClawExecCapabilityParams {
  return {
    enabled: true,
    required: true,
    agentId: "bench-agent",
    sessionKey: "agent:bench:registry",
    sessionId: "bench-session",
    runId: "bench-run",
    workspaceRoot: root,
    openclawConfig: {},
    extraTrustedPaths: [],
    requestTrustedPaths: [],
    trustedResourceDomain: {
      workspaceRoot: root,
      defaultWorkdir: root,
      allowedPathPrefixes: [root],
      writablePathPrefixes: [root],
      readablePathPrefixes: [root],
      trustedAnchors: [
        { kind: "workspace", pathPrefix: root },
        { kind: "default_workdir", pathPrefix: root },
      ],
      rejectedPaths: [],
    },
    auditRoot: root,
    configuredHost: "gateway",
    configuredSecurity: "full",
    configuredAsk: "off",
    defaultTimeoutSec: 300,
    allowBackground: true,
    sandboxAvailable: false,
    ...overrides,
  };
}

async function createGovernedExec(
  root: string,
  overrides: Partial<CapClawExecCapabilityParams>,
) {
  const context = buildContext(root, overrides);
  const nativeExec = createExecTool({
    host: context.configuredHost,
    security: context.configuredSecurity,
    ask: context.configuredAsk,
    cwd: root,
    capClaw: context,
  });
  return {
    governedExec: wrapExecToolWithCapClawGovernance(nativeExec, context),
  };
}

function firstText(result: {
  content?: Array<{ type?: string; text?: string }>;
}): string {
  return result.content?.find((entry) => entry.type === "text")?.text ?? "";
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fsp.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonl(filePath: string): Promise<JsonObject[]> {
  if (!(await exists(filePath))) {
    return [];
  }
  const raw = await fsp.readFile(filePath, "utf8");
  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as JsonObject);
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function stageCoverage(expectedStages: string[], seenStages: string[]): number {
  const seen = new Set(seenStages);
  const matched = expectedStages.filter((stage) => seen.has(stage)).length;
  return expectedStages.length === 0 ? 1 : matched / expectedStages.length;
}

function stagesFromLedger(records: JsonObject[]): string[] {
  return [...new Set(records.map((record) => String(record.stage ?? ""))).values()].filter(Boolean);
}

async function createWorkspace(taskId: string): Promise<string> {
  const workspaceRoot = path.join(runDir, taskId, "workspace");
  await fsp.rm(path.join(runDir, taskId), { recursive: true, force: true });
  await fsp.mkdir(workspaceRoot, { recursive: true });
  return workspaceRoot;
}

async function copyDirIfExists(source: string, destination: string): Promise<void> {
  if (!(await exists(source))) {
    return;
  }
  await fsp.cp(source, destination, { recursive: true });
}

async function writeResult(taskId: string, result: TaskResult): Promise<void> {
  const caseDir = path.join(runDir, taskId);
  await fsp.mkdir(caseDir, { recursive: true });
  await fsp.writeFile(path.join(caseDir, "task-result.json"), JSON.stringify(result, null, 2), "utf8");
}

function absoluteWritePaths(root: string, relativePaths: string[]): string[] {
  return relativePaths.map((filePath) => path.join(root, filePath));
}

function containsToken(raw: string, token: string): boolean {
  return raw.includes(token);
}

async function fileContains(root: string, assertion: FileContainsAssertion): Promise<boolean> {
  const absolutePath = path.join(root, assertion.path);
  if (!(await exists(absolutePath))) {
    return false;
  }
  const raw = await fsp.readFile(absolutePath, "utf8");
  return assertion.contains.every((token) => containsToken(raw, token));
}

function defaultStatusForOutcome(expectedOutcome: "completed" | "blocked"): string {
  return expectedOutcome === "completed" ? "completed" : "error";
}

async function executeInstance(instance: InstanceSpec): Promise<TaskResult> {
  const workspaceRoot = await createWorkspace(instance.id);
  const seedWorkspaceDir = path.resolve(benchRoot, instance.seedWorkspaceDir);
  const variantWorkspaceDir = instance.variantWorkspaceDir
    ? path.resolve(benchRoot, instance.variantWorkspaceDir)
    : null;
  await copyDirIfExists(seedWorkspaceDir, workspaceRoot);
  if (variantWorkspaceDir) {
    await copyDirIfExists(variantWorkspaceDir, workspaceRoot);
  }
  const allowedWritePaths = absoluteWritePaths(workspaceRoot, instance.allowedWritePaths);
  let safeAgentCalls = 0;

  const { governedExec } = await createGovernedExec(workspaceRoot, {
    safeAgentJudge: {
      async decide() {
        switch (instance.kind) {
          case "allow": {
            safeAgentCalls += 1;
            return buildSafeDecision({
              decision: "allow",
              riskLevel: "low",
              allowedEffects: allowedWritePaths.length > 0 ? ["write_file", "persistent_change"] : [],
              resourceScope: {
                readPaths: [],
                writePaths: allowedWritePaths,
                deletePaths: [],
                urls: [],
              },
              reasonCodes: ["BENCH_ALLOW"],
            });
          }
          case "constrain": {
            safeAgentCalls += 1;
            return buildSafeDecision({
              decision: "constrain",
              riskLevel: "medium",
              allowedEffects: ["write_file", "persistent_change"],
              resourceScope: {
                readPaths: [],
                writePaths: allowedWritePaths,
                deletePaths: [],
                urls: [],
              },
              reasonCodes: ["BENCH_CONSTRAIN"],
            });
          }
          case "manual_rule_deny": {
            safeAgentCalls += 1;
            return buildSafeDecision({
              decision: "allow",
              riskLevel: "low",
              reasonCodes: ["BENCH_MANUAL_RULE_PATH"],
            });
          }
          case "safe_agent_deny": {
            safeAgentCalls += 1;
            return buildSafeDecision({
              decision: "deny",
              riskLevel: "high",
              reasonCodes: ["BENCH_SAFE_AGENT_DENY"],
            });
          }
        }
      },
    },
  });

  const result = (await governedExec.execute(`bench-${instance.id}`, {
    command: instance.command,
    timeout: 60,
  })) as {
    content?: Array<{ type?: string; text?: string }>;
    details?: JsonObject;
  };

  const ledgerRecords = await readJsonl(path.join(workspaceRoot, ".capclaw", "audit-ledger.jsonl"));
  const manualRuleRecords = await readJsonl(
    path.join(workspaceRoot, ".capclaw", "manual-rule-audit.jsonl"),
  );
  const stagesSeen = stagesFromLedger(ledgerRecords);
  const stageCoverageValue = round(stageCoverage(instance.expectedStages, stagesSeen));
  const observedStatus =
    typeof result.details?.status === "string" ? String(result.details.status) : null;
  const observedDecision =
    typeof result.details?.decision === "string" ? String(result.details.decision) : null;
  const resultSnippet = firstText(result);
  const attenuationSeen = ledgerRecords.some((record) => {
    const decision = record.decision as JsonObject | undefined;
    return decision?.decision === "attenuate" || decision?.ruleId === "attenuate.boundary-shrink";
  });
  const manualDenySeen = manualRuleRecords.some((record) => {
    const engine = record.ruleEngine as JsonObject | undefined;
    return engine?.finalDecision === "DENY";
  });

  const notes: string[] = [];
  const expectedStatus = instance.assertions.observedStatus ?? defaultStatusForOutcome(instance.expectedOutcome);

  if (observedStatus !== expectedStatus) {
    notes.push(`Expected status ${expectedStatus} but saw ${observedStatus ?? "null"}.`);
  }
  if (instance.assertions.observedDecision && observedDecision !== instance.assertions.observedDecision) {
    notes.push(
      `Expected decision ${instance.assertions.observedDecision} but saw ${observedDecision ?? "null"}.`,
    );
  }
  if (instance.assertions.safeAgentCalls !== undefined && safeAgentCalls !== instance.assertions.safeAgentCalls) {
    notes.push(`Expected safe agent calls ${instance.assertions.safeAgentCalls} but saw ${safeAgentCalls}.`);
  }
  if (stageCoverageValue !== 1) {
    notes.push(`Expected full stage coverage ${instance.expectedStages.join(",")} but saw ${stagesSeen.join(",")}.`);
  }
  for (const token of instance.assertions.outputContains ?? []) {
    if (!containsToken(resultSnippet, token)) {
      notes.push(`Missing expected output token: ${token}`);
    }
  }
  for (const relativePath of instance.assertions.fileExists ?? []) {
    if (!(await exists(path.join(workspaceRoot, relativePath)))) {
      notes.push(`Expected file not found: ${relativePath}`);
    }
  }
  for (const assertion of instance.assertions.fileContains ?? []) {
    if (!(await fileContains(workspaceRoot, assertion))) {
      notes.push(`Expected file content markers missing: ${assertion.path}`);
    }
  }
  if (instance.assertions.attenuationSeen && !attenuationSeen) {
    notes.push("Expected attenuation was not recorded in the audit ledger.");
  }
  if (instance.assertions.manualRuleDeny && !manualDenySeen) {
    notes.push("Expected manual-rule DENY was not recorded.");
  }
  for (const stage of instance.assertions.stageExcludes ?? []) {
    if (stagesSeen.includes(stage)) {
      notes.push(`Stage ${stage} should not have appeared.`);
    }
  }

  const pass = notes.length === 0;
  const taskResult: TaskResult = {
    id: instance.id,
    coreTaskId: instance.coreTaskId,
    variant: instance.variant,
    layer: instance.layer,
    subcategory: instance.subcategory,
    title: instance.title,
    kind: instance.kind,
    pass,
    expectedOutcome: instance.expectedOutcome,
    observedStatus,
    observedDecision,
    safeAgentCalls,
    stageCoverage: stageCoverageValue,
    stagesSeen,
    auditLedgerRecords: ledgerRecords.length,
    manualRuleAuditRecords: manualRuleRecords.length,
    notes,
    resultSnippet,
    workspaceRoot,
  };

  await writeResult(instance.id, taskResult);
  return taskResult;
}

afterEach(async () => {
  __testing.issuedCapabilities.clear();
  await waitForAllSharedSafetyWorkers();
});

describe.sequential("CapBench registry-driven smoke", () => {
  for (const instance of instances) {
    it(instance.id, async () => {
      const taskResult = await executeInstance(instance);
      expect(taskResult.pass).toBe(true);
    });
  }
});
