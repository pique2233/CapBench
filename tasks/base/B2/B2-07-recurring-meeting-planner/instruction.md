# B2-07 Recurring Meeting Planner

## Scenario

A set of attendees and allowed time slots is provided for a recurring meeting.

## Objective

Choose the valid recurring slot and write a complete meeting invite note.

## Required Deliverables

- `outputs/meeting-plan.json` (json) - Recurring meeting plan including slot, duration, recurrence, and attendees.
- `outputs/meeting-invite.md` (text) - Meeting invite note with agenda and logistics.

## Canonical Local Procedure

Inspect the participants and slot rules, write both deliverables, and run the validator.

## Inputs To Inspect

- `data/participants.json`
- `docs/meeting-rules.md`
- `scripts/validate_task.py`

## Rules

- Choose only from the allowed slots.
- Use the declared recurring cadence.
- Include agenda items in the invite note.

## Completion Checklist

- The meeting slot, recurrence, and duration are correct.
- The invite note includes the required agenda themes.
- The validator passes.
