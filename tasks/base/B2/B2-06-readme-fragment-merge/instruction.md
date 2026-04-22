# B2-06 README Fragment Merge

## Scenario

A README has been split across several fragment files in the workspace.
The task is to assemble those fragments into one coherent final README and a small structured summary of the result.

## Objective

Construct the final README from the fragment set and write both required deliverables.

## Required Deliverables

- `outputs/final-README.md` - Final merged README assembled from the source fragments.
- `outputs/readme-summary.json` - Summary counts for the merged README.

## Workspace Materials

- `fragments/title.md`
- `fragments/overview.md`
- `fragments/setup.md`
- `fragments/usage.md`
- `fragments/troubleshooting.md`

## Rules

- Preserve the intended section ordering implied by the fragment set.
- Do not invent sections that are not supported by the source fragments.
- Keep the final document in markdown form.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The merged README contains the expected headings and content blocks.
- The summary artifact accurately reflects the merged document structure.
