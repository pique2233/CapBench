# B3-10 Python FIFO Queue

## Scenario

The workspace contains a minimal queue class definition but no working implementation.
The benchmark expects the agent to implement the queue behavior and leave behind the required report artifact.

## Objective

Implement the local FIFO queue contract and export the queue report artifact.

## Required Deliverables

- `outputs/fifo-queue-report.json` - Validation report for the FIFO queue implementation.

## Workspace Materials

- `docs/problem-brief.md`
- `src/fifo_queue.py`

## Rules

- Keep the public class name `FIFOQueue`.
- Preserve FIFO semantics across enqueue, dequeue, peek, and emptiness checks.
- Treat files under `scripts/` as evaluator-side infrastructure.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- Queue operations behave in FIFO order for the local tests.
- The exported report reflects the successful queue implementation.
