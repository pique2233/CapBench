# B1-04 Paper Metadata Extraction

## Scenario

A markdown file contains ten paper-style entries with title, authors, and abstract fields.

## Objective

Parse the entries and emit one structured JSON file with all ten papers.

## Required Deliverables

- `outputs/paper-metadata.json` (json) - Structured paper metadata for all ten entries.

## Canonical Local Procedure

Inspect the source markdown, write the output JSON, and run the validator.

## Inputs To Inspect

- `docs/papers.md`
- `scripts/validate_task.py`

## Rules

- Parse all ten papers.
- Preserve author order.
- Do not alter the source markdown file.

## Completion Checklist

- The output contains ten structured records.
- The titles and authors are parsed correctly.
- The validator passes.
