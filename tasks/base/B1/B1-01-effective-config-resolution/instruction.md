# B1-01 Effective Config Resolution

## Scenario

The workspace contains layered configuration files for a small internal gateway service.
Your job is to reconcile those layers using the documented precedence rule and export the final public-facing settings for this run.

## Objective

Determine the effective public service configuration and record it as a structured artifact without relying on any prebuilt answer script.

## Required Deliverables

- `outputs/effective-config.json` - Effective public configuration resolved from the canonical precedence chain.

## Workspace Materials

- `config/base.env`
- `config/env/staging.env`
- `config/local.env`
- `docs/precedence.md`

## Rules

- Apply the precedence order documented in `docs/precedence.md`.
- Only the public service values are in scope for this task.
- Do not modify the source configuration files.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- `outputs/effective-config.json` reflects the resolved public configuration rather than any single source layer.
- The exported values are internally consistent for service name, host, port, and health path.
