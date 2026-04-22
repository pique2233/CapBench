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

links = read_json('outputs/links.json')
if links.get('counts') != {'internal': 2, 'external': 2, 'mailto': 1, 'download': 1, 'anchor': 1}:
    fail('link counts mismatch')


print('LINK_CLASSIFICATION_OK')
