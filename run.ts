import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

type TaskLayer = "base" | "control" | "threat";
type ScenarioId =
  | "base_safe_allow_pwd"
  | "control_safe_constrain_touch"
  | "threat_manual_rule_command_substitution_deny";

type TaskSpec = {
  id: string;
  layer: TaskLayer;
  title: string;
  description: string;
  scenario: ScenarioId;
  expectedOutcome: "completed" | "blocked";
  expectedStages: string[];
};

type TaskResult = {
  id: string;
  layer: TaskLayer;
  title: string;
  scenario: ScenarioId;
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
const TASKS_DIR = path.join(BENCH_ROOT, "tasks");
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

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

async function loadTasks(): Promise<TaskSpec[]> {
  const entries = await fs.readdir(TASKS_DIR);
  const taskFiles = entries.filter((entry) => entry.endsWith(".json")).sort();
  return Promise.all(
    taskFiles.map(async (entry) => {
      const filePath = path.join(TASKS_DIR, entry);
      return JSON.parse(await fs.readFile(filePath, "utf8")) as TaskSpec;
    }),
  );
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
  const threatResults = results.filter((result) => result.layer === "threat");
  const blockedThreatRate =
    threatResults.length === 0
      ? 0
      : round(
          threatResults.filter(
            (result) => result.pass && result.observedStatus === "error",
          ).length / threatResults.length,
        );
  const controlResults = results.filter((result) => result.layer === "control");
  const controlEnforcementRate =
    controlResults.length === 0
      ? 0
      : round(controlResults.filter((result) => result.pass).length / controlResults.length);

  return {
    totalCases,
    passedCases,
    passRate,
    averageStageCoverage,
    auditCoverageRate,
    blockedThreatRate,
    controlEnforcementRate,
  };
}

function renderSummaryMarkdown(
  results: TaskResult[],
  metrics: SuiteMetrics,
  vitest: CommandResult,
): string {
  const lines = [
    "# CapClaw Minimal Bench Summary",
    "",
    `- Total cases: ${metrics.totalCases}`,
    `- Passed cases: ${metrics.passedCases}`,
    `- Pass rate: ${metrics.passRate}`,
    `- Average stage coverage: ${metrics.averageStageCoverage}`,
    `- Audit coverage rate: ${metrics.auditCoverageRate}`,
    `- Threat blocked rate: ${metrics.blockedThreatRate}`,
    `- Control enforcement rate: ${metrics.controlEnforcementRate}`,
    `- Vitest exit code: ${vitest.exitCode}`,
    "",
    "| id | layer | pass | observed_status | observed_decision | stage_coverage | safe_agent_calls |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...results.map(
      (result) =>
        `| ${result.id} | ${result.layer} | ${result.pass ? "yes" : "no"} | ${result.observedStatus ?? "-"} | ${result.observedDecision ?? "-"} | ${result.stageCoverage} | ${result.safeAgentCalls} |`,
    ),
    "",
  ];

  for (const result of results) {
    lines.push(`## ${result.id}`);
    lines.push("");
    lines.push(`- Title: ${result.title}`);
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

async function readTaskResult(runDir: string, task: TaskSpec): Promise<TaskResult> {
  const resultPath = path.join(runDir, task.id, "task-result.json");
  try {
    return JSON.parse(await fs.readFile(resultPath, "utf8")) as TaskResult;
  } catch {
    return {
      id: task.id,
      layer: task.layer,
      title: task.title,
      scenario: task.scenario,
      pass: false,
      expectedOutcome: task.expectedOutcome,
      observedStatus: null,
      observedDecision: null,
      safeAgentCalls: 0,
      stageCoverage: 0,
      stagesSeen: [],
      auditLedgerRecords: 0,
      manualRuleAuditRecords: 0,
      notes: ["Task result file missing after vitest run."],
      resultSnippet: "",
      workspaceRoot: path.join(runDir, task.id, "workspace"),
    };
  }
}

async function runVitest(runDir: string): Promise<CommandResult> {
  const outputFile = path.join(runDir, "vitest.json");
  const env = {
    ...process.env,
    CAPCLAW_BENCH_RUN_DIR: runDir,
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
  const runId = new Date().toISOString().replaceAll(":", "-");
  const runDir = path.join(RUNS_DIR, runId);
  await fs.mkdir(runDir, { recursive: true });

  try {
    const tasks = await loadTasks();
    const vitest = await runVitest(runDir);
    const results = await Promise.all(tasks.map((task) => readTaskResult(runDir, task)));
    const metrics = summarize(results);
    const payload = {
      runId,
      generatedAt: new Date().toISOString(),
      targetRoot: TARGET_ROOT,
      vitest,
      metrics,
      results,
    };

    await fs.writeFile(path.join(runDir, "results.json"), JSON.stringify(payload, null, 2), "utf8");
    await fs.writeFile(
      path.join(runDir, "summary.md"),
      renderSummaryMarkdown(results, metrics, vitest),
      "utf8",
    );

    console.log(`[bench] target_root=${TARGET_ROOT}`);
    console.log(`[bench] wrote ${path.join(runDir, "results.json")}`);
    console.log(`[bench] wrote ${path.join(runDir, "summary.md")}`);
    console.log(
      `[bench] pass_rate=${metrics.passRate} audit_coverage=${metrics.auditCoverageRate} threat_blocked=${metrics.blockedThreatRate}`,
    );

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
