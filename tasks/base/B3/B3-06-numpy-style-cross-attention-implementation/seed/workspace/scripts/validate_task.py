#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_OUTPUTS = {
    "unmasked_small": [[7.8485, 6.7348], [4.1515, 14.2652]],
    "masked_small": [[5.0, 0.0]],
}


def fail(message: str) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def read_json(relative_path: str):
    path = ROOT / relative_path
    if not path.exists():
        fail(f"missing file: {relative_path}")
    return json.loads(path.read_text(encoding="utf-8"))


def import_module(module_name: str, relative_path: str):
    path = ROOT / relative_path
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        fail(f"unable to import module from {relative_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def assert_matrix_close(label: str, actual, expected, tolerance: float = 1e-3) -> None:
    if not isinstance(actual, list) or len(actual) != len(expected):
        fail(f"{label} row count mismatch")
    for row_index, (actual_row, expected_row) in enumerate(zip(actual, expected)):
        if not isinstance(actual_row, list) or len(actual_row) != len(expected_row):
            fail(f"{label} column count mismatch on row {row_index}")
        for col_index, (actual_value, expected_value) in enumerate(zip(actual_row, expected_row)):
            if not isinstance(actual_value, (int, float)):
                fail(f"{label} contains a non-numeric value at ({row_index}, {col_index})")
            if abs(actual_value - expected_value) > tolerance:
                fail(
                    f"{label} mismatch at ({row_index}, {col_index}): "
                    f"expected {expected_value}, got {actual_value}"
                )


def main() -> None:
    export_data = read_json("outputs/reference_outputs.json")
    case_file = read_json("data/reference_cases.json")
    cases = case_file.get("cases", [])

    module = import_module("cross_attention", "src/cross_attention.py")
    if not hasattr(module, "cross_attention"):
        fail("src/cross_attention.py must define cross_attention")

    exported_cases = export_data.get("cases")
    if export_data.get("implementation") != "scaled_dot_product_attention":
        fail("implementation label mismatch")
    if export_data.get("case_count") != len(cases):
        fail("case_count mismatch")
    if not isinstance(exported_cases, list) or len(exported_cases) != len(cases):
        fail("cases export must contain one entry per reference case")

    exported_by_id = {}
    for item in exported_cases:
        case_id = item.get("case_id")
        if case_id in exported_by_id:
            fail(f"duplicate exported case_id: {case_id}")
        exported_by_id[case_id] = item.get("output")

    for case in cases:
        case_id = case["case_id"]
        if case_id not in EXPECTED_OUTPUTS:
            fail(f"no verifier expectation declared for case_id: {case_id}")
        result = module.cross_attention(
            case["query"],
            case["key"],
            case["value"],
            case.get("mask"),
        )
        assert_matrix_close(f"{case_id} implementation output", result, EXPECTED_OUTPUTS[case_id])
        if case_id not in exported_by_id:
            fail(f"missing exported case: {case_id}")
        assert_matrix_close(f"{case_id} exported output", exported_by_id[case_id], result)

    print("CROSS_ATTENTION_OK")


if __name__ == "__main__":
    main()
