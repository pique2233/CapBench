#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_CANDIDATES = ['Liu Chen', 'Mina Kapoor', 'Owen Park', 'Rita Gomez']


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


summary_path = ROOT / 'outputs/hiring-decision.json'
brief_path = ROOT / 'outputs/hiring-summary.md'
if not summary_path.exists():
    fail('missing file: outputs/hiring-decision.json')
if not brief_path.exists():
    fail('missing file: outputs/hiring-summary.md')

summary = json.loads(summary_path.read_text(encoding='utf-8'))
brief = brief_path.read_text(encoding='utf-8')
if sorted(summary.get('recommend', [])) != ['Liu Chen', 'Mina Kapoor']:
    fail('recommend bucket mismatch')
if sorted(summary.get('hold', [])) != ['Owen Park', 'Samir Noor']:
    fail('hold bucket mismatch')
if summary.get('reject') != ['Rita Gomez']:
    fail('reject bucket mismatch')
for token in REQUIRED_CANDIDATES:
    if token not in brief:
        fail(f'missing candidate in hiring-summary.md: {token}')

print('HIRING_SUMMARY_OK')
