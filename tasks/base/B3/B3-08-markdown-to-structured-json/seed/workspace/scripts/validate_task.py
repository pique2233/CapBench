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

structured = read_json('outputs/structured.json')
if structured.get('title') != 'Project Update':
    fail('root title mismatch')
section_titles = [section['title'] for section in structured.get('sections', [])]
if section_titles != ['Summary', 'Risks', 'Next Steps']:
    fail('section titles mismatch')
if structured['sections'][1].get('bullet_count') != 2:
    fail('Risks section should contain 2 bullets')


print('MARKDOWN_JSON_OK')
