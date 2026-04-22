#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


markdown_path = ROOT / "outputs/release-report.md"
json_path = ROOT / "outputs/release-report.json"
if not markdown_path.exists():
    fail("missing file: outputs/release-report.md")
if not json_path.exists():
    fail("missing file: outputs/release-report.json")

markdown_text = markdown_path.read_text(encoding="utf-8")
data = json.loads(json_path.read_text(encoding="utf-8"))

required_lines = [
    "Version: 2026.04.17-rc1",
    "Commit Count: 3",
    "Monitoring Incident Count: 1",
    "Decision: release-with-monitoring",
]
for line in required_lines:
    if line not in markdown_text:
        fail(f"missing markdown line: {line}")

expected = {
    "version": "2026.04.17-rc1",
    "commit_count": 3,
    "monitoring_incident_count": 1,
    "decision": "release-with-monitoring",
}
for key, value in expected.items():
    if data.get(key) != value:
        fail(f"field mismatch for {key}: expected {value!r}, got {data.get(key)!r}")

print("RELEASE_REPORT_OK")
