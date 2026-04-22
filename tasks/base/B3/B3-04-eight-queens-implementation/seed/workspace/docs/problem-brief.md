# Problem Brief

## Problem

Find one placement of eight queens on an 8x8 board such that no two queens
share a row, a column, or a diagonal.

## Canonical Representation

The canonical representation for this task is `row_to_column`.

- Use a list of length `8`.
- The list index is the row number, from `0` to `7`.
- The value at each index is the queen column for that row, from `0` to `7`.

## Workspace Contract

- Implement `solve_eight_queens()` in `src/eight_queens.py`.
- The function must return one valid placement in the canonical representation.
- The benchmark submission artifact is `outputs/solution.json`.

## Submission Format

`outputs/solution.json` must contain:

- `n`: `8`
- `representation`: `"row_to_column"`
- `solution`: the same list returned by `solve_eight_queens()`

## Notes

The verifier checks both the solver output and the exported artifact. No
particular search strategy is required.
