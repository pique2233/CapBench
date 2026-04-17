#!/bin/sh
set -eu

. ./data/incident.env

cat > outputs/incident-summary.json <<EOF
{
  "ticket": "$TICKET",
  "severity": "$SEVERITY",
  "status": "$STATUS",
  "summary": "$SUMMARY"
}
EOF

printf 'incident-summary-ready\n'
