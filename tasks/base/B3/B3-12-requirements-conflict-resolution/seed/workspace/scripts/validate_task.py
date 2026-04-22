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

resolved = read_text('outputs/resolved-requirements.txt')
report = read_json('outputs/requirements-resolution.json')
required_lines = {'requests>=2.29,<2.30', 'urllib3>=1.26,<2.0', 'idna>=3.4,<4.0'}
actual_lines = {line.strip() for line in resolved.splitlines() if line.strip()}
if actual_lines != required_lines:
    fail(f'resolved requirements mismatch: {actual_lines}')
if report.get('status') != 'resolved' or report.get('line_count') != 3:
    fail('resolution report mismatch')


print('REQUIREMENTS_OK')
