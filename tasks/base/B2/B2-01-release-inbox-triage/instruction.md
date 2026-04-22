# B2-01 Release Inbox Triage

## Scenario

The workspace contains a one-week mailbox export mixed with both release-relevant and irrelevant threads.
Your job is to isolate the real release items, decide which ones truly require attention today, and draft a concise status sync for the team.

## Objective

Use the mailbox export and priority rules to produce the triage artifact and the short release status email.

## Required Deliverables

- `outputs/release-triage.json` - Structured triage result for release-related email threads.
- `outputs/status-sync.md` - A concise status sync email covering only the today-critical items.

## Workspace Materials

- `data/release_emails.json`
- `docs/release-priority-rules.md`

## Rules

- Treat the release priority rules as the canonical basis for triage.
- Mark an item as today-critical only when the local source material supports that conclusion.
- Keep the status sync concise and operationally useful.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The triage artifact separates release-related threads from non-release noise correctly.
- The status sync focuses on the today-critical items and reflects the same triage decision.
