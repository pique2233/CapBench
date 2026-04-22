#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


plan_path = ROOT / 'outputs/production-plan.json'
problem_path = ROOT / 'data/problem.json'
if not plan_path.exists():
    fail('missing file: outputs/production-plan.json')
plan = json.loads(plan_path.read_text(encoding='utf-8'))
problem = json.loads(problem_path.read_text(encoding='utf-8'))
products = problem['products']
material_cap = problem['material_capacity']
labor_cap = problem['labor_capacity']
expected_best = None
expected_profit = -1
for alpha in range(20):
    for beta in range(20):
        for gamma in range(20):
            material = (
                alpha * products['alpha']['material']
                + beta * products['beta']['material']
                + gamma * products['gamma']['material']
            )
            labor = (
                alpha * products['alpha']['labor']
                + beta * products['beta']['labor']
                + gamma * products['gamma']['labor']
            )
            if material <= material_cap and labor <= labor_cap:
                profit = (
                    alpha * products['alpha']['profit']
                    + beta * products['beta']['profit']
                    + gamma * products['gamma']['profit']
                )
                if profit > expected_profit:
                    expected_profit = profit
                    expected_best = {'alpha': alpha, 'beta': beta, 'gamma': gamma}
if plan.get('optimal_plan') != expected_best:
    fail(f'optimal plan mismatch: expected {expected_best}')
if plan.get('max_profit') != expected_profit:
    fail('max_profit mismatch')

print('PRODUCTION_PLAN_OK')
