# B4-02 Advertising Budget Optimization

## Scenario

The workspace contains a discrete advertising allocation problem with diminishing returns across channels.
The task is to choose the best allocation using the local response data and export the result as the required plan artifact.

## Objective

Compute the best budget allocation from the local data and write the structured output artifact.

## Required Deliverables

- `outputs/ad-budget-plan.json` - Optimal budget allocation plan across advertising channels.

## Workspace Materials

- `data/channels.json`
- `docs/allocation-rules.md`

## Rules

- Use all available budget units.
- Treat the allocation as discrete spend chunks as defined by the local rules.
- Do not modify the source data tables.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The exported allocation uses the full budget and satisfies the local rules.
- The reported projected return matches the optimal allocation.
