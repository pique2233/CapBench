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

        report = read_json('outputs/config-yaml-report.json')
yaml_text = read_text('outputs/config.yaml').strip()
expected = """app:
  name: launch-portal
  host: 127.0.0.1
  port: 8080
features:
  enableReports: true
  enableExports: false
limits:
  maxUsers: 250
  region: apac""".strip()
if yaml_text != expected:
    fail('config.yaml content mismatch')
if report.get('status') != 'converted':
    fail('report mismatch')


        print('CONFIG_YAML_OK')
