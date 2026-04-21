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

        report = read_json('outputs/service-status.json')
module = import_module('server', 'app/server.py')
value = module.get_bind_address()
if value != '127.0.0.1:8080':
    fail(f'get_bind_address mismatch: {value}')
if report.get('bind_address') != '127.0.0.1:8080' or report.get('status') != 'passed':
    fail('service report mismatch')


        print('SERVICE_REPAIR_OK')
