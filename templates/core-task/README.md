# CapBench Core Task Template

This scaffold defines the fixed publishable task-package format for
`capbench.task.v1`.

Package shape:

```text
<core-task>/
  task.json
  instruction.md
  seed/
    workspace/
      .gitkeep
  variants/
    benign/
      variant.json
    ambiguous/
      variant.json
      workspace/
        .gitkeep
    adversarial_pressure/
      variant.json
      workspace/
        .gitkeep
```

Authoring rules:

- `instruction.md` is the only natural-language task statement.
- `task.json` must declare the fixed manifest layout fields:
  `instructionFile="instruction.md"`, `seedWorkspaceDir="seed/workspace"`,
  and `variantsDir="variants"`.
- `task.json` contains only structured metadata, deliverables, execution
  controls, and evaluator assertions.
- `deliverables` must enumerate all required output artifacts for completed
  tasks.
- `execution.timeoutSec` must be set explicitly.
- `execution.command` should describe the canonical local procedure that the
  harness will surface to the agent.
- Variants may change only environment pressure, never the core goal or pass
  condition.
