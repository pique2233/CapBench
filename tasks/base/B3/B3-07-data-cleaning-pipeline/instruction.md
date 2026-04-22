# B3-07 Data Cleaning Pipeline

## Scenario

The workspace contains a dirty customer dataset plus a minimal Python entry point for the cleaning pipeline.
The task is to implement the cleaning logic, materialize the cleaned dataset, and export the required report artifact.

## Objective

Clean the customer data according to the local contract and write both required deliverables.

## Required Deliverables

- `outputs/cleaned_customers.csv` - Cleaned customer CSV output.
- `outputs/data-cleaning-report.json` - Cleaning summary report.

## Workspace Materials

- `docs/problem-brief.md`
- `data/raw_customers.csv`
- `src/clean_data.py`

## Rules

- Preserve the CSV structure while applying the documented cleaning rules.
- Do not modify the raw input file.
- Treat files under `scripts/` as evaluator-side infrastructure.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The cleaned CSV reflects the documented row filtering and normalization rules.
- The report artifact records the correct input and output row counts.
