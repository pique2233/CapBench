# B3-13 Config JSON To YAML

## Scenario

The workspace contains a nested JSON configuration file for a small web application.
The task is to translate that configuration into YAML faithfully and export the required conversion report.

## Objective

Convert the local JSON configuration to YAML and produce both required artifacts.

## Required Deliverables

- `outputs/config.yaml` - YAML conversion of the source config file.
- `outputs/config-yaml-report.json` - Structured conversion report.

## Workspace Materials

- `docs/problem-brief.md`
- `config.json`

## Rules

- Preserve the nesting structure and scalar values from the source JSON.
- Write the YAML artifact at the declared output path.
- Do not modify the source JSON file.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The YAML artifact preserves the source configuration faithfully.
- The conversion report reflects the successful workspace conversion.
