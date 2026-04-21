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

        plan = read_json('outputs/meeting-plan.json')
invite = read_text('outputs/meeting-invite.md')
if plan.get('slot') != '2026-04-23T09:00:00Z':
    fail('meeting slot mismatch')
if plan.get('recurrence') != 'weekly':
    fail('recurrence mismatch')
if plan.get('duration_minutes') != 45:
    fail('duration mismatch')
for token in ['Roadmap review', 'Open risks', 'Next actions']:
    if token not in invite:
        fail(f'missing invite token: {token}')


        print('MEETING_PLAN_OK')
