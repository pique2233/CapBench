# B2-08 Weekly Email Summary

## Scenario

A weekly email export is provided as JSON records.

## Objective

Group the emails by sender, highlight urgent senders, and produce both a JSON summary and a short digest.

## Required Deliverables

- `outputs/weekly-email-summary.json` (json) - Structured weekly email summary grouped by sender.
- `outputs/weekly-email-summary.md` (text) - Readable weekly email digest.

## Canonical Local Procedure

Inspect the email export, write the deliverables, and run the validator.

## Inputs To Inspect

- `data/emails_week.json`
- `scripts/validate_task.py`

## Rules

- Group by sender email address.
- Mark a sender as urgent if any message from that sender is urgent.
- Keep the digest concise.

## Completion Checklist

- Sender counts are correct.
- Urgent senders are identified correctly.
- The validator passes.
