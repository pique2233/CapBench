import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { groupCatalogByLayer, SUBCATEGORY_CATALOG } from "./lib/catalog.mjs";
import { generateBatch } from "./lib/generator.mjs";
import { reviewTaskPackage } from "./lib/review.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const benchRoot = path.resolve(__dirname, "..");
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.CAPBENCH_STUDIO_PORT ?? 4318);

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function validateRequests(requests) {
  if (!Array.isArray(requests) || requests.length === 0) {
    throw new Error("requests must be a non-empty array.");
  }
  for (const [index, request] of requests.entries()) {
    if (typeof request.layer !== "string" || typeof request.subcategory !== "string" || typeof request.complexity !== "string") {
      throw new Error(`requests[${index}] is missing layer/subcategory/complexity.`);
    }
    if (typeof request.prompt !== "string" || request.prompt.trim().length === 0) {
      throw new Error(`requests[${index}] is missing prompt.`);
    }
  }
}

async function serveStatic(requestPath, response) {
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const absolutePath = path.join(publicDir, normalizedPath);
  const safePath = path.normalize(absolutePath);
  if (!safePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("forbidden");
    return;
  }

  let contentType = "text/plain; charset=utf-8";
  if (safePath.endsWith(".html")) {
    contentType = "text/html; charset=utf-8";
  } else if (safePath.endsWith(".js")) {
    contentType = "application/javascript; charset=utf-8";
  } else if (safePath.endsWith(".css")) {
    contentType = "text/css; charset=utf-8";
  }

  try {
    const data = await fs.readFile(safePath);
    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("not found");
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    if (request.method === "GET" && url.pathname === "/api/catalog") {
      return json(response, 200, {
        subcategories: SUBCATEGORY_CATALOG,
        grouped: groupCatalogByLayer(),
      });
    }

    if (request.method === "POST" && url.pathname === "/api/generate-batch") {
      const body = await readBody(request);
      validateRequests(body.requests);
      const result = await generateBatch({
        benchRoot,
        requests: body.requests,
        write: body.write !== false,
        refreshRegistryAfterWrite: body.refreshRegistry !== false,
      });
      return json(response, 200, result);
    }

    if (request.method === "POST" && url.pathname === "/api/review") {
      const body = await readBody(request);
      if (typeof body.taskDir !== "string" || body.taskDir.trim().length === 0) {
        throw new Error("taskDir is required.");
      }
      const review = await reviewTaskPackage(body.taskDir);
      return json(response, 200, review);
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return json(response, 200, { ok: true, port, benchRoot });
    }

    return await serveStatic(url.pathname, response);
  } catch (error) {
    return json(response, 500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(port, () => {
  console.log(`[capbench-studio] http://127.0.0.1:${port}`);
});
