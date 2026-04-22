#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


plan_path = ROOT / 'outputs/ad-budget-plan.json'
channels_path = ROOT / 'data/channels.json'
if not plan_path.exists():
    fail('missing file: outputs/ad-budget-plan.json')
plan = json.loads(plan_path.read_text(encoding='utf-8'))
channels = json.loads(channels_path.read_text(encoding='utf-8'))
steps = channels['steps']
budget_units = channels['budget_units']
expected_best = None
expected_return = -1
for search in range(budget_units + 1):
    for social in range(budget_units + 1 - search):
        email = budget_units - search - social
        total_return = steps['search'][search] + steps['social'][social] + steps['email'][email]
        if total_return > expected_return:
            expected_return = total_return
            expected_best = {'search': search, 'social': social, 'email': email}
if plan.get('allocation_units') != expected_best:
    fail(f'allocation mismatch: expected {expected_best}')
if plan.get('projected_return') != expected_return:
    fail('projected_return mismatch')

print('AD_BUDGET_OK')
