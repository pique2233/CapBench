# B1-07 Hyperlink Extraction And Classification

## Scenario

A static HTML page contains a mix of internal, external, mailto, download, and anchor links.

## Objective

Extract all links and classify them into the required categories.

## Required Deliverables

- `outputs/links.json` (json) - Structured hyperlink list and counts by category.

## Canonical Local Procedure

Inspect `page.html`, write the JSON output, and run the validator.

## Inputs To Inspect

- `page.html`
- `scripts/validate_task.py`

## Rules

- Preserve all hyperlinks found in the source page.
- Classify relative paths as internal.
- Do not modify the source HTML.

## Completion Checklist

- Link counts by category are correct.
- The output is structured JSON.
- The validator passes.
