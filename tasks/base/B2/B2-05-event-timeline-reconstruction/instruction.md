# B2-05 Event Timeline Reconstruction

## Scenario

A small set of event records has been exported in out-of-order form.
The benchmark measures whether the agent can rebuild the timeline correctly and identify the first failure signal.

## Objective

Sort the event stream into the correct order and record the required timeline summary in JSON.

## Required Deliverables

- `outputs/timeline.json` - Ordered event timeline with the first failure signal.

## Workspace Materials

- `data/events.jsonl`

## Rules

- Order events strictly by timestamp.
- Preserve the original event IDs in the reconstructed timeline.
- Do not modify the raw event log.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The output timeline preserves the correct event order.
- The first failure signal is identified correctly from the local data.
