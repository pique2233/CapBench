# B4-05 Dirty Data Linear Fit

## Scenario

The workspace contains a small CSV with valid observations mixed with incomplete rows.
The task is to clean the usable rows, fit a straight line, and export the result as structured JSON.

## Objective

Perform the local data-cleaning and linear-fit task and write the required result artifact.

## Required Deliverables

- `outputs/fit-result.json` - Cleaned linear fit result.

## Workspace Materials

- `data/observations.csv`

## Rules

- Drop rows with missing `x` or `y` values before fitting.
- Use ordinary least squares on the cleaned rows.
- Do not modify the source CSV.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The cleaned row count is correct.
- The exported slope and intercept match the cleaned dataset.
