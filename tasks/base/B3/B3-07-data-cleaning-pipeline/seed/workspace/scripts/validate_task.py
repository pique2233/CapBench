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

        report = read_json('outputs/data-cleaning-report.json')
output_path = ROOT / 'outputs' / 'cleaned_customers.csv'
if not output_path.exists():
    fail('missing cleaned_customers.csv')
rows = list(csv.DictReader(output_path.open(encoding='utf-8')))
if len(rows) != 4:
    fail('expected 4 cleaned rows')
if any(not row['customer_id'] for row in rows):
    fail('customer_id cannot be empty')
if any(row['email'] != row['email'].lower() for row in rows):
    fail('emails must be normalized to lowercase')
if report.get('input_rows') != 6 or report.get('output_rows') != 4:
    fail('report row counts mismatch')


        print('DATA_CLEANING_OK')
