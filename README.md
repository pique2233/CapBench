# CapBench

[![View Code](https://img.shields.io/badge/View_Code-CapClaw-24292F?logo=github)](https://github.com/pique2233/CapClaw)

This repository is an external benchmark harness for CapClaw. It treats the
real OpenClaw / CapClaw agent as the system under test and keeps the
benchmark outside the target CapClaw source tree.

The current scaffold uses the publishable mixed structure discussed in the
design doc:

- each core task lives in its own folder
- `instruction.md` is the only natural-language task statement
- `task.json` uses the fixed `capbench.task.v1` format
- `task.json` contains only structured metadata, deliverables, and evaluation config
- `task.json` explicitly declares `instructionFile`, `seedWorkspaceDir`, and `variantsDir`
- `seed/workspace/` is the canonical initial workspace for that core task
- variants are defined as overlays under that core task
- registry and runsets are generated automatically

The repository currently ships:

- `9` sample core tasks
- `27` runnable instances
- `3` runsets: `smoke`, `standard`, `full`
- `1` authoring studio for batch task production

Current sample core tasks:

- `B1-01` Effective Config Resolution
- `B3-01` Release Report Workflow
- `B3-02` Python Syntax Repair Project
- `C1-01` Approved Output Boundary
- `C1-02` README Local Development Boundary Update
- `C3-01` Contracted Incident Summary
- `T1-01` Authoritative Request Under Spoofing
- `T3-01` Credential File Access Denial
- `T4-01` Poisoned Skill Secret Lure

## Layout

```text
.
  CAPBENCH_DESIGN.md
  README.md
  run.sh
  run.ts
  adapters/
    openclaw/
      capclaw-minimal-bench.test.ts
  authoring/
    README.md
    server.mjs
    demo-generate.mjs
    public/
    lib/
  schemas/
    core-task.schema.json
    instance.schema.json
    result.schema.json
  templates/
    core-task/
  registry/
    core_tasks.json
    instances.json
    runsets/
      smoke.json
      standard.json
      full.json
  tasks/
    base/
      B1/
      B3/
    control/
      C1/
      C3/
    threat/
      T1/
      T3/
  runs/
```

Each core task follows this package shape:

```text
tasks/<layer>/<subcategory>/<core-task>/
  task.json
  instruction.md
  seed/
    workspace/
      ...
  variants/
    benign/
      variant.json
    ambiguous/
      variant.json
      workspace/
        ...
    adversarial_pressure/
      variant.json
      workspace/
        ...
```

`task.json` now follows a fixed template:

- `taskFormatVersion`
- `instructionFile`, `seedWorkspaceDir`, `variantsDir`
- `coreTaskId`, `layer`, `subcategory`, `complexity`, `title`, `description`
- `deliverables[]`
- `execution.kind`, `execution.command`, `execution.expectedOutcome`
- `execution.expectedStages`, `execution.timeoutSec`
- `execution.allowedWritePaths` when relevant
- `execution.validationCommands` for evaluator-run acceptance checks
- `execution.assertions`
- `execution.assertions.filesUnchanged` for strict boundary tasks

For live CapClaw runs, `execution.timeoutSec` should be treated as a real agent
budget, not a unit-test timeout. The sample tasks use `600` seconds, and the
harness adds a small grace window above that for Vitest bookkeeping.

Use the scaffold under [templates/core-task](/Users/liziwen/Desktop/CapClaw/capclaw/bench/templates/core-task/README.md) when authoring new tasks.

## Authoring

The bench now includes a browser-based authoring studio for batch task
production. The intended flow is:

1. choose `layer`, `subcategory`, and `complexity`
2. paste a short natural-language brief
3. generate a full task package directly into `tasks/`
4. auto-refresh `registry/`
5. auto-run structural review

Start the studio:

```bash
node authoring/server.mjs
```

Then open `http://127.0.0.1:4318`.

Run the built-in demo batch for the three current authoring examples:

```bash
node authoring/demo-generate.mjs
```

The demo batch generates:

- `B3-02` Python syntax repair
- `C1-02` README section boundary update
- `T4-01` poisoned skill secret lure

## Run

If this repo is checked out next to a target `CapClaw/` repo:

```bash
./run.sh
```

Run the full current sample set:

```bash
CAPBENCH_RUNSET=full ./run.sh
```

If the target repo lives elsewhere:

```bash
CAPCLAW_TARGET_ROOT=/abs/path/to/CapClaw ./run.sh
```

The runner installs `openclaw` dependencies on first run, generates registry
files from the task folders, injects the adapter test into the target repo for
the duration of the run, executes the real agent through `agentCommand(...)`,
passes the structured execution contract from `task.json` into the live agent
prompt, and then restores the target tree back to its prior state.

## Outputs

Each run writes a timestamped folder under `runs/`:

- `results.json` - full machine-readable task results and suite metrics
- `summary.md` - quick human-readable summary
- `active-instances.json` - the concrete instance list selected by the runset
- `<task-id>/workspace/.capclaw/*.jsonl` - native CapClaw audit artifacts

Each result also captures real agent runtime metadata, including:

- provider / model used
- duration per case
- token usage
- governed request counts

The source-of-truth task registry is regenerated under `registry/`:

- `core_tasks.json(.jsonl)` - discovered core task metadata
- `instances.json(.jsonl)` - expanded runnable instances
- `runsets/*.json` - selected instance IDs for `smoke`, `standard`, `full`

## Notes

- The benchmark repo does not permanently modify CapClaw source files.
- The current runner expects a usable local OpenClaw runtime state, including
  `~/.openclaw/openclaw.json` and any required runtime secrets such as
  `~/.openclaw/.env`.
- During benchmark runs, the harness enables OpenClaw live-test mode so the
  real agent can use the local configured state instead of Vitest's isolated
  temporary home.
