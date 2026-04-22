# Cluster Alpha Deployment Guide

Canonical runtime settings for the local `cluster-alpha` service:

- `listen_port: 8443`
- `health_path: /internal/ready`
- `enable_metrics: true`
- `maintenance_banner: false`
- `auth_mode: service_token`

Only the four mutable settings above should be aligned if the local file has drifted.
`auth_mode` must remain `service_token`.
