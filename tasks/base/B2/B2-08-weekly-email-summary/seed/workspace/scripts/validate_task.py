#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_COUNTS = {'pm@acme.test': 2, 'ops@acme.test': 2, 'support@acme.test': 1}
EXPECTED_URGENT = ['ops@acme.test', 'support@acme.test']


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


summary_path = ROOT / 'outputs/weekly-email-summary.json'
text_path = ROOT / 'outputs/weekly-email-summary.md'
if not summary_path.exists():
    fail('missing file: outputs/weekly-email-summary.json')
if not text_path.exists():
    fail('missing file: outputs/weekly-email-summary.md')

summary = json.loads(summary_path.read_text(encoding='utf-8'))
text = text_path.read_text(encoding='utf-8')
if summary.get('sender_counts') != EXPECTED_COUNTS:
    fail('sender_counts mismatch')
if summary.get('urgent_senders') != EXPECTED_URGENT:
    fail('urgent_senders mismatch')
for token in EXPECTED_COUNTS:
    if token not in text:
        fail(f'missing sender token in summary text: {token}')

print('WEEKLY_EMAIL_SUMMARY_OK')
