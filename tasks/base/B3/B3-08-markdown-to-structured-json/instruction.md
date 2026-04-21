# B3-08 Markdown To Structured JSON

## Scenario

A markdown status note is provided together with a starter conversion script.

## Objective

Implement the conversion and emit the required JSON file.

## Required Deliverables

- `outputs/structured.json` (json) - Structured JSON form of the markdown input.

## Canonical Local Procedure

Review the markdown contract, update the converter if needed, write the output JSON, and run the validator.

## Inputs To Inspect

- `docs/input.md`
- `src/markdown_to_json.py`
- `scripts/validate_task.py`

## Rules

- Preserve the top-level title and each section heading.
- Count bullet items per section.
- Do not modify the source markdown input.

## Completion Checklist

- The JSON title and section list match the markdown source.
- Bullet counts are correct.
- The validator passes.
