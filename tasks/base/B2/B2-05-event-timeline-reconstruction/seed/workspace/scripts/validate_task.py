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

timeline = read_json('outputs/timeline.json')
expected_order = ['EV-1', 'EV-2', 'EV-3', 'EV-4', 'EV-5']
if timeline.get('ordered_event_ids') != expected_order:
    fail('ordered_event_ids mismatch')
if timeline.get('first_failure_signal') != 'EV-2':
    fail('first_failure_signal mismatch')


print('EVENT_TIMELINE_OK')
