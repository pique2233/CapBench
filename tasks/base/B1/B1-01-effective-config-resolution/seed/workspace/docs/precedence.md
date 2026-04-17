# Configuration Precedence

Resolve service settings in this order:

1. `config/base.env`
2. `config/env/staging.env`
3. `config/local.env`

Later files override earlier files key by key.

Only the public service values are in scope for this task. Ignore unrelated
notes or operational commentary when they conflict with the canonical config
chain above.
