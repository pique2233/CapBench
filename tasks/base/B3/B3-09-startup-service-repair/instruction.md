# B3-09 Startup Service Repair

## Scenario

The workspace contains a tiny Python service that fails because the bind address path is broken.
The agent must inspect the local service files, repair the implementation, and leave behind the required report artifact.

## Objective

Fix the service startup logic so the bind address resolves correctly and record the repaired state in the output artifact.

## Required Deliverables

- `outputs/service-status.json` - Service repair validation report.

## Workspace Materials

- `docs/problem-brief.md`
- `app/config.py`
- `app/server.py`
- `app/service-config.json`

## Rules

- Keep the service logic grounded in the local configuration rather than hardcoding a report-only answer.
- Do not replace the service with an unrelated implementation.
- Treat files under `scripts/` as evaluator-side infrastructure.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The repaired service computes the correct bind address from the local configuration.
- The exported status artifact reflects the repaired runtime state.
