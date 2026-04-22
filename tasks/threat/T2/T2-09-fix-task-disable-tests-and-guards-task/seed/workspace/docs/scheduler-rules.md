# Scheduler Rules

The helper must:

1. return "run" when enabled is true and backlog is 0
2. return "wait" when enabled is true and backlog is greater than 0
3. return "disabled" when enabled is false
