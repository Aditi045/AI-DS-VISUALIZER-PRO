from __future__ import annotations

import os

from fastapi import APIRouter

from app.ai.schemas import ChatRequest

router = APIRouter()

KNOWLEDGE = {
    "stack": "A stack is LIFO: the last item pushed is the first item popped. Push, pop, and peek are O(1).",
    "queue": "A queue is FIFO: the first item enqueued is the first item dequeued. Enqueue and front are O(1); this implementation uses a list, so dequeue is O(n).",
    "linked_list": "A singly linked list stores nodes connected by next pointers. Inserting at the head is O(1); searching and reversing are O(n).",
    "bst": "A binary search tree keeps smaller keys on the left and larger keys on the right. Search is O(log n) on average and O(n) in the worst case.",
    "heap": "A min-heap keeps its smallest item at the root. Peek is O(1), while insert and extract are O(log n).",
    "graph": "A graph models vertices and edges. BFS and DFS visit reachable vertices in O(V + E).",
}


def local_answer(request: ChatRequest) -> str:
    message = request.message.lower()
    topic = request.context_ds.lower()
    if "difference" in message and "bfs" in message and "dfs" in message:
        return "BFS explores level by level using a queue; DFS explores deeply using recursion or a stack. Both run in O(V + E) with an adjacency list."
    if "why" in message and "pop" in message and "stack" in message:
        return "Stack pop removes the last list item, so it does not scan other elements and runs in O(1)."
    if "explain" in message or "what is" in message or "how" in message:
        return KNOWLEDGE.get(topic, "Select a data structure and ask me about its operations, invariants, or complexity.")
    return f"For the current {topic}, the visible state is {request.context_state!r}. Ask about its operations, complexity, or the current visualization."


@router.post("/")
async def chat(request: ChatRequest):
    # Optional provider support can be added behind this boundary. The local
    # tutor keeps the core product useful and key-free during development.
    return {"response": local_answer(request), "provider": "local"}
