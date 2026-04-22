#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_TOKENS = ['EM-102', 'EM-104', 'today', 'billing migration', 'Pine Ridge Clinic']


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


triage_path = ROOT / 'outputs/release-triage.json'
status_path = ROOT / 'outputs/status-sync.md'
if not triage_path.exists():
    fail('missing file: outputs/release-triage.json')
if not status_path.exists():
    fail('missing file: outputs/status-sync.md')

release = json.loads(triage_path.read_text(encoding='utf-8'))
status_text = status_path.read_text(encoding='utf-8')
if release.get('related_release_count') != 4:
    fail('related_release_count must equal 4')
if sorted(release.get('must_handle_today', [])) != ['EM-102', 'EM-104']:
    fail('must_handle_today must contain EM-102 and EM-104')
if release.get('draft_path') != 'outputs/status-sync.md':
    fail('draft_path must point to outputs/status-sync.md')
for token in REQUIRED_TOKENS:
    if token not in status_text:
        fail(f'missing token in status-sync.md: {token}')

print('RELEASE_INBOX_OK')
