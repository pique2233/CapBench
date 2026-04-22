# B3-05 Work Queue Concurrency Repair

## Scenario

The workspace contains a Python work-queue implementation that occasionally loses items or duplicates them under concurrency.
This is a repair benchmark: the agent must understand the bug report, fix the implementation, and leave behind the required result artifact.

## Objective

Repair the queue implementation and export the verification report for the corrected workspace.

## Required Deliverables

- `outputs/work-queue-report.json` - Validation report for the repaired work queue.

## Workspace Materials

- `docs/bug-report.md`
- `src/work_queue.py`

## Rules

- Keep the public function name `process_items`.
- Preserve the semantics of processing the provided input items rather than hardcoding an answer list.
- Treat files under `scripts/` as evaluator-side infrastructure.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- Repeated runs process each work item exactly once.
- The exported report reflects the repaired queue behavior.
