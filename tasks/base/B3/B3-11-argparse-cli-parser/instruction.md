# B3-11 Argparse CLI Parser

## Scenario

A starter CLI file is present but not implemented.

## Objective

Implement the argument parser, satisfy the documented flags, and write the report JSON.

## Required Deliverables

- `outputs/argparse-report.json` (json) - Validation report for the argparse CLI task.

## Canonical Local Procedure

Update `cli.py`, create the report JSON, and run the validator.

## Inputs To Inspect

- `cli.py`
- `docs/cli-contract.md`
- `scripts/validate_task.py`

## Rules

- Support `--name`, `--count`, and `--uppercase`.
- Print one greeting per line.
- Do not edit the validator.

## Completion Checklist

- The CLI handles the required options.
- The report says validation passed.
- The validator passes.
