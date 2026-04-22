# Problem Brief

Implement the local Markdown-to-JSON conversion in `src/markdown_to_json.py`.

## Source

- `docs/input.md` is the canonical markdown source.

## Required Structure

Write `outputs/structured.json` with:

- `title`
- `sections`

Each section object should preserve the section title and include the number of bullet items found in that section.
