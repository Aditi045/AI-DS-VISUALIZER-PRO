"""Safe, deterministic natural-language command parser."""
from __future__ import annotations

import re
from typing import Any

from app.ai.schemas import Operation, ParsedCommand

_NUMBER = r"-?\d+(?:\.\d+)?"


def _value(raw: str) -> Any:
    raw = raw.strip().strip("'\"")
    try:
        return float(raw) if "." in raw else int(raw)
    except ValueError:
        return raw


def _values(fragment: str) -> list[Any]:
    tokens = re.findall(r"'[^']+'|\"[^\"]+\"|[A-Za-z][\w-]*|" + _NUMBER, fragment)
    ignored = {"and", "a", "an", "the", "to", "from", "of", "on", "in", "using", "with"}
    return [_value(token) for token in tokens if token.lower() not in ignored]


def parse_local(command: str) -> ParsedCommand:
    text = command.strip()
    lower = text.lower()
    if not text:
        raise ValueError("Command cannot be empty")

    if any(word in lower for word in ("stack", "push", "pop", "peek")):
        ops: list[Operation] = []
        if re.search(r"\bcreate\b|\bclear\b", lower):
            ops.append(Operation(type="clear"))
        match = re.search(r"(?:push|add)\s+(.+?)(?:\.|$)", text, re.I)
        if match:
            ops.extend(Operation(type="push", value=v) for v in _values(match.group(1)))
        if re.search(r"\bpop\b|remove the top", lower):
            ops.append(Operation(type="pop"))
        if re.search(r"\bpeek\b|top element", lower):
            ops.append(Operation(type="peek"))
        if ops:
            return ParsedCommand(data_structure="stack", operations=ops)

    if any(word in lower for word in ("queue", "enqueue", "dequeue")):
        ops = []
        if re.search(r"\bcreate\b|\bclear\b", lower):
            ops.append(Operation(type="clear"))
        match = re.search(r"(?:enqueue|add)\s+(.+?)(?:\.|$)", text, re.I)
        if match:
            ops.extend(Operation(type="enqueue", value=v) for v in _values(match.group(1)))
        if re.search(r"\bdequeue\b|remove (?:the )?first", lower):
            ops.append(Operation(type="dequeue"))
        if re.search(r"\bfront\b", lower):
            ops.append(Operation(type="front"))
        if ops:
            return ParsedCommand(data_structure="queue", operations=ops)

    if "linked list" in lower:
        ops = [Operation(type="reverse")] if "reverse" in lower else []
        delete_match = re.search(r"delete\s+([\w.'-]+)", text, re.I)
        if delete_match:
            ops.append(Operation(type="delete", value=_value(delete_match.group(1))))
        if "insert" in lower:
            ops.extend(Operation(type="insert_end", value=v) for v in _values(text) if isinstance(v, (int, float)))
        if not ops:
            ops.extend(Operation(type="insert_end", value=v) for v in _values(text) if isinstance(v, (int, float)))
        return ParsedCommand(data_structure="linked_list", operations=ops or [Operation(type="clear")])

    if "bst" in lower or "binary search tree" in lower:
        ops = [Operation(type="clear")] if "create" in lower else []
        nums = [v for v in _values(text) if isinstance(v, (int, float))]
        ops.extend(Operation(type="insert", value=v) for v in nums)
        match = re.search(r"search\s+(" + _NUMBER + r")", text, re.I)
        if match:
            ops.append(Operation(type="search", value=_value(match.group(1))))
        match = re.search(r"delete\s+(" + _NUMBER + r")", text, re.I)
        if match:
            ops.append(Operation(type="delete", value=_value(match.group(1))))
        if "inorder" in lower:
            ops.append(Operation(type="inorder"))
        return ParsedCommand(data_structure="bst", operations=ops or [Operation(type="inorder")])

    if "heap" in lower:
        ops = [Operation(type="clear")] if "create" in lower else []
        ops.extend(Operation(type="insert", value=v) for v in _values(text) if isinstance(v, (int, float)))
        if "extract" in lower:
            ops.append(Operation(type="extract"))
        if "peek" in lower:
            ops.append(Operation(type="peek"))
        return ParsedCommand(data_structure="heap", operations=ops or [Operation(type="peek")])

    if "graph" in lower or "edge" in lower:
        ops = [Operation(type="clear")] if "create" in lower else []
        pattern = r"(?:connect|edge|add edge)\s+([\w -]+?)\s+(?:to|->)\s+([\w -]+)(?:\s+with weight\s+(" + _NUMBER + r"))?"
        for source, target, weight in re.findall(pattern, text, re.I):
            ops.append(Operation(type="add_edge", source=source.strip(), target=target.strip(), weight=float(weight) if weight else None))
        return ParsedCommand(data_structure="graph", operations=ops or [Operation(type="clear")])

    raise ValueError("I could not identify a supported data structure or operation")


def parse_natural_language(command: str) -> dict[str, Any]:
    try:
        result = parse_local(command)
        return result.dict() if hasattr(result, "dict") else result.model_dump()
    except Exception as exc:
        return {"error": "Malformed command", "details": str(exc)}
