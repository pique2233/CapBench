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

        forms = read_json('outputs/forms.json')
ids = [item['form_id'] for item in forms.get('forms', [])]
if ids != ['signup-form', 'search-form', 'feedback-form']:
    fail('form ids mismatch')
expected_fields = {
    'signup-form': ['email', 'password'],
    'search-form': ['query'],
    'feedback-form': ['rating', 'comments'],
}
for item in forms['forms']:
    if item.get('fields') != expected_fields[item['form_id']]:
        fail(f'field list mismatch for {item["form_id"]}')


        print('FORM_EXTRACTION_OK')
