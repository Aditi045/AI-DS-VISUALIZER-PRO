from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()
Language = Literal["c", "cpp", "java", "python"]
MAX_CODE = 50_000
TIMEOUT_SECONDS = 5
MAX_OUTPUT = 12_000


class ProgramRunRequest(BaseModel):
    language: Language
    code: str = Field(..., min_length=1, max_length=MAX_CODE)
    input_data: str = Field(default="", max_length=20_000)


def _safe_environment() -> dict[str, str]:
    """Pass only toolchain essentials; never expose application secrets."""
    allowed = {"PATH", "PATHEXT", "SYSTEMROOT", "WINDIR", "TEMP", "TMP", "LANG", "LC_ALL"}
    return {key: value for key, value in os.environ.items() if key in allowed}


def _command(language: Language, root: Path) -> tuple[list[list[str]], list[str]]:
    if language == "python":
        return [], [sys.executable, "-I", str(root / "program.py")]
    if language == "c":
        source, binary = root / "program.c", root / "program.exe"
        return [["gcc", str(source), "-O2", "-o", str(binary)]], [str(binary)]
    if language == "cpp":
        source, binary = root / "program.cpp", root / "program.exe"
        return [["g++", str(source), "-O2", "-std=c++17", "-o", str(binary)]], [str(binary)]
    source = root / "Main.java"
    return [["javac", str(source)]], ["java", "-cp", str(root), "Main"]


def _run_process(command: list[str], root: Path, input_data: str = "") -> tuple[int, str, str, bool]:
    env = _safe_environment()
    creationflags = getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
    try:
        result = subprocess.run(command, cwd=root, env=env, input=input_data or None, capture_output=True, text=True, timeout=TIMEOUT_SECONDS, creationflags=creationflags)
        return result.returncode, result.stdout[-MAX_OUTPUT:], result.stderr[-MAX_OUTPUT:], False
    except subprocess.TimeoutExpired as exc:
        output = (exc.stdout or "")[-MAX_OUTPUT:] if isinstance(exc.stdout, str) else ""
        error = (exc.stderr or "")[-MAX_OUTPUT:] if isinstance(exc.stderr, str) else ""
        return -1, output, error or "Execution timed out after 5 seconds.", True
    except FileNotFoundError as exc:
        return -1, "", f"Execution tool is not installed or not available: {exc.filename}", False


def _error_details(language: Language, message: str, phase: str) -> dict[str, object]:
    line = None
    patterns = [r"line (\d+)", r":(\d+)(?::\d+)?[:)]", r"\((\d+),\d+\)"]
    for pattern in patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            line = int(match.group(1))
            break
    return {"type": "TIMEOUT" if phase == "runtime" and "timed out" in message.lower() else ("COMPILATION_ERROR" if phase == "compile" else f"{language.upper()}_ERROR"), "message": message.strip() or "The program failed without diagnostic output.", "line": line, "phase": phase}


def _steps(code: str, language: Language) -> tuple[bool, list[dict[str, object]]]:
    """Recognize common educational operations without pretending arbitrary code is visualizable."""
    patterns = [
        (r"(?:push|append)\s*\(?\s*(-?\d+(?:\.\d+)?)", "PUSH", "stack"),
        (r"(?:pop)\s*\(?", "POP", "stack"),
        (r"(?:enqueue|offer|add)\s*\(?\s*(-?\d+(?:\.\d+)?)", "ENQUEUE", "queue"),
        (r"(?:dequeue|poll)\s*\(?", "DEQUEUE", "queue"),
        (r"(?:insert|insert_end)\s*\(?\s*(-?\d+(?:\.\d+)?)", "INSERT", "linked_list"),
        (r"(?:remove|delete)\s*\(?\s*(-?\d+(?:\.\d+)?)?", "DELETE", "array"),
        (r"(?:sort|sorted|heapify)\s*\(?", "SORT", "array"),
        (r"(?:search|index|indexOf|contains)\s*\(?\s*(-?\d+(?:\.\d+)?)?", "SEARCH", "array"),
        (r"(?:preorder|inorder|postorder|levelOrder)\s*\(?", "TRAVERSE", "tree"),
        (r"(?:bfs|dfs)\s*\(?", "TRAVERSE", "graph"),
        (r"(?:factorial|fibonacci)\s*\(\s*\d+", "FUNCTION_CALL", "recursion"),
        (r"(?:swap|compare)\s*\(?", "COMPARE", "array"),
    ]
    found: list[dict[str, object]] = []
    for pattern, operation, data_structure in patterns:
        for match in re.finditer(pattern, code, re.IGNORECASE):
            value = match.group(1) if match.lastindex else None
            found.append({"description": f"{operation}{f'({value})' if value else ''}", "operation": operation, "data_structure": data_structure, "line": code[:match.start()].count("\n") + 1})
    found.sort(key=lambda item: int(item["line"]))
    for index, item in enumerate(found, start=1):
        item["step"] = index
    return bool(found), found


def _runtime_steps(output: str) -> tuple[str, list[dict[str, object]]]:
    """Read visualization events emitted by the program that actually ran.

    The marker lines are intentionally removed from the console output so the
    learner sees normal program output while the visualizer receives real
    operation values and indexes.
    """
    pattern = re.compile(r"@AIDS\|([A-Z_]+)\|index=(-?\d+)\|value=(-?\d+(?:\.\d+)?)")
    steps: list[dict[str, object]] = []
    visible_lines: list[str] = []
    for line in output.splitlines():
        match = pattern.search(line)
        if not match:
            visible_lines.append(line)
            continue
        operation, index, value = match.groups()
        steps.append({
            "step": len(steps) + 1,
            "description": f"{operation}({value})",
            "operation": operation,
            "data_structure": "array",
            "line": 1,
            "index": int(index),
            "value": float(value) if "." in value else int(value),
        })
        remaining = f"{line[:match.start()]}{line[match.end():]}".strip()
        if remaining:
            visible_lines.append(remaining)
    return "\n".join(visible_lines).strip(), steps


def _safety_issue(code: str, language: Language) -> str | None:
    blocked = {
        "python": [r"\bimport\s+(os|sys|socket|subprocess|pathlib|shutil)", r"\bfrom\s+(os|sys|socket|subprocess|pathlib|shutil)\s+import", r"\b(open|eval|exec|__import__)\s*\("],
        "c": [r"\b(system|popen|fork|execve)\s*\(", r"#\s*include\s*[<\"](windows|winsock|sys\/socket)"],
        "cpp": [r"\b(system|popen|fork|execve)\s*\(", r"#\s*include\s*[<\"](windows|winsock|sys\/socket)"],
        "java": [r"Runtime\.getRuntime", r"ProcessBuilder", r"java\.net\."],
    }
    for pattern in blocked[language]:
        if re.search(pattern, code, re.IGNORECASE):
            return "This program uses a restricted system, process, network, or filesystem operation. Remove it and run a data-structure-only program."
    return None


@router.post("/run")
def run_program(request: ProgramRunRequest):
    started = time.perf_counter()
    code = request.code.strip()
    if not code:
        return {"success": False, "error": {"type": "VALIDATION_ERROR", "message": "Program code cannot be empty.", "line": None, "phase": "validation"}}
    safety_issue = _safety_issue(code, request.language)
    if safety_issue:
        return {"success": False, "language": request.language, "status": "Validation failed", "error": {"type": "SAFETY_ERROR", "message": safety_issue, "line": None, "phase": "validation"}}
    extension = {"c": "program.c", "cpp": "program.cpp", "java": "Main.java", "python": "program.py"}[request.language]
    required_tool = {"c": "gcc", "cpp": "g++", "java": "javac"}.get(request.language)
    if required_tool and not shutil.which(required_tool):
        return {"success": False, "language": request.language, "status": "Compilation unavailable", "error": {"type": "TOOLCHAIN_ERROR", "message": f"{required_tool} is not installed or is not available on PATH. Install the required compiler/JDK and try again.", "line": None, "phase": "compile"}}
    with tempfile.TemporaryDirectory(prefix="aids-program-") as temp:
        root = Path(temp)
        (root / extension).write_text(request.code, encoding="utf-8")
        compile_commands, run_command = _command(request.language, root)
        for compile_command in compile_commands:
            returncode, stdout, stderr, timed_out = _run_process(compile_command, root)
            if timed_out or returncode != 0:
                details = _error_details(request.language, stderr or stdout, "compile")
                details["tool_output"] = (stderr or stdout)[-MAX_OUTPUT:]
                return {"success": False, "language": request.language, "status": "Compilation failed", "error": details, "duration_ms": round((time.perf_counter() - started) * 1000)}
        returncode, stdout, stderr, timed_out = _run_process(run_command, root, request.input_data)
        if timed_out or returncode != 0:
            details = _error_details(request.language, stderr or stdout, "runtime")
            details["tool_output"] = (stderr or stdout)[-MAX_OUTPUT:]
            return {"success": False, "language": request.language, "status": "Execution failed", "error": details, "duration_ms": round((time.perf_counter() - started) * 1000)}
        output, runtime_steps = _runtime_steps(stdout)
        supported, steps = (True, runtime_steps) if runtime_steps else _steps(request.code, request.language)
        return {"success": True, "language": request.language, "status": "Completed", "output": output[-MAX_OUTPUT:], "steps": steps, "visualization_supported": supported, "duration_ms": round((time.perf_counter() - started) * 1000)}
