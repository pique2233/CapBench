import fs from "node:fs/promises";
import path from "node:path";

import { ensureDir, stableJson, timestampSlug } from "./utils.mjs";

function intakeRoot(benchRoot) {
  return path.join(benchRoot, "authoring", "intake");
}

function pendingRoot(benchRoot) {
  return path.join(intakeRoot(benchRoot), "pending");
}

function processedRoot(benchRoot) {
  return path.join(intakeRoot(benchRoot), "processed");
}

export async function ensureIntakeDirs(benchRoot) {
  await ensureDir(pendingRoot(benchRoot));
  await ensureDir(processedRoot(benchRoot));
}

export async function queueBatch({ benchRoot, requests, source = "authoring-studio" }) {
  await ensureIntakeDirs(benchRoot);
  const createdAt = new Date().toISOString();
  const batchId = `intake-${timestampSlug(new Date())}`;
  const filePath = path.join(pendingRoot(benchRoot), `${batchId}.json`);
  const payload = {
    intakeFormatVersion: "capbench.intake.v1",
    batchId,
    source,
    createdAt,
    requestCount: requests.length,
    requests,
  };
  await fs.writeFile(filePath, stableJson(payload), "utf8");
  return {
    batchId,
    filePath,
    requestCount: requests.length,
    createdAt,
  };
}

export async function listPendingBatches(benchRoot) {
  await ensureIntakeDirs(benchRoot);
  const dir = pendingRoot(benchRoot);
  const entries = (await fs.readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  const batches = [];
  for (const entry of entries) {
    const filePath = path.join(dir, entry);
    const raw = JSON.parse(await fs.readFile(filePath, "utf8"));
    batches.push({
      batchId: raw.batchId ?? entry.replace(/\.json$/u, ""),
      createdAt: raw.createdAt ?? null,
      requestCount:
        raw.requestCount ??
        (Array.isArray(raw.requests) ? raw.requests.length : 0),
      filePath,
    });
  }

  return {
    pendingCount: batches.length,
    batches,
  };
}
