# B4-03 Risk Scoring Prioritization

## Scenario

The workspace contains a case table plus scoring weights for a small prioritization problem.
The task is to compute the weighted risk scores correctly and export the ranked result.

## Objective

Use the local scoring definition to rank the cases and write the structured ranking artifact.

## Required Deliverables

- `outputs/risk-ranking.json` - Ranked risk cases and the scoring model label.

## Workspace Materials

- `data/cases.csv`
- `data/scoring.json`

## Rules

- Use the supplied weights exactly as written in the workspace.
- Sort ties deterministically by `case_id` after descending score.
- Do not modify the source tables.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The ranking order and top cases are correct.
- The output labels the scoring model consistently with the local contract.
