from typing import Any


class HashTable:
    def __init__(self, capacity: int = 16): self._buckets: list[list[tuple[Any, Any]]] = [[] for _ in range(capacity)]
    def _bucket(self, key: Any) -> list[tuple[Any, Any]]: return self._buckets[hash(key) % len(self._buckets)]
    def insert(self, key: Any, value: Any) -> None:
        bucket = self._bucket(key)
        for i, (old, _) in enumerate(bucket):
            if old == key: bucket[i] = (key, value); return
        bucket.append((key, value))
    def search(self, key: Any) -> Any:
        return next((value for old, value in self._bucket(key) if old == key), None)
    def delete(self, key: Any) -> bool:
        bucket = self._bucket(key)
        for i, (old, _) in enumerate(bucket):
            if old == key: bucket.pop(i); return True
        return False
