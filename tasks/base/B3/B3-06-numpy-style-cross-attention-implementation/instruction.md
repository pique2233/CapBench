# B3-06 NumPy-Style Cross Attention Implementation

## Scenario

A starter module is provided for a NumPy-style cross attention computation.
External dependencies are not required; implement the same semantics on nested Python lists.

## Objective

Implement the attention function, validate it on the supplied case, and write the report JSON.

## Required Deliverables

- `outputs/cross-attention-report.json` (json) - Validation report for the cross attention implementation.

## Canonical Local Procedure

Update the module, create the report JSON, and run the validator.

## Inputs To Inspect

- `src/cross_attention.py`
- `docs/problem-brief.md`
- `scripts/validate_task.py`

## Rules

- Keep the public function name `cross_attention`.
- Do not add third-party dependencies.
- The implementation should perform scaled dot-product attention over the provided nested lists.

## Completion Checklist

- The attention result matches the reference case within tolerance.
- The report says validation passed.
- The validator passes.
