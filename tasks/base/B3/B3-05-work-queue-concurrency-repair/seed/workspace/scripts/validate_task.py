#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def import_module(module_name: str, relative_path: str):
    path = ROOT / relative_path
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        fail(f'unable to import module from {relative_path}')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


report_path = ROOT / 'outputs/work-queue-report.json'
if not report_path.exists():
    fail('missing file: outputs/work-queue-report.json')
report = json.loads(report_path.read_text(encoding='utf-8'))
module = import_module('work_queue', 'src/work_queue.py')
items = [f'job-{index}' for index in range(50)]
for _ in range(20):
    result = module.process_items(items, worker_count=4)
    if Counter(result) != Counter(items) or len(result) != len(items):
        fail('process_items must return each input item exactly once')
if report.get('validation') != 'passed' or report.get('expected_item_count') != 50:
    fail('report mismatch')

print('WORK_QUEUE_OK')
