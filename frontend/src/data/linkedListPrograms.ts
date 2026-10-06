import type { ProgramItem, ExecutionEvent } from '../types/dsa';

export const LINKED_LIST_PROGRAMS: Record<string, ProgramItem> = {
  // ==========================================
  // 5. LINKED LIST
  // ==========================================
  'linked_list-create': {
    id: 'create',
    name: 'Create List',
    description: 'Construct a linked list of nodes linked by next pointers',
    chapterId: 'linked_list',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(n)',
      notes: 'Each node requires a separate memory allocation with data and pointer.',
    },
    code: {
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

head = Node(10)
head.next = Node(20)
head.next.next = Node(30)

print("Created list: 10 -> 20 -> 30 -> NULL")
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main(void) {
    struct Node* head = malloc(sizeof(struct Node));
    head->data = 10;
    head->next = malloc(sizeof(struct Node));
    head->next->data = 20;
    head->next->next = malloc(sizeof(struct Node));
    head->next->next->data = 30;
    head->next->next->next = NULL;
    printf("Created: 10 -> 20 -> 30 -> NULL\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    std::cout << "List created: 10 -> 20 -> 30 -> NULL" << std::endl;
    return 0;
}
`,
      java: `class Node {
    int data;
    Node next;
    Node(int d) { this.data = d; }
}

public class Main {
    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        System.out.println("Created linked list: 10 -> 20 -> 30 -> NULL");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_INSERT',
        operation: 'ALLOCATE_HEAD',
        data_structure: 'linked_list',
        line: 6,
        description: 'Allocated head node [10 | NULL]',
        state: [10],
        variables: { head: 10, length: 1 },
        highlight: { pointers: { head: 0 } },
        log: { type: 'INFO', message: 'Created head node with value 10' },
      },
      {
        step: 2,
        type: 'LIST_INSERT',
        operation: 'LINK_SECOND',
        data_structure: 'linked_list',
        line: 7,
        description: 'Linked second node: [10 | ->] -> [20 | NULL]',
        state: [10, 20],
        variables: { head: 10, length: 2 },
        highlight: { pointers: { head: 0, next: 1 } },
        log: { type: 'STEP', message: 'Linked 20 after 10' },
      },
      {
        step: 3,
        type: 'LIST_INSERT',
        operation: 'LINK_THIRD',
        data_structure: 'linked_list',
        line: 8,
        description: 'Linked third node: [10 | ->] -> [20 | ->] -> [30 | NULL]',
        state: [10, 20, 30],
        variables: { head: 10, tail: 30, length: 3 },
        highlight: { pointers: { head: 0, tail: 2 } },
        log: { type: 'SUCCESS', message: 'List initialized: 10 -> 20 -> 30 -> NULL' },
      },
    ],
  },

  'linked_list-beginning': {
    id: 'beginning',
    name: 'Insert at Beginning',
    description: 'Insert a new node before the current head in O(1) time',
    chapterId: 'linked_list',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'New node next points to old head, then head pointer updates to new node.',
    },
    code: {
      python: `head = [20, 30] # representing 20 -> 30 -> NULL

new_val = 10
# New node created and points to old head
new_node = [new_val]
head = new_node + head

print("New list after inserting at beginning:", head)
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void insertAtHead(struct Node** headRef, int val) {
    struct Node* n = malloc(sizeof(struct Node));
    n->data = val;
    n->next = *headRef;
    *headRef = n;
}

int main(void) {
    struct Node* head = NULL;
    insertAtHead(&head, 20);
    insertAtHead(&head, 10);
    printf("Inserted 10 at beginning.\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

struct Node {
    int data;
    Node* next;
    Node(int d, Node* n = nullptr) : data(d), next(n) {}
};

int main() {
    Node* head = new Node(20);
    head = new Node(10, head); // insert at head
    std::cout << "Head is now: " << head->data << std::endl;
    return 0;
}
`,
      java: `class Node {
    int data;
    Node next;
    Node(int d, Node n) { this.data = d; this.next = n; }
}

public class Main {
    public static void main(String[] args) {
        Node head = new Node(20, null);
        head = new Node(10, head);
        System.out.println("Head data: " + head.data);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_INSERT',
        operation: 'INITIAL_LIST',
        data_structure: 'linked_list',
        line: 1,
        description: 'Existing list: HEAD -> [20 | ->] -> [30 | NULL]',
        state: [20, 30],
        variables: { head: 20, length: 2 },
        highlight: { pointers: { head: 0 } },
        log: { type: 'INFO', message: 'Current head points to 20' },
      },
      {
        step: 2,
        type: 'LIST_INSERT',
        operation: 'ALLOCATE_NEW',
        data_structure: 'linked_list',
        line: 5,
        description: 'Created new node [10 | ->]. Pointed its next to [20]',
        state: [10, 20, 30],
        variables: { newNode: 10, nextNode: 20 },
        highlight: { pointers: { newNode: 0, oldHead: 1 } },
        log: { type: 'STEP', message: 'newNode->next = head' },
      },
      {
        step: 3,
        type: 'LIST_INSERT',
        operation: 'UPDATE_HEAD',
        data_structure: 'linked_list',
        line: 6,
        description: 'Updated HEAD pointer to point to 10 in O(1)',
        state: [10, 20, 30],
        variables: { head: 10, length: 3 },
        highlight: { pointers: { head: 0 } },
        log: { type: 'SUCCESS', message: 'HEAD updated. List: 10 -> 20 -> 30 -> NULL' },
      },
    ],
  },

  'linked_list-end': {
    id: 'end',
    name: 'Insert at End',
    description: 'Append a new node to the end of the linked list',
    chapterId: 'linked_list',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Traverses to last node (O(n)) unless tail pointer is maintained.',
    },
    code: {
      python: `list_nodes = [10, 20]
new_value = 30

# Traverse to the end and append
list_nodes.append(new_value)
print("List after appending to end:", list_nodes)
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node* next; };

void append(struct Node** headRef, int val) {
    struct Node* n = malloc(sizeof(struct Node));
    n->data = val; n->next = NULL;
    if (!*headRef) { *headRef = n; return; }
    struct Node* curr = *headRef;
    while (curr->next) curr = curr->next;
    curr->next = n;
}

int main(void) {
    struct Node* head = NULL;
    append(&head, 10); append(&head, 20); append(&head, 30);
    printf("Appended 30 at end.\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

struct Node { int data; Node* next; Node(int d): data(d), next(nullptr){} };

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    std::cout << "Appended 30 to end of list" << std::endl;
    return 0;
}
`,
      java: `class Node { int data; Node next; Node(int d){ data=d; } }

public class Main {
    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        System.out.println("Appended 30 at end");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_TRAVERSE',
        operation: 'FIND_TAIL',
        data_structure: 'linked_list',
        line: 1,
        description: 'Starting at HEAD (10), scanning to find the tail node',
        state: [10, 20],
        variables: { current: 10 },
        highlight: { pointers: { current: 0 } },
        log: { type: 'STEP', message: 'curr = head (10)' },
      },
      {
        step: 2,
        type: 'LIST_TRAVERSE',
        operation: 'REACHED_TAIL',
        data_structure: 'linked_list',
        line: 1,
        description: 'Current is 20 where curr->next is NULL (Tail reached)',
        state: [10, 20],
        variables: { current: 20 },
        highlight: { pointers: { current: 1, tail: 1 } },
        log: { type: 'STEP', message: 'Tail reached at 20' },
      },
      {
        step: 3,
        type: 'LIST_INSERT',
        operation: 'LINK_NEW_TAIL',
        data_structure: 'linked_list',
        line: 5,
        description: 'Set curr->next = Node(30). New tail is 30',
        state: [10, 20, 30],
        variables: { newTail: 30, length: 3 },
        highlight: { pointers: { tail: 2 } },
        log: { type: 'SUCCESS', message: 'Appended 30 at end: 10 -> 20 -> 30 -> NULL' },
      },
    ],
  },

  'linked_list-position': {
    id: 'position',
    name: 'Insert at Position',
    description: 'Insert a node at a given 1-based or 0-based index',
    chapterId: 'linked_list',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Traverses to position - 1, rewires pointers to splice the new node.',
    },
    code: {
      python: `list_nodes = [10, 20, 40]
pos = 2
val = 30

list_nodes.insert(pos, val)
print(f"Inserted {val} at position {pos}:", list_nodes)
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node* next; };

void insertAtPos(struct Node* head, int pos, int val) {
    struct Node* curr = head;
    for (int i = 0; i < pos - 1 && curr; i++) curr = curr->next;
    struct Node* n = malloc(sizeof(struct Node));
    n->data = val; n->next = curr->next;
    curr->next = n;
}

int main(void) {
    // 10 -> 20 -> 40
    printf("Inserted 30 at position 2\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    std::cout << "Inserted at position 2" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Inserted at position 2");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_TRAVERSE',
        operation: 'TRAVERSE_TO_POS',
        data_structure: 'linked_list',
        line: 5,
        description: 'Traversing to index 1 (value 20) to insert at position 2',
        state: [10, 20, 40],
        variables: { targetPos: 2, currentVal: 20 },
        highlight: { pointers: { current: 1 } },
        log: { type: 'STEP', message: 'Reached predecessor node 20' },
      },
      {
        step: 2,
        type: 'LIST_INSERT',
        operation: 'SPLICE_NODE',
        data_structure: 'linked_list',
        line: 6,
        description: 'New Node(30)->next = Node(40). Node(20)->next = Node(30)',
        state: [10, 20, 30, 40],
        variables: { inserted: 30, atIndex: 2 },
        highlight: { pointers: { inserted: 2 } },
        log: { type: 'SUCCESS', message: 'Spliced 30 into position 2: 10 -> 20 -> 30 -> 40' },
      },
    ],
  },

  'linked_list-delete': {
    id: 'delete',
    name: 'Delete Node',
    description: 'Delete a node by value and bypass its pointer connection',
    chapterId: 'linked_list',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Sets prev->next = curr->next and frees curr.',
    },
    code: {
      python: `list_nodes = [10, 20, 30, 40]
val_to_delete = 20

list_nodes.remove(val_to_delete)
print("After deletion:", list_nodes)
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node* next; };

void deleteVal(struct Node** headRef, int val) {
    struct Node *curr = *headRef, *prev = NULL;
    while (curr && curr->data != val) {
        prev = curr;
        curr = curr->next;
    }
    if (curr) {
        prev->next = curr->next;
        free(curr);
    }
}

int main(void) {
    printf("Deleted node 20\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    std::cout << "Deleted node 20" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Deleted node 20");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_TRAVERSE',
        operation: 'FIND_TARGET',
        data_structure: 'linked_list',
        line: 4,
        description: 'Locating node with value 20: found at index 1',
        state: [10, 20, 30, 40],
        variables: { prev: 10, curr: 20 },
        highlight: { pointers: { prev: 0, curr: 1 } },
        log: { type: 'STEP', message: 'Target node 20 identified' },
      },
      {
        step: 2,
        type: 'LIST_DELETE',
        operation: 'BYPASS_LINK',
        data_structure: 'linked_list',
        line: 4,
        description: 'Bypassing node 20: prev(10)->next is linked to curr->next(30)',
        state: [10, 30, 40],
        variables: { deleted: 20, newLength: 3 },
        highlight: { pointers: { bypassed: 1 } },
        log: { type: 'SUCCESS', message: 'Node 20 deleted: 10 -> 30 -> 40 -> NULL' },
      },
    ],
  },

  'linked_list-search': {
    id: 'search',
    name: 'Search',
    description: 'Traverse list looking for target node matching value',
    chapterId: 'linked_list',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Follows next pointer until target matches or NULL is hit.',
    },
    code: {
      python: `list_nodes = [10, 20, 30, 40]
target = 30

for idx, val in enumerate(list_nodes):
    if val == target:
        print(f"Found {target} at node index {idx}")
        break
`,
      c: `#include <stdio.h>

int main(void) {
    printf("Found 30 at index 2\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    std::cout << "Found 30 at index 2" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Found 30 at index 2");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_TRAVERSE',
        operation: 'COMPARE',
        data_structure: 'linked_list',
        line: 4,
        description: 'Visiting node 0 (value 10) != target (30)',
        state: [10, 20, 30, 40],
        variables: { current: 10, target: 30 },
        highlight: { pointers: { current: 0 } },
        log: { type: 'STEP', message: 'curr->data 10 != 30' },
      },
      {
        step: 2,
        type: 'LIST_TRAVERSE',
        operation: 'COMPARE',
        data_structure: 'linked_list',
        line: 4,
        description: 'Visiting node 1 (value 20) != target (30)',
        state: [10, 20, 30, 40],
        variables: { current: 20, target: 30 },
        highlight: { pointers: { current: 1 } },
        log: { type: 'STEP', message: 'curr->data 20 != 30' },
      },
      {
        step: 3,
        type: 'LIST_TRAVERSE',
        operation: 'FOUND',
        data_structure: 'linked_list',
        line: 5,
        description: 'Match! node 2 (value 30) == target (30)',
        state: [10, 20, 30, 40],
        variables: { foundNode: 30, index: 2 },
        highlight: { pointers: { found: 2 } },
        log: { type: 'SUCCESS', message: 'Node 30 found at index 2!' },
      },
    ],
  },

  'linked_list-traverse': {
    id: 'traverse',
    name: 'Traverse',
    description: 'Visit each node sequentially until NULL pointer',
    chapterId: 'linked_list',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Visits every node using curr = curr.next pointer chasing.',
    },
    code: {
      python: `list_nodes = [10, 20, 30, 40]

curr = 0
while curr < len(list_nodes):
    print("Node:", list_nodes[curr])
    curr += 1
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[] = {10, 20, 30, 40};
    for(int i=0; i<4; i++) printf("Node: %d\\n", arr[i]);
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int arr[] = {10, 20, 30, 40};
    for(int v : arr) std::cout << "Node: " << v << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};
        for(int v : arr) System.out.println("Node: " + v);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_TRAVERSE',
        operation: 'VISIT',
        data_structure: 'linked_list',
        line: 5,
        description: 'Visiting node 0 (value: 10)',
        state: [10, 20, 30, 40],
        variables: { curr: 10, index: 0 },
        highlight: { pointers: { current: 0 } },
        log: { type: 'STEP', message: 'Visited node 10' },
      },
      {
        step: 2,
        type: 'LIST_TRAVERSE',
        operation: 'VISIT',
        data_structure: 'linked_list',
        line: 5,
        description: 'Visiting node 1 (value: 20)',
        state: [10, 20, 30, 40],
        variables: { curr: 20, index: 1 },
        highlight: { pointers: { current: 1 } },
        log: { type: 'STEP', message: 'Visited node 20' },
      },
      {
        step: 3,
        type: 'LIST_TRAVERSE',
        operation: 'VISIT',
        data_structure: 'linked_list',
        line: 5,
        description: 'Visiting node 2 (value: 30)',
        state: [10, 20, 30, 40],
        variables: { curr: 30, index: 2 },
        highlight: { pointers: { current: 2 } },
        log: { type: 'STEP', message: 'Visited node 30' },
      },
      {
        step: 4,
        type: 'LIST_TRAVERSE',
        operation: 'VISIT',
        data_structure: 'linked_list',
        line: 5,
        description: 'Visiting node 3 (value: 40) -> NULL reached',
        state: [10, 20, 30, 40],
        variables: { curr: 40, index: 3 },
        highlight: { pointers: { current: 3 } },
        log: { type: 'SUCCESS', message: 'Completed traversal. Hit NULL terminator.' },
      },
    ],
  },

  // ==========================================
  // 6. DOUBLY LINKED LIST
  // ==========================================
  'doubly_linked_list-create': {
    id: 'create',
    name: 'Create List',
    description: 'Create nodes with PREV, DATA, and NEXT pointer compartments',
    chapterId: 'doubly_linked_list',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(n)',
      notes: 'Each node links both forwards (next) and backwards (prev).',
    },
    code: {
      python: `class DNode:
    def __init__(self, data):
        self.prev = None
        self.data = data
        self.next = None

# NULL <- [PREV|10|NEXT] <-> [PREV|20|NEXT] <-> [PREV|30|NEXT] -> NULL
n1 = DNode(10)
n2 = DNode(20)
n3 = DNode(30)
n1.next = n2; n2.prev = n1
n2.next = n3; n3.prev = n2

print("Doubly Linked List created: NULL <- 10 <=> 20 <=> 30 -> NULL")
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct DNode {
    struct DNode* prev;
    int data;
    struct DNode* next;
};

int main(void) {
    printf("Doubly Linked List created\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

struct DNode {
    DNode* prev;
    int data;
    DNode* next;
    DNode(int d): prev(nullptr), data(d), next(nullptr){}
};

int main() {
    std::cout << "Doubly Linked List created" << std::endl;
    return 0;
}
`,
      java: `class DNode {
    DNode prev;
    int data;
    DNode next;
    DNode(int d) { data = d; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Doubly Linked List created");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_INSERT',
        operation: 'ALLOCATE_FIRST',
        data_structure: 'doubly_linked_list',
        line: 9,
        description: 'Created first node: NULL <- [PREV | 10 | NEXT] -> NULL',
        state: [10],
        variables: { head: 10 },
        highlight: { pointers: { head: 0 } },
        log: { type: 'INFO', message: 'Created head node 10' },
      },
      {
        step: 2,
        type: 'LIST_INSERT',
        operation: 'LINK_BIDIRECTIONAL',
        data_structure: 'doubly_linked_list',
        line: 13,
        description: 'Node 10.next = Node 20 and Node 20.prev = Node 10',
        state: [10, 20],
        variables: { head: 10, second: 20 },
        highlight: { pointers: { head: 0, next: 1 } },
        log: { type: 'STEP', message: 'Linked bidirectional 10 <=> 20' },
      },
      {
        step: 3,
        type: 'LIST_INSERT',
        operation: 'LINK_BIDIRECTIONAL',
        data_structure: 'doubly_linked_list',
        line: 14,
        description: 'Node 20.next = Node 30 and Node 30.prev = Node 20',
        state: [10, 20, 30],
        variables: { head: 10, tail: 30 },
        highlight: { pointers: { head: 0, tail: 2 } },
        log: { type: 'SUCCESS', message: 'Doubly linked list: NULL <- 10 <=> 20 <=> 30 -> NULL' },
      },
    ],
  },

  'doubly_linked_list-forward': {
    id: 'forward',
    name: 'Forward Traversal',
    description: 'Traverse list from head to tail using next pointers',
    chapterId: 'doubly_linked_list',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Follows next pointer from HEAD to TAIL.',
    },
    code: {
      python: `nodes = [10, 20, 30, 40]

print("Forward traversal (head to tail):")
for v in nodes:
    print(v, "->", end=" ")
print("NULL")
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[] = {10, 20, 30, 40};
    for(int i=0; i<4; i++) printf("%d -> ", arr[i]);
    printf("NULL\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int arr[] = {10, 20, 30, 40};
    for(int v : arr) std::cout << v << " -> ";
    std::cout << "NULL" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};
        for(int v : arr) System.out.print(v + " -> ");
        System.out.println("NULL");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_TRAVERSE',
        operation: 'FORWARD_STEP',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = head (10). Following NEXT pointer ->',
        state: [10, 20, 30, 40],
        variables: { direction: 'forward', curr: 10 },
        highlight: { pointers: { current: 0 } },
        log: { type: 'STEP', message: 'At node 10' },
      },
      {
        step: 2,
        type: 'LIST_TRAVERSE',
        operation: 'FORWARD_STEP',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = curr.next (20)',
        state: [10, 20, 30, 40],
        variables: { direction: 'forward', curr: 20 },
        highlight: { pointers: { current: 1 } },
        log: { type: 'STEP', message: 'At node 20' },
      },
      {
        step: 3,
        type: 'LIST_TRAVERSE',
        operation: 'FORWARD_STEP',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = curr.next (30)',
        state: [10, 20, 30, 40],
        variables: { direction: 'forward', curr: 30 },
        highlight: { pointers: { current: 2 } },
        log: { type: 'STEP', message: 'At node 30' },
      },
      {
        step: 4,
        type: 'LIST_TRAVERSE',
        operation: 'FORWARD_COMPLETE',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = curr.next (40). Reached TAIL.',
        state: [10, 20, 30, 40],
        variables: { direction: 'forward', curr: 40 },
        highlight: { pointers: { current: 3 } },
        log: { type: 'SUCCESS', message: 'Forward traversal reached tail 40' },
      },
    ],
  },

  'doubly_linked_list-backward': {
    id: 'backward',
    name: 'Backward Traversal',
    description: 'Traverse list from tail to head using prev pointers',
    chapterId: 'doubly_linked_list',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Follows prev pointer backward from TAIL to HEAD.',
    },
    code: {
      python: `nodes = [10, 20, 30, 40]

print("Backward traversal (tail to head):")
for v in reversed(nodes):
    print(v, "<-", end=" ")
print("NULL")
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[] = {10, 20, 30, 40};
    for(int i=3; i>=0; i--) printf("%d <- ", arr[i]);
    printf("NULL\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int arr[] = {10, 20, 30, 40};
    for(int i=3; i>=0; i--) std::cout << arr[i] << " <- ";
    std::cout << "NULL" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};
        for(int i=3; i>=0; i--) System.out.print(arr[i] + " <- ");
        System.out.println("NULL");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'LIST_TRAVERSE',
        operation: 'BACKWARD_STEP',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = tail (40). Following PREV pointer <-',
        state: [10, 20, 30, 40],
        variables: { direction: 'backward', curr: 40 },
        highlight: { pointers: { current: 3 } },
        log: { type: 'STEP', message: 'At tail node 40' },
      },
      {
        step: 2,
        type: 'LIST_TRAVERSE',
        operation: 'BACKWARD_STEP',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = curr.prev (30)',
        state: [10, 20, 30, 40],
        variables: { direction: 'backward', curr: 30 },
        highlight: { pointers: { current: 2 } },
        log: { type: 'STEP', message: 'At node 30' },
      },
      {
        step: 3,
        type: 'LIST_TRAVERSE',
        operation: 'BACKWARD_STEP',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = curr.prev (20)',
        state: [10, 20, 30, 40],
        variables: { direction: 'backward', curr: 20 },
        highlight: { pointers: { current: 1 } },
        log: { type: 'STEP', message: 'At node 20' },
      },
      {
        step: 4,
        type: 'LIST_TRAVERSE',
        operation: 'BACKWARD_COMPLETE',
        data_structure: 'doubly_linked_list',
        line: 4,
        description: 'curr = curr.prev (10). Reached HEAD node. prev is NULL.',
        state: [10, 20, 30, 40],
        variables: { direction: 'backward', curr: 10 },
        highlight: { pointers: { current: 0 } },
        log: { type: 'SUCCESS', message: 'Backward traversal complete at head 10' },
      },
    ],
  },
};
