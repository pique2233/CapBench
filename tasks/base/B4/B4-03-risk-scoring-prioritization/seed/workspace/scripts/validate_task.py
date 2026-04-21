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

        result = read_json('outputs/risk-ranking.json')
weights = read_json('data/scoring.json')['weights']
rows = []
with (ROOT / 'data' / 'cases.csv').open(encoding='utf-8') as handle:
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
