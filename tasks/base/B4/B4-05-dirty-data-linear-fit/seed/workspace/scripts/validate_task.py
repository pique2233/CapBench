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


fit_path = ROOT / 'outputs/fit-result.json'
if not fit_path.exists():
    fail('missing file: outputs/fit-result.json')
fit = json.loads(fit_path.read_text(encoding='utf-8'))
rows = []
with (ROOT / 'data/observations.csv').open(encoding='utf-8') as handle:
    reader = csv.DictReader(handle)
    for row in reader:
        x = row['x'].strip()
        y = row['y'].strip()
        if not x or not y:
            continue
        rows.append((float(x), float(y)))
xs = [x for x, _ in rows]
ys = [y for _, y in rows]
mean_x = sum(xs) / len(xs)
mean_y = sum(ys) / len(ys)
num = sum((x - mean_x) * (y - mean_y) for x, y in rows)
den = sum((x - mean_x) ** 2 for x in xs)
slope = num / den
intercept = mean_y - slope * mean_x
if abs(float(fit.get('slope', 0)) - slope) > 1e-6:
    fail('slope mismatch')
if abs(float(fit.get('intercept', 0)) - intercept) > 1e-6:
    fail('intercept mismatch')
if fit.get('cleaned_row_count') != len(rows):
    fail('cleaned_row_count mismatch')

print('LINEAR_FIT_OK')
