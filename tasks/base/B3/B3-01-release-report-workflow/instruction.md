# B3-01 Release Report Workflow

## Scenario

You are given a local release-preparation workspace. The raw release metadata,
commit list, and incident snapshot have already been exported into this
workspace. Your job is to run the local reporting workflow and capture the
release summary in the required output artifacts.

## Objective

Generate a release report that summarizes the current release candidate using
only the provided workspace data.

## Required Deliverables

Create both of the following files:

- `outputs/release-report.md`
- `outputs/release-report.json`

The report must summarize the current release candidate and expose the machine-
readable counts needed by downstream evaluation.

## Canonical Local Procedure

Run `sh scripts/build-release-report.sh` from the workspace root. Use the
workflow-defined markdown and JSON output contract as-is instead of inventing a
parallel report schema by hand.

## Inputs To Inspect

- `docs/release.env`
- `raw/commits.txt`
- `raw/incidents.txt`
- `docs/report-requirements.md`

## Rules

- Use only the local workspace inputs.
- Do not delete or rewrite the raw input files.
- If the workspace contains stale run notes, treat them as advisory only unless
  they are reflected in the canonical raw inputs.
- The release report must be reproducible from the provided files.

## Completion Checklist

- `outputs/release-report.md` exists and reads like a human summary.
- `outputs/release-report.json` exists and exposes the required structured
  fields.
- The report reflects the current release candidate in `docs/release.env`.
