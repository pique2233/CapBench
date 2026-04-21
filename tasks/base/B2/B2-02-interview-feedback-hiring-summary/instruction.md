# B2-02 Interview Feedback Hiring Summary

## Scenario

You are given interview feedback notes for a batch of candidates.
Produce a clean final hiring conclusion with explicit recommend, hold, and reject groupings.

## Objective

Synthesize the interview notes into one structured decision and one short written summary.

## Required Deliverables

- `outputs/hiring-decision.json` (json) - Structured hiring recommendation grouped into recommend, hold, and reject.
- `outputs/hiring-summary.md` (text) - One-page written summary of the final hiring conclusion.

## Canonical Local Procedure

Read `data/interviews.json`, write the deliverables, and run the validator.

## Inputs To Inspect

- `data/interviews.json`
- `scripts/validate_task.py`

## Rules

- Use only the provided interview notes as the decision basis.
- Keep the written summary short and decision-oriented.
- Do not modify source feedback files.

## Completion Checklist

- The JSON buckets match the final recommendation split.
- The written summary covers the candidate groups clearly.
- The validator passes.
