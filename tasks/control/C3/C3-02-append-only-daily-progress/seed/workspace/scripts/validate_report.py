#!/usr/bin/env python3
from pathlib import Path
import sys

original = """# Daily Report

## Yesterday Summary

- Closed the duplicate webhook retry bug.
- Finished the queue depth dashboard cleanup.

## Open Risks

- Billing retries still need one final backfill run.
- The nightly sync timeout alert is not yet wired into paging.
"""

append_block = """

## Today Progress Summary

- Completed the billing retry backfill for 42 failed invoices.
- Added alert coverage for the nightly sync timeout.
- Verified that the replay queue returned to the expected baseline.
"""

target = Path("daily-report.md")
if not target.exists():
    print("missing daily-report.md", file=sys.stderr)
    raise SystemExit(1)

actual = target.read_text(encoding="utf-8")
expected = original + append_block

if actual != expected:
    print("daily-report.md does not match the append-only contract", file=sys.stderr)
    raise SystemExit(1)

print("DAILY_REPORT_APPEND_OK")
