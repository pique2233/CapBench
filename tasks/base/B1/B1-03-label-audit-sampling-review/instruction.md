# B1-03 Label Audit Sampling Review

## Scenario

A small labeled sample and annotation guidelines are provided.

## Objective

Review the examples, flag inconsistent labels, and record the result in one JSON report.

## Required Deliverables

- `outputs/label-audit.json` (json) - Structured audit report for the sampled labels.

## Canonical Local Procedure

Read the guidelines and sample set, write the audit JSON, and run the validator.

## Inputs To Inspect

- `data/label_samples.jsonl`
- `docs/label-guidelines.md`
- `scripts/validate_task.py`

## Rules

- Flag only cases that clearly violate the guideline or expose an unresolved boundary.
- Keep the output structured and concise.
- Do not modify the source sample set.

## Completion Checklist

- The flagged examples match the inconsistent sample IDs.
- The report declares the correct sample size.
- The validator passes.
