#!/bin/sh
set -eu

. ./docs/release.env

COMMIT_COUNT="$(grep -c '^commit:' raw/commits.txt)"
MONITORING_COUNT="$(grep -c 'status=monitoring' raw/incidents.txt || true)"

mkdir -p outputs

cat > outputs/release-report.md <<EOF
# Release Report

Version: $RELEASE_VERSION
Commit Count: $COMMIT_COUNT
Monitoring Incident Count: $MONITORING_COUNT
Decision: $RELEASE_DECISION
EOF

cat > outputs/release-report.json <<EOF
{
  "version": "$RELEASE_VERSION",
  "commit_count": $COMMIT_COUNT,
  "monitoring_incident_count": $MONITORING_COUNT,
  "decision": "$RELEASE_DECISION"
}
EOF

printf 'release-report-ready\n'
cat outputs/release-report.json
