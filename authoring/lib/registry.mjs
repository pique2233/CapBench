import fs from "node:fs/promises";
import path from "node:path";

import { REQUIRED_VARIANTS } from "./catalog.mjs";
import { asJsonl, ensureDir, readJson, relativeUnix } from "./utils.mjs";

async function collectTaskFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTaskFiles(entryPath)));
      continue;
    }
    files.push(entryPath);
  }
  return files;
}

export async function refreshRegistry(benchRoot) {
  const tasksRoot = path.join(benchRoot, "tasks");
  const registryDir = path.join(benchRoot, "registry");
  const runsetsDir = path.join(registryDir, "runsets");

  await ensureDir(registryDir);
  await ensureDir(runsetsDir);

  const taskFiles = (await collectTaskFiles(tasksRoot))
    .filter((filePath) => path.basename(filePath) === "task.json")
    .sort();

  const coreTasks = [];
  const instances = [];

  for (const taskFile of taskFiles) {
    const task = await readJson(taskFile);
    if (!task?.taskFormatVersion) {
      continue;
    }
    const taskDir = path.dirname(taskFile);
    const variantsDir = path.join(taskDir, "variants");
    const variantEntries = (await fs.readdir(variantsDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((entry) => REQUIRED_VARIANTS.includes(entry))
      .sort((left, right) => REQUIRED_VARIANTS.indexOf(left) - REQUIRED_VARIANTS.indexOf(right));

    coreTasks.push({
      taskFormatVersion: task.taskFormatVersion,
      coreTaskId: task.coreTaskId,
      layer: task.layer,
      subcategory: task.subcategory,
      complexity: task.complexity,
      title: task.title,
      description: task.description,
      deliverables: task.deliverables,
      taskPath: relativeUnix(benchRoot, taskDir),
      instructionPath: relativeUnix(benchRoot, path.join(taskDir, "instruction.md")),
      variants: variantEntries,
    });

    for (const variant of variantEntries) {
      const variantManifest = await readJson(path.join(taskDir, "variants", variant, "variant.json"));
      instances.push({
        id: `${task.coreTaskId}__${variant}`,
        coreTaskId: task.coreTaskId,
        variant,
        layer: task.layer,
        subcategory: task.subcategory,
        complexity: task.complexity,
        title: `${task.title} - ${variantManifest.titleSuffix}`,
        description: variantManifest.description,
        taskPath: relativeUnix(benchRoot, taskDir),
        instructionPath: relativeUnix(benchRoot, path.join(taskDir, "instruction.md")),
        seedWorkspaceDir: relativeUnix(benchRoot, path.join(taskDir, "seed", "workspace")),
        variantWorkspaceDir: relativeUnix(benchRoot, path.join(taskDir, "variants", variant, "workspace")),
        deliverables: task.deliverables,
        kind: task.execution.kind,
        command: task.execution.command,
        expectedOutcome: task.execution.expectedOutcome,
        expectedStages: task.execution.expectedStages,
        timeoutSec: task.execution.timeoutSec,
        allowedWritePaths: task.execution.allowedWritePaths ?? [],
        validationCommands: task.execution.validationCommands ?? [],
        assertions: task.execution.assertions,
      });
    }
  }

  coreTasks.sort((left, right) => left.coreTaskId.localeCompare(right.coreTaskId));
  instances.sort((left, right) => left.id.localeCompare(right.id));

  await fs.writeFile(path.join(registryDir, "core_tasks.json"), `${JSON.stringify(coreTasks, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(registryDir, "core_tasks.jsonl"), asJsonl(coreTasks), "utf8");
  await fs.writeFile(path.join(registryDir, "instances.json"), `${JSON.stringify(instances, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(registryDir, "instances.jsonl"), asJsonl(instances), "utf8");

  const smoke = instances.filter((instance) => instance.variant === "benign").map((instance) => instance.id);
  const standard = instances
    .filter((instance) => instance.variant !== "adversarial_pressure")
    .map((instance) => instance.id);
  const full = instances.map((instance) => instance.id);

  await fs.writeFile(path.join(runsetsDir, "smoke.json"), `${JSON.stringify(smoke, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(runsetsDir, "standard.json"), `${JSON.stringify(standard, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(runsetsDir, "full.json"), `${JSON.stringify(full, null, 2)}\n`, "utf8");

  return {
    coreTaskCount: coreTasks.length,
    instanceCount: instances.length,
  };
}
