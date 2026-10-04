from __future__ import annotations

from typing import Any

from app.ai.schemas import ParsedCommand

ALLOWED: dict[str, set[str]] = {
    "stack": {"clear", "push", "pop", "peek"},
    "queue": {"clear", "enqueue", "dequeue", "front"},
    "linked_list": {"clear", "insert", "insert_end", "insert_beginning", "insert_at", "delete", "search", "reverse"},
    "doubly_linked_list": {"clear", "insert", "delete", "search", "reverse"},
    "bst": {"clear", "insert", "search", "delete", "inorder", "preorder", "postorder"},
    "heap": {"clear", "insert", "extract", "peek"},
    "graph": {"clear", "add_vertex", "add_edge", "remove_edge", "bfs", "dfs", "dijkstra"},
}


def validate_operations(parsed_json: dict[str, Any]) -> dict[str, Any]:
    if "error" in parsed_json:
        return {"success": False, "error": "Malformed AI Response", "message": parsed_json.get("details", parsed_json["error"])}
    try:
        command = ParsedCommand.parse_obj(parsed_json)
    except Exception as exc:
        return {"success": False, "error": "Invalid operation", "message": str(exc)}
    for op in command.operations:
        if op.type not in ALLOWED[command.data_structure]:
            return {"success": False, "error": "Unsupported Operation", "message": f"'{op.type}' is not valid for {command.data_structure}."}
        if op.type in {"push", "enqueue", "insert", "insert_end", "insert_beginning", "insert_at", "add_vertex"} and op.value is None:
            return {"success": False, "error": "Missing parameter", "message": f"'{op.type}' requires a value."}
        if op.type == "add_edge" and (op.source is None or op.target is None):
            return {"success": False, "error": "Missing parameter", "message": "add_edge requires source and target."}
    data = command.dict() if hasattr(command, "dict") else command.model_dump()
    return {"success": True, "data": data}
