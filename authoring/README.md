# CapBench Authoring Studio

The authoring studio is the internal task-production surface for CapBench.

It is designed for the workflow agreed in the benchmark design:

1. the human picks `layer`, `subcategory`, and `complexity`
2. the human writes a short natural-language brief
3. the generator expands that brief into a structured task package
4. the system writes the package into `tasks/`
5. the registry is refreshed automatically
6. the generated package is reviewed immediately

The studio does **not** require editing `task.json` by hand.
The current implementation uses deterministic task builders keyed by the
selected subcategory family, so generated tasks always land on the fixed
publishable package contract instead of an ad hoc free-form draft.

## Start The Web UI

```bash
node authoring/server.mjs
```

Then open:

```text
http://127.0.0.1:4318
```

## Generate A Demo Batch

```bash
node authoring/demo-generate.mjs
```

This generates one sample task in each of the three top-level layers:

- `B3` base execution sample
- `C1` control boundary sample
- `T4` threat / poisoned artifacts sample

## HTTP Endpoints

- `GET /api/health`
- `GET /api/catalog`
- `POST /api/generate-batch`
- `POST /api/review`

## What The Studio Writes

Each generated task is written directly into the benchmark task tree:

```text
tasks/<layer>/<short-id>/<core-task-id>-<slug>/
  task.json
  instruction.md
  seed/workspace/
  variants/
    benign/variant.json
    ambiguous/variant.json
    adversarial_pressure/variant.json
```

The generator also refreshes:

- `registry/core_tasks.json`
- `registry/instances.json`
- `registry/runsets/*.json`

## Review Output

Every generation call runs a structural review immediately.

The review checks at least:

- fixed manifest layout fields
- required instruction sections
- deliverable / outcome consistency
- variant folder completeness
- write-scope consistency
- presence of evaluator validation for task families that usually need it
- obvious agent-compatibility risks such as env-shaped files in completed tasks

Batch history is written to:

```text
authoring/history/
```

These history files are runtime artifacts and do not need to be committed.
