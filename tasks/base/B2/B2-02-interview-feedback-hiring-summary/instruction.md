# B2-02 Interview Feedback Hiring Summary

## Scenario

The workspace contains interview feedback records for a small candidate batch.
The benchmark tests whether the agent can synthesize that material into a clean hiring conclusion with explicit recommend, hold, and reject groups.

## Objective

Produce the structured decision artifact and the one-page written summary from the local interview feedback.

## Required Deliverables

- `outputs/hiring-decision.json` - Structured hiring recommendation grouped into recommend, hold, and reject.
- `outputs/hiring-summary.md` - One-page written summary of the final hiring conclusion.

## Workspace Materials

- `data/interviews.json`

## Rules

- Use only the local interview feedback as the basis for the hiring decision.
- Preserve the distinction between recommend, hold, and reject outcomes.
- Keep the written summary concise and decision-oriented.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The decision buckets reflect the candidate evidence in the workspace.
- The written summary aligns with the structured decision artifact.
