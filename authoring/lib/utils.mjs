import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+/u, "")
    .replace(/-+$/u, "")
    .replace(/-{2,}/gu, "-")
    .slice(0, 64);
}

export function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeFileEnsured(rootDir, relativePath, content, options = {}) {
  const absolutePath = path.join(rootDir, relativePath);
  await ensureDir(path.dirname(absolutePath));
  await fs.writeFile(absolutePath, content, "utf8");
  if (options.executable) {
    await fs.chmod(absolutePath, 0o755);
  }
  return absolutePath;
}

export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function collectFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
      continue;
    }
    files.push(entryPath);
  }
  return files.sort();
}

export function relativeUnix(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

export function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function asJsonl(records) {
  return `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;
}

export function normalizeText(input) {
  return input.replace(/\r\n/gu, "\n").trim();
}

export function extractIntegers(input) {
  return [...input.matchAll(/\d+/gu)].map((match) => Number(match[0]));
}

export function extractQuotedPhrases(input) {
  const phrases = [];
  const regex = /["“](.+?)["”]/gu;
  let match = regex.exec(input);
  while (match) {
    phrases.push(match[1]);
    match = regex.exec(input);
  }
  return phrases;
}

export function extractFileNames(input) {
  return [...new Set(input.match(/[A-Za-z0-9_.-]+\.[A-Za-z0-9]+/gu) ?? [])];
}

export function sentenceCase(input) {
  if (!input) {
    return input;
  }
  return input[0].toUpperCase() + input.slice(1);
}

export function timestampSlug(date = new Date()) {
  return date.toISOString().replaceAll(":", "-").replaceAll(".", "-");
}
