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

crm = read_json('outputs/crm-summary.json')
if crm.get('account_name') != 'Northwind Health':
    fail('account_name mismatch')
if crm.get('opportunity_stage') != 'proposal':
    fail('opportunity_stage mismatch')
if sorted(crm.get('stakeholders', [])) != ['Ava Patel', 'Jon Reyes', 'Mina Shah']:
    fail('stakeholders mismatch')
if len(crm.get('next_actions', [])) != 3:
    fail('expected three next actions')


print('CRM_SUMMARY_OK')
