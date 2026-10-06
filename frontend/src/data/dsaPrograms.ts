import type { ChapterId, ProgramItem, ExecutionEvent, Language, ComplexityInfo } from '../types/dsa';

export const DSA_PROGRAMS: Record<string, ProgramItem> = {
  // ==========================================
  // 1. ARRAY
  // ==========================================
  'array-create': {
    id: 'create',
    name: 'Create Array',
    description: 'Initialize a contiguous array with predefined elements',
    chapterId: 'array',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(n)',
      notes: 'Allocates contiguous memory slots and copies initial values.',
    },
    code: {
      python: `# Create and initialize an Array
size = 5
arr = [10, 20, 30, 40, 50]

print("Array initialized with size:", len(arr))
print("Elements:", arr)
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    int size = 5;
    
    printf("Array initialized with size: %d\\n", size);
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50};
    std::cout << "Array initialized with size: " << arr.size() << std::endl;
    for (int val : arr) {
        std::cout << val << " ";
    }
    std::cout << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        System.out.println("Array initialized with size: " + arr.length);
        for (int val : arr) {
            System.out.print(val + " ");
        }
        System.out.println();
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'ARRAY_CREATE',
        operation: 'ALLOCATE',
        data_structure: 'array',
        line: 2,
        description: 'Allocating contiguous memory for 5 elements',
        state: [null, null, null, null, null],
        variables: { size: 5, capacity: 5 },
        highlight: { range: [0, 4] },
        log: { type: 'INFO', message: 'Allocated memory for array of size 5' },
      },
      {
        step: 2,
        type: 'ARRAY_INSERT',
        operation: 'SET_ELEMENT',
        data_structure: 'array',
        line: 3,
        description: 'Initializing arr[0] = 10, arr[1] = 20, arr[2] = 30',
        state: [10, 20, 30, null, null],
        variables: { size: 5, initialized: 3 },
        highlight: { indices: [0, 1, 2] },
        log: { type: 'STEP', message: 'Inserted elements at indices 0, 1, 2' },
      },
      {
        step: 3,
        type: 'ARRAY_INSERT',
        operation: 'COMPLETE_INIT',
        data_structure: 'array',
        line: 3,
        description: 'Initializing arr[3] = 40, arr[4] = 50',
        state: [10, 20, 30, 40, 50],
        variables: { size: 5, arr: [10, 20, 30, 40, 50] },
        highlight: { indices: [3, 4] },
        log: { type: 'SUCCESS', message: 'Array creation complete: [10, 20, 30, 40, 50]' },
      },
    ],
  },

  'array-traverse': {
    id: 'traverse',
    name: 'Traverse',
    description: 'Visit each array element sequentially from index 0 to n-1',
    chapterId: 'array',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Visits every element exactly once using a pointer index.',
    },
    code: {
      python: `arr = [15, 28, 42, 67, 91]

print("Starting array traversal:")
for i in range(len(arr)):
    current = arr[i]
    print(f"Index {i} -> Value {current}")
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[] = {15, 28, 42, 67, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    for (int i = 0; i < n; i++) {
        printf("Index %d -> Value %d\\n", i, arr[i]);
    }
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int arr[] = {15, 28, 42, 67, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    for (int i = 0; i < n; i++) {
        std::cout << "Index " << i << " -> Value " << arr[i] << std::endl;
    }
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {15, 28, 42, 67, 91};
        for (int i = 0; i < arr.length; i++) {
            System.out.println("Index " + i + " -> Value " + arr[i]);
        }
    }
}
`,
    },
    generateTrace: () => {
      const arr = [15, 28, 42, 67, 91];
      const trace: ExecutionEvent[] = [
        {
          step: 1,
          type: 'ARRAY_CREATE',
          operation: 'INIT',
          data_structure: 'array',
          line: 1,
          description: 'Initialized array [15, 28, 42, 67, 91]',
          state: [...arr],
          variables: { i: 0, n: 5 },
          log: { type: 'INFO', message: 'Ready to traverse 5 elements' },
        },
      ];
      arr.forEach((val, idx) => {
        trace.push({
          step: trace.length + 1,
          type: 'ARRAY_ACCESS',
          operation: 'VISIT',
          data_structure: 'array',
          line: 5,
          description: `Accessing element at index ${idx}: arr[${idx}] = ${val}`,
          state: [...arr],
          variables: { i: idx, current: val, n: 5 },
          highlight: { indices: [idx], pointers: { i: idx } },
          log: { type: 'STEP', message: `Visited index ${idx}: value ${val}` },
        });
      });
      trace.push({
        step: trace.length + 1,
        type: 'ARRAY_ACCESS',
        operation: 'COMPLETE',
        data_structure: 'array',
        line: 6,
        description: 'Completed linear array traversal',
        state: [...arr],
        variables: { i: 5, n: 5 },
        log: { type: 'SUCCESS', message: 'Traversal finished. All elements visited.' },
      });
      return trace;
    },
  },

  'array-insert': {
    id: 'insert',
    name: 'Insert',
    description: 'Insert an element at an index by shifting following elements right',
    chapterId: 'array',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Inserting at the end is O(1). Inserting at index 0 requires shifting all n elements.',
    },
    code: {
      python: `arr = [10, 20, 30, 40]
index_to_insert = 2
value = 99

# Shift elements to the right
arr.append(None)
for i in range(len(arr) - 1, index_to_insert, -1):
    arr[i] = arr[i - 1]

arr[index_to_insert] = value
print("Array after insert:", arr)
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[10] = {10, 20, 30, 40};
    int size = 4, pos = 2, val = 99;
    
    for (int i = size; i > pos; i--) {
        arr[i] = arr[i - 1];
    }
    arr[pos] = val;
    size++;
    
    printf("Inserted %d at index %d\\n", val, pos);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {10, 20, 30, 40};
    arr.insert(arr.begin() + 2, 99);
    std::cout << "Inserted 99 at index 2" << std::endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> arr = new ArrayList<>(List.of(10, 20, 30, 40));
        arr.add(2, 99);
        System.out.println("Array after insert: " + arr);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'ARRAY_CREATE',
        operation: 'INITIAL_STATE',
        data_structure: 'array',
        line: 1,
        description: 'Array before insertion: [10, 20, 30, 40]',
        state: [10, 20, 30, 40],
        variables: { targetIndex: 2, value: 99, size: 4 },
        log: { type: 'INFO', message: 'Target: insert 99 at index 2' },
      },
      {
        step: 2,
        type: 'ARRAY_SHIFT',
        operation: 'SHIFT_RIGHT',
        data_structure: 'array',
        line: 7,
        description: 'Shifting element 40 from index 3 to index 4',
        state: [10, 20, 30, 40, 40],
        variables: { i: 4, 'arr[4]': 40 },
        highlight: { indices: [3, 4], pointers: { shift: 4 } },
        log: { type: 'STEP', message: 'Shifted arr[3] -> arr[4]' },
      },
      {
        step: 3,
        type: 'ARRAY_SHIFT',
        operation: 'SHIFT_RIGHT',
        data_structure: 'array',
        line: 7,
        description: 'Shifting element 30 from index 2 to index 3',
        state: [10, 20, 30, 30, 40],
        variables: { i: 3, 'arr[3]': 30 },
        highlight: { indices: [2, 3], pointers: { shift: 3 } },
        log: { type: 'STEP', message: 'Shifted arr[2] -> arr[3]' },
      },
      {
        step: 4,
        type: 'ARRAY_INSERT',
        operation: 'SET_VALUE',
        data_structure: 'array',
        line: 10,
        description: 'Inserting value 99 at index 2',
        state: [10, 20, 99, 30, 40],
        variables: { index: 2, value: 99, newSize: 5 },
        highlight: { indices: [2], pointers: { inserted: 2 } },
        log: { type: 'SUCCESS', message: 'Element 99 inserted successfully at index 2' },
      },
    ],
  },

  'array-delete': {
    id: 'delete',
    name: 'Delete',
    description: 'Delete an element at an index and shift subsequent elements left',
    chapterId: 'array',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Deleting last element is O(1). Deleting first element requires shifting all remaining elements.',
    },
    code: {
      python: `arr = [10, 20, 30, 40, 50]
delete_index = 1

# Shift left to overwrite deleted element
for i in range(delete_index, len(arr) - 1):
    arr[i] = arr[i + 1]

arr.pop()
print("Array after deletion:", arr)
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    int size = 5, pos = 1;
    
    for (int i = pos; i < size - 1; i++) {
        arr[i] = arr[i + 1];
    }
    size--;
    
    printf("Deleted element at index %d\\n", pos);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50};
    arr.erase(arr.begin() + 1);
    std::cout << "Element deleted from index 1" << std::endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> arr = new ArrayList<>(List.of(10, 20, 30, 40, 50));
        arr.remove(1);
        System.out.println("After delete: " + arr);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'ARRAY_CREATE',
        operation: 'INITIAL_STATE',
        data_structure: 'array',
        line: 1,
        description: 'Array before deletion: [10, 20, 30, 40, 50]',
        state: [10, 20, 30, 40, 50],
        variables: { delete_index: 1, val: 20 },
        highlight: { indices: [1], pointers: { target: 1 } },
        log: { type: 'INFO', message: 'Targeting element at index 1 (value: 20) for deletion' },
      },
      {
        step: 2,
        type: 'ARRAY_SHIFT',
        operation: 'SHIFT_LEFT',
        data_structure: 'array',
        line: 5,
        description: 'Shifting element 30 from index 2 to index 1',
        state: [10, 30, 30, 40, 50],
        variables: { i: 1, 'arr[1]': 30 },
        highlight: { indices: [1, 2], pointers: { shift: 1 } },
        log: { type: 'STEP', message: 'arr[1] = arr[2] (value 30)' },
      },
      {
        step: 3,
        type: 'ARRAY_SHIFT',
        operation: 'SHIFT_LEFT',
        data_structure: 'array',
        line: 5,
        description: 'Shifting element 40 from index 3 to index 2',
        state: [10, 30, 40, 40, 50],
        variables: { i: 2, 'arr[2]': 40 },
        highlight: { indices: [2, 3], pointers: { shift: 2 } },
        log: { type: 'STEP', message: 'arr[2] = arr[3] (value 40)' },
      },
      {
        step: 4,
        type: 'ARRAY_SHIFT',
        operation: 'SHIFT_LEFT',
        data_structure: 'array',
        line: 5,
        description: 'Shifting element 50 from index 4 to index 3',
        state: [10, 30, 40, 50, 50],
        variables: { i: 3, 'arr[3]': 50 },
        highlight: { indices: [3, 4], pointers: { shift: 3 } },
        log: { type: 'STEP', message: 'arr[3] = arr[4] (value 50)' },
      },
      {
        step: 5,
        type: 'ARRAY_DELETE',
        operation: 'TRUNCATE',
        data_structure: 'array',
        line: 7,
        description: 'Removed trailing duplicate, new array size is 4',
        state: [10, 30, 40, 50],
        variables: { newSize: 4, deletedValue: 20 },
        log: { type: 'SUCCESS', message: 'Deletion complete: [10, 30, 40, 50]' },
      },
    ],
  },

  'array-update': {
    id: 'update',
    name: 'Update',
    description: 'Update the value at a specific index directly in O(1) time',
    chapterId: 'array',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Direct indexing by offset memory address is instantaneous.',
    },
    code: {
      python: `arr = [10, 20, 30, 40, 50]
update_index = 2
new_value = 99

old_value = arr[update_index]
arr[update_index] = new_value

print(f"Updated index {update_index}: {old_value} -> {new_value}")
print("Resulting array:", arr)
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    int index = 2;
    int newValue = 99;
    
    arr[index] = newValue;
    printf("Updated index %d to %d\\n", index, newValue);
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    arr[2] = 99;
    std::cout << "Updated index 2 to 99" << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        arr[2] = 99;
        System.out.println("Updated index 2 to 99");
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'ARRAY_ACCESS',
        operation: 'READ_INDEX',
        data_structure: 'array',
        line: 5,
        description: 'Accessing arr[2] which currently holds 30',
        state: [10, 20, 30, 40, 50],
        variables: { update_index: 2, old_value: 30, new_value: 99 },
        highlight: { indices: [2], pointers: { target: 2 } },
        log: { type: 'INFO', message: 'Current value at index 2 is 30' },
      },
      {
        step: 2,
        type: 'ARRAY_UPDATE',
        operation: 'WRITE_VALUE',
        data_structure: 'array',
        line: 6,
        description: 'Writing new value 99 into arr[2]',
        state: [10, 20, 99, 40, 50],
        variables: { update_index: 2, value: 99 },
        highlight: { indices: [2], pointers: { updated: 2 } },
        log: { type: 'SUCCESS', message: 'Updated arr[2] = 99 successfully in O(1)' },
      },
    ],
  },

  'array-search': {
    id: 'search',
    name: 'Search',
    description: 'Find the index of a given target element in the array',
    chapterId: 'array',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Linear scan compares element by element until found or end of array.',
    },
    code: {
      python: `arr = [10, 25, 40, 70, 85]
target = 70
found_index = -1

for i in range(len(arr)):
    if arr[i] == target:
        found_index = i
        break

print(f"Target {target} found at index: {found_index}")
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[] = {10, 25, 40, 70, 85};
    int n = 5, target = 70, found = -1;
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            found = i;
            break;
        }
    }
    printf("Found at: %d\\n", found);
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int arr[] = {10, 25, 40, 70, 85};
    int target = 70;
    for (int i = 0; i < 5; i++) {
        if (arr[i] == target) {
            std::cout << "Found at index: " << i << std::endl;
            break;
        }
    }
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 25, 40, 70, 85};
        int target = 70;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                System.out.println("Found at: " + i);
                break;
            }
        }
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'ARRAY_COMPARE',
        operation: 'COMPARE',
        data_structure: 'array',
        line: 5,
        description: 'Comparing arr[0] (10) == target (70): False',
        state: [10, 25, 40, 70, 85],
        variables: { i: 0, current: 10, target: 70 },
        highlight: { indices: [0], pointers: { i: 0 } },
        log: { type: 'STEP', message: 'arr[0]=10 != 70' },
      },
      {
        step: 2,
        type: 'ARRAY_COMPARE',
        operation: 'COMPARE',
        data_structure: 'array',
        line: 5,
        description: 'Comparing arr[1] (25) == target (70): False',
        state: [10, 25, 40, 70, 85],
        variables: { i: 1, current: 25, target: 70 },
        highlight: { indices: [1], pointers: { i: 1 } },
        log: { type: 'STEP', message: 'arr[1]=25 != 70' },
      },
      {
        step: 3,
        type: 'ARRAY_COMPARE',
        operation: 'COMPARE',
        data_structure: 'array',
        line: 5,
        description: 'Comparing arr[2] (40) == target (70): False',
        state: [10, 25, 40, 70, 85],
        variables: { i: 2, current: 40, target: 70 },
        highlight: { indices: [2], pointers: { i: 2 } },
        log: { type: 'STEP', message: 'arr[2]=40 != 70' },
      },
      {
        step: 4,
        type: 'ARRAY_SEARCH',
        operation: 'FOUND',
        data_structure: 'array',
        line: 6,
        description: 'Match found! arr[3] (70) == target (70)',
        state: [10, 25, 40, 70, 85],
        variables: { i: 3, target: 70, found_index: 3 },
        highlight: { indices: [3], pointers: { found: 3 } },
        log: { type: 'SUCCESS', message: 'Target 70 found at index 3!' },
      },
    ],
  },

  // ==========================================
  // 2. STACK
  // ==========================================
  'stack-push': {
    id: 'push',
    name: 'Push',
    description: 'Add an element to the top of the stack',
    chapterId: 'stack',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Push increments the top pointer and stores the new element.',
    },
    code: {
      python: `stack = [10, 20]
MAX_CAPACITY = 5

def push(item):
    if len(stack) >= MAX_CAPACITY:
        print("Stack Overflow!")
        return
    stack.append(item)
    print(f"Pushed {item}. New TOP is index {len(stack) - 1}")

push(30)
push(40)
`,
      c: `#include <stdio.h>
#define MAX 5

int stack[MAX] = {10, 20};
int top = 1;

void push(int val) {
    if (top >= MAX - 1) {
        printf("Stack Overflow!\\n");
        return;
    }
    stack[++top] = val;
    printf("Pushed %d. TOP: %d\\n", val, top);
}

int main(void) {
    push(30);
    push(40);
    return 0;
}
`,
      cpp: `#include <iostream>
#include <stack>

int main() {
    std::stack<int> s;
    s.push(10);
    s.push(20);
    s.push(30);
    std::cout << "Top element: " << s.top() << std::endl;
    return 0;
}
`,
      java: `import java.util.Stack;

public class Main {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        s.push(10);
        s.push(20);
        s.push(30);
        System.out.println("Top: " + s.peek());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'STACK_PEEK',
        operation: 'INITIAL_STACK',
        data_structure: 'stack',
        line: 1,
        description: 'Initial stack with elements [10, 20], TOP is at index 1',
        state: [10, 20],
        variables: { top: 1, capacity: 5 },
        highlight: { pointers: { top: 1 } },
        log: { type: 'INFO', message: 'Stack initialized with [10, 20]' },
      },
      {
        step: 2,
        type: 'STACK_PUSH',
        operation: 'PUSH_30',
        data_structure: 'stack',
        line: 8,
        description: 'Pushing 30 onto stack: TOP moves from index 1 to index 2',
        state: [10, 20, 30],
        variables: { top: 2, item: 30 },
        highlight: { pointers: { top: 2 } },
        log: { type: 'STEP', message: 'Pushed 30 onto stack' },
      },
      {
        step: 3,
        type: 'STACK_PUSH',
        operation: 'PUSH_40',
        data_structure: 'stack',
        line: 8,
        description: 'Pushing 40 onto stack: TOP moves from index 2 to index 3',
        state: [10, 20, 30, 40],
        variables: { top: 3, item: 40 },
        highlight: { pointers: { top: 3 } },
        log: { type: 'SUCCESS', message: 'Pushed 40. Stack size: 4' },
      },
    ],
  },

  'stack-pop': {
    id: 'pop',
    name: 'Pop',
    description: 'Remove and return the topmost element from the stack',
    chapterId: 'stack',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Decrements the top pointer and returns previous top element.',
    },
    code: {
      python: `stack = [10, 20, 30, 40]

def pop():
    if not stack:
        print("Stack Underflow!")
        return None
    val = stack.pop()
    print("Popped:", val)
    return val

pop()
pop()
`,
      c: `#include <stdio.h>

int stack[5] = {10, 20, 30, 40};
int top = 3;

int pop() {
    if (top < 0) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    return stack[top--];
}

int main(void) {
    printf("Popped: %d\\n", pop());
    printf("Popped: %d\\n", pop());
    return 0;
}
`,
      cpp: `#include <iostream>
#include <stack>

int main() {
    std::stack<int> s;
    for (int v : {10, 20, 30, 40}) s.push(v);
    std::cout << "Popped: " << s.top() << std::endl;
    s.pop();
    std::cout << "Popped: " << s.top() << std::endl;
    s.pop();
    return 0;
}
`,
      java: `import java.util.Stack;

public class Main {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        s.push(10); s.push(20); s.push(30); s.push(40);
        System.out.println("Popped: " + s.pop());
        System.out.println("Popped: " + s.pop());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'STACK_PEEK',
        operation: 'INITIAL_STACK',
        data_structure: 'stack',
        line: 1,
        description: 'Stack contains [10, 20, 30, 40], TOP is at index 3 (value 40)',
        state: [10, 20, 30, 40],
        variables: { top: 3, topValue: 40 },
        highlight: { pointers: { top: 3 } },
        log: { type: 'INFO', message: 'Initial stack: [10, 20, 30, 40]' },
      },
      {
        step: 2,
        type: 'STACK_POP',
        operation: 'POP_40',
        data_structure: 'stack',
        line: 7,
        description: 'Popping top element (40). TOP decreases to index 2 (value 30)',
        state: [10, 20, 30],
        variables: { popped: 40, top: 2 },
        highlight: { pointers: { top: 2 } },
        log: { type: 'STEP', message: 'Popped 40 from stack' },
      },
      {
        step: 3,
        type: 'STACK_POP',
        operation: 'POP_30',
        data_structure: 'stack',
        line: 7,
        description: 'Popping top element (30). TOP decreases to index 1 (value 20)',
        state: [10, 20],
        variables: { popped: 30, top: 1 },
        highlight: { pointers: { top: 1 } },
        log: { type: 'SUCCESS', message: 'Popped 30. Remaining stack size: 2' },
      },
    ],
  },

  'stack-peek': {
    id: 'peek',
    name: 'Peek',
    description: 'Inspect the top element without removing it',
    chapterId: 'stack',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(1)',
      notes: 'Directly reads the element at top index.',
    },
    code: {
      python: `stack = [10, 20, 30]

def peek():
    if not stack:
        print("Stack is empty!")
        return None
    print("Top element is:", stack[-1])
    return stack[-1]

peek()
`,
      c: `#include <stdio.h>

int stack[3] = {10, 20, 30};
int top = 2;

int peek() {
    if (top < 0) {
        printf("Stack empty!\\n");
        return -1;
    }
    return stack[top];
}

int main(void) {
    printf("Top: %d\\n", peek());
    return 0;
}
`,
      cpp: `#include <iostream>
#include <stack>

int main() {
    std::stack<int> s;
    s.push(10); s.push(20); s.push(30);
    std::cout << "Top: " << s.top() << std::endl;
    return 0;
}
`,
      java: `import java.util.Stack;

public class Main {
    public static void main(String[] args) {
        Stack<Integer> s = new Stack<>();
        s.push(10); s.push(20); s.push(30);
        System.out.println("Top: " + s.peek());
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'STACK_PEEK',
        operation: 'READ_TOP',
        data_structure: 'stack',
        line: 6,
        description: 'Peeking at stack: top element is 30 at index 2',
        state: [10, 20, 30],
        variables: { top: 2, topValue: 30, size: 3 },
        highlight: { pointers: { top: 2 } },
        log: { type: 'SUCCESS', message: 'Peek returned 30 without modifying the stack.' },
      },
    ],
  },

  'stack-display': {
    id: 'display',
    name: 'Display',
    description: 'Traverse and display all elements in the stack from top to bottom',
    chapterId: 'stack',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Traverses each element in LIFO order.',
    },
    code: {
      python: `stack = [10, 20, 30]

print("Stack elements from top to bottom:")
for i in range(len(stack) - 1, -1, -1):
    print(f"| {stack[i]} |")
print("+----+")
`,
      c: `#include <stdio.h>

int main(void) {
    int stack[3] = {10, 20, 30};
    int top = 2;
    for (int i = top; i >= 0; i--) {
        printf("| %d |\\n", stack[i]);
    }
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int stack[3] = {10, 20, 30};
    for (int i = 2; i >= 0; i--) {
        std::cout << "| " << stack[i] << " |" << std::endl;
    }
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] stack = {10, 20, 30};
        for (int i = stack.length - 1; i >= 0; i--) {
            System.out.println("| " + stack[i] + " |");
        }
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'STACK_PEEK',
        operation: 'VISIT_TOP',
        data_structure: 'stack',
        line: 5,
        description: 'Visiting element at top (index 2): 30',
        state: [10, 20, 30],
        variables: { i: 2, val: 30 },
        highlight: { pointers: { current: 2 } },
        log: { type: 'STEP', message: 'Visiting top: 30' },
      },
      {
        step: 2,
        type: 'STACK_PEEK',
        operation: 'VISIT_MIDDLE',
        data_structure: 'stack',
        line: 5,
        description: 'Visiting element at index 1: 20',
        state: [10, 20, 30],
        variables: { i: 1, val: 20 },
        highlight: { pointers: { current: 1 } },
        log: { type: 'STEP', message: 'Visiting index 1: 20' },
      },
      {
        step: 3,
        type: 'STACK_PEEK',
        operation: 'VISIT_BOTTOM',
        data_structure: 'stack',
        line: 5,
        description: 'Visiting element at bottom (index 0): 10',
        state: [10, 20, 30],
        variables: { i: 0, val: 10 },
        highlight: { pointers: { current: 0 } },
        log: { type: 'SUCCESS', message: 'Stack traversal complete.' },
      },
    ],
  },

  'stack-array': {
    id: 'array',
    name: 'Stack Using Array',
    description: 'Fixed-size array-backed stack with overflow and underflow checks',
    chapterId: 'stack',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(n)',
      notes: 'Array-based stack has a fixed MAX_SIZE bound.',
    },
    code: {
      python: `MAX_SIZE = 4
stack = [None] * MAX_SIZE
top = -1

def push(x):
    global top
    if top == MAX_SIZE - 1:
        print("Stack Overflow!")
        return
    top += 1
    stack[top] = x
    print(f"Pushed {x} at index {top}")

push(10)
push(20)
push(30)
push(40)
push(50) # Overflow!
`,
      c: `#include <stdio.h>
#define MAX 4

int stack[MAX];
int top = -1;

void push(int x) {
    if (top == MAX - 1) {
        printf("Stack Overflow!\\n");
        return;
    }
    stack[++top] = x;
    printf("Pushed %d\\n", x);
}

int main(void) {
    push(10); push(20); push(30); push(40); push(50);
    return 0;
}
`,
      cpp: `#include <iostream>
const int MAX = 4;
int stackArr[MAX];
int top = -1;

void push(int x) {
    if (top == MAX - 1) {
        std::cout << "Stack Overflow!" << std::endl;
        return;
    }
    stackArr[++top] = x;
    std::cout << "Pushed " << x << std::endl;
}

int main() {
    push(10); push(20); push(30); push(40); push(50);
    return 0;
}
`,
      java: `public class Main {
    static final int MAX = 4;
    static int[] stack = new int[MAX];
    static int top = -1;
    
    static void push(int x) {
        if (top == MAX - 1) {
            System.out.println("Stack Overflow!");
            return;
        }
        stack[++top] = x;
        System.out.println("Pushed: " + x);
    }
    
    public static void main(String[] args) {
        push(10); push(20); push(30); push(40); push(50);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'STACK_PUSH',
        operation: 'PUSH',
        data_structure: 'stack',
        line: 11,
        description: 'Pushed 10. TOP = 0',
        state: [10],
        variables: { top: 0, MAX_SIZE: 4 },
        highlight: { pointers: { top: 0 } },
        log: { type: 'STEP', message: 'Pushed 10' },
      },
      {
        step: 2,
        type: 'STACK_PUSH',
        operation: 'PUSH',
        data_structure: 'stack',
        line: 11,
        description: 'Pushed 20. TOP = 1',
        state: [10, 20],
        variables: { top: 1, MAX_SIZE: 4 },
        highlight: { pointers: { top: 1 } },
        log: { type: 'STEP', message: 'Pushed 20' },
      },
      {
        step: 3,
        type: 'STACK_PUSH',
        operation: 'PUSH',
        data_structure: 'stack',
        line: 11,
        description: 'Pushed 30. TOP = 2',
        state: [10, 20, 30],
        variables: { top: 2, MAX_SIZE: 4 },
        highlight: { pointers: { top: 2 } },
        log: { type: 'STEP', message: 'Pushed 30' },
      },
      {
        step: 4,
        type: 'STACK_PUSH',
        operation: 'PUSH_FULL',
        data_structure: 'stack',
        line: 11,
        description: 'Pushed 40. TOP = 3. Stack is now full (4/4)!',
        state: [10, 20, 30, 40],
        variables: { top: 3, MAX_SIZE: 4 },
        highlight: { pointers: { top: 3 } },
        log: { type: 'WARN', message: 'Stack reached maximum capacity (4)' },
      },
      {
        step: 5,
        type: 'STACK_OVERFLOW',
        operation: 'OVERFLOW_ERROR',
        data_structure: 'stack',
        line: 7,
        description: 'Stack Overflow: Attempted to push 50 into full stack!',
        state: [10, 20, 30, 40],
        variables: { top: 3, failedValue: 50 },
        highlight: { pointers: { top: 3 } },
        log: { type: 'ERROR', message: 'Stack Overflow detected!' },
      },
    ],
  },

  'stack-linked': {
    id: 'linked',
    name: 'Stack Using Linked List',
    description: 'Dynamic node-based stack with no fixed size limit',
    chapterId: 'stack',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(1)',
      space: 'O(n)',
      notes: 'Each push dynamically allocates a node and links it to previous TOP.',
    },
    code: {
      python: `class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

top = None

def push(val):
    global top
    new_node = Node(val, top)
    top = new_node
    print(f"Pushed {val} as new top node")

push(10)
push(20)
push(30)
`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};
struct Node* top = NULL;

void push(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->data = val;
    n->next = top;
    top = n;
    printf("Pushed %d\\n", val);
}

int main(void) {
    push(10); push(20); push(30);
    return 0;
}
`,
      cpp: `#include <iostream>

struct Node {
    int data;
    Node* next;
    Node(int val, Node* n = nullptr) : data(val), next(n) {}
};

int main() {
    Node* top = nullptr;
    top = new Node(10, top);
    top = new Node(20, top);
    top = new Node(30, top);
    std::cout << "Top: " << top->data << std::endl;
    return 0;
}
`,
      java: `class Node {
    int data;
    Node next;
    Node(int d, Node n) { data = d; next = n; }
}

public class Main {
    static Node top = null;
    public static void main(String[] args) {
        top = new Node(10, top);
        top = new Node(20, top);
        top = new Node(30, top);
        System.out.println("Top: " + top.data);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'STACK_PUSH',
        operation: 'NODE_ALLOC',
        data_structure: 'stack',
        line: 11,
        description: 'Allocated Node(10) -> NULL. TOP points to 10',
        state: [10],
        variables: { top: 10 },
        highlight: { pointers: { top: 0 } },
        log: { type: 'STEP', message: 'Created Node(10) at head' },
      },
      {
        step: 2,
        type: 'STACK_PUSH',
        operation: 'NODE_ALLOC',
        data_structure: 'stack',
        line: 11,
        description: 'Allocated Node(20) -> Node(10). TOP points to 20',
        state: [10, 20],
        variables: { top: 20 },
        highlight: { pointers: { top: 1 } },
        log: { type: 'STEP', message: 'Created Node(20) -> 10' },
      },
      {
        step: 3,
        type: 'STACK_PUSH',
        operation: 'NODE_ALLOC',
        data_structure: 'stack',
        line: 11,
        description: 'Allocated Node(30) -> Node(20). TOP points to 30',
        state: [10, 20, 30],
        variables: { top: 30 },
        highlight: { pointers: { top: 2 } },
        log: { type: 'SUCCESS', message: 'Linked-list stack updated with 3 nodes' },
      },
    ],
  },
};

import { QUEUE_PROGRAMS } from './queuePrograms';
import { LINKED_LIST_PROGRAMS } from './linkedListPrograms';
import { TREE_PROGRAMS } from './treePrograms';
import { GRAPH_PROGRAMS } from './graphPrograms';
import { ALGO_PROGRAMS } from './algoPrograms';

export const ALL_DSA_PROGRAMS: Record<string, ProgramItem> = {
  ...DSA_PROGRAMS,
  ...QUEUE_PROGRAMS,
  ...LINKED_LIST_PROGRAMS,
  ...TREE_PROGRAMS,
  ...GRAPH_PROGRAMS,
  ...ALGO_PROGRAMS,
};

export function getProgramItem(chapterId: ChapterId, programId?: string): ProgramItem {
  if (programId) {
    const key = `${chapterId}-${programId}`;
    if (ALL_DSA_PROGRAMS[key]) return ALL_DSA_PROGRAMS[key];
  }
  // Fallback to first program matching chapter
  const match = Object.values(ALL_DSA_PROGRAMS).find(p => p.chapterId === chapterId);
  if (match) return match;
  return ALL_DSA_PROGRAMS['array-create'];
}
