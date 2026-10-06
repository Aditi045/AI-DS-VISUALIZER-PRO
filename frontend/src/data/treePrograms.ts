import type { ProgramItem, ExecutionEvent } from '../types/dsa';

export const TREE_PROGRAMS: Record<string, ProgramItem> = {
  // ==========================================
  // 7. BINARY TREE
  // ==========================================
  'binary_tree-inorder': {
    id: 'inorder',
    name: 'Inorder Traversal',
    description: 'Traverse left subtree, visit root node, traverse right subtree (L-Root-R)',
    chapterId: 'binary_tree',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(h)',
      notes: 'Visits every node exactly once with recursion stack depth h (tree height).',
    },
    code: {
      python: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Tree:
#      50
#    /    \\
#   30     70
#  /  \\   /  \\
# 20  40 60  80

root = TreeNode(50,
    TreeNode(30, TreeNode(20), TreeNode(40)),
    TreeNode(70, TreeNode(60), TreeNode(80))
)

visited = []
def inorder(node):
    if not node: return
    inorder(node.left)
    visited.append(node.val)
    inorder(node.right)

inorder(root)
print("Inorder sequence:", visited)
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node { int val; struct Node *left, *right; };

void inorder(struct Node* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->val);
    inorder(root->right);
}

int main(void) {
    printf("Inorder: 20 30 40 50 60 70 80\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

void inorderPrint() {
    std::cout << "Inorder: 20 30 40 50 60 70 80" << std::endl;
}

int main() {
    inorderPrint();
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Inorder: 20 30 40 50 60 70 80");
    }
}
`,
    },
    generateTrace: () => {
      const tree = {
        value: 50,
        left: { value: 30, left: { value: 20 }, right: { value: 40 } },
        right: { value: 70, left: { value: 60 }, right: { value: 80 } },
      };
      const sequence = [20, 30, 40, 50, 60, 70, 80];
      const trace: ExecutionEvent[] = [
        {
          step: 1,
          type: 'TREE_VISIT',
          operation: 'START',
          data_structure: 'binary_tree',
          line: 23,
          description: 'Starting Inorder traversal from root (50)',
          state: tree,
          variables: { current: 50, order: 'Left -> Root -> Right' },
          highlight: { nodes: [50] },
          log: { type: 'INFO', message: 'Inorder begins at root 50' },
        },
      ];
      sequence.forEach((val, idx) => {
        trace.push({
          step: trace.length + 1,
          type: 'TREE_VISIT',
          operation: 'VISIT_NODE',
          data_structure: 'binary_tree',
          line: 25,
          description: `Visited node (${val}) [Order #${idx + 1}]`,
          state: tree,
          variables: { visitedNode: val, visitedSoFar: sequence.slice(0, idx + 1) },
          highlight: { nodes: [val] },
          log: { type: 'STEP', message: `Visited node ${val}` },
        });
      });
      trace.push({
        step: trace.length + 1,
        type: 'TREE_VISIT',
        operation: 'COMPLETE',
        data_structure: 'binary_tree',
        line: 28,
        description: 'Inorder complete: [20, 30, 40, 50, 60, 70, 80]',
        state: tree,
        variables: { result: sequence },
        log: { type: 'SUCCESS', message: 'Inorder traversal completed successfully.' },
      });
      return trace;
    },
  },

  'binary_tree-preorder': {
    id: 'preorder',
    name: 'Preorder Traversal',
    description: 'Visit root node, traverse left subtree, traverse right subtree (Root-L-R)',
    chapterId: 'binary_tree',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(h)',
      notes: 'Visits root first, ideal for copying or serializing trees.',
    },
    code: {
      python: `visited = []
def preorder(node):
    if not node: return
    visited.append(node.val) # Root first!
    preorder(node.left)
    preorder(node.right)
`,
      c: `void preorder(struct Node* root) {
    if (!root) return;
    printf("%d ", root->val);
    preorder(root->left);
    preorder(root->right);
}`,
      cpp: `void preorder(Node* root) {
    if (!root) return;
    std::cout << root->val << " ";
    preorder(root->left);
    preorder(root->right);
}`,
      java: `void preorder(Node root) {
    if (root == null) return;
    System.out.print(root.val + " ");
    preorder(root.left);
    preorder(root.right);
}`,
    },
    generateTrace: () => {
      const tree = {
        value: 50,
        left: { value: 30, left: { value: 20 }, right: { value: 40 } },
        right: { value: 70, left: { value: 60 }, right: { value: 80 } },
      };
      const seq = [50, 30, 20, 40, 70, 60, 80];
      return seq.map((val, idx) => ({
        step: idx + 1,
        type: 'TREE_VISIT',
        operation: 'PREORDER_VISIT',
        data_structure: 'binary_tree',
        line: 4,
        description: `Preorder visit: Node (${val}) [Root-L-R]`,
        state: tree,
        variables: { visitedNode: val, seqSoFar: seq.slice(0, idx + 1) },
        highlight: { nodes: [val] },
        log: { type: 'STEP', message: `Preorder visited ${val}` },
      }));
    },
  },

  // ==========================================
  // 8. BINARY SEARCH TREE (BST)
  // ==========================================
  'bst-insert': {
    id: 'insert',
    name: 'Insert',
    description: 'Insert a value by navigating left if val < node, right if val > node',
    chapterId: 'bst',
    complexity: {
      timeBest: 'O(log n)',
      timeAverage: 'O(log n)',
      timeWorst: 'O(n)',
      space: 'O(h)',
      notes: 'Follows binary decision tree: O(log n) when balanced, O(n) if degenerate.',
    },
    code: {
      python: `class BSTNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(node, val):
    if not node:
        return BSTNode(val)
    if val < node.val:
        node.left = insert(node.left, val)
    elif val > node.val:
        node.right = insert(node.right, val)
    return node

root = BSTNode(50)
insert(root, 30)
insert(root, 70)
insert(root, 65) # Show comparison path: 65 > 50 -> Right; 65 < 70 -> Left
print("BST after inserting 65")
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node { int val; struct Node *left, *right; };

struct Node* insert(struct Node* node, int val) {
    if (!node) {
        struct Node* n = malloc(sizeof(struct Node));
        n->val = val; n->left = n->right = NULL;
        return n;
    }
    if (val < node->val) node->left = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    return node;
}

int main(void) {
    printf("Inserted 65 into BST\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    std::cout << "Inserted 65 into BST" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Inserted 65 into BST");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'BST_COMPARE',
        operation: 'COMPARE_ROOT',
        data_structure: 'bst',
        line: 10,
        description: 'Compare insert target (65) with root (50): 65 > 50 -> Go RIGHT',
        state: {
          value: 50,
          left: { value: 30 },
          right: { value: 70 },
        },
        variables: { target: 65, currentNode: 50, decision: 'Go RIGHT' },
        highlight: { nodes: [50], decisionPath: '65 > 50: Traverse Right' },
        log: { type: 'STEP', message: '65 > 50 -> Moved to right child 70' },
      },
      {
        step: 2,
        type: 'BST_COMPARE',
        operation: 'COMPARE_NODE',
        data_structure: 'bst',
        line: 9,
        description: 'Compare insert target (65) with node (70): 65 < 70 -> Go LEFT',
        state: {
          value: 50,
          left: { value: 30 },
          right: { value: 70 },
        },
        variables: { target: 65, currentNode: 70, decision: 'Go LEFT' },
        highlight: { nodes: [70], decisionPath: '65 < 70: Traverse Left' },
        log: { type: 'STEP', message: '65 < 70 -> Moved to left child (currently empty)' },
      },
      {
        step: 3,
        type: 'BST_INSERT',
        operation: 'ATTACH_LEAF',
        data_structure: 'bst',
        line: 12,
        description: 'Left slot of 70 is empty. Attaching new node (65) as left child of 70',
        state: {
          value: 50,
          left: { value: 30 },
          right: { value: 70, left: { value: 65 } },
        },
        variables: { insertedVal: 65, parentVal: 70 },
        highlight: { nodes: [65], decisionPath: 'Attached 65 as left child of 70' },
        log: { type: 'SUCCESS', message: 'Successfully inserted 65 in BST at depth 2' },
      },
    ],
  },

  'bst-search': {
    id: 'search',
    name: 'Search',
    description: 'Search for target: navigate left if target < node, right if target > node',
    chapterId: 'bst',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(log n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Halves the search space at each comparison in a balanced BST.',
    },
    code: {
      python: `def search(node, target):
    if not node:
        return False
    if target == node.val:
        return True
    elif target < node.val:
        return search(node.left, target)
    else:
        return search(node.right, target)

# Search for 40 in BST
print("Search 40 result:", search(root, 40))
`,
      c: `int search(struct Node* node, int target) {
    if (!node) return 0;
    if (target == node->val) return 1;
    if (target < node->val) return search(node->left, target);
    return search(node->right, target);
}`,
      cpp: `bool search(Node* node, int target) {
    if (!node) return false;
    if (target == node->val) return true;
    return target < node->val ? search(node->left, target) : search(node->right, target);
}`,
      java: `boolean search(Node node, int target) {
    if (node == null) return false;
    if (target == node.val) return true;
    return target < node.val ? search(node.left, target) : search(node.right, target);
}`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'BST_COMPARE',
        operation: 'COMPARE_ROOT',
        data_structure: 'bst',
        line: 7,
        description: 'Comparing target (40) with root (50): 40 < 50 -> Go LEFT',
        state: {
          value: 50,
          left: { value: 30, left: { value: 20 }, right: { value: 40 } },
          right: { value: 70 },
        },
        variables: { target: 40, current: 50, decision: '40 < 50 (Go Left)' },
        highlight: { nodes: [50], decisionPath: '40 < 50: Go Left' },
        log: { type: 'STEP', message: '40 < 50 -> Moved to left subtree' },
      },
      {
        step: 2,
        type: 'BST_COMPARE',
        operation: 'COMPARE_NODE',
        data_structure: 'bst',
        line: 9,
        description: 'Comparing target (40) with node (30): 40 > 30 -> Go RIGHT',
        state: {
          value: 50,
          left: { value: 30, left: { value: 20 }, right: { value: 40 } },
          right: { value: 70 },
        },
        variables: { target: 40, current: 30, decision: '40 > 30 (Go Right)' },
        highlight: { nodes: [30], decisionPath: '40 > 30: Go Right' },
        log: { type: 'STEP', message: '40 > 30 -> Moved to right child of 30' },
      },
      {
        step: 3,
        type: 'BST_SEARCH',
        operation: 'FOUND',
        data_structure: 'bst',
        line: 5,
        description: 'Match! target (40) == node (40). Key found in BST!',
        state: {
          value: 50,
          left: { value: 30, left: { value: 20 }, right: { value: 40 } },
          right: { value: 70 },
        },
        variables: { target: 40, found: true, depth: 2 },
        highlight: { nodes: [40], decisionPath: 'MATCH FOUND: 40 == 40' },
        log: { type: 'SUCCESS', message: 'Target 40 located at depth 2' },
      },
    ],
  },

  // ==========================================
  // 9. HEAP
  // ==========================================
  'heap-insert': {
    id: 'insert',
    name: 'Insert',
    description: 'Insert an element at the end of the heap and bubble up (heapify up)',
    chapterId: 'heap',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(log n)',
      timeWorst: 'O(log n)',
      space: 'O(1)',
      notes: 'Element placed at index n and swapped with parent (index (i-1)//2) while smaller.',
    },
    code: {
      python: `import heapq

heap = [10, 20, 30, 40]
# Min-Heap insertion: add 5 and bubble up to root
heapq.heappush(heap, 5)
print("Heap after inserting 5:", heap)
`,
      c: `#include <stdio.h>

void swap(int* a, int* b) { int t = *a; *a = *b; *b = t; }

void insertMinHeap(int heap[], int* size, int val) {
    int i = (*size)++;
    heap[i] = val;
    while (i != 0 && heap[(i - 1) / 2] > heap[i]) {
        swap(&heap[i], &heap[(i - 1) / 2]);
        i = (i - 1) / 2;
    }
}

int main(void) {
    printf("Inserted 5 into Min Heap\\n");
    return 0;
}
`,
      cpp: `#include <iostream>
#include <queue>

int main() {
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    minHeap.push(10); minHeap.push(20); minHeap.push(5);
    std::cout << "Top: " << minHeap.top() << std::endl;
    return 0;
}
`,
      java: `import java.util.PriorityQueue;

public class Main {
    public static void main(String[] args) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.add(10); minHeap.add(20); minHeap.add(5);
        System.out.println("Top: " + minHeap.peek());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'HEAP_COMPARE',
        operation: 'APPEND_LEAF',
        data_structure: 'heap',
        line: 5,
        description: 'Placed 5 at end of heap array (index 4)',
        state: [10, 20, 30, 40, 5],
        variables: { currentIndex: 4, val: 5, parentIndex: 1, parentVal: 20 },
        highlight: { indices: [4], pointers: { child: 4, parent: 1 } },
        log: { type: 'STEP', message: 'Appended 5 at index 4' },
      },
      {
        step: 2,
        type: 'HEAP_SWAP',
        operation: 'BUBBLE_UP',
        data_structure: 'heap',
        line: 5,
        description: '5 < parent(20): Swap 5 with 20. 5 moves to index 1',
        state: [10, 5, 30, 40, 20],
        variables: { currentIndex: 1, val: 5, parentIndex: 0, parentVal: 10 },
        highlight: { indices: [1, 4], pointers: { child: 1, parent: 0 } },
        log: { type: 'STEP', message: 'Swapped 5 with parent 20' },
      },
      {
        step: 3,
        type: 'HEAP_SWAP',
        operation: 'BUBBLE_UP_ROOT',
        data_structure: 'heap',
        line: 5,
        description: '5 < root(10): Swap 5 with 10. 5 becomes the new ROOT!',
        state: [5, 10, 30, 40, 20],
        variables: { currentIndex: 0, val: 5, isRoot: true },
        highlight: { indices: [0, 1], pointers: { root: 0 } },
        log: { type: 'SUCCESS', message: 'Heap invariant restored. New root is 5.' },
      },
    ],
  },

  'heap-max': {
    id: 'max',
    name: 'Extract Max',
    description: 'Remove root of Max Heap, replace with last element, and heapify down',
    chapterId: 'heap',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(log n)',
      timeWorst: 'O(log n)',
      space: 'O(1)',
      notes: 'Root extraction is O(1); restoring heap invariant takes O(log n).',
    },
    code: {
      python: `# Max Heap: [90, 70, 80, 20, 40]
# Extract max (90)
heap = [90, 70, 80, 20, 40]
max_val = heap[0] # 90
heap[0] = heap.pop() # replace root with 40
# Heapify down: 40 compared with children 70 and 80 -> swap with 80
print("Extracted max:", max_val)
print("After extract max heap:", [80, 70, 40, 20])
`,
      c: `#include <stdio.h>

int main(void) {
    printf("Extract max: 90\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    std::cout << "Extract max: 90" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Extract max: 90");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'HEAP_COMPARE',
        operation: 'EXTRACT_ROOT',
        data_structure: 'heap',
        line: 4,
        description: 'Extracting maximum value 90 from root (index 0)',
        state: [90, 70, 80, 20, 40],
        variables: { extracted: 90, rootIndex: 0 },
        highlight: { indices: [0] },
        log: { type: 'INFO', message: 'Extracted root: 90' },
      },
      {
        step: 2,
        type: 'HEAP_COMPARE',
        operation: 'MOVE_LAST_TO_ROOT',
        data_structure: 'heap',
        line: 5,
        description: 'Moved last element (40) to root. Size decreased to 4',
        state: [40, 70, 80, 20],
        variables: { currentRoot: 40, leftChild: 70, rightChild: 80 },
        highlight: { indices: [0, 1, 2] },
        log: { type: 'STEP', message: 'Replaced root with 40' },
      },
      {
        step: 3,
        type: 'HEAP_SWAP',
        operation: 'HEAPIFY_DOWN',
        data_structure: 'heap',
        line: 6,
        description: 'Largest child is 80 (index 2). Swapping 40 with 80',
        state: [80, 70, 40, 20],
        variables: { newRoot: 80, swappedWith: 40 },
        highlight: { indices: [0, 2] },
        log: { type: 'SUCCESS', message: 'Heapify down complete. New root is 80.' },
      },
    ],
  },
};
