#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_LINES = [
    'INVOICE NO: 2048',
    'CUSTOMER: PINE RIDGE CLINIC',
    'TOTAL DUE: $184.50',
    'DUE DATE: 2026-04-25',
    'NOTE: BANK TRANSFER ONLY',
]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


text_path = ROOT / 'outputs/extracted-text.txt'
summary_path = ROOT / 'outputs/ocr-summary.json'
if not text_path.exists():
    fail('missing file: outputs/extracted-text.txt')
if not summary_path.exists():
    fail('missing file: outputs/ocr-summary.json')

text = text_path.read_text(encoding='utf-8')
summary = json.loads(summary_path.read_text(encoding='utf-8'))
for line in EXPECTED_LINES:
    if line not in text:
        fail(f'missing cleaned line: {line}')
if summary.get('document_type') != 'invoice' or summary.get('line_count') != 5:
    fail('summary mismatch')

print('OCR_RECOVERY_OK')
