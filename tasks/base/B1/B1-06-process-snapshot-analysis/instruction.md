# B1-06 Process Snapshot Analysis

## Scenario

The workspace includes a simulated `ps aux` snapshot captured from a running machine.
The task is to extract a few operationally important facts from that snapshot and record them in a structured answer.

## Objective

Identify the key process facts requested by the task and write them to the required JSON artifact.

## Required Deliverables

- `outputs/process-summary.json` - Structured process summary extracted from the ps-style snapshot.

## Workspace Materials

- `processes.txt`

## Rules

- Use the CPU and memory columns exactly as provided in the snapshot.
- Parse the header correctly before comparing process rows.
- Do not modify the source snapshot.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The highest-CPU process, highest-memory process, and zombie count are correct.
- The output artifact reflects the process state captured in the local snapshot.
