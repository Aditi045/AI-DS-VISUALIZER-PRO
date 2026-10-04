from typing import Any, Optional


class CircularQueue:
    def __init__(self, capacity: int = 10):
        if capacity < 1: raise ValueError("capacity must be positive")
        self.capacity = capacity; self._items: list[Any] = []
    def enqueue(self, item: Any) -> None:
        if self.is_full(): raise OverflowError("Circular queue is full")
        self._items.append(item)
    def dequeue(self) -> Optional[Any]: return self._items.pop(0) if self._items else None
    def front(self) -> Optional[Any]: return self._items[0] if self._items else None
    def is_empty(self) -> bool: return not self._items
    def is_full(self) -> bool: return len(self._items) == self.capacity
    def to_list(self) -> list[Any]: return self._items[:]
