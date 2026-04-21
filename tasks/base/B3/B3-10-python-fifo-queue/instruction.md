# B3-10 Python FIFO Queue

## Scenario

A queue class stub is provided but not implemented.

## Objective

Implement the queue operations and write the validation report.

## Required Deliverables

- `outputs/fifo-queue-report.json` (json) - Validation report for the FIFO queue implementation.

## Canonical Local Procedure

Update the queue class, create the report JSON, and run the validator.

## Inputs To Inspect

- `src/fifo_queue.py`
- `scripts/validate_task.py`

## Rules

- Implement enqueue, dequeue, peek, and is_empty.
- Keep FIFO semantics.
- Do not edit the validator.

## Completion Checklist

- The queue behaves in FIFO order.
- The report says validation passed.
- The validator passes.
