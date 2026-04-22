#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_TOKENS = ['billing data backfill', 'runbook approval', 'Nora', 'Sam', 'Ivy']


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


plan_path = ROOT / 'outputs/handoff.json'
text_path = ROOT / 'outputs/handoff.md'
if not plan_path.exists():
    fail('missing file: outputs/handoff.json')
if not text_path.exists():
    fail('missing file: outputs/handoff.md')

plan = json.loads(plan_path.read_text(encoding='utf-8'))
text = text_path.read_text(encoding='utf-8')
if sorted(plan.get('blockers', [])) != ['billing data backfill', 'runbook approval']:
    fail('blocker list mismatch')
if sorted(plan.get('owner_tags', [])) != ['ops:ivy', 'platform:sam', 'product:nora']:
    fail('owner_tags mismatch')
if plan.get('next_shift_checks') != 3:
    fail('next_shift_checks must equal 3')
for token in REQUIRED_TOKENS:
    if token not in text:
        fail(f'missing token in handoff.md: {token}')

print('HANDOFF_OK')
