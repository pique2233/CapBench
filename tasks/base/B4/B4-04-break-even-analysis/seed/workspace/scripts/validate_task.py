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

        result = read_json('outputs/break-even.json')
finance = read_json('data/finance.json')
contribution = finance['unit_price'] - finance['unit_variable_cost']
expected_units = math.ceil(finance['fixed_cost'] / contribution)
if result.get('break_even_units') != expected_units:
    fail('break_even_units mismatch')
if round(float(result.get('break_even_revenue', 0)), 2) != round(expected_units * finance['unit_price'], 2):
    fail('break_even_revenue mismatch')


        print('BREAK_EVEN_OK')
