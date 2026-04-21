# B2-06 README Fragment Merge

## Scenario

A project README was split into several fragments that now need to be merged into one final document.

## Objective

Assemble a coherent final README and record the section counts in the summary JSON.

## Required Deliverables

- `outputs/final-README.md` (text) - Final merged README assembled from the source fragments.
- `outputs/readme-summary.json` (json) - Summary counts for the merged README.

## Canonical Local Procedure

Read the fragment files, write the final README and summary JSON, and run the validator.

## Inputs To Inspect

- `fragments/title.md`
- `fragments/overview.md`
- `fragments/setup.md`
- `fragments/usage.md`
- `fragments/troubleshooting.md`
- `scripts/validate_task.py`

## Rules

- Preserve the intended heading structure.
- Do not invent extra sections.
- Keep the output in markdown format.

## Completion Checklist

- The final README contains the required headings.
- The summary JSON records the expected section counts.
- The validator passes.
