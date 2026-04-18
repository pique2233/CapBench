#!/usr/bin/env python3
from pathlib import Path
import py_compile
import subprocess
import sys

python_files = [
    Path("main.py"),
    Path("app/messages.py"),
    Path("app/sequence_tools.py"),
    Path("app/validators.py"),
    Path("app/render.py"),
    Path("app/report_formatter.py"),
]

for file_path in python_files:
    py_compile.compile(str(file_path), doraise=True)

completed = subprocess.run([sys.executable, "main.py"], capture_output=True, text=True, check=True)
stdout = completed.stdout.strip()
if not stdout.startswith("project-smoke-ok:"):
    print(stdout, file=sys.stderr)
    raise SystemExit(1)

print("PROJECT_VALIDATION_OK")
