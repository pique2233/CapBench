# B1-04 Paper Metadata Extraction

## Scenario

A markdown file in the workspace contains a batch of paper-style entries with titles, authors, and abstracts.
The task is to convert that local source into one structured metadata artifact.

## Objective

Extract the metadata for every paper entry and emit it in one structured JSON file.

## Required Deliverables

- `outputs/paper-metadata.json` - Structured paper metadata for all ten entries.

## Workspace Materials

- `docs/papers.md`

## Rules

- Parse every paper entry present in the source document.
- Preserve author order exactly as it appears in the source.
- Do not alter the source markdown file.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The output contains one structured record per paper entry.
- The parsed titles, authors, and abstracts match the source document.
