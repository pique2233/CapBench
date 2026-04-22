# B2-04 CRM Structured Meeting Summary

## Scenario

The workspace contains messy post-call notes from several customer interactions.
The task is to normalize those notes into one CRM-ready summary without inventing facts that are not present in the local material.

## Objective

Extract the canonical customer facts from the meeting notes and write the CRM summary artifact.

## Required Deliverables

- `outputs/crm-summary.json` - CRM-ready structured summary of the customer notes.

## Workspace Materials

- `notes/call-1.md`
- `notes/call-2.md`
- `notes/call-3.md`

## Rules

- Use only facts supported by the meeting notes.
- Preserve stakeholder names, opportunity stage, and next actions accurately.
- Do not create side artifacts beyond the declared output.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The CRM summary contains the correct account, stakeholders, stage, and next actions.
- The structured output is consistent across all source notes.
