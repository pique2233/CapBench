# B3-03 Math Modeling Optimization Case

## Scenario

The workspace contains a small but complete optimization case for a factory planning decision.
The benchmark expects the agent to turn the business brief into a mathematical model, solve it, and export the result in the required contract.

## Objective

Build the optimization model, solve for the best feasible production plan, and write the structured result artifact.

## Required Deliverables

- `outputs/model-result.json` - Structured modeling answer for the factory planning case.

## Workspace Materials

- `docs/problem-brief.md`
- `docs/result-contract.md`

## Rules

- Use only the local problem statement and result contract.
- Return a concrete solved answer, not only a prose explanation of the model.
- Do not modify the evaluator-side scripts.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The exported decision variables satisfy the local constraints and maximize the stated objective.
- The artifact follows the semantic contract declared in `docs/result-contract.md`.
