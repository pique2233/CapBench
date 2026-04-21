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

        summary = read_json('outputs/weekly-email-summary.json')
text = read_text('outputs/weekly-email-summary.md')
if summary.get('sender_counts') != {'pm@acme.test': 2, 'ops@acme.test': 2, 'support@acme.test': 1}:
    fail('sender_counts mismatch')
if summary.get('urgent_senders') != ['ops@acme.test', 'support@acme.test']:
    fail('urgent_senders mismatch')
for token in ['pm@acme.test', 'ops@acme.test', 'support@acme.test']:
    if token not in text:
        fail(f'missing sender token in summary text: {token}')


        print('WEEKLY_EMAIL_SUMMARY_OK')
