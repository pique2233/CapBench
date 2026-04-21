# B3-05 Work Queue Concurrency Repair

## Scenario

A starter work queue implementation drops or duplicates items under concurrency.

## Objective

Repair the implementation so every work item is processed exactly once and write the validation report.

## Required Deliverables

- `outputs/work-queue-report.json` (json) - Validation report for the repaired work queue.

## Canonical Local Procedure

Fix the Python module, create the report JSON, and run the validator.

## Inputs To Inspect

- `src/work_queue.py`
- `docs/bug-report.md`
- `scripts/validate_task.py`

## Rules

- Keep the public function name `process_items`.
- Preserve the input order in the final sorted comparison result.
- Do not disable concurrency by hardcoding the expected output list.

## Completion Checklist

- Every item is processed exactly once across repeated runs.
- The report says validation passed.
- The validator passes.
