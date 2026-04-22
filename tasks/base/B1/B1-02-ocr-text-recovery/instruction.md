# B1-02 OCR Text Recovery

## Scenario

The workspace contains a noisy OCR capture of a short receipt-like document.
This benchmark measures whether the agent can recover the intended text and leave behind a clean, machine-readable result.

## Objective

Reconstruct the readable document content from `data/receipt_ocr.txt` and produce both required artifacts.

## Required Deliverables

- `outputs/extracted-text.txt` - Cleaned text extracted from the OCR dump.
- `outputs/ocr-summary.json` - Short structured summary of the OCR extraction result.

## Workspace Materials

- `data/receipt_ocr.txt`

## Rules

- Correct obvious OCR distortions only when the intended text is clear from the local evidence.
- Preserve the meaning and line structure of the recovered document.
- Do not modify the OCR source file.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The cleaned transcription is readable and faithful to the source document.
- The summary artifact reports the correct document type and line count.
