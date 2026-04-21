# B1-02 OCR Text Recovery

## Scenario

A noisy OCR dump is provided in the workspace.
Recover the readable text and summarize the extraction result.

## Objective

Extract the intended text content and produce both a cleaned text file and a short summary JSON.

## Required Deliverables

- `outputs/extracted-text.txt` (text) - Cleaned text extracted from the OCR dump.
- `outputs/ocr-summary.json` (json) - Short structured summary of the OCR extraction result.

## Canonical Local Procedure

Inspect the OCR dump, write the two deliverables, and run the validator.

## Inputs To Inspect

- `data/receipt_ocr.txt`
- `scripts/validate_task.py`

## Rules

- Clean obvious OCR noise such as 0/O and 5/S mistakes where the intent is clear.
- Preserve the original meaning of the document.
- Do not alter the OCR source file.

## Completion Checklist

- The cleaned text contains the expected readable lines.
- The summary JSON reports the correct document type and line count.
- The validator passes.
