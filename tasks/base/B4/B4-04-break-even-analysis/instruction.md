# B4-04 Break-Even Analysis

## Scenario

The workspace contains a compact unit-economics input for a simple break-even calculation.
The benchmark expects the agent to compute the break-even units and corresponding revenue and export the result as structured JSON.

## Objective

Calculate the break-even result from the local finance input and write the required artifact.

## Required Deliverables

- `outputs/break-even.json` - Break-even units and revenue summary.

## Workspace Materials

- `data/finance.json`

## Rules

- Use ceiling units for the break-even quantity.
- Preserve the local cost assumptions exactly.
- Return numeric values rather than a prose-only answer.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The exported break-even units and revenue are correct.
- The artifact reflects the local finance assumptions faithfully.
