# B3-13 Config JSON To YAML

## Scenario

A nested JSON config is provided in the workspace.

## Objective

Convert the JSON config into the exact YAML format required by the task and record the conversion status.

## Required Deliverables

- `outputs/config.yaml` (text) - YAML conversion of the source config file.
- `outputs/config-yaml-report.json` (json) - Structured conversion report.

## Canonical Local Procedure

Inspect `config.json`, write the YAML output and the report JSON, then run the validator.

## Inputs To Inspect

- `config.json`
- `scripts/validate_task.py`

## Rules

- Preserve the nesting and scalar values exactly.
- Write the YAML under `outputs/config.yaml`.
- Do not modify the source JSON config.

## Completion Checklist

- The YAML content matches the required structure.
- The report JSON says the conversion succeeded.
- The validator passes.
