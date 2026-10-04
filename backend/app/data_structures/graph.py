from typing import Any, List, Dict, Optional, Tuple, Set

class Graph:
    def __init__(self, directed: bool = False, weighted: bool = False):
        self.directed = directed
        self.weighted = weighted
        # Adjacency list: node -> {neighbor: weight} or {neighbor: None}
        self.adj_list: Dict[Any, Dict[Any, Optional[float]]] = {}

    def add_vertex(self, vertex: Any) -> None:
        if vertex not in self.adj_list:
            self.adj_list[vertex] = {}

    def add_edge(self, u: Any, v: Any, weight: Optional[float] = None) -> None:
        self.add_vertex(u)
        self.add_vertex(v)
        
        self.adj_list[u][v] = weight
        if not self.directed:
            self.adj_list[v][u] = weight

    def remove_edge(self, u: Any, v: Any) -> None:
        if u in self.adj_list and v in self.adj_list[u]:
            del self.adj_list[u][v]
        if not self.directed and v in self.adj_list and u in self.adj_list[v]:
            del self.adj_list[v][u]
            
    def remove_vertex(self, vertex: Any) -> None:
        if vertex in self.adj_list:
            del self.adj_list[vertex]
            for u in self.adj_list:
                if vertex in self.adj_list[u]:
                    del self.adj_list[u][vertex]

    def neighbors(self, vertex: Any) -> List[Any]:
        if vertex in self.adj_list:
            return list(self.adj_list[vertex].keys())
        return []
        
    def get_vertices(self) -> List[Any]:
        return list(self.adj_list.keys())

    def get_edges(self) -> List[Tuple[Any, Any, Optional[float]]]:
        edges = []
        seen = set()
        for u in self.adj_list:
            for v, weight in self.adj_list[u].items():
                if self.directed:
                    edges.append((u, v, weight))
                else:
                    edge = frozenset([u, v])
                    if edge not in seen:
                        seen.add(edge)
                        edges.append((u, v, weight))
        return edges

    def to_dict(self) -> Dict:
        return {
            "vertices": self.get_vertices(),
            "edges": [{"source": u, "target": v, "weight": w} for u, v, w in self.get_edges()],
            "directed": self.directed,
            "weighted": self.weighted
        }
