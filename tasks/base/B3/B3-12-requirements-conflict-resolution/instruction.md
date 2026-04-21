# B3-12 Requirements Conflict Resolution

## Scenario

Two requirement files overlap and conflict.

## Objective

Resolve the constraints into one compatible requirements file and record the result summary.

## Required Deliverables

- `outputs/resolved-requirements.txt` (text) - Merged compatible requirements file.
- `outputs/requirements-resolution.json` (json) - Structured summary of the resolved requirements output.

## Canonical Local Procedure

Inspect the requirement files, write the resolved outputs, and run the validator.

## Inputs To Inspect

- `requirements/primary.txt`
- `requirements/secondary.txt`
- `docs/resolution-notes.md`
- `scripts/validate_task.py`

## Rules

- Keep only the overlapping compatible constraints.
- Do not add packages not present in the source files.
- Do not modify the input requirements files.

## Completion Checklist

- The resolved requirements file contains the expected three lines.
- The resolution report is correct.
- The validator passes.
