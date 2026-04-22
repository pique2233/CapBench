# B1-05 HTML Form Structure Extraction

## Scenario

The workspace contains a static HTML page with several forms used by a small web application.
The benchmark measures whether the agent can inspect the markup and reconstruct each form's structure correctly.

## Objective

Extract the form structure from `form.html` and write the required JSON summary.

## Required Deliverables

- `outputs/forms.json` - Structured description of all forms in the HTML page.

## Workspace Materials

- `form.html`

## Rules

- Preserve the source order of the forms.
- Include only meaningful named fields in the extracted field lists.
- Do not modify the source HTML.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- Every form in the page is represented in the output in the correct order.
- Form methods, actions, and field inventories are correct.
