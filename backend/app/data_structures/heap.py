from typing import Any, List, Optional

class Heap:
    def __init__(self, is_min_heap: bool = True):
        self.heap: List[Any] = []
        self.is_min_heap = is_min_heap

    def _compare(self, a: Any, b: Any) -> bool:
        if self.is_min_heap:
            return a < b
        return a > b

    def _parent(self, i: int) -> int:
        return (i - 1) // 2

    def _left_child(self, i: int) -> int:
        return 2 * i + 1

    def _right_child(self, i: int) -> int:
        return 2 * i + 2

    def _swap(self, i: int, j: int) -> None:
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def insert(self, key: Any) -> None:
        self.heap.append(key)
        self._heapify_up(len(self.heap) - 1)

    def _heapify_up(self, i: int) -> None:
        while i > 0 and self._compare(self.heap[i], self.heap[self._parent(i)]):
            self._swap(i, self._parent(i))
            i = self._parent(i)

    def extract(self) -> Optional[Any]:
        if not self.heap:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()

        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._heapify_down(0)
        return root

    def _heapify_down(self, i: int) -> None:
        smallest_or_largest = i
        left = self._left_child(i)
        right = self._right_child(i)
        n = len(self.heap)

        if left < n and self._compare(self.heap[left], self.heap[smallest_or_largest]):
            smallest_or_largest = left

        if right < n and self._compare(self.heap[right], self.heap[smallest_or_largest]):
            smallest_or_largest = right

        if smallest_or_largest != i:
            self._swap(i, smallest_or_largest)
            self._heapify_down(smallest_or_largest)

    def peek(self) -> Optional[Any]:
        if self.heap:
            return self.heap[0]
        return None

    def size(self) -> int:
        return len(self.heap)
        
    def to_list(self) -> List[Any]:
        return self.heap.copy()
