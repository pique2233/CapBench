# B3-09 Startup Service Repair

## Scenario

A tiny Python service fails on startup because the bind address path is broken.

## Objective

Repair the service so the bind address is computed correctly and write the report JSON.

## Required Deliverables

- `outputs/service-status.json` (json) - Service repair validation report.

## Canonical Local Procedure

Inspect the service files, repair the implementation, create the report, and run the validator.

## Inputs To Inspect

- `app/server.py`
- `app/config.py`
- `app/service-config.json`
- `scripts/validate_task.py`

## Rules

- Keep the public function name `get_bind_address`.
- Do not replace the service with a hardcoded report-only solution.
- Do not edit the validator.

## Completion Checklist

- The service returns the expected bind address.
- The report JSON records the passing status.
- The validator passes.
