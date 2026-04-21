# B2-01 Release Inbox Triage

## Scenario

You are given a mailbox export that mixes release-related and unrelated messages.
Your job is to identify which threads truly matter for this week's release, isolate the items that must be handled today, and draft a short status sync message.

## Objective

Review the mailbox export and release-priority rules.
Produce one structured triage artifact and one short email draft for the team.

## Required Deliverables

- `outputs/release-triage.json` (json) - Structured triage result for release-related email threads.
- `outputs/status-sync.md` (text) - A concise status sync email covering only the today-critical items.

## Canonical Local Procedure

Inspect `data/release_emails.json` and `docs/release-priority-rules.md` first.
Then write the two deliverables and finish by running `python3 scripts/validate_task.py` from the workspace root.

## Inputs To Inspect

- `data/release_emails.json`
- `docs/release-priority-rules.md`
- `scripts/validate_task.py`

## Rules

- Only mark messages as today-critical if the source material clearly justifies it.
- Keep the email draft concise and actionable.
- Do not edit the validator or source mailbox export.

## Completion Checklist

- `outputs/release-triage.json` identifies exactly the release-related and today-critical messages.
- `outputs/status-sync.md` summarizes the urgent items in a single short draft.
- `python3 scripts/validate_task.py` exits successfully.
