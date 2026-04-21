# B2-05 Event Timeline Reconstruction

## Scenario

A small set of out-of-order event records is provided.

## Objective

Sort the events into a correct timeline and identify the first failure signal.

## Required Deliverables

- `outputs/timeline.json` (json) - Ordered event timeline with the first failure signal.

## Canonical Local Procedure

Inspect the event records, produce the JSON timeline, and run the validator.

## Inputs To Inspect

- `data/events.jsonl`
- `scripts/validate_task.py`

## Rules

- Order events strictly by timestamp.
- Preserve the original event IDs.
- Do not change the source event log.

## Completion Checklist

- The ordered event IDs are correct.
- The first failure signal is identified correctly.
- The validator passes.
