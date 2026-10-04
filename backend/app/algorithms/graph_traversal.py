from typing import Dict, Any, List, Optional
from app.data_structures.graph import Graph

def bfs(graph: Graph, start_vertex: Any) -> Dict[str, Any]:
    if start_vertex not in graph.adj_list:
        return {"error": f"Vertex {start_vertex} not found in graph."}
        
    visited = set()
    queue = [start_vertex]
    visited.add(start_vertex)
    
    steps = []
    traversal = []
    
    while queue:
        current = queue.pop(0)
        traversal.append(current)
        
        neighbors = graph.neighbors(current)
        steps.append({
            "current": current,
            "visited": list(visited),
            "queue": queue.copy(),
            "neighbors": neighbors
        })
        
        for neighbor in neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return {
        "algorithm": "BFS",
        "result": traversal,
        "steps": steps,
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V)"
    }

def dfs(graph: Graph, start_vertex: Any) -> Dict[str, Any]:
    if start_vertex not in graph.adj_list:
        return {"error": f"Vertex {start_vertex} not found in graph."}
        
    visited = set()
    steps = []
    traversal = []
    
    def _dfs_recursive(vertex):
        visited.add(vertex)
        traversal.append(vertex)
        
        neighbors = graph.neighbors(vertex)
        steps.append({
            "current": vertex,
            "visited": list(visited),
            "neighbors": neighbors
        })
        
        for neighbor in neighbors:
            if neighbor not in visited:
                _dfs_recursive(neighbor)
                
    _dfs_recursive(start_vertex)
    
    return {
        "algorithm": "DFS",
        "result": traversal,
        "steps": steps,
        "time_complexity": "O(V + E)",
        "space_complexity": "O(V)"
    }


def dijkstra(graph: Graph, start_vertex: Any, target: Optional[Any] = None) -> Dict[str, Any]:
    if start_vertex not in graph.adj_list:
        return {"error": f"Vertex {start_vertex} not found in graph."}
    distances = {vertex: float("inf") for vertex in graph.get_vertices()}
    previous: Dict[Any, Any] = {}
    distances[start_vertex] = 0
    unvisited = set(distances)
    steps = []
    while unvisited:
        current = min(unvisited, key=lambda vertex: distances[vertex])
        if distances[current] == float("inf"):
            break
        unvisited.remove(current)
        steps.append({"current": current, "distance": distances[current], "visited": list(set(distances) - unvisited)})
        if target is not None and current == target:
            break
        for neighbor in graph.neighbors(current):
            weight = graph.adj_list[current][neighbor]
            candidate = distances[current] + (weight if weight is not None else 1)
            if candidate < distances[neighbor]:
                distances[neighbor] = candidate
                previous[neighbor] = current
    path = []
    if target is not None and target in distances and distances[target] != float("inf"):
        current = target
        while current in previous:
            path.append(current)
            current = previous[current]
        path.append(start_vertex)
        path.reverse()
    return {"algorithm": "Dijkstra", "result": {"distances": distances, "path": path}, "steps": steps, "time_complexity": "O((V + E) log V)", "space_complexity": "O(V)"}
