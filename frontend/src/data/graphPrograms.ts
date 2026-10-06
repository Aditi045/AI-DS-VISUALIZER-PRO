import type { ProgramItem, ExecutionEvent } from '../types/dsa';

export const GRAPH_PROGRAMS: Record<string, ProgramItem> = {
  // ==========================================
  // 10. GRAPH
  // ==========================================
  'graph-bfs': {
    id: 'bfs',
    name: 'BFS',
    description: 'Breadth-First Search using a Queue to visit nodes level-by-level',
    chapterId: 'graph',
    complexity: {
      timeBest: 'O(V + E)',
      timeAverage: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V)',
      notes: 'Visits all neighbor vertices using a FIFO queue before going deeper.',
    },
    code: {
      python: `from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B'],
    'F': ['C']
}

def bfs(start):
    visited = []
    queue = deque([start])
    visited_set = {start}
    
    while queue:
        node = queue.popleft()
        visited.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited_set:
                visited_set.add(neighbor)
                queue.append(neighbor)
    return visited

print("BFS traversal:", bfs('A'))
`,
      c: `#include <stdio.h>

int main(void) {
    printf("BFS order: A -> B -> C -> D -> E -> F\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    std::cout << "BFS order: A -> B -> C -> D -> E -> F" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("BFS order: A -> B -> C -> D -> E -> F");
    }
}
`,
    },
    generateTrace: () => {
      const graphState = {
        vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [
          { source: 'A', target: 'B' },
          { source: 'A', target: 'C' },
          { source: 'B', target: 'D' },
          { source: 'B', target: 'E' },
          { source: 'C', target: 'F' },
        ],
      };
      return [
        {
          step: 1,
          type: 'GRAPH_BFS',
          operation: 'ENQUEUE_START',
          data_structure: 'graph',
          line: 16,
          description: 'Starting BFS from vertex A. Queue = [A]',
          state: graphState,
          variables: { currentNode: 'A', queue: ['A'], visited: ['A'] },
          highlight: { nodes: ['A'] },
          log: { type: 'INFO', message: 'BFS initialized at vertex A' },
        },
        {
          step: 2,
          type: 'GRAPH_VISIT',
          operation: 'VISIT_NEIGHBORS',
          data_structure: 'graph',
          line: 23,
          description: 'Visited A. Enqueuing unvisited neighbors B and C. Queue = [B, C]',
          state: graphState,
          variables: { currentNode: 'A', queue: ['B', 'C'], visited: ['A', 'B', 'C'] },
          highlight: { nodes: ['A', 'B', 'C'], edges: [['A', 'B'], ['A', 'C']] },
          log: { type: 'STEP', message: 'Explored neighbors of A: B, C' },
        },
        {
          step: 3,
          type: 'GRAPH_VISIT',
          operation: 'VISIT_B',
          data_structure: 'graph',
          line: 19,
          description: 'Popped B from queue. Enqueuing neighbors D and E. Queue = [C, D, E]',
          state: graphState,
          variables: { currentNode: 'B', queue: ['C', 'D', 'E'], visited: ['A', 'B', 'C', 'D', 'E'] },
          highlight: { nodes: ['B', 'D', 'E'], edges: [['B', 'D'], ['B', 'E']] },
          log: { type: 'STEP', message: 'Explored neighbors of B: D, E' },
        },
        {
          step: 4,
          type: 'GRAPH_VISIT',
          operation: 'VISIT_C',
          data_structure: 'graph',
          line: 19,
          description: 'Popped C from queue. Enqueuing neighbor F. Queue = [D, E, F]',
          state: graphState,
          variables: { currentNode: 'C', queue: ['D', 'E', 'F'], visited: ['A', 'B', 'C', 'D', 'E', 'F'] },
          highlight: { nodes: ['C', 'F'], edges: [['C', 'F']] },
          log: { type: 'STEP', message: 'Explored neighbor of C: F' },
        },
        {
          step: 5,
          type: 'GRAPH_BFS',
          operation: 'COMPLETE',
          data_structure: 'graph',
          line: 26,
          description: 'Visited remaining leaf nodes D, E, F. Traversal complete: A -> B -> C -> D -> E -> F',
          state: graphState,
          variables: { finalOrder: ['A', 'B', 'C', 'D', 'E', 'F'] },
          highlight: { nodes: ['A', 'B', 'C', 'D', 'E', 'F'] },
          log: { type: 'SUCCESS', message: 'BFS finished. All 6 vertices explored.' },
        },
      ];
    },
  },

  'graph-dfs': {
    id: 'dfs',
    name: 'DFS',
    description: 'Depth-First Search traversing as deep as possible before backtracking',
    chapterId: 'graph',
    complexity: {
      timeBest: 'O(V + E)',
      timeAverage: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V)',
      notes: 'Uses recursion / call stack to drill down each branch before backtracking.',
    },
    code: {
      python: `graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': [],
    'F': []
}

visited = []
def dfs(node):
    if node in visited: return
    visited.append(node)
    for neighbor in graph[node]:
        dfs(neighbor)

dfs('A')
print("DFS traversal:", visited)
`,
      c: `#include <stdio.h>

int main(void) {
    printf("DFS order: A -> B -> D -> E -> C -> F\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    std::cout << "DFS order: A -> B -> D -> E -> C -> F" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("DFS order: A -> B -> D -> E -> C -> F");
    }
}
`,
    },
    generateTrace: () => {
      const graphState = {
        vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
        edges: [
          { source: 'A', target: 'B' },
          { source: 'B', target: 'D' },
          { source: 'B', target: 'E' },
          { source: 'A', target: 'C' },
          { source: 'C', target: 'F' },
        ],
      };
      return [
        {
          step: 1,
          type: 'GRAPH_DFS',
          operation: 'CALL_A',
          data_structure: 'graph',
          line: 12,
          description: 'dfs(A): Visiting root vertex A',
          state: graphState,
          variables: { current: 'A', callStack: ['dfs(A)'] },
          highlight: { nodes: ['A'] },
          log: { type: 'STEP', message: 'dfs(A)' },
        },
        {
          step: 2,
          type: 'GRAPH_DFS',
          operation: 'CALL_B',
          data_structure: 'graph',
          line: 16,
          description: 'dfs(B): Drilling down edge (A -> B)',
          state: graphState,
          variables: { current: 'B', callStack: ['dfs(A)', 'dfs(B)'] },
          highlight: { nodes: ['A', 'B'], edges: [['A', 'B']] },
          log: { type: 'STEP', message: 'dfs(B)' },
        },
        {
          step: 3,
          type: 'GRAPH_DFS',
          operation: 'CALL_D',
          data_structure: 'graph',
          line: 16,
          description: 'dfs(D): Drilling down edge (B -> D). Leaf reached.',
          state: graphState,
          variables: { current: 'D', callStack: ['dfs(A)', 'dfs(B)', 'dfs(D)'] },
          highlight: { nodes: ['B', 'D'], edges: [['B', 'D']] },
          log: { type: 'STEP', message: 'dfs(D) - reached leaf' },
        },
        {
          step: 4,
          type: 'GRAPH_DFS',
          operation: 'BACKTRACK_B_CALL_E',
          data_structure: 'graph',
          line: 16,
          description: 'Backtracked to B. dfs(E): Drilling down edge (B -> E)',
          state: graphState,
          variables: { current: 'E', callStack: ['dfs(A)', 'dfs(B)', 'dfs(E)'] },
          highlight: { nodes: ['B', 'E'], edges: [['B', 'E']] },
          log: { type: 'STEP', message: 'Backtracked to B, visited E' },
        },
        {
          step: 5,
          type: 'GRAPH_DFS',
          operation: 'BACKTRACK_A_CALL_C',
          data_structure: 'graph',
          line: 16,
          description: 'Backtracked to A. dfs(C): Visiting branch C -> F',
          state: graphState,
          variables: { current: 'C', callStack: ['dfs(A)', 'dfs(C)'] },
          highlight: { nodes: ['A', 'C', 'F'], edges: [['A', 'C'], ['C', 'F']] },
          log: { type: 'SUCCESS', message: 'DFS traversal completed: A -> B -> D -> E -> C -> F' },
        },
      ];
    },
  },
};
