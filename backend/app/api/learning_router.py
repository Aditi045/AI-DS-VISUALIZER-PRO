from __future__ import annotations

import re
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.algorithms.sorting import bubble_sort, insertion_sort, merge_sort, quick_sort

router = APIRouter()


class AlgorithmRequest(BaseModel):
    algorithm: str = Field(..., max_length=40)
    values: list[float] = Field(default_factory=list, max_items=1000)
    target: float | None = None


@router.post("/algorithm/run")
async def run_algorithm(request: AlgorithmRequest):
    if request.algorithm in {"bubble_sort", "insertion_sort", "merge_sort", "quick_sort"}:
        result = {"bubble_sort": bubble_sort, "insertion_sort": insertion_sort, "merge_sort": merge_sort, "quick_sort": quick_sort}[request.algorithm](request.values)
        return {"success": True, **result}
    return {"success": False, "error": "Unsupported Algorithm"}


@router.post("/code/analyze")
async def analyze_code(payload: dict[str, str]):
    code = payload.get("code", "")[:10000]
    operations: list[dict[str, Any]] = []
    for match in re.finditer(r"stack\.push\(([^)]+)\)", code, re.I):
        raw = match.group(1).strip()
        if re.fullmatch(r"-?\d+(?:\.\d+)?", raw): operations.append({"type": "push", "value": float(raw) if "." in raw else int(raw)})
    operations.extend({"type": "pop"} for _ in re.finditer(r"stack\.pop\(\)", code, re.I))
    return {"success": True, "data_structure": "stack", "operations": operations, "safe": True, "message": "Only recognized stack patterns were converted; code was never executed."}


@router.post("/code/generate")
async def generate_code(payload: dict[str, Any]):
    language = str(payload.get("language", "python")).lower()
    state = payload.get("state", [])
    values = state if isinstance(state, list) else []
    lines = {"python": ["stack = []"] + [f"stack.append({value!r})" for value in values], "javascript": ["const stack = [];"] + [f"stack.push({value!r});" for value in values], "cpp": ["std::stack<int> stack;"] + [f"stack.push({value});" for value in values], "java": ["Stack<Integer> stack = new Stack<>();"] + [f"stack.push({value});" for value in values]}.get(language, ["// Unsupported language"])
    return {"success": True, "language": language, "code": "\n".join(lines), "educational": True}
