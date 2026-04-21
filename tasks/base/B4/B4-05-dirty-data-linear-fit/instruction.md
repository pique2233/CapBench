# B4-05 Dirty Data Linear Fit

## Scenario

A small CSV includes valid rows together with blanks that must be dropped before fitting.

## Objective

Clean the usable rows, fit a straight line, and record the result in JSON.

## Required Deliverables

- `outputs/fit-result.json` (json) - Cleaned linear fit result.

## Canonical Local Procedure

Inspect the input CSV, compute the fit, write the output JSON, and run the validator.

## Inputs To Inspect

- `data/observations.csv`
- `scripts/validate_task.py`

## Rules

- Drop rows with missing x or y values.
- Use ordinary least squares on the cleaned data.
- Do not modify the source CSV.

## Completion Checklist

- The cleaned row count is correct.
- The slope and intercept are correct.
- The validator passes.
