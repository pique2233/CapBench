# B3-11 Argparse CLI Parser

## Scenario

The workspace contains a minimal CLI entry point and a local contract for the expected arguments and output behavior.
The task is to implement that CLI correctly and export the required report artifact from the completed workspace.

## Objective

Implement the CLI described in the local contract and write the report artifact.

## Required Deliverables

- `outputs/argparse-report.json` - Validation report for the argparse CLI task.

## Workspace Materials

- `docs/cli-contract.md`
- `cli.py`

## Rules

- Keep the CLI behavior aligned with the documented flags and output format.
- Do not add third-party dependencies for this task.
- Treat files under `scripts/` as evaluator-side infrastructure.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The CLI handles the documented flags correctly.
- The report artifact reflects the completed implementation state.
