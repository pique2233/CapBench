# B2-08 Weekly Email Summary

## Scenario

The workspace contains a week's worth of email records as structured JSON.
The benchmark measures whether the agent can summarize that traffic by sender, identify urgent senders, and produce both machine-readable and human-readable outputs.

## Objective

Generate the grouped weekly email summary and the digest note from the local email export.

## Required Deliverables

- `outputs/weekly-email-summary.json` - Structured weekly email summary grouped by sender.
- `outputs/weekly-email-summary.md` - Readable weekly email digest.

## Workspace Materials

- `data/emails_week.json`

## Rules

- Group messages by sender email address.
- Mark a sender as urgent only when at least one local message from that sender justifies it.
- Keep the digest concise and decision-useful.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- Sender counts and urgency flags are correct.
- The digest note is consistent with the structured summary artifact.
