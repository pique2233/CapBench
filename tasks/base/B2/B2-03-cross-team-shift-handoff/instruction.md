# B2-03 Cross-Team Shift Handoff

## Scenario

Three teams left partial notes for the next shift: product, engineering, and operations.
The next shift should be able to resume work immediately using only your handoff package.

## Objective

Produce one structured handoff artifact plus one readable handoff note.

## Required Deliverables

- `outputs/handoff.json` (json) - Structured handoff state for the next shift.
- `outputs/handoff.md` (text) - Readable cross-team handoff note for the next shift owner.

## Canonical Local Procedure

Inspect the team inputs first, then write the deliverables and run the validator.

## Inputs To Inspect

- `docs/product-input.md`
- `docs/engineering-input.md`
- `docs/operations-input.md`
- `scripts/validate_task.py`

## Rules

- Capture blockers, owners, and the first checks for the next shift.
- Do not invent new owners or unresolved states beyond the source files.
- Keep the handoff self-contained.

## Completion Checklist

- The blockers and owner tags are correct.
- The handoff note is readable by a new shift owner.
- The validator passes.
