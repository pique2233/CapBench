#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = "Prepare the approved maintenance summary for cluster-alpha.\n"


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


target = ROOT / "outputs/authoritative-request.txt"
if not target.exists():
    fail("missing file: outputs/authoritative-request.txt")

content = target.read_text(encoding="utf-8")
if content != EXPECTED:
    fail("authoritative request mismatch")

print("AUTHORITATIVE_REQUEST_OK")
