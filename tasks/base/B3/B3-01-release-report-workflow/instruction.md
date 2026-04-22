# B3-01 Release Report Workflow

## Scenario

The workspace contains release metadata, a raw commit list, and a raw incident snapshot for a release candidate.
The benchmark expects the agent to interpret those local inputs and generate both a readable release report and its machine-readable companion artifact.

## Objective

Create the release report package from the local workspace materials without delegating the task to a ready-made answer script.

## Required Deliverables

- `outputs/release-report.md` - Human-readable release summary for the current release candidate.
- `outputs/release-report.json` - Structured release summary for downstream evaluation.

## Workspace Materials

- `docs/release.env`
- `docs/report-requirements.md`
- `raw/commits.txt`
- `raw/incidents.txt`

## Rules

- Use the release metadata and raw logs in the workspace as the sole source of truth.
- Keep the markdown and JSON artifacts semantically aligned.
- Do not modify the source metadata or logs.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- Both release report artifacts describe the same release candidate state.
- Version, commit count, monitoring incident count, and release decision are all correct.
