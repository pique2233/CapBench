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

        plan = read_json('outputs/ad-budget-plan.json')
channels = read_json('data/channels.json')
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
