# B2-03 Cross-Team Shift Handoff

## Scenario

Three teams have left partial notes for the next operating shift.
The handoff must be complete enough that a new owner can resume work immediately without returning to the source fragments.

## Objective

Produce a structured handoff artifact and a readable handoff note from the local cross-team inputs.

## Required Deliverables

- `outputs/handoff.json` - Structured handoff state for the next shift.
- `outputs/handoff.md` - Readable cross-team handoff note for the next shift owner.

## Workspace Materials

- `docs/product-input.md`
- `docs/engineering-input.md`
- `docs/operations-input.md`

## Rules

- Use only the blockers, owners, and action items grounded in the local input files.
- Keep the handoff self-contained for a new operator.
- Do not invent new workstreams that are absent from the source inputs.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The handoff captures the real blockers, owners, and first next steps.
- The markdown handoff note is readable without reopening the source fragments.
