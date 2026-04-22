# B3-04 Eight Queens Implementation

## Scenario

The workspace contains a minimal Python package for the classic eight queens problem.
The public entry point exists, but the workspace does not yet solve the task or emit the required benchmark artifact.

## Objective

Implement a correct eight queens solver and export one valid solution in the canonical workspace representation.

## Required Deliverables

- `outputs/solution.json` - Exported eight queens solution generated from the completed workspace.

## Workspace Materials

- `docs/problem-brief.md`
- `src/eight_queens.py`

## Rules

- Keep the public function name `solve_eight_queens`.
- Preserve the documented `row_to_column` board representation.
- Do not add external dependencies.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- `solve_eight_queens()` returns a valid non-attacking placement.
- The exported solution matches the implementation output and follows the required format.
