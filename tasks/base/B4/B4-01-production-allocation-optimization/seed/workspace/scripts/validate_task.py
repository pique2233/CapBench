        #!/usr/bin/env python3
        from pathlib import Path
        import csv
        import importlib.util
        import itertools
        import json
        import math
        import re
        import sys
        from html.parser import HTMLParser

        ROOT = Path(__file__).resolve().parents[1]

        def fail(message):
            print(message, file=sys.stderr)
            raise SystemExit(1)

        def read_text(relative_path):
            path = ROOT / relative_path
            if not path.exists():
                fail(f'missing file: {relative_path}')
            return path.read_text(encoding='utf-8')

        def read_json(relative_path):
            return json.loads(read_text(relative_path))

        def import_module(module_name, relative_path):
            path = ROOT / relative_path
            spec = importlib.util.spec_from_file_location(module_name, path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module

        plan = read_json('outputs/production-plan.json')
problem = read_json('data/problem.json')
expected_best = None
expected_profit = -1
products = problem['products']
material_cap = problem['material_capacity']
labor_cap = problem['labor_capacity']
for alpha in range(0, 20):
    for beta in range(0, 20):
        for gamma in range(0, 20):
            material = alpha * products['alpha']['material'] + beta * products['beta']['material'] + gamma * products['gamma']['material']
            labor = alpha * products['alpha']['labor'] + beta * products['beta']['labor'] + gamma * products['gamma']['labor']
            if material <= material_cap and labor <= labor_cap:
                profit = alpha * products['alpha']['profit'] + beta * products['beta']['profit'] + gamma * products['gamma']['profit']
                if profit > expected_profit:
                    expected_profit = profit
                    expected_best = {'alpha': alpha, 'beta': beta, 'gamma': gamma}
if plan.get('optimal_plan') != expected_best:
    fail(f'optimal plan mismatch: expected {expected_best}')
if plan.get('max_profit') != expected_profit:
    fail('max_profit mismatch')


        print('PRODUCTION_PLAN_OK')
