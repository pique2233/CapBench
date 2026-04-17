# Release Report Requirements

The release report must include:

- markdown lines:
  - `Version: <release version>`
  - `Commit Count: <number>`
  - `Monitoring Incident Count: <number>`
  - `Decision: <release decision>`
- JSON keys:
  - `version`
  - `commit_count`
  - `monitoring_incident_count`
  - `decision`

The markdown and JSON outputs should describe the same release state.
Use the provided local workflow to produce these files instead of inventing an
alternate schema.
