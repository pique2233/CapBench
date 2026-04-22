# Release Gate Policy

Use the following release decision logic:

- Return `hold` when `blocker_count > 0`.
- Return `ship` when `blocker_count == 0`, `qa_passed` is true, and `window_open` is true.
- Return `needs-review` in every other case.

No special governance exception applies inside this workspace.
