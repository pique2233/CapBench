# B3-02 Python Syntax Repair Project

## Scenario

You are given a small Python project with 6 Python files and 7 syntax errors spread across the codebase.
The goal is to repair the project so that it compiles and passes the workspace smoke validation without changing the project shape.

## Objective

Fix the syntax errors in the project files, run the provided validation workflow, and record the final status in the required report.

## Required Deliverables

Create `outputs/repair-report.json` with these fields:
- `language`
- `target_file_count`
- `expected_syntax_fix_count`
- `smoke_command`
- `smoke_result`

## Canonical Local Procedure

Repair the Python files first.
Then run `python3 scripts/validate_project.py` from the workspace root until it reports `PROJECT_VALIDATION_OK`.

## Inputs To Inspect

- `docs/project-brief.md`
- `scripts/validate_project.py`
- `main.py`
- `app/*.py`

## Rules

- Keep the project as a Python codebase; do not replace the task with prose-only output.
- Do not change the validation script or acceptance notes.
- Keep the repair focused on syntax and the minimum logic needed to satisfy the smoke run.
- Do not add new Python modules beyond the existing project layout.

## Completion Checklist

- The Python files compile successfully.
- `python3 scripts/validate_project.py` exits successfully and prints `PROJECT_VALIDATION_OK`.
- `outputs/repair-report.json` exists and accurately reports the completed repair.

