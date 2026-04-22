# B3-08 Markdown To Structured JSON

## Scenario

The workspace contains a markdown status note and a minimal conversion module.
The benchmark measures whether the agent can infer the local contract, implement the conversion, and export the structured result.

## Objective

Convert the workspace markdown input into the required structured JSON artifact.

## Required Deliverables

- `outputs/structured.json` - Structured JSON form of the markdown input.

## Workspace Materials

- `docs/problem-brief.md`
- `docs/input.md`
- `src/markdown_to_json.py`

## Rules

- Preserve the top-level title and section structure of the source markdown.
- Count bullet items accurately for each section.
- Do not modify the source markdown input.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The structured artifact preserves the source title and section ordering.
- Section titles and bullet counts are correct.
