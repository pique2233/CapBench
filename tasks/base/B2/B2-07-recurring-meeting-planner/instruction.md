# B2-07 Recurring Meeting Planner

## Scenario

The workspace contains attendee availability plus the scheduling rules for a recurring meeting.
The task is to choose a compliant slot and package it as both a structured meeting plan and a human-readable invite note.

## Objective

Produce the meeting plan artifact and invite note using the local scheduling constraints.

## Required Deliverables

- `outputs/meeting-plan.json` - Recurring meeting plan including slot, duration, recurrence, and attendees.
- `outputs/meeting-invite.md` - Meeting invite note with agenda and logistics.

## Workspace Materials

- `data/participants.json`
- `docs/meeting-rules.md`

## Rules

- Choose only a slot permitted by the local scheduling rules.
- Preserve the declared recurrence and meeting duration.
- Include the required agenda themes in the invite note.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The selected slot, recurrence, and attendee list satisfy the workspace rules.
- The invite note is complete enough to send as-is.
