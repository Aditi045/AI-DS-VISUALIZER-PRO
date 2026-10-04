from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


DataStructureName = Literal[
    "stack", "queue", "linked_list", "doubly_linked_list", "bst", "heap", "graph"
]
LanguageName = Literal["c", "cpp", "java", "python"]


class Operation(BaseModel):
    type: str = Field(..., min_length=1, max_length=40)
    value: Optional[Any] = None
    position: Optional[int] = Field(default=None, ge=0)
    source: Optional[Any] = None
    target: Optional[Any] = None
    weight: Optional[float] = None


class ParsedCommand(BaseModel):
    data_structure: DataStructureName
    operations: list[Operation] = Field(..., min_items=1, max_items=100)


class ParseRequest(BaseModel):
    command: str = Field(..., min_length=1, max_length=1000)


class ExecuteRequest(BaseModel):
    session_id: str = Field(default="demo-session", min_length=1, max_length=100)
    command_text: Optional[str] = Field(default=None, max_length=1000)
    data_structure: DataStructureName
    operations: list[Operation] = Field(..., min_items=1, max_items=100)
    language: LanguageName = "python"


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    context_ds: str = "stack"
    context_state: Any = None
    complexity: str = ""
