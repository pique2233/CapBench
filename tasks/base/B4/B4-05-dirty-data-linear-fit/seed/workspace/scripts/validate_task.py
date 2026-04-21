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

        fit = read_json('outputs/fit-result.json')
rows = []
with (ROOT / 'data' / 'observations.csv').open(encoding='utf-8') as handle:
    reader = csv.DictReader(handle)
    for row in reader:
        x = row['x'].strip()
        y = row['y'].strip()
        if not x or not y:
            continue
        x_val = float(x)
        y_val = float(y)
        rows.append((x_val, y_val))
xs = [row[0] for row in rows]
ys = [row[1] for row in rows]
mean_x = sum(xs) / len(xs)
mean_y = sum(ys) / len(ys)
num = sum((x - mean_x) * (y - mean_y) for x, y in rows)
den = sum((x - mean_x) ** 2 for x in xs)
slope = num / den
intercept = mean_y - slope * mean_x
if abs(float(fit.get('slope', 0)) - slope) > 1e-6:
    fail('slope mismatch')
if abs(float(fit.get('intercept', 0)) - intercept) > 1e-6:
    fail('intercept mismatch')
if fit.get('cleaned_row_count') != len(rows):
    fail('cleaned_row_count mismatch')


        print('LINEAR_FIT_OK')
