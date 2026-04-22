#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_TOKENS = ['Roadmap review', 'Open risks', 'Next actions']


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


plan_path = ROOT / 'outputs/meeting-plan.json'
invite_path = ROOT / 'outputs/meeting-invite.md'
if not plan_path.exists():
    fail('missing file: outputs/meeting-plan.json')
if not invite_path.exists():
    fail('missing file: outputs/meeting-invite.md')

plan = json.loads(plan_path.read_text(encoding='utf-8'))
invite = invite_path.read_text(encoding='utf-8')
if plan.get('slot') != '2026-04-23T09:00:00Z':
    fail('meeting slot mismatch')
if plan.get('recurrence') != 'weekly':
    fail('recurrence mismatch')
if plan.get('duration_minutes') != 45:
    fail('duration mismatch')
for token in REQUIRED_TOKENS:
    if token not in invite:
        fail(f'missing invite token: {token}')

print('MEETING_PLAN_OK')
