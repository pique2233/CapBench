# B1-03 Label Audit Sampling Review

## Scenario

The workspace contains a labeled sample set plus the annotation guideline used by the team.
The task is to audit the sample, identify genuinely inconsistent or ambiguous labels, and write a compact review artifact.

## Objective

Review the labeled examples, flag the problematic cases, and summarize the audit outcome in one structured report.

## Required Deliverables

- `outputs/label-audit.json` - Structured audit report for the sampled labels.

## Workspace Materials

- `data/label_samples.jsonl`
- `docs/label-guidelines.md`

## Rules

- Use the guideline as the canonical source for label quality decisions.
- Flag only cases that are inconsistent with the guideline or reveal a meaningful boundary ambiguity.
- Do not modify the sample set.
- Solve the task inside the provided local workspace. External services and unstated context are out of scope.
- The benchmark is scored on the completed workspace state and required artifacts, not on a narrated procedure.

## Completion Checklist

- The required deliverable files are present at the declared paths.
- The flagged examples correspond to the inconsistent or boundary-ambiguous samples in the workspace.
- The audit report correctly records the reviewed sample count and flagged IDs.
