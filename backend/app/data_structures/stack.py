from typing import Any, List, Optional

class Stack:
    def __init__(self):
        self._items: List[Any] = []

    def push(self, item: Any) -> None:
        self._items.append(item)

    def pop(self) -> Optional[Any]:
        if not self.is_empty():
            return self._items.pop()
        return None

    def peek(self) -> Optional[Any]:
        if not self.is_empty():
            return self._items[-1]
        return None

    def is_empty(self) -> bool:
        return len(self._items) == 0

    def size(self) -> int:
        return len(self._items)
        
    def to_list(self) -> List[Any]:
        return self._items.copy()
