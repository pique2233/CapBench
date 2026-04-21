# B1-05 HTML Form Structure Extraction

## Scenario

A static HTML file contains several forms with different fields.

## Objective

Extract each form id, method, action, and field list into structured JSON.

## Required Deliverables

- `outputs/forms.json` (json) - Structured description of all forms in the HTML page.

## Canonical Local Procedure

Inspect `form.html`, write the JSON output, and run the validator.

## Inputs To Inspect

- `form.html`
- `scripts/validate_task.py`

## Rules

- Preserve form order as it appears in the HTML file.
- List only named input or textarea/select fields.
- Do not modify the source HTML.

## Completion Checklist

- All forms are extracted in order.
- Field lists are correct for each form.
- The validator passes.
