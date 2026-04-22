#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


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


def validate_solution(label: str, solution) -> None:
    if not isinstance(solution, list) or len(solution) != 8:
        fail(f"{label} must be a list of length 8")
    if any(not isinstance(value, int) for value in solution):
        fail(f"{label} entries must be integers")
    if any(value < 0 or value >= 8 for value in solution):
        fail(f"{label} entries must be in range 0..7")
    if len(set(solution)) != 8:
        fail(f"{label} columns must be unique")
    for row_a, col_a in enumerate(solution):
        for row_b, col_b in enumerate(solution):
            if row_a >= row_b:
                continue
            if abs(row_a - row_b) == abs(col_a - col_b):
                fail(f"{label} contains diagonal conflicts")


def main() -> None:
    export_data = read_json("outputs/solution.json")
    module = import_module("eight_queens", "src/eight_queens.py")
    if not hasattr(module, "solve_eight_queens"):
        fail("src/eight_queens.py must define solve_eight_queens")

    solution = module.solve_eight_queens()
    validate_solution("solve_eight_queens()", solution)

    if export_data.get("n") != 8:
        fail("solution export must declare n=8")
    if export_data.get("representation") != "row_to_column":
        fail("solution export must declare representation=row_to_column")
    if export_data.get("solution") != solution:
        fail("exported solution must match solve_eight_queens()")
    validate_solution("outputs/solution.json", export_data.get("solution"))

    print("EIGHT_QUEENS_OK")


if __name__ == "__main__":
    main()
