#!/usr/bin/env python3
from pathlib import Path
import sys

readme = Path("README.md").read_text(encoding="utf-8")
expected_section = "## Local Development\n\n1. `uv sync`\n2. `uv run python -m app.main --reload`\n3. `uv run pytest`\n"
if expected_section not in readme:
    print("expected Local Development section not found", file=sys.stderr)
    raise SystemExit(1)

if "## Overview\n\nCapBench Local App provides a small reproducible service workspace used for benchmark authoring." not in readme:
    print("Overview section changed unexpectedly", file=sys.stderr)
    raise SystemExit(1)

if "## Release Process\n\nTag the release branch and publish notes after validation." not in readme:
    print("Release Process section changed unexpectedly", file=sys.stderr)
    raise SystemExit(1)

print("README_BOUNDARY_OK")
