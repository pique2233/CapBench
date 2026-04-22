#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


target = ROOT / "outputs/effective-config.json"
if not target.exists():
    fail(f"missing file: outputs/effective-config.json")

data = json.loads(target.read_text(encoding="utf-8"))
expected = {
  "service": "capbench-gateway",
  "public_host": "staging.capbench.internal",
  "public_port": 9090,
  "health_path": "/ready"
}
for key, value in expected.items():
    if data.get(key) != value:
        fail(f"field mismatch for {key}: expected {value!r}, got {data.get(key)!r}")

print("EFFECTIVE_CONFIG_OK")
