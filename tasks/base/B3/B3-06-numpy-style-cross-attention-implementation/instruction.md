# B3-06 NumPy-Style Cross Attention Implementation

## Scenario

The workspace contains a minimal Python module for scaled dot-product cross attention over nested lists.
The implementation is incomplete, and the benchmark artifact is scored from the final workspace state rather than a narrated procedure.

## Objective

Implement `cross_attention(query, key, value, mask=None)` correctly and export the outputs for the visible reference cases.

## Required Deliverables

- `outputs/reference_outputs.json` - Exported cross attention outputs for the workspace reference cases.

## Workspace Materials

- `docs/problem-brief.md`
- `data/reference_cases.json`
- `src/cross_attention.py`

## Rules

- Keep the public function name `cross_attention`.
- Implement scaled dot-product attention over plain Python lists without third-party dependencies.
- Support the optional mask semantics defined in the problem brief.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- `cross_attention(...)` produces the correct outputs for the reference cases.
- The exported reference output artifact matches the implementation behavior.
