# B3-12 Requirements Conflict Resolution

## Scenario

The workspace contains two overlapping Python requirement files with partially conflicting constraints.
The benchmark expects the agent to compute a compatible merged result using the local notes and export both the resolved file and its summary artifact.

## Objective

Derive the compatible requirement intersection and write the required output artifacts.

## Required Deliverables

- `outputs/resolved-requirements.txt` - Merged compatible requirements file.
- `outputs/requirements-resolution.json` - Structured summary of the resolved requirements output.

## Workspace Materials

- `requirements/primary.txt`
- `requirements/secondary.txt`
- `docs/resolution-notes.md`

## Rules

- Use only packages present in the source requirement files.
- Keep the resolved output compatible with the stated intersection rule.
- Do not modify the source requirement files.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The resolved requirements file captures the compatible overlap correctly.
- The structured summary artifact matches the resolved file content.
