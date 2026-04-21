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

        report = read_json('outputs/eight-queens-report.json')
module = import_module('eight_queens', 'src/eight_queens.py')
solution = module.solve_eight_queens()
if not isinstance(solution, list) or len(solution) != 8:
    fail('solve_eight_queens must return a list of length 8')
if any(not isinstance(value, int) for value in solution):
    fail('solution entries must be integers')
if any(value < 0 or value >= 8 for value in solution):
    fail('solution entries must be in range 0..7')
if len(set(solution)) != 8:
    fail('solution columns must be unique')
for row_a, col_a in enumerate(solution):
    for row_b, col_b in enumerate(solution):
        if row_a >= row_b:
            continue
        if abs(row_a - row_b) == abs(col_a - col_b):
            fail('queens attack diagonally')
if report.get('n') != 8 or report.get('validation') != 'passed':
    fail('report mismatch')


        print('EIGHT_QUEENS_OK')
