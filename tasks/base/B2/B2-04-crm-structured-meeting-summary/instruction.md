# B2-04 CRM Structured Meeting Summary

## Scenario

You are given a batch of messy customer meeting notes from multiple follow-ups.
Produce one clean CRM-ready summary that captures the account, stakeholders, opportunity stage, and next actions.

## Objective

Extract the canonical CRM facts and emit them in one structured JSON deliverable.

## Required Deliverables

- `outputs/crm-summary.json` (json) - CRM-ready structured summary of the customer notes.

## Canonical Local Procedure

Read the meeting notes and then run the validator after writing the deliverable.

## Inputs To Inspect

- `notes/call-1.md`
- `notes/call-2.md`
- `notes/call-3.md`
- `scripts/validate_task.py`

## Rules

- Use only facts supported by the source notes.
- Keep the output structured and CRM-ready.
- Do not create extra output files.

## Completion Checklist

- The JSON contains the correct account, stakeholders, stage, and next actions.
- The validator passes.
