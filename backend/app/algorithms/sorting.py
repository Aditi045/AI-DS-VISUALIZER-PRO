from __future__ import annotations

from typing import Any


def _result(name: str, values: list[Any], steps: list[dict[str, Any]], time: str, space: str = "O(1)") -> dict[str, Any]:
    return {"algorithm": name, "result": values, "steps": steps, "time_complexity": time, "space_complexity": space}


def bubble_sort(values: list[Any]) -> dict[str, Any]:
    items = values[:]
    steps = []
    for end in range(len(items) - 1, 0, -1):
        for i in range(end):
            steps.append({"compare": [i, i + 1], "values": items[:]})
            if items[i] > items[i + 1]: items[i], items[i + 1] = items[i + 1], items[i]
    return _result("bubble_sort", items, steps, "O(n²)")


def insertion_sort(values: list[Any]) -> dict[str, Any]:
    items = values[:]
    steps = []
    for i in range(1, len(items)):
        key, j = items[i], i - 1
        while j >= 0 and items[j] > key:
            steps.append({"move": [j, j + 1], "values": items[:]})
            items[j + 1] = items[j]; j -= 1
        items[j + 1] = key
    return _result("insertion_sort", items, steps, "O(n²)")


def merge_sort(values: list[Any]) -> dict[str, Any]:
    steps: list[dict[str, Any]] = []
    def sort(items: list[Any]) -> list[Any]:
        if len(items) <= 1: return items
        mid = len(items) // 2
        left, right = sort(items[:mid]), sort(items[mid:])
        merged: list[Any] = []
        while left and right: merged.append(left.pop(0) if left[0] <= right[0] else right.pop(0))
        merged.extend(left or right); steps.append({"merge": merged[:]}); return merged
    return _result("merge_sort", sort(values[:]), steps, "O(n log n)", "O(n)")


def quick_sort(values: list[Any]) -> dict[str, Any]:
    steps: list[dict[str, Any]] = []
    def sort(items: list[Any]) -> list[Any]:
        if len(items) <= 1: return items
        pivot = items[-1]
        low = [v for v in items[:-1] if v <= pivot]; high = [v for v in items[:-1] if v > pivot]
        result = sort(low) + [pivot] + sort(high); steps.append({"pivot": pivot, "values": result[:]}); return result
    return _result("quick_sort", sort(values[:]), steps, "O(n log n)", "O(log n)")

