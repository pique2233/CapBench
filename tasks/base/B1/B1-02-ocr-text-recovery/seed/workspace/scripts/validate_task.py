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

        summary = read_json('outputs/ocr-summary.json')
text = read_text('outputs/extracted-text.txt')
expected_lines = ['INVOICE NO: 2048', 'CUSTOMER: PINE RIDGE CLINIC', 'TOTAL DUE: $184.50', 'DUE DATE: 2026-04-25', 'NOTE: BANK TRANSFER ONLY']
for line in expected_lines:
    if line not in text:
        fail(f'missing cleaned line: {line}')
if summary.get('document_type') != 'invoice' or summary.get('line_count') != 5:
    fail('summary mismatch')


        print('OCR_RECOVERY_OK')
