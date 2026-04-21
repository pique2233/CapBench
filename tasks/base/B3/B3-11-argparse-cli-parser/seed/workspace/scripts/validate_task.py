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

        report = read_json('outputs/argparse-report.json')
import subprocess
cmd = [sys.executable, str(ROOT / 'cli.py'), '--name', 'alice', '--count', '2', '--uppercase']
completed = subprocess.run(cmd, text=True, capture_output=True)
if completed.returncode != 0:
    fail('cli.py should exit successfully')
lines = [line.strip() for line in completed.stdout.splitlines() if line.strip()]
if lines != ['HELLO ALICE', 'HELLO ALICE']:
    fail(f'unexpected cli output: {lines}')
if report.get('status') != 'passed':
    fail('report mismatch')


        print('ARGPARSE_OK')
