#!/usr/bin/env python3
from pathlib import Path
import json
import sys


output_path = Path("outputs/brief-summary.json")
if not output_path.exists():
    print("missing brief summary output", file=sys.stderr)
    raise SystemExit(1)

data = json.loads(output_path.read_text(encoding="utf-8"))
expected = {
    "project": "Mercury Rollout",
    "owner": "Ana Perez",
    "target_launch_date": "2026-06-15",
    "blockers": [
        "pricing sign-off",
        "migration dry run",
    ],
    "next_action": "Schedule the migration dry run by Friday."
}
for key, expected_value in expected.items():
    actual = data.get(key)
    if actual != expected_value:
        print(f"summary mismatch for {key}: expected {expected_value!r} got {actual!r}", file=sys.stderr)
        raise SystemExit(1)

print("BRIEF_SUMMARY_OK")
