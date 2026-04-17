import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

type TaskLayer = "base" | "control" | "threat";
type TaskComplexity = "low" | "medium" | "high";
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

type ExecutionDefinition = {
  kind: ExecutionKind;
  command: string;
  expectedOutcome: "completed" | "blocked";
  expectedStages: string[];
  allowedWritePaths?: string[];
  assertions: TaskAssertions;
};

type CoreTaskDefinition = {
  coreTaskId: string;
  layer: TaskLayer;
  subcategory: string;
  complexity: TaskComplexity;
  title: string;
  description: string;
  execution: ExecutionDefinition;
};

type VariantOverlay = {
  variant: TaskVariant;
  titleSuffix: string;
  description: string;
};

type CoreTaskRecord = {
  coreTaskId: string;
  layer: TaskLayer;
  subcategory: string;
  complexity: TaskComplexity;
  title: string;
  description: string;
  taskPath: string;
  instructionPath: string;
  variants: TaskVariant[];
};

type InstanceSpec = {
  id: string;
  coreTaskId: string;
  variant: TaskVariant;
  layer: TaskLayer;
  subcategory: string;
  complexity: TaskComplexity;
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

type SuiteMetrics = {
  totalCases: number;
  passedCases: number;
  passRate: number;
  averageStageCoverage: number;
  auditCoverageRate: number;
  baseSuccessRate: number;
  controlSuccessRate: number;
  threatSuccessRate: number;
  benignPassRate: number;
  ambiguousPassRate: number;
  adversarialPassRate: number;
  blockedThreatRate: number;
  controlEnforcementRate: number;
};

type CommandResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BENCH_ROOT = __dirname;
const TASKS_ROOT = path.join(BENCH_ROOT, "tasks");
const REGISTRY_DIR = path.join(BENCH_ROOT, "registry");
const RUNSETS_DIR = path.join(REGISTRY_DIR, "runsets");
const RUNS_DIR = path.join(BENCH_ROOT, "runs");
const TARGET_ROOT = path.resolve(
  process.env.CAPCLAW_TARGET_ROOT ?? path.join(BENCH_ROOT, "..", "CapClaw"),
);
const OPENCLAW_DIR = path.join(TARGET_ROOT, "openclaw");
const ADAPTER_SOURCE = path.join(
  BENCH_ROOT,
  "adapters",
  "openclaw",
  "capclaw-minimal-bench.test.ts",
);
const TEST_FILE = path.join(OPENCLAW_DIR, "test", "bench", "capclaw-minimal-bench.test.ts");
const NODE22_BIN = path.join(
  process.env.HOME ?? "",
  ".nvm",
  "versions",
  "node",
  "v22.22.2",
  "bin",
  "node",
);
const NODE22_BIN_DIR = path.dirname(NODE22_BIN);
const DEFAULT_RUNSET = process.env.CAPBENCH_RUNSET ?? "smoke";
const REQUIRED_VARIANTS: TaskVariant[] = ["benign", "ambiguous", "adversarial_pressure"];

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getPathKind(filePath: string): Promise<"missing" | "file" | "directory" | "other"> {
  try {
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      return "file";
    }
    if (stats.isDirectory()) {
      return "directory";
    }
    return "other";
  } catch {
    return "missing";
  }
}

async function assertPathKind(
  filePath: string,
  expected: "file" | "directory",
  label: string,
): Promise<void> {
  const actual = await getPathKind(filePath);
  if (actual !== expected) {
    throw new Error(`${label} expected ${expected} but found ${actual}: ${filePath}`);
  }
}

async function validateTaskPackage(taskFile: string): Promise<void> {
  const taskDir = path.dirname(taskFile);
  const instructionPath = path.join(taskDir, "instruction.md");
  const seedWorkspaceDir = path.join(taskDir, "seed", "workspace");
  const variantsDir = path.join(taskDir, "variants");

  await assertPathKind(instructionPath, "file", "Task package instruction");
  const instruction = await fs.readFile(instructionPath, "utf8");
  if (instruction.trim().length === 0) {
    throw new Error(`Task package instruction.md must be non-empty: ${instructionPath}`);
  }

  await assertPathKind(seedWorkspaceDir, "directory", "Task package seed workspace");
  await assertPathKind(variantsDir, "directory", "Task package variants directory");

  const rawTask = await readJson<unknown>(taskFile);
  if (!isRecord(rawTask)) {
    throw new Error(`Task file must contain a JSON object: ${taskFile}`);
  }
  if ("instruction" in rawTask || "instructionPath" in rawTask || "workspaceFiles" in rawTask) {
    throw new Error(
      `Legacy root fields are not allowed in task.json; use instruction.md and seed/workspace instead: ${taskFile}`,
    );
  }
  if (isRecord(rawTask.execution) && "workspaceFiles" in rawTask.execution) {
    throw new Error(
      `Legacy execution.workspaceFiles is not allowed; use seed/workspace instead: ${taskFile}`,
    );
  }

  const legacyVariantFiles = await Promise.all(
    REQUIRED_VARIANTS.map(async (variant) => ({
      variant,
      kind: await getPathKind(path.join(variantsDir, `${variant}.json`)),
    })),
  );
  const presentLegacyVariantFiles = legacyVariantFiles
    .filter((entry) => entry.kind !== "missing")
    .map((entry) => `${entry.variant}.json`);
  if (presentLegacyVariantFiles.length > 0) {
    throw new Error(
      `Legacy flat variant files are not allowed in ${variantsDir}: ${presentLegacyVariantFiles.join(", ")}`,
    );
  }

  const variantEntries = (await fs.readdir(variantsDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const missingVariants = REQUIRED_VARIANTS.filter((variant) => !variantEntries.includes(variant));
  const extraVariants = variantEntries.filter(
    (entry) => !REQUIRED_VARIANTS.includes(entry as TaskVariant),
  );
  if (missingVariants.length > 0 || extraVariants.length > 0) {
    const details = [
      missingVariants.length > 0 ? `missing: ${missingVariants.join(", ")}` : null,
      extraVariants.length > 0 ? `extra: ${extraVariants.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join("; ");
    throw new Error(`Task package variants must be exactly ${REQUIRED_VARIANTS.join(", ")} (${details})`);
  }

  for (const variant of REQUIRED_VARIANTS) {
    const variantJsonPath = path.join(variantsDir, variant, "variant.json");
    await assertPathKind(variantJsonPath, "file", `Variant manifest for ${variant}`);
    const variantOverlay = await readJson<unknown>(variantJsonPath);
    if (!isRecord(variantOverlay) || variantOverlay.variant !== variant) {
      throw new Error(
        `Variant manifest must declare variant=${variant}: ${variantJsonPath}`,
      );
    }
  }
}

function toJsonl(records: object[]): string {
  return `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;
}

async function collectTaskFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return await collectTaskFiles(entryPath);
      }
      return [entryPath];
    }),
  );
  return files.flat();
}

function buildInstance(
  taskFile: string,
  task: CoreTaskDefinition,
  variantDir: string,
  variant: VariantOverlay,
): InstanceSpec {
  const taskDir = path.dirname(taskFile);
  const seedWorkspaceDir = path.join(taskDir, "seed", "workspace");
  const variantWorkspaceDir = path.join(variantDir, "workspace");

  return {
    id: `${task.coreTaskId}__${variant.variant}`,
    coreTaskId: task.coreTaskId,
    variant: variant.variant,
    layer: task.layer,
    subcategory: task.subcategory,
    complexity: task.complexity,
    title: `${task.title} - ${variant.titleSuffix}`,
    description: variant.description,
    taskPath: path.relative(BENCH_ROOT, taskDir),
    instructionPath: path.relative(BENCH_ROOT, path.join(taskDir, "instruction.md")),
    seedWorkspaceDir: path.relative(BENCH_ROOT, seedWorkspaceDir),
    variantWorkspaceDir: path.relative(BENCH_ROOT, variantWorkspaceDir),
    kind: task.execution.kind,
    command: task.execution.command,
    expectedOutcome: task.execution.expectedOutcome,
    expectedStages: task.execution.expectedStages,
    allowedWritePaths: task.execution.allowedWritePaths ?? [],
    assertions: task.execution.assertions,
  };
}

function compareVariants(left: TaskVariant, right: TaskVariant): number {
  const order: TaskVariant[] = ["benign", "ambiguous", "adversarial_pressure"];
  return order.indexOf(left) - order.indexOf(right);
}

async function generateRegistry(): Promise<{
  coreTasks: CoreTaskRecord[];
  instances: InstanceSpec[];
}> {
  await fs.mkdir(REGISTRY_DIR, { recursive: true });
  await fs.mkdir(RUNSETS_DIR, { recursive: true });

  const taskFiles = (await collectTaskFiles(TASKS_ROOT))
    .filter((filePath) => path.basename(filePath) === "task.json")
    .sort();

  const coreTasks: CoreTaskRecord[] = [];
  const instances: InstanceSpec[] = [];

  for (const taskFile of taskFiles) {
    await validateTaskPackage(taskFile);
    const taskDir = path.dirname(taskFile);
    const task = await readJson<CoreTaskDefinition>(taskFile);
    const variantsDir = path.join(taskDir, "variants");
    const variantDirs = (await fs.readdir(variantsDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(variantsDir, entry.name))
      .sort();
    const variantEntries = await Promise.all(
      variantDirs.map(async (variantDir) => ({
        variantDir,
        overlay: await readJson<VariantOverlay>(path.join(variantDir, "variant.json")),
      })),
    );
    variantEntries.sort((left, right) => compareVariants(left.overlay.variant, right.overlay.variant));

    coreTasks.push({
      coreTaskId: task.coreTaskId,
      layer: task.layer,
      subcategory: task.subcategory,
      complexity: task.complexity,
      title: task.title,
      description: task.description,
      taskPath: path.relative(BENCH_ROOT, taskDir),
      instructionPath: path.relative(BENCH_ROOT, path.join(taskDir, "instruction.md")),
      variants: variantEntries.map((entry) => entry.overlay.variant),
    });

    for (const entry of variantEntries) {
      instances.push(buildInstance(taskFile, task, entry.variantDir, entry.overlay));
    }
  }

  instances.sort((left, right) => left.id.localeCompare(right.id));
  coreTasks.sort((left, right) => left.coreTaskId.localeCompare(right.coreTaskId));

  await fs.writeFile(path.join(REGISTRY_DIR, "core_tasks.json"), JSON.stringify(coreTasks, null, 2), "utf8");
  await fs.writeFile(path.join(REGISTRY_DIR, "instances.json"), JSON.stringify(instances, null, 2), "utf8");
  await fs.writeFile(path.join(REGISTRY_DIR, "core_tasks.jsonl"), toJsonl(coreTasks), "utf8");
  await fs.writeFile(path.join(REGISTRY_DIR, "instances.jsonl"), toJsonl(instances), "utf8");

  const smoke = instances.filter((instance) => instance.variant === "benign").map((instance) => instance.id);
  const standard = instances
    .filter((instance) => instance.variant !== "adversarial_pressure")
    .map((instance) => instance.id);
  const full = instances.map((instance) => instance.id);

  await fs.writeFile(path.join(RUNSETS_DIR, "smoke.json"), JSON.stringify(smoke, null, 2), "utf8");
  await fs.writeFile(path.join(RUNSETS_DIR, "standard.json"), JSON.stringify(standard, null, 2), "utf8");
  await fs.writeFile(path.join(RUNSETS_DIR, "full.json"), JSON.stringify(full, null, 2), "utf8");

  return { coreTasks, instances };
}

async function installAdapter(): Promise<() => Promise<void>> {
  const adapterSource = await fs.readFile(ADAPTER_SOURCE, "utf8");
  await fs.mkdir(path.dirname(TEST_FILE), { recursive: true });

  try {
    const existing = await fs.readFile(TEST_FILE, "utf8");
    await fs.writeFile(TEST_FILE, adapterSource, "utf8");
    return async () => {
      await fs.writeFile(TEST_FILE, existing, "utf8");
    };
  } catch {
    await fs.writeFile(TEST_FILE, adapterSource, "utf8");
    return async () => {
      await fs.rm(TEST_FILE, { force: true });
    };
  }
}

async function loadRunset(runset: string, instances: InstanceSpec[]): Promise<InstanceSpec[]> {
  const runsetPath = path.join(RUNSETS_DIR, `${runset}.json`);
  const selectedIds = await readJson<string[]>(runsetPath);
  const instanceMap = new Map(instances.map((instance) => [instance.id, instance]));
  return selectedIds
    .map((id) => instanceMap.get(id))
    .filter((entry): entry is InstanceSpec => entry !== undefined);
}

function summarize(results: TaskResult[]): SuiteMetrics {
  const totalCases = results.length;
  const passedCases = results.filter((result) => result.pass).length;
  const passRate = totalCases === 0 ? 0 : round(passedCases / totalCases);
  const averageStageCoverage =
    totalCases === 0
      ? 0
      : round(results.reduce((sum, result) => sum + result.stageCoverage, 0) / totalCases);
  const auditCoverageRate =
    totalCases === 0
      ? 0
      : round(results.filter((result) => result.auditLedgerRecords > 0).length / totalCases);

  const byLayer = (layer: TaskLayer) => results.filter((result) => result.layer === layer);
  const byVariant = (variant: TaskVariant) => results.filter((result) => result.variant === variant);
  const passRateFor = (subset: TaskResult[]) =>
    subset.length === 0 ? 0 : round(subset.filter((result) => result.pass).length / subset.length);

  const threatBlocked = results.filter(
    (result) =>
      result.layer === "threat" &&
      result.expectedOutcome === "blocked" &&
      result.pass &&
      result.observedStatus === "error",
  );
  const threatBlockedCandidates = results.filter(
    (result) => result.layer === "threat" && result.expectedOutcome === "blocked",
  );
  const controlCandidates = byLayer("control");

  return {
    totalCases,
    passedCases,
    passRate,
    averageStageCoverage,
    auditCoverageRate,
    baseSuccessRate: passRateFor(byLayer("base")),
    controlSuccessRate: passRateFor(byLayer("control")),
    threatSuccessRate: passRateFor(byLayer("threat")),
    benignPassRate: passRateFor(byVariant("benign")),
    ambiguousPassRate: passRateFor(byVariant("ambiguous")),
    adversarialPassRate: passRateFor(byVariant("adversarial_pressure")),
    blockedThreatRate:
      threatBlockedCandidates.length === 0
        ? 0
        : round(threatBlocked.length / threatBlockedCandidates.length),
    controlEnforcementRate: passRateFor(controlCandidates),
  };
}

function renderSummaryMarkdown(
  results: TaskResult[],
  metrics: SuiteMetrics,
  vitest: CommandResult,
  runset: string,
): string {
  const lines = [
    "# CapBench Run Summary",
    "",
    `- Runset: ${runset}`,
    `- Total cases: ${metrics.totalCases}`,
    `- Passed cases: ${metrics.passedCases}`,
    `- Pass rate: ${metrics.passRate}`,
    `- Average stage coverage: ${metrics.averageStageCoverage}`,
    `- Audit coverage rate: ${metrics.auditCoverageRate}`,
    `- Base success rate: ${metrics.baseSuccessRate}`,
    `- Control success rate: ${metrics.controlSuccessRate}`,
    `- Threat success rate: ${metrics.threatSuccessRate}`,
    `- Benign pass rate: ${metrics.benignPassRate}`,
    `- Ambiguous pass rate: ${metrics.ambiguousPassRate}`,
    `- Adversarial pass rate: ${metrics.adversarialPassRate}`,
    `- Threat blocked rate: ${metrics.blockedThreatRate}`,
    `- Control enforcement rate: ${metrics.controlEnforcementRate}`,
    `- Vitest exit code: ${vitest.exitCode}`,
    "",
    "| id | layer | variant | pass | observed_status | observed_decision | stage_coverage | safe_agent_calls |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...results.map(
      (result) =>
        `| ${result.id} | ${result.layer} | ${result.variant} | ${result.pass ? "yes" : "no"} | ${result.observedStatus ?? "-"} | ${result.observedDecision ?? "-"} | ${result.stageCoverage} | ${result.safeAgentCalls} |`,
    ),
    "",
  ];

  for (const result of results) {
    lines.push(`## ${result.id}`);
    lines.push("");
    lines.push(`- Title: ${result.title}`);
    lines.push(`- Core task: ${result.coreTaskId}`);
    lines.push(`- Subcategory: ${result.subcategory}`);
    lines.push(`- Kind: ${result.kind}`);
    lines.push(`- Stages seen: ${result.stagesSeen.join(", ") || "-"}`);
    lines.push(`- Audit ledger records: ${result.auditLedgerRecords}`);
    lines.push(`- Manual-rule audit records: ${result.manualRuleAuditRecords}`);
    lines.push(`- Workspace: ${result.workspaceRoot}`);
    lines.push(`- Notes: ${result.notes.join(" ") || "none"}`);
    lines.push("");
    lines.push("```text");
    lines.push(result.resultSnippet || "(empty)");
    lines.push("```");
    lines.push("");
  }

  lines.push("## Vitest Stdout");
  lines.push("");
  lines.push("```text");
  lines.push(vitest.stdout.trim() || "(empty)");
  lines.push("```");
  lines.push("");
  lines.push("## Vitest Stderr");
  lines.push("");
  lines.push("```text");
  lines.push(vitest.stderr.trim() || "(empty)");
  lines.push("```");

  return lines.join("\n");
}

async function readTaskResult(runDir: string, instance: InstanceSpec): Promise<TaskResult> {
  const resultPath = path.join(runDir, instance.id, "task-result.json");
  try {
    return JSON.parse(await fs.readFile(resultPath, "utf8")) as TaskResult;
  } catch {
    return {
      id: instance.id,
      coreTaskId: instance.coreTaskId,
      variant: instance.variant,
      layer: instance.layer,
      subcategory: instance.subcategory,
      title: instance.title,
      kind: instance.kind,
      pass: false,
      expectedOutcome: instance.expectedOutcome,
      observedStatus: null,
      observedDecision: null,
      safeAgentCalls: 0,
      stageCoverage: 0,
      stagesSeen: [],
      auditLedgerRecords: 0,
      manualRuleAuditRecords: 0,
      notes: ["Task result file missing after vitest run."],
      resultSnippet: "",
      workspaceRoot: path.join(runDir, instance.id, "workspace"),
    };
  }
}

async function runVitest(runDir: string, activeInstancesPath: string): Promise<CommandResult> {
  const outputFile = path.join(runDir, "vitest.json");
  const env = {
    ...process.env,
    CAPCLAW_BENCH_RUN_DIR: runDir,
    CAPBENCH_INSTANCE_REGISTRY: activeInstancesPath,
    CAPBENCH_ROOT: BENCH_ROOT,
    PATH: `${NODE22_BIN_DIR}:${process.env.PATH ?? ""}`,
  };

  return await new Promise((resolve, reject) => {
    const child = spawn(
      "pnpm",
      [
        "--dir",
        OPENCLAW_DIR,
        "exec",
        "vitest",
        "run",
        TEST_FILE,
        "--maxWorkers=1",
        "--reporter=json",
        `--outputFile=${outputFile}`,
      ],
      {
        env,
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = String(chunk);
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = String(chunk);
      stderr += text;
      process.stderr.write(text);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        exitCode: code ?? 1,
        stdout,
        stderr,
      });
    });
  });
}

async function main(): Promise<void> {
  const restoreAdapter = await installAdapter();
  await fs.mkdir(RUNS_DIR, { recursive: true });
  const { coreTasks, instances } = await generateRegistry();
  const selectedInstances = await loadRunset(DEFAULT_RUNSET, instances);
  const runId = new Date().toISOString().replaceAll(":", "-");
  const runDir = path.join(RUNS_DIR, runId);
  await fs.mkdir(runDir, { recursive: true });

  if (selectedInstances.length === 0) {
    throw new Error(`Runset "${DEFAULT_RUNSET}" produced zero instances.`);
  }

  const activeInstancesPath = path.join(runDir, "active-instances.json");
  await fs.writeFile(activeInstancesPath, JSON.stringify(selectedInstances, null, 2), "utf8");

  try {
    const vitest = await runVitest(runDir, activeInstancesPath);
    const results = await Promise.all(
      selectedInstances.map((instance) => readTaskResult(runDir, instance)),
    );
    const metrics = summarize(results);
    const payload = {
      runId,
      generatedAt: new Date().toISOString(),
      runset: DEFAULT_RUNSET,
      targetRoot: TARGET_ROOT,
      registry: {
        totalCoreTasks: coreTasks.length,
        totalInstances: instances.length,
        selectedInstances: selectedInstances.length,
      },
      vitest,
      metrics,
      results,
    };

    await fs.writeFile(path.join(runDir, "results.json"), JSON.stringify(payload, null, 2), "utf8");
    await fs.writeFile(
      path.join(runDir, "summary.md"),
      renderSummaryMarkdown(results, metrics, vitest, DEFAULT_RUNSET),
      "utf8",
    );

    console.log(`[bench] target_root=${TARGET_ROOT}`);
    console.log(`[bench] runset=${DEFAULT_RUNSET}`);
    console.log(`[bench] core_tasks=${coreTasks.length} instances=${instances.length} selected=${selectedInstances.length}`);
    console.log(`[bench] wrote ${path.join(runDir, "results.json")}`);
    console.log(`[bench] wrote ${path.join(runDir, "summary.md")}`);
    console.log(`[bench] pass_rate=${metrics.passRate} control_success=${metrics.controlSuccessRate} threat_success=${metrics.threatSuccessRate}`);

    if (vitest.exitCode !== 0 || metrics.passedCases !== metrics.totalCases) {
      process.exitCode = 1;
    }
  } finally {
    await restoreAdapter();
  }
}

main().catch((error) => {
  console.error("[bench] fatal", error);
  process.exitCode = 1;
});
