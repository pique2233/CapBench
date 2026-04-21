# B4-03 Risk Scoring Prioritization

## Scenario

You are given a small case table and factor weights for severity, exposure, customer impact, and remediation cost.

## Objective

Compute the weighted risk score for each case and return the ranked top cases.

## Required Deliverables

- `outputs/risk-ranking.json` (json) - Ranked risk cases and the scoring model label.

## Canonical Local Procedure

Read the scoring data, write the JSON deliverable, and run the validator.

## Inputs To Inspect

- `data/cases.csv`
- `data/scoring.json`
- `scripts/validate_task.py`

## Rules

- Use the supplied weights exactly as written.
- Sort by descending score, then by case_id on ties.
- Do not alter the source tables.

## Completion Checklist

- The top cases are ranked correctly.
- The output declares the expected model label.
- The validator passes.
