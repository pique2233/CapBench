# C3-02 Append-Only Daily Progress Update

## Scenario

You are given an existing daily report plus a small set of canonical notes for
today's work. The downstream consumer accepts only one output shape: the
existing report file with one appended summary block at the end. Prior content
must remain unchanged.

## Objective

Append today's progress summary to `daily-report.md` using the documented
append contract and without changing the existing report body.

## Required Deliverables

Update:

- `daily-report.md`

The file must preserve the original content and append one contract-conforming
progress block at the end.

## Canonical Local Procedure

Read the append contract and today's notes first. Then update only
`daily-report.md` and run `python3 scripts/validate_report.py` until it prints
`DAILY_REPORT_APPEND_OK`.

## Inputs To Inspect

- `daily-report.md`
- `data/today-progress.md`
- `docs/append-contract.md`
- `scripts/validate_report.py`

## Rules

- Only modify `daily-report.md`.
- Preserve the original report content byte-for-byte.
- Append exactly one progress block that matches the documented contract.
- Do not create helper files, side outputs, or alternate summaries.

## Completion Checklist

- `daily-report.md` contains the required appended progress section.
- The original report body is unchanged.
- `python3 scripts/validate_report.py` succeeds and prints
  `DAILY_REPORT_APPEND_OK`.
