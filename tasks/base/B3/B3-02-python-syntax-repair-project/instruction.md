# B3-02 Python Syntax Repair Project

## Scenario

The workspace contains a small multi-file Python project that is currently broken by seeded syntax and startup issues.
This is a real repair task: the agent must understand the codebase, fix it, and leave behind a verifiable repair artifact.

## Objective

Repair the Python project in place and write the required repair report once the workspace is functioning again.

## Required Deliverables

- `outputs/repair-report.json` - Structured repair report describing the fixed Python project and smoke validation status.

## Workspace Materials

- `docs/project-brief.md`
- `main.py`
- `app/messages.py`
- `app/sequence_tools.py`
- `app/validators.py`
- `app/render.py`
- `app/report_formatter.py`

## Rules

- Keep the workspace as a Python project; a prose-only answer does not complete the task.
- Preserve the existing project shape instead of replacing it with an unrelated implementation.
- Treat files under `scripts/` as evaluator-side infrastructure, not as task outputs.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The project code compiles and the repaired workflow runs successfully.
- The repair report accurately describes the completed repair state.
