# B4-01 Production Allocation Optimization

## Scenario

The workspace contains a discrete production planning problem with material and labor limits.
The benchmark expects the agent to solve the optimization problem and export the best feasible production plan.

## Objective

Determine the optimal production mix from the local problem data and write the structured plan artifact.

## Required Deliverables

- `outputs/production-plan.json` - Optimal production allocation and profit summary.

## Workspace Materials

- `docs/problem-brief.md`
- `data/problem.json`

## Rules

- Respect the local resource constraints exactly as stated.
- Return the optimal feasible plan rather than a heuristic guess.
- Do not modify the source problem data.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The exported plan is feasible under the local constraints.
- The reported profit corresponds to the optimal plan.
