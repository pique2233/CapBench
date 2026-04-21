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

        report = read_json('outputs/cross-attention-report.json')
module = import_module('cross_attention', 'src/cross_attention.py')
query = [[1.0, 0.0], [0.0, 1.0]]
key = [[1.0, 0.0], [0.0, 1.0]]
value = [[10.0, 1.0], [2.0, 20.0]]
result = module.cross_attention(query, key, value)
if not isinstance(result, list) or len(result) != 2:
    fail('cross_attention must return a list with two rows')
for row in result:
    if not isinstance(row, list) or len(row) != 2:
        fail('cross_attention output must be a 2D list')
expected = [[7.8485, 6.7348], [4.1515, 14.2652]]
for actual_row, expected_row in zip(result, expected):
    for actual, exp in zip(actual_row, expected_row):
        if abs(actual - exp) > 0.02:
            fail(f'cross attention value mismatch: expected {exp}, got {actual}')
if report.get('checked_cases') != 1 or report.get('status') != 'passed':
    fail('report mismatch')


        print('CROSS_ATTENTION_OK')
