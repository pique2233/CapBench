import fs from "node:fs/promises";
import path from "node:path";

import { REQUIRED_VARIANTS } from "./catalog.mjs";
import { collectFiles, exists, normalizeText, readJson, relativeUnix } from "./utils.mjs";

const REQUIRED_INSTRUCTION_HEADINGS = [
  "## Scenario",
  "## Objective",
  "## Rules",
  "## Completion Checklist",
];

function pushFinding(findings, severity, code, message) {
  findings.push({ severity, code, message });
}

function summarizeStatus(findings) {
  if (findings.some((finding) => finding.severity === "high")) {
    return "needs_attention";
  }
  if (findings.some((finding) => finding.severity === "medium")) {
    return "pass_with_warnings";
  }
  return "pass";
}

export async function reviewTaskPackage(taskDir) {
  const findings = [];
  const taskPath = path.join(taskDir, "task.json");
  const instructionPath = path.join(taskDir, "instruction.md");

  if (!(await exists(taskPath))) {
    pushFinding(findings, "high", "missing_task_json", "task.json is missing.");
    return { status: summarizeStatus(findings), findings };
  }

  if (!(await exists(instructionPath))) {
    pushFinding(findings, "high", "missing_instruction", "instruction.md is missing.");
  }

  const task = await readJson(taskPath);

  if (task.taskFormatVersion !== "capbench.task.v1") {
    pushFinding(findings, "high", "wrong_format_version", "taskFormatVersion must be capbench.task.v1.");
  }
  if ("instruction" in task || "instructionPath" in task || "workspaceFiles" in task) {
    pushFinding(findings, "high", "legacy_root_fields", "Legacy task fields are not allowed; use instruction.md and seed/workspace.");
  }
  if (task.instructionFile !== "instruction.md") {
    pushFinding(findings, "high", "wrong_instruction_file", "instructionFile must equal instruction.md.");
  }
  if (task.seedWorkspaceDir !== "seed/workspace") {
    pushFinding(findings, "high", "wrong_seed_dir", "seedWorkspaceDir must equal seed/workspace.");
  }
  if (task.variantsDir !== "variants") {
    pushFinding(findings, "high", "wrong_variants_dir", "variantsDir must equal variants.");
  }

  if (await exists(instructionPath)) {
    const instruction = await fs.readFile(instructionPath, "utf8");
    for (const heading of REQUIRED_INSTRUCTION_HEADINGS) {
      if (!instruction.includes(heading)) {
        pushFinding(findings, "medium", "instruction_heading_missing", `instruction.md is missing heading: ${heading}`);
      }
    }
    if (normalizeText(instruction).length < 240) {
      pushFinding(findings, "medium", "instruction_too_brief", "instruction.md is unusually short for a publishable benchmark task.");
    }
  }

  const seedWorkspaceDir = path.join(taskDir, "seed", "workspace");
  if (!(await exists(seedWorkspaceDir))) {
    pushFinding(findings, "high", "missing_seed_workspace", "seed/workspace is missing.");
  } else {
    const files = await collectFiles(seedWorkspaceDir);
    if (files.length === 0) {
      pushFinding(findings, "medium", "empty_seed_workspace", "seed/workspace is empty.");
    }
    if (
      task.execution?.expectedOutcome === "completed" &&
      files.some((filePath) => /\.(env|pem|key)$/u.test(filePath) || filePath.includes("/secrets/"))
    ) {
      pushFinding(
        findings,
        "medium",
        "agent_compatibility_risk",
        "Completed task seed includes env/secret-shaped files; this may trigger conservative runtime safety policies.",
      );
    }
  }

  if (task.execution?.expectedOutcome === "completed" && (!Array.isArray(task.deliverables) || task.deliverables.length === 0)) {
    pushFinding(findings, "high", "missing_deliverables", "Completed tasks should declare at least one deliverable.");
  }
  if (task.execution?.expectedOutcome === "blocked" && Array.isArray(task.deliverables) && task.deliverables.length > 0) {
    pushFinding(findings, "high", "blocked_has_deliverables", "Blocked tasks should not declare deliverables.");
  }

  if (
    Array.isArray(task.execution?.allowedWritePaths) &&
    task.execution.allowedWritePaths.length > 0 &&
    Array.isArray(task.deliverables)
  ) {
    for (const deliverable of task.deliverables) {
      const inScope = task.execution.allowedWritePaths.some(
        (allowedPath) =>
          deliverable.path === allowedPath || deliverable.path.startsWith(`${allowedPath}/`),
      );
      if (!inScope) {
        pushFinding(
          findings,
          "high",
          "deliverable_outside_write_scope",
          `Deliverable ${deliverable.path} is outside execution.allowedWritePaths.`,
        );
      }
    }
  }

  if (
    ["B3", "C1", "C2", "C3", "B4"].includes(String(task.coreTaskId).slice(0, 2)) &&
    (!Array.isArray(task.execution?.validationCommands) || task.execution.validationCommands.length === 0)
  ) {
    pushFinding(
      findings,
      "medium",
      "missing_validation_commands",
      "This task family usually benefits from evaluator-run validationCommands, but none were declared.",
    );
  }
  if (
    ["C1", "C2", "C3"].includes(String(task.coreTaskId).slice(0, 2)) &&
    (!Array.isArray(task.execution?.assertions?.filesUnchanged) || task.execution.assertions.filesUnchanged.length === 0)
  ) {
    pushFinding(
      findings,
      "medium",
      "missing_files_unchanged",
      "Control tasks with scoped writes should usually declare assertions.filesUnchanged for out-of-scope files.",
    );
  }

  const variantsDir = path.join(taskDir, "variants");
  if (!(await exists(variantsDir))) {
    pushFinding(findings, "high", "missing_variants_dir", "variants directory is missing.");
  } else {
    const entries = (await fs.readdir(variantsDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    const missing = REQUIRED_VARIANTS.filter((variant) => !entries.includes(variant));
    const extra = entries.filter((entry) => !REQUIRED_VARIANTS.includes(entry));
    if (missing.length > 0 || extra.length > 0) {
      pushFinding(
        findings,
        "high",
        "variant_set_mismatch",
        `variants must be exactly ${REQUIRED_VARIANTS.join(", ")}; missing=${missing.join(",") || "none"} extra=${extra.join(",") || "none"}.`,
      );
    }

    for (const variant of REQUIRED_VARIANTS) {
      const manifestPath = path.join(variantsDir, variant, "variant.json");
      if (!(await exists(manifestPath))) {
        pushFinding(findings, "high", "missing_variant_manifest", `Variant ${variant} is missing variant.json.`);
        continue;
      }
      const manifest = await readJson(manifestPath);
      if (manifest.variant !== variant) {
        pushFinding(findings, "high", "variant_manifest_mismatch", `Variant manifest ${relativeUnix(taskDir, manifestPath)} must declare variant=${variant}.`);
      }
    }
  }

  if (Array.isArray(task.execution?.validationCommands)) {
    for (const [index, validation] of task.execution.validationCommands.entries()) {
      if (typeof validation.command !== "string" || validation.command.trim().length === 0) {
        pushFinding(findings, "high", "validation_command_missing", `validationCommands[${index}] must declare a command.`);
      }
    }
  }
  if (Array.isArray(task.execution?.assertions?.filesUnchanged)) {
    for (const [index, relativePath] of task.execution.assertions.filesUnchanged.entries()) {
      if (typeof relativePath !== "string" || relativePath.trim().length === 0) {
        pushFinding(findings, "high", "files_unchanged_entry_invalid", `filesUnchanged[${index}] must be a non-empty relative path.`);
      }
    }
  }

  return {
    status: summarizeStatus(findings),
    findings,
  };
}
