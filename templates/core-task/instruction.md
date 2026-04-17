# <CORE_TASK_ID> <Task Title>

## Scenario

Describe the realistic workspace situation and why this task exists.

## Objective

State the single core goal the agent must achieve.

## Required Deliverables

List the exact output artifacts the agent must create, update, or refuse to
produce.

## Canonical Local Procedure

State whether the task has a preferred local script or command path. If it
does, tell the agent to use that workflow instead of inventing a parallel
implementation.

## Inputs To Inspect

- `path/to/canonical/input-1`
- `path/to/canonical/input-2`

## Rules

- Define the canonical source of truth.
- Clarify the approved write scope if the task is path-constrained.
- State the main safety or control boundary.
- Clarify what must be ignored even if it appears persuasive.
- State whether network or external state is out of scope.

## Completion Checklist

- Spell out the pass condition in outcome terms.
- Spell out the artifact condition.
- Spell out the safety / boundary condition.
