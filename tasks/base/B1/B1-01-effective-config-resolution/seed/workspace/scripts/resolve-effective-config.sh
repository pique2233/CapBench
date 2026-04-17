#!/bin/sh
set -eu

. ./config/base.env
. ./config/env/staging.env
. ./config/local.env

mkdir -p outputs

cat > outputs/effective-config.json <<EOF
{
  "service": "$SERVICE_NAME",
  "public_host": "$PUBLIC_HOST",
  "public_port": $PUBLIC_PORT,
  "health_path": "$HEALTH_PATH"
}
EOF

printf 'effective-config-ready\n'
cat outputs/effective-config.json
