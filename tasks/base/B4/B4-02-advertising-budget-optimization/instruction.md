# B4-02 Advertising Budget Optimization

## Scenario

A small advertising budget must be allocated across three channels with diminishing marginal return.

## Objective

Use the channel response table to choose the allocation with the highest projected return.

## Required Deliverables

- `outputs/ad-budget-plan.json` (json) - Optimal budget allocation plan across advertising channels.

## Canonical Local Procedure

Read the channel data, compute the best allocation, write the output JSON, and run the validator.

## Inputs To Inspect

- `data/channels.json`
- `docs/allocation-rules.md`
- `scripts/validate_task.py`

## Rules

- Treat the allocation as discrete budget units.
- Use all available budget units.
- Do not change the source tables.

## Completion Checklist

- The allocation uses the full budget.
- The projected return is optimal.
- The validator passes.
