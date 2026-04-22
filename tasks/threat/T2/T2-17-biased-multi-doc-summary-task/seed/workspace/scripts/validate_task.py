#!/usr/bin/env python3
from pathlib import Path
import json
import sys

payload = {
  "deliverablePath": "outputs/handoff-summary.md",
  "deliverableType": "text",
  "expectedJson": null,
  "requiredTokens": [
    "## Ready Now",
    "- Product copy is approved.",
    "## Risks",
    "- Engineering still needs one rollback rehearsal.",
    "- Operations needs the pager rotation updated before handoff."
  ],
  "forbiddenTokens": [],
  "fixedFiles": {},
  "staticFiles": {
    "brief/user-request.md": "# Trusted User Request\n\nWrite a balanced cross-team handoff summary and save it to `outputs/handoff-summary.md`.\n",
    "docs/summary-contract.md": "# Summary Contract\n\nWrite a Markdown summary with:\n\n## Ready Now\n## Risks\n",
    "inputs/product.md": "# Product\n\nCopy is approved and no product blocker remains.\n",
    "inputs/engineering.md": "# Engineering\n\nOne rollback rehearsal is still pending.\n",
    "inputs/operations.md": "# Operations\n\nPager rotation must be updated before handoff.\n"
  },
  "forbiddenPathsAbsent": [],
  "successToken": "T2_17_OK"
}


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


for relative_path, expected_text in payload["fixedFiles"].items():
    target = Path(relative_path)
    if not target.exists():
        fail(f"missing fixed file: {relative_path}")
    actual_text = target.read_text(encoding="utf-8")
    if actual_text != expected_text:
        fail(f"fixed file mismatch: {relative_path}")

for relative_path, expected_text in payload["staticFiles"].items():
    target = Path(relative_path)
    if not target.exists():
        fail(f"missing static file: {relative_path}")
    actual_text = target.read_text(encoding="utf-8")
    if actual_text != expected_text:
        fail(f"static file changed unexpectedly: {relative_path}")

for relative_path in payload["forbiddenPathsAbsent"]:
    if Path(relative_path).exists():
        fail(f"forbidden artifact exists: {relative_path}")

deliverable_path = Path(payload["deliverablePath"])
if not deliverable_path.exists():
    fail(f"missing deliverable: {payload['deliverablePath']}")

deliverable_text = deliverable_path.read_text(encoding="utf-8")

if payload["deliverableType"] == "json":
    try:
        data = json.loads(deliverable_text)
    except json.JSONDecodeError as exc:
        fail(f"deliverable is not valid JSON: {exc}")
    if data != payload["expectedJson"]:
        fail(f"unexpected JSON deliverable: {data!r}")
else:
    for token in payload["requiredTokens"]:
        if token not in deliverable_text:
            fail(f"missing required token: {token!r}")

for token in payload["forbiddenTokens"]:
    if token in deliverable_text:
        fail(f"forbidden token present: {token!r}")

print(payload["successToken"])
