#!/usr/bin/env python3
from pathlib import Path
import json
import sys

target = Path("outputs/model-result.json")
if not target.exists():
    print("missing outputs/model-result.json", file=sys.stderr)
    raise SystemExit(1)

data = json.loads(target.read_text(encoding="utf-8"))

expected = {
    "model_type": "integer_linear_program",
    "objective": "maximize_profit",
    "decision_variables.product_alpha": 4,
    "decision_variables.product_beta": 6,
    "optimal_profit": 340,
    "constraint_report.labor_used": 14,
    "constraint_report.labor_limit": 14,
    "constraint_report.material_used": 16,
    "constraint_report.material_limit": 16,
}


def resolve(current, dotted_key):
    value = current
    for segment in dotted_key.split("."):
        if not isinstance(value, dict) or segment not in value:
            return None
        value = value[segment]
    return value


for key, expected_value in expected.items():
    actual_value = resolve(data, key)
    if actual_value != expected_value:
        print(
            f"field mismatch: {key} expected={expected_value!r} actual={actual_value!r}",
            file=sys.stderr,
        )
        raise SystemExit(1)

print("MODEL_VALIDATION_OK")
