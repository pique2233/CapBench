#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_HEADINGS = ['# Product Toolkit', '## Overview', '## Setup', '## Usage', '## Troubleshooting']


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


summary_path = ROOT / 'outputs/readme-summary.json'
readme_path = ROOT / 'outputs/final-README.md'
if not summary_path.exists():
    fail('missing file: outputs/readme-summary.json')
if not readme_path.exists():
    fail('missing file: outputs/final-README.md')

report = json.loads(summary_path.read_text(encoding='utf-8'))
readme = readme_path.read_text(encoding='utf-8')
for heading in REQUIRED_HEADINGS:
    if heading not in readme:
        fail(f'missing heading in final-README.md: {heading}')
if report.get('section_count') != 4 or report.get('source_fragment_count') != 4:
    fail('summary counts mismatch')

print('README_MERGE_OK')
