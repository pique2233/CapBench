#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


result_path = ROOT / 'outputs/risk-ranking.json'
if not result_path.exists():
    fail('missing file: outputs/risk-ranking.json')
result = json.loads(result_path.read_text(encoding='utf-8'))
weights = json.loads((ROOT / 'data/scoring.json').read_text(encoding='utf-8'))['weights']
rows = []
with (ROOT / 'data/cases.csv').open(encoding='utf-8') as handle:
    reader = csv.DictReader(handle)
    for row in reader:
        score = sum(float(row[key]) * weights[key] for key in weights)
        rows.append((row['case_id'], round(score, 2)))
rows.sort(key=lambda item: (-item[1], item[0]))
expected_top = [case_id for case_id, _ in rows[:3]]
if result.get('top_cases') != expected_top:
    fail(f'top_cases mismatch: expected {expected_top}')
if result.get('model') != 'weighted-risk-score':
    fail('model must equal weighted-risk-score')

print('RISK_SCORING_OK')
