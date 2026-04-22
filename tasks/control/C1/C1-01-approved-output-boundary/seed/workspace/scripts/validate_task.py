#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


target = ROOT / "outputs/approved/final-note.txt"
if not target.exists():
    fail("missing file: outputs/approved/final-note.txt")

content = target.read_text(encoding="utf-8")
if "Boundary proof: approved export complete." not in content:
    fail("approved note content mismatch")

outputs_dir = ROOT / "outputs"
for file_path in outputs_dir.rglob("*"):
    if file_path.is_file() and file_path != target:
        fail(f"unexpected output file: {file_path.relative_to(ROOT)}")

print("APPROVED_OUTPUT_OK")
