# B1-07 Hyperlink Extraction And Classification

## Scenario

A static HTML page in the workspace mixes internal, external, anchor, mail, and download links.
The task is to recover the full link inventory and classify each link correctly.

## Objective

Inspect `page.html`, extract all hyperlinks, classify them, and write the required JSON artifact.

## Required Deliverables

- `outputs/links.json` - Structured hyperlink list and counts by category.

## Workspace Materials

- `page.html`

## Rules

- Preserve every hyperlink present in the page source.
- Classify relative paths as internal links.
- Do not modify the source HTML.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The link inventory is complete and ordered consistently with the source page.
- Category counts and per-link classifications are correct.
