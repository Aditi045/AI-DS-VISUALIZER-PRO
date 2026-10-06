import type { ProgramItem, ExecutionEvent } from '../types/dsa';

export const QUEUE_PROGRAMS: Record<string, ProgramItem> = {
  // ==========================================
  // 3. QUEUE
  // ==========================================
  'queue-enqueue': {
    id: 'enqueue',
    name: 'Enqueue',
    description: 'Insert an element at the rear of the queue (FIFO order)',
    chapterId: 'queue',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Elements are appended to the rear pointer index in constant time.',
    },
    code: {
      python: `from collections import deque

queue = deque([10, 20])

def enqueue(item):
    queue.append(item)
    print(f"Enqueued {item}. Rear is now: {item}")

enqueue(30)
enqueue(40)
print("Queue state:", list(queue))
`,
      c: `#include <stdio.h>
#define MAX 6

int queue[MAX] = {10, 20};
int front = 0, rear = 1;

void enqueue(int val) {
    if (rear >= MAX - 1) {
        printf("Queue Overflow!\\n");
        return;
    }
    queue[++rear] = val;
    printf("Enqueued %d at rear position %d\\n", val, rear);
}

int main(void) {
    enqueue(30);
    enqueue(40);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <queue>

int main() {
    std::queue<int> q;
    q.push(10);
    q.push(20);
    q.push(30);
    std::cout << "Front element: " << q.front() << ", Rear element: " << q.back() << std::endl;
    return 0;
}
`,
      java: `import java.util.ArrayDeque;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<Integer> q = new ArrayDeque<>();
        q.add(10);
        q.add(20);
        q.add(30);
        System.out.println("Queue: " + q);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'QUEUE_ENQUEUE',
        operation: 'INIT_QUEUE',
        data_structure: 'queue',
        line: 3,
        description: 'Queue initialized with [10, 20]. FRONT=10, REAR=20',
        state: [10, 20],
        variables: { front: 0, rear: 1, size: 2 },
        highlight: { pointers: { front: 0, rear: 1 } },
        log: { type: 'INFO', message: 'Queue initialized with elements [10, 20]' },
      },
      {
        step: 2,
        type: 'QUEUE_ENQUEUE',
        operation: 'ENQUEUE_30',
        data_structure: 'queue',
        line: 6,
        description: 'Enqueued 30 at rear. REAR pointer moves to index 2',
        state: [10, 20, 30],
        variables: { front: 0, rear: 2, value: 30 },
        highlight: { indices: [2], pointers: { front: 0, rear: 2 } },
        log: { type: 'STEP', message: 'Enqueued 30 at rear' },
      },
      {
        step: 3,
        type: 'QUEUE_ENQUEUE',
        operation: 'ENQUEUE_40',
        data_structure: 'queue',
        line: 6,
        description: 'Enqueued 40 at rear. REAR pointer moves to index 3',
        state: [10, 20, 30, 40],
        variables: { front: 0, rear: 3, value: 40 },
        highlight: { indices: [3], pointers: { front: 0, rear: 3 } },
        log: { type: 'SUCCESS', message: 'Queue size is now 4. FIFO order preserved.' },
      },
    ],
  },

  'queue-dequeue': {
    id: 'dequeue',
    name: 'Dequeue',
    description: 'Remove and return the element from the front of the queue',
    chapterId: 'queue',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Removes the earliest inserted element at front pointer.',
    },
    code: {
      python: `from collections import deque

queue = deque([10, 20, 30, 40])

def dequeue():
    if not queue:
        print("Queue Underflow!")
        return None
    val = queue.popleft()
    print("Dequeued front element:", val)
    return val

dequeue()
dequeue()
`,
      c: `#include <stdio.h>

int queue[5] = {10, 20, 30, 40};
int front = 0, rear = 3;

int dequeue() {
    if (front > rear) {
        printf("Queue Underflow!\\n");
        return -1;
    }
    return queue[front++];
}

int main(void) {
    printf("Dequeued: %d\\n", dequeue());
    printf("Dequeued: %d\\n", dequeue());
    return 0;
}
`,
      cpp: `#include <iostream>
#include <queue>

int main() {
    std::queue<int> q;
    for (int v : {10, 20, 30, 40}) q.push(v);
    std::cout << "Dequeued: " << q.front() << std::endl;
    q.pop();
    std::cout << "Dequeued: " << q.front() << std::endl;
    q.pop();
    return 0;
}
`,
      java: `import java.util.ArrayDeque;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<Integer> q = new ArrayDeque<>();
        q.add(10); q.add(20); q.add(30); q.add(40);
        System.out.println("Dequeued: " + q.poll());
        System.out.println("Dequeued: " + q.poll());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'QUEUE_FRONT',
        operation: 'INITIAL_QUEUE',
        data_structure: 'queue',
        line: 3,
        description: 'Queue contains [10, 20, 30, 40]. FRONT points to 10',
        state: [10, 20, 30, 40],
        variables: { front: 0, rear: 3, size: 4 },
        highlight: { pointers: { front: 0, rear: 3 } },
        log: { type: 'INFO', message: 'Current queue: [10, 20, 30, 40]' },
      },
      {
        step: 2,
        type: 'QUEUE_DEQUEUE',
        operation: 'DEQUEUE_10',
        data_structure: 'queue',
        line: 9,
        description: 'Dequeued element 10 from FRONT. FRONT moves to 20',
        state: [20, 30, 40],
        variables: { dequeued: 10, front: 0, rear: 2 },
        highlight: { indices: [0], pointers: { front: 0, rear: 2 } },
        log: { type: 'STEP', message: 'Removed element 10 from front' },
      },
      {
        step: 3,
        type: 'QUEUE_DEQUEUE',
        operation: 'DEQUEUE_20',
        data_structure: 'queue',
        line: 9,
        description: 'Dequeued element 20 from FRONT. FRONT moves to 30',
        state: [30, 40],
        variables: { dequeued: 20, front: 0, rear: 1 },
        highlight: { indices: [0], pointers: { front: 0, rear: 1 } },
        log: { type: 'SUCCESS', message: 'Removed element 20. Remaining: [30, 40]' },
      },
    ],
  },

  'queue-front': {
    id: 'front',
    name: 'Front',
    description: 'Inspect the element currently at the front of the queue',
    chapterId: 'queue',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Direct peek at front element without removal.',
    },
    code: {
      python: `from collections import deque

queue = deque([10, 20, 30])
print("Front element is:", queue[0])
`,
      c: `#include <stdio.h>

int queue[3] = {10, 20, 30};
int front = 0;

int main(void) {
    printf("Front: %d\\n", queue[front]);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <queue>

int main() {
    std::queue<int> q;
    q.push(10); q.push(20); q.push(30);
    std::cout << "Front: " << q.front() << std::endl;
    return 0;
}
`,
      java: `import java.util.ArrayDeque;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<Integer> q = new ArrayDeque<>();
        q.add(10); q.add(20); q.add(30);
        System.out.println("Front: " + q.peek());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'QUEUE_FRONT',
        operation: 'PEEK_FRONT',
        data_structure: 'queue',
        line: 4,
        description: 'Front element inspection: queue[front] is 10',
        state: [10, 20, 30],
        variables: { front: 0, value: 10 },
        highlight: { indices: [0], pointers: { front: 0, rear: 2 } },
        log: { type: 'SUCCESS', message: 'Front element is 10' },
      },
    ],
  },

  'queue-rear': {
    id: 'rear',
    name: 'Rear',
    description: 'Inspect the element currently at the rear of the queue',
    chapterId: 'queue',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Direct peek at rear element without removal.',
    },
    code: {
      python: `from collections import deque

queue = deque([10, 20, 30])
print("Rear element is:", queue[-1])
`,
      c: `#include <stdio.h>

int queue[3] = {10, 20, 30};
int rear = 2;

int main(void) {
    printf("Rear: %d\\n", queue[rear]);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <queue>

int main() {
    std::queue<int> q;
    q.push(10); q.push(20); q.push(30);
    std::cout << "Rear: " << q.back() << std::endl;
    return 0;
}
`,
      java: `import java.util.ArrayDeque;

public class Main {
    public static void main(String[] args) {
        ArrayDeque<Integer> q = new ArrayDeque<>();
        q.add(10); q.add(20); q.add(30);
        System.out.println("Rear: " + q.peekLast());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'QUEUE_REAR',
        operation: 'PEEK_REAR',
        data_structure: 'queue',
        line: 4,
        description: 'Rear element inspection: queue[rear] is 30',
        state: [10, 20, 30],
        variables: { rear: 2, value: 30 },
        highlight: { indices: [2], pointers: { front: 0, rear: 2 } },
        log: { type: 'SUCCESS', message: 'Rear element is 30' },
      },
    ],
  },

  'queue-display': {
    id: 'display',
    name: 'Display',
    description: 'Traverse and display elements from front to rear',
    chapterId: 'queue',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Iterates through each element from front to rear in FIFO order.',
    },
    code: {
      python: `queue = [10, 20, 30, 40]

print("Queue contents (FRONT -> REAR):")
for i, val in enumerate(queue):
    print(f"[{i}]: {val}", end=" -> " if i < len(queue)-1 else "\\n")
`,
      c: `#include <stdio.h>

int main(void) {
    int q[4] = {10, 20, 30, 40};
    for (int i = 0; i < 4; i++) {
        printf("%d ", q[i]);
    }
    printf("\\n");
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int q[4] = {10, 20, 30, 40};
    for (int v : q) std::cout << v << " ";
    std::cout << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] q = {10, 20, 30, 40};
        for (int v : q) System.out.print(v + " ");
        System.out.println();
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'QUEUE_FRONT',
        operation: 'TRAVERSE',
        data_structure: 'queue',
        line: 4,
        description: 'Visiting front element at index 0: 10',
        state: [10, 20, 30, 40],
        variables: { current: 10, index: 0 },
        highlight: { indices: [0], pointers: { front: 0, current: 0 } },
        log: { type: 'STEP', message: 'Visiting front: 10' },
      },
      {
        step: 2,
        type: 'QUEUE_FRONT',
        operation: 'TRAVERSE',
        data_structure: 'queue',
        line: 4,
        description: 'Visiting element at index 1: 20',
        state: [10, 20, 30, 40],
        variables: { current: 20, index: 1 },
        highlight: { indices: [1], pointers: { current: 1 } },
        log: { type: 'STEP', message: 'Visiting index 1: 20' },
      },
      {
        step: 3,
        type: 'QUEUE_REAR',
        operation: 'TRAVERSE',
        data_structure: 'queue',
        line: 4,
        description: 'Visiting rear element at index 3: 40',
        state: [10, 20, 30, 40],
        variables: { current: 40, index: 3 },
        highlight: { indices: [3], pointers: { rear: 3, current: 3 } },
        log: { type: 'SUCCESS', message: 'Queue traversal complete.' },
      },
    ],
  },

  // ==========================================
  // 4. CIRCULAR QUEUE
  // ==========================================
  'circular_queue-enqueue': {
    id: 'enqueue',
    name: 'Enqueue',
    description: 'Insert an element with modular arithmetic (rear = (rear + 1) % MAX)',
    chapterId: 'circular_queue',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Modular index arithmetic avoids wasted empty slots at the front.',
    },
    code: {
      python: `MAX_SIZE = 5
cqueue = [None] * MAX_SIZE
front = 0
rear = 2
count = 3
cqueue[0] = 10
cqueue[1] = 20
cqueue[2] = 30

def enqueue(val):
    global rear, count
    if count == MAX_SIZE:
        print("Circular Queue Overflow!")
        return
    rear = (rear + 1) % MAX_SIZE
    cqueue[rear] = val
    count += 1
    print(f"Enqueued {val} at index {rear}. (rear = {rear})")

enqueue(40)
enqueue(50)
`,
      c: `#include <stdio.h>
#define MAX 5

int cqueue[MAX] = {10, 20, 30, 0, 0};
int front = 0, rear = 2, count = 3;

void enqueue(int val) {
    if (count == MAX) {
        printf("Circular Queue Overflow!\\n");
        return;
    }
    rear = (rear + 1) % MAX;
    cqueue[rear] = val;
    count++;
    printf("Enqueued %d at index %d\\n", val, rear);
}

int main(void) {
    enqueue(40);
    enqueue(50);
    return 0;
}
`,
      cpp: `#include <iostream>
const int MAX = 5;
int cqueue[MAX] = {10, 20, 30, 0, 0};
int front = 0, rear = 2, count = 3;

void enqueue(int val) {
    if (count == MAX) { std::cout << "Overflow!\\n"; return; }
    rear = (rear + 1) % MAX;
    cqueue[rear] = val;
    count++;
    std::cout << "Enqueued " << val << " at " << rear << std::endl;
}

int main() {
    enqueue(40); enqueue(50);
    return 0;
}
`,
      java: `public class Main {
    static final int MAX = 5;
    static int[] cqueue = {10, 20, 30, 0, 0};
    static int front = 0, rear = 2, count = 3;
    
    static void enqueue(int val) {
        if (count == MAX) { System.out.println("Overflow!"); return; }
        rear = (rear + 1) % MAX;
        cqueue[rear] = val;
        count++;
        System.out.println("Enqueued " + val + " at " + rear);
    }
    
    public static void main(String[] args) {
        enqueue(40); enqueue(50);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'CQUEUE_FRONT',
        operation: 'INITIAL_STATE',
        data_structure: 'circular_queue',
        line: 6,
        description: 'Circular queue capacity 5. Slots: [10, 20, 30, empty, empty]',
        state: [10, 20, 30, null, null],
        variables: { front: 0, rear: 2, count: 3, capacity: 5 },
        highlight: { pointers: { front: 0, rear: 2 } },
        log: { type: 'INFO', message: 'Circular queue: 3 elements, 2 free slots' },
      },
      {
        step: 2,
        type: 'CQUEUE_ENQUEUE',
        operation: 'ENQUEUE_40',
        data_structure: 'circular_queue',
        line: 16,
        description: 'rear = (2 + 1) % 5 = 3. Storing 40 at slot 3',
        state: [10, 20, 30, 40, null],
        variables: { front: 0, rear: 3, count: 4, value: 40 },
        highlight: { indices: [3], pointers: { front: 0, rear: 3 } },
        log: { type: 'STEP', message: 'Enqueued 40 at index 3' },
      },
      {
        step: 3,
        type: 'CQUEUE_ENQUEUE',
        operation: 'ENQUEUE_50',
        data_structure: 'circular_queue',
        line: 16,
        description: 'rear = (3 + 1) % 5 = 4. Storing 50 at slot 4',
        state: [10, 20, 30, 40, 50],
        variables: { front: 0, rear: 4, count: 5, value: 50 },
        highlight: { indices: [4], pointers: { front: 0, rear: 4 } },
        log: { type: 'SUCCESS', message: 'Enqueued 50 at index 4. Queue is now full (5/5).' },
      },
    ],
  },

  'circular_queue-dequeue': {
    id: 'dequeue',
    name: 'Dequeue',
    description: 'Remove front element and advance front pointer circularly',
    chapterId: 'circular_queue',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'front = (front + 1) % MAX advances front in constant time.',
    },
    code: {
      python: `MAX_SIZE = 5
cqueue = [10, 20, 30, 40, 50]
front = 0
rear = 4
count = 5

def dequeue():
    global front, count
    if count == 0:
        print("Circular Queue Underflow!")
        return None
    val = cqueue[front]
    cqueue[front] = None
    front = (front + 1) % MAX_SIZE
    count -= 1
    print(f"Dequeued {val}. New front is at index {front}")
    return val

dequeue()
dequeue()
`,
      c: `#include <stdio.h>
#define MAX 5

int cqueue[MAX] = {10, 20, 30, 40, 50};
int front = 0, rear = 4, count = 5;

int dequeue() {
    if (count == 0) {
        printf("Underflow!\\n");
        return -1;
    }
    int val = cqueue[front];
    cqueue[front] = 0;
    front = (front + 1) % MAX;
    count--;
    return val;
}

int main(void) {
    printf("Dequeued: %d\\n", dequeue());
    printf("Dequeued: %d\\n", dequeue());
    return 0;
}
`,
      cpp: `#include <iostream>
const int MAX = 5;
int cqueue[MAX] = {10, 20, 30, 40, 50};
int front = 0, count = 5;

int dequeue() {
    if (count == 0) return -1;
    int val = cqueue[front];
    front = (front + 1) % MAX;
    count--;
    return val;
}

int main() {
    std::cout << "Dequeued: " << dequeue() << std::endl;
    std::cout << "Dequeued: " << dequeue() << std::endl;
    return 0;
}
`,
      java: `public class Main {
    static final int MAX = 5;
    static int[] cqueue = {10, 20, 30, 40, 50};
    static int front = 0, count = 5;
    
    static int dequeue() {
        if (count == 0) return -1;
        int val = cqueue[front];
        front = (front + 1) % MAX;
        count--;
        return val;
    }
    
    public static void main(String[] args) {
        System.out.println("Dequeued: " + dequeue());
        System.out.println("Dequeued: " + dequeue());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'CQUEUE_FRONT',
        operation: 'INITIAL_STATE',
        data_structure: 'circular_queue',
        line: 5,
        description: 'Queue contains [10, 20, 30, 40, 50]. FRONT is at index 0',
        state: [10, 20, 30, 40, 50],
        variables: { front: 0, rear: 4, count: 5 },
        highlight: { pointers: { front: 0, rear: 4 } },
        log: { type: 'INFO', message: 'Initial circular queue with 5 items' },
      },
      {
        step: 2,
        type: 'CQUEUE_DEQUEUE',
        operation: 'DEQUEUE_10',
        data_structure: 'circular_queue',
        line: 14,
        description: 'Dequeued 10. front = (0 + 1) % 5 = 1',
        state: [null, 20, 30, 40, 50],
        variables: { dequeued: 10, front: 1, count: 4 },
        highlight: { indices: [1], pointers: { front: 1, rear: 4 } },
        log: { type: 'STEP', message: 'Dequeued 10 from index 0' },
      },
      {
        step: 3,
        type: 'CQUEUE_DEQUEUE',
        operation: 'DEQUEUE_20',
        data_structure: 'circular_queue',
        line: 14,
        description: 'Dequeued 20. front = (1 + 1) % 5 = 2',
        state: [null, null, 30, 40, 50],
        variables: { dequeued: 20, front: 2, count: 3 },
        highlight: { indices: [2], pointers: { front: 2, rear: 4 } },
        log: { type: 'SUCCESS', message: 'Dequeued 20. Front is now at index 2 (value 30)' },
      },
    ],
  },

  'circular_queue-wrap': {
    id: 'wrap',
    name: 'Circular Wrap Around',
    description: 'Demonstrate wrap-around where REAR wraps past the end back to index 0',
    chapterId: 'circular_queue',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'When rear reaches MAX_SIZE-1 and front > 0, rear wraps around to index 0!',
    },
    code: {
      python: `MAX = 5
cqueue = [None, None, 30, 40, 50]
front = 2
rear = 4
count = 3

print(f"Before wrap: rear={rear}, front={front}")
# Next insertion wraps around to index 0!
rear = (rear + 1) % MAX
cqueue[rear] = 60
count += 1
print(f"After wrap: Enqueued 60 at index {rear}! (rear wrapped to 0)")

rear = (rear + 1) % MAX
cqueue[rear] = 70
count += 1
print(f"Enqueued 70 at index {rear}")
`,
      c: `#include <stdio.h>
#define MAX 5

int main(void) {
    int cqueue[MAX] = {0, 0, 30, 40, 50};
    int front = 2, rear = 4;
    
    // Wrap around to index 0!
    rear = (rear + 1) % MAX;
    cqueue[rear] = 60;
    printf("Wrapped around! Stored 60 at index %d\\n", rear);
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int rear = 4, max = 5;
    rear = (rear + 1) % max;
    std::cout << "Wrapped around to index: " << rear << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int rear = 4, max = 5;
        rear = (rear + 1) % max;
        System.out.println("Wrapped around to index: " + rear);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'CQUEUE_REAR',
        operation: 'AT_MAX_INDEX',
        data_structure: 'circular_queue',
        line: 5,
        description: 'Slots 0 and 1 are empty. FRONT is at 2, REAR is at index 4 (last slot)',
        state: [null, null, 30, 40, 50],
        variables: { front: 2, rear: 4, count: 3, MAX: 5 },
        highlight: { pointers: { front: 2, rear: 4 } },
        log: { type: 'INFO', message: 'REAR is at slot 4 (end of array). Next enqueue will wrap!' },
      },
      {
        step: 2,
        type: 'CQUEUE_WRAP',
        operation: 'WRAP_AROUND',
        data_structure: 'circular_queue',
        line: 9,
        description: 'WRAP AROUND! rear = (4 + 1) % 5 = 0. Enqueueing 60 into slot 0!',
        state: [60, null, 30, 40, 50],
        variables: { front: 2, rear: 0, count: 4, value: 60 },
        highlight: { indices: [0], pointers: { front: 2, rear: 0 } },
        log: { type: 'WARN', message: 'Circular wrap occurred: rear looped from index 4 to index 0!' },
      },
      {
        step: 3,
        type: 'CQUEUE_ENQUEUE',
        operation: 'ENQUEUE_70',
        data_structure: 'circular_queue',
        line: 14,
        description: 'rear = (0 + 1) % 5 = 1. Enqueueing 70 into slot 1. Queue is full!',
        state: [60, 70, 30, 40, 50],
        variables: { front: 2, rear: 1, count: 5, value: 70 },
        highlight: { indices: [1], pointers: { front: 2, rear: 1 } },
        log: { type: 'SUCCESS', message: 'Full capacity achieved across wrap boundary.' },
      },
    ],
  },
};
