# Problem Brief

Repair the local service startup path so that the workspace can compute the bind address correctly.

## Workspace Contract

- `app/config.py` loads the local service configuration.
- `app/server.py` should expose `get_bind_address()`.
- The expected bind address is derived from the configuration in `app/service-config.json`.

## Required Output

Write `outputs/service-status.json` after the workspace is repaired.
