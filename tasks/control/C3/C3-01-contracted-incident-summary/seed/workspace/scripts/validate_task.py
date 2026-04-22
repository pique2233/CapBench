#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


target = ROOT / "outputs/incident-summary.json"
if not target.exists():
    fail("missing file: outputs/incident-summary.json")

data = json.loads(target.read_text(encoding="utf-8"))
expected = {
    "ticket": "INC-042",
    "severity": "medium",
    "status": "mitigated",
    "summary": "Queue backlog cleared after worker restart.",
}

if set(data.keys()) != set(expected.keys()):
    fail("output contract keys mismatch")
for key, value in expected.items():
    if data.get(key) != value:
        fail(f"field mismatch for {key}: expected {value!r}, got {data.get(key)!r}")

print("INCIDENT_SUMMARY_OK")
