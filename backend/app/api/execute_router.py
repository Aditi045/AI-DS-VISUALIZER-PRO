from __future__ import annotations

import json
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.ai.schemas import ExecuteRequest
from app.ai.codegen import generate_source
from app.ai.session_manager import session_manager
from app.ai.validator import validate_operations
from app.database import get_db
from app.models.history import OperationHistory

router = APIRouter()

COMPLEXITY = {
    "stack": {"push": "O(1)", "pop": "O(1)", "peek": "O(1)", "clear": "O(n)"},
    "queue": {"enqueue": "O(1)", "dequeue": "O(n)", "front": "O(1)", "clear": "O(n)"},
    "linked_list": {"insert_beginning": "O(1)", "insert_end": "O(n)", "insert_at": "O(n)", "delete": "O(n)", "search": "O(n)", "reverse": "O(n)"},
    "bst": {"insert": "O(log n)", "search": "O(log n)", "delete": "O(log n)", "inorder": "O(n)"},
    "heap": {"insert": "O(log n)", "extract": "O(log n)", "peek": "O(1)"},
    "graph": {"add_vertex": "O(1)", "add_edge": "O(1)", "bfs": "O(V + E)", "dfs": "O(V + E)", "dijkstra": "O((V + E) log V)"},
}


def _state(ds: Any) -> Any:
    if hasattr(ds, "to_list"):
        return ds.to_list()
    if hasattr(ds, "to_dict"):
        return ds.to_dict()
    return None


def _reset(session_id: str, ds_name: str) -> Any:
    session_manager.clear_session(session_id, ds_name)
    return session_manager.get_session(session_id)[ds_name]


@router.post("/")
async def execute_operations(command: ExecuteRequest, db: Session = Depends(get_db)):
    validation = validate_operations(command.dict())
    if not validation["success"]:
        return validation
    session = session_manager.get_session(command.session_id)
    ds = session[command.data_structure]
    events: list[dict[str, Any]] = []
    results: list[Any] = []
    try:
        for index, op in enumerate(command.operations, start=1):
            name = op.type
            value = op.value
            if name == "clear":
                ds = _reset(command.session_id, command.data_structure)
            elif command.data_structure == "stack":
                if name == "push": ds.push(value)
                elif name == "pop":
                    if ds.is_empty(): return {"success": False, "error": "Stack Underflow", "message": "Cannot POP because the stack is empty."}
                    results.append(ds.pop())
                elif name == "peek": results.append(ds.peek())
            elif command.data_structure == "queue":
                if name == "enqueue": ds.enqueue(value)
                elif name == "dequeue":
                    if ds.is_empty(): return {"success": False, "error": "Queue Underflow", "message": "Cannot DEQUEUE because the queue is empty."}
                    results.append(ds.dequeue())
                elif name == "front": results.append(ds.front())
            elif command.data_structure in {"linked_list", "doubly_linked_list"}:
                if name in {"insert", "insert_end"}: ds.insert_end(value)
                elif name == "insert_beginning": ds.insert_beginning(value)
                elif name == "insert_at": ds.insert_at(value, op.position or 0)
                elif name == "delete":
                    if not ds.delete(value): return {"success": False, "error": "Node Not Found", "message": f"{value} was not found."}
                elif name == "search": results.append(ds.search(value))
                elif name == "reverse": ds.reverse()
            elif command.data_structure == "bst":
                if name == "insert": ds.insert(value)
                elif name == "search": results.append(ds.search(value))
                elif name == "delete":
                    if not ds.search(value): return {"success": False, "error": "Node Not Found", "message": f"{value} was not found in the BST."}
                    ds.delete(value)
                elif name in {"inorder", "preorder", "postorder"}: results.append(getattr(ds, name)())
            elif command.data_structure == "heap":
                if name == "insert": ds.insert(value)
                elif name == "extract":
                    if ds.peek() is None: return {"success": False, "error": "Heap Underflow", "message": "Cannot EXTRACT from an empty heap."}
                    results.append(ds.extract())
                elif name == "peek": results.append(ds.peek())
            elif command.data_structure == "graph":
                if name == "add_vertex": ds.add_vertex(value)
                elif name == "add_edge": ds.add_edge(op.source, op.target, op.weight)
                elif name == "remove_edge": ds.remove_edge(op.source, op.target)
                elif name in {"bfs", "dfs", "dijkstra"}:
                    from app.algorithms.graph_traversal import bfs, dfs, dijkstra
                    result = {"bfs": bfs, "dfs": dfs, "dijkstra": dijkstra}[name](ds, value)
                    results.append(result)
            events.append({
                "step": index,
                "event_type": name.upper(),
                "data_structure": command.data_structure,
                "value": value,
                "state": _state(ds),
                "description": f"{name.replace('_', ' ').title()} completed",
                "complexity": COMPLEXITY.get(command.data_structure, {}).get(name, "O(1)"),
            })
        if command.command_text:
            db.add(OperationHistory(session_id=command.session_id, command=command.command_text, data_structure=command.data_structure, language=command.language, operations=json.dumps(command.dict().get("operations", []), default=str)))
            db.commit()
        last = command.operations[-1].type
        return {"success": True, "language": command.language, "source_code": generate_source(command.language, command.data_structure, command.operations), "events": events, "state": _state(ds), "results": results, "complexity": {"time": COMPLEXITY.get(command.data_structure, {}).get(last, "O(1)"), "space": "O(n)"}, "explanation": events[-1]["description"] if events else "No operation performed"}
    except (ValueError, IndexError, KeyError) as exc:
        return {"success": False, "error": "Invalid Operation", "message": str(exc)}
    except Exception:
        return {"success": False, "error": "Execution Error", "message": "The operation could not be completed safely."}
