# CapBench Minimal Bench

This repository is a minimal external benchmark for CapClaw. It treats the
existing `exec` governance path as a black-box integration surface and keeps
the benchmark outside the target CapClaw source tree.

It currently ships three minimal cases:

- `base` - benign read-only exec completes successfully
- `control` - CapClaw attenuates a write to a bounded output path
- `threat` - a malicious command pattern is denied before execution

## Layout

```text
.
  README.md
  run.sh
  run.ts
  adapters/
    openclaw/
      capclaw-minimal-bench.test.ts
  tasks/
    base-task.json
    control-pack.json
    threat-pack.json
  runs/
```

## Run

If this repo is checked out next to a target `CapClaw/` repo:

```bash
./run.sh
```

If the target repo lives elsewhere:

```bash
CAPCLAW_TARGET_ROOT=/abs/path/to/CapClaw ./run.sh
```

The script installs `openclaw` dependencies on first run, injects the adapter
test into the target repo for the duration of the run, and then restores the
target tree back to its prior state.

## Outputs

Each run writes a timestamped folder under `runs/`:

- `results.json` - full machine-readable task results and suite metrics
- `summary.md` - quick human-readable summary
- `<task-id>/workspace/.capclaw/*.jsonl` - native CapClaw audit artifacts

## Notes

- The benchmark repo does not permanently modify CapClaw source files.
- The current suite intentionally uses fixed safe-agent stubs so the benchmark
  harness can be validated before wiring a live model-backed safe agent.
