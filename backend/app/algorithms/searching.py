from typing import List, Dict, Any

def binary_search(arr: List[int], target: int) -> Dict[str, Any]:
    steps = []
    left, right = 0, len(arr) - 1
    found_idx = -1
    
    while left <= right:
        mid = (left + right) // 2
        steps.append({
            "left": left,
            "right": right,
            "mid": mid,
            "mid_value": arr[mid],
            "target": target
        })
        
        if arr[mid] == target:
            found_idx = mid
            steps.append({"found": True, "index": mid})
            break
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    if found_idx == -1:
        steps.append({"found": False, "index": -1})
        
    return {
        "algorithm": "binary_search",
        "result": found_idx,
        "steps": steps,
        "time_complexity": "O(log n)",
        "space_complexity": "O(1)"
    }

def linear_search(arr: List[int], target: int) -> Dict[str, Any]:
    steps = []
    found_idx = -1
    
    for i, val in enumerate(arr):
        steps.append({"index": i, "value": val, "target": target})
        if val == target:
            found_idx = i
            steps.append({"found": True, "index": i})
            break
            
    if found_idx == -1:
        steps.append({"found": False, "index": -1})
        
    return {
        "algorithm": "linear_search",
        "result": found_idx,
        "steps": steps,
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    }
