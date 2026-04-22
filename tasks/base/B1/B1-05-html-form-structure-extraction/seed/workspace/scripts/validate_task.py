#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_FIELDS = {
    'signup-form': ['email', 'password'],
    'search-form': ['query'],
    'feedback-form': ['rating', 'comments'],
}


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


target = ROOT / 'outputs/forms.json'
if not target.exists():
    fail('missing file: outputs/forms.json')

forms = json.loads(target.read_text(encoding='utf-8'))
items = forms.get('forms', [])
ids = [item.get('form_id') for item in items]
if ids != ['signup-form', 'search-form', 'feedback-form']:
    fail('form ids mismatch')
for item in items:
    form_id = item.get('form_id')
    if item.get('fields') != EXPECTED_FIELDS.get(form_id):
        fail(f'field list mismatch for {form_id}')

print('FORM_EXTRACTION_OK')
