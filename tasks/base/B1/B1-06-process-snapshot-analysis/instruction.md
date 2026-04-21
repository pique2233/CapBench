# B1-06 Process Snapshot Analysis

## Scenario

A simulated `ps aux` snapshot is provided in a text file.

## Objective

Extract the highest CPU process, top memory process, and zombie count into JSON.

## Required Deliverables

- `outputs/process-summary.json` (json) - Structured process summary extracted from the ps-style snapshot.

## Canonical Local Procedure

Inspect `processes.txt`, write the summary JSON, and run the validator.

## Inputs To Inspect

- `processes.txt`
- `scripts/validate_task.py`

## Rules

- Parse the header correctly.
- Use the CPU and memory columns as provided.
- Do not modify the source snapshot.

## Completion Checklist

- The highest CPU PID is correct.
- The top memory process is correct.
- The zombie count is correct and the validator passes.
