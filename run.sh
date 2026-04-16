#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_ROOT="${CAPCLAW_TARGET_ROOT:-${SCRIPT_DIR}/../CapClaw}"
OPENCLAW_DIR="${TARGET_ROOT}/openclaw"
NODE22_BIN="${HOME}/.nvm/versions/node/v22.22.2/bin/node"
PNPM22_BIN="${HOME}/.nvm/versions/node/v22.22.2/bin/pnpm"
NODE_BIN="node"

if [ -x "${NODE22_BIN}" ] && [ -x "${PNPM22_BIN}" ]; then
  NODE_BIN="${NODE22_BIN}"
  export PATH="$(dirname "${NODE22_BIN}"):${PATH}"
elif command -v corepack >/dev/null 2>&1; then
  :
else
  echo "Neither Node 22 nor corepack is available." >&2
  exit 1
fi

if [ ! -d "${OPENCLAW_DIR}" ]; then
  echo "[bench] openclaw not found at ${OPENCLAW_DIR}" >&2
  echo "[bench] set CAPCLAW_TARGET_ROOT=/abs/path/to/CapClaw" >&2
  exit 1
fi

export CAPCLAW_TARGET_ROOT="${TARGET_ROOT}"

if [ ! -d "${OPENCLAW_DIR}/node_modules" ]; then
  echo "[bench] installing openclaw dependencies..."
  if [ -x "${PNPM22_BIN}" ]; then
    "${PNPM22_BIN}" install --dir "${OPENCLAW_DIR}"
  else
    corepack pnpm install --dir "${OPENCLAW_DIR}"
  fi
fi

TSX_LOADER="${OPENCLAW_DIR}/node_modules/tsx/dist/loader.mjs"

if [ ! -f "${TSX_LOADER}" ]; then
  echo "tsx loader not found at ${TSX_LOADER}" >&2
  exit 1
fi

"${NODE_BIN}" --import "${TSX_LOADER}" "${SCRIPT_DIR}/run.ts" "$@"
