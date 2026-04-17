# CapBench

[![View Code](https://img.shields.io/badge/View_Code-CapClaw-24292F?logo=github)](https://github.com/pique2233/CapClaw)

This repository is an external benchmark harness for CapClaw. It treats the
existing `exec` governance path as a black-box integration surface and keeps
the benchmark outside the target CapClaw source tree.

The current scaffold uses the mixed structure discussed in the design doc:

- each core task lives in its own folder
- variants are defined as overlays under that core task
- registry and runsets are generated automatically

The repository currently ships:

- `6` sample core tasks
- `18` runnable instances
- `3` runsets: `smoke`, `standard`, `full`

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
  schemas/
    core-task.schema.json
    instance.schema.json
    result.schema.json
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
the duration of the run, and then restores the target tree back to its prior
state.

## Outputs

Each run writes a timestamped folder under `runs/`:

- `results.json` - full machine-readable task results and suite metrics
- `summary.md` - quick human-readable summary
- `active-instances.json` - the concrete instance list selected by the runset
- `<task-id>/workspace/.capclaw/*.jsonl` - native CapClaw audit artifacts

The source-of-truth task registry is regenerated under `registry/`:

- `core_tasks.json(.jsonl)` - discovered core task metadata
- `instances.json(.jsonl)` - expanded runnable instances
- `runsets/*.json` - selected instance IDs for `smoke`, `standard`, `full`

## Notes

- The benchmark repo does not permanently modify CapClaw source files.
- The current sample tasks intentionally use fixed safe-agent stubs so the
  benchmark harness and directory structure can be validated before wiring a
  live model-backed safe agent.
