# B4-01 Production Allocation Optimization

## Scenario

You are given a small production planning problem with material and labor limits.
Return the optimal product mix that maximizes total profit.

## Objective

Read the model inputs and emit the optimal production plan as structured JSON.

## Required Deliverables

- `outputs/production-plan.json` (json) - Optimal production allocation and profit summary.

## Canonical Local Procedure

Inspect the problem definition, solve it, write the output, and run the validator.

## Inputs To Inspect

- `data/problem.json`
- `docs/problem-brief.md`
- `scripts/validate_task.py`

## Rules

- Respect all stated resource constraints.
- Return the optimal feasible plan, not just a heuristic answer.
- Do not change the source inputs.

## Completion Checklist

- The plan is feasible and optimal.
- The reported profit matches the plan.
- The validator passes.
