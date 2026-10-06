import type { ProgramItem, ExecutionEvent } from '../types/dsa';

export const ALGO_PROGRAMS: Record<string, ProgramItem> = {
  // ==========================================
  // 11. SEARCHING
  // ==========================================
  'searching-linear': {
    id: 'linear',
    name: 'Linear Search',
    description: 'Scan elements sequentially from index 0 until match or end of array',
    chapterId: 'searching',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      notes: 'Best case when element is at index 0; worst case when absent or at last index.',
    },
    code: {
      python: `arr = [12, 34, 56, 78, 90]
target = 56

for i in range(len(arr)):
    if arr[i] == target:
        print(f"Target {target} found at index {i}")
        break
`,
      c: `#include <stdio.h>

int main(void) {
    int arr[] = {12, 34, 56, 78, 90};
    int target = 56, n = 5;
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            printf("Found at %d\\n", i);
            break;
        }
    }
    return 0;
}
`,
      cpp: `#include <iostream>

int main() {
    int arr[] = {12, 34, 56, 78, 90};
    int target = 56;
    for (int i = 0; i < 5; i++) {
        if (arr[i] == target) {
            std::cout << "Found at index " << i << std::endl;
            break;
        }
    }
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {12, 34, 56, 78, 90};
        int target = 56;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                System.out.println("Found at " + i);
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
        type: 'SEARCH_COMPARE',
        operation: 'COMPARE',
        data_structure: 'searching',
        line: 5,
        description: 'Comparing arr[0] (12) with target (56): False',
        state: [12, 34, 56, 78, 90],
        variables: { i: 0, currentVal: 12, target: 56 },
        highlight: { indices: [0], pointers: { i: 0 } },
        log: { type: 'STEP', message: 'arr[0]=12 != 56' },
      },
      {
        step: 2,
        type: 'SEARCH_COMPARE',
        operation: 'COMPARE',
        data_structure: 'searching',
        line: 5,
        description: 'Comparing arr[1] (34) with target (56): False',
        state: [12, 34, 56, 78, 90],
        variables: { i: 1, currentVal: 34, target: 56 },
        highlight: { indices: [1], pointers: { i: 1 } },
        log: { type: 'STEP', message: 'arr[1]=34 != 56' },
      },
      {
        step: 3,
        type: 'SEARCH_COMPARE',
        operation: 'FOUND',
        data_structure: 'searching',
        line: 6,
        description: 'MATCH FOUND! arr[2] (56) == target (56)',
        state: [12, 34, 56, 78, 90],
        variables: { i: 2, currentVal: 56, target: 56, foundIndex: 2 },
        highlight: { indices: [2], pointers: { found: 2 } },
        log: { type: 'SUCCESS', message: 'Target 56 found at index 2!' },
      },
    ],
  },

  'searching-binary': {
    id: 'binary',
    name: 'Binary Search',
    description: 'Divide-and-conquer on sorted array using LOW, MID, HIGH pointers',
    chapterId: 'searching',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(log n)',
      timeWorst: 'O(log n)',
      space: 'O(1)',
      notes: 'Halves the search space after each comparison.',
    },
    code: {
      python: `arr = [10, 20, 30, 40, 50, 60, 70]
target = 50
low = 0
high = len(arr) - 1

while low <= high:
    mid = (low + high) // 2
    if arr[mid] == target:
        print(f"Found target {target} at index {mid}")
        break
    elif arr[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
`,
      c: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main(void) {
    int arr[] = {10, 20, 30, 40, 50, 60, 70};
    printf("Index: %d\\n", binarySearch(arr, 7, 50));
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50, 60, 70};
    int low = 0, high = arr.size() - 1, target = 50;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) {
            std::cout << "Found at index " << mid << std::endl;
            break;
        }
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50, 60, 70};
        int low = 0, high = arr.length - 1, target = 50;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (arr[mid] == target) {
                System.out.println("Found at index " + mid);
                break;
            }
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'SEARCH_RANGE',
        operation: 'EVALUATE_MID',
        data_structure: 'searching',
        line: 8,
        description: 'Range [0..6]. low=0, high=6. mid = (0+6)//2 = 3. arr[3]=40 < 50',
        state: [10, 20, 30, 40, 50, 60, 70],
        variables: { low: 0, mid: 3, high: 6, 'arr[mid]': 40, target: 50 },
        highlight: { range: [0, 6], pointers: { low: 0, mid: 3, high: 6 } },
        log: { type: 'STEP', message: 'arr[3]=40 < 50. Shrinking range to right half: low = mid + 1 = 4' },
      },
      {
        step: 2,
        type: 'SEARCH_RANGE',
        operation: 'EVALUATE_MID',
        data_structure: 'searching',
        line: 8,
        description: 'Range [4..6]. low=4, high=6. mid = (4+6)//2 = 5. arr[5]=60 > 50',
        state: [10, 20, 30, 40, 50, 60, 70],
        variables: { low: 4, mid: 5, high: 6, 'arr[mid]': 60, target: 50 },
        highlight: { range: [4, 6], pointers: { low: 4, mid: 5, high: 6 } },
        log: { type: 'STEP', message: 'arr[5]=60 > 50. Shrinking range to left half: high = mid - 1 = 4' },
      },
      {
        step: 3,
        type: 'SEARCH_COMPARE',
        operation: 'MATCH_FOUND',
        data_structure: 'searching',
        line: 9,
        description: 'Range [4..4]. low=4, high=4. mid=4. MATCH: arr[4]=50 == target 50!',
        state: [10, 20, 30, 40, 50, 60, 70],
        variables: { low: 4, mid: 4, high: 4, 'arr[mid]': 50, target: 50, found: true },
        highlight: { range: [4, 4], pointers: { low: 4, mid: 4, high: 4 } },
        log: { type: 'SUCCESS', message: 'Binary search found 50 at index 4 in O(log n)!' },
      },
    ],
  },

  // ==========================================
  // 12. SORTING
  // ==========================================
  'sorting-bubble': {
    id: 'bubble',
    name: 'Bubble Sort',
    description: 'Repeatedly swap adjacent elements if they are in wrong order',
    chapterId: 'sorting',
    complexity: {
      timeBest: 'O(n)',
      timeAverage: 'O(n²)',
      timeWorst: 'O(n²)',
      space: 'O(1)',
      notes: 'In each pass, the largest unsorted element bubbles up to the end.',
    },
    code: {
      python: `arr = [64, 34, 25, 12, 22]
n = len(arr)

for i in range(n):
    for j in range(0, n - i - 1):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]

print("Sorted array:", arr)
`,
      c: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main(void) {
    int arr[] = {64, 34, 25, 12, 22};
    bubbleSort(arr, 5);
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}
`,
      cpp: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> arr = {64, 34, 25, 12, 22};
    for (size_t i = 0; i < arr.size(); i++) {
        for (size_t j = 0; j + 1 < arr.size() - i; j++) {
            if (arr[j] > arr[j + 1]) std::swap(arr[j], arr[j + 1]);
        }
    }
    for (int v : arr) std::cout << v << " ";
    std::cout << std::endl;
    return 0;
}
`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22};
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
                }
            }
        }
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'SORT_COMPARE',
        operation: 'COMPARE',
        data_structure: 'sorting',
        line: 6,
        description: 'Comparing arr[0] (64) > arr[1] (34): True',
        state: [64, 34, 25, 12, 22],
        variables: { j: 0, 'arr[j]': 64, 'arr[j+1]': 34 },
        highlight: { compareIndices: [0, 1] },
        log: { type: 'STEP', message: '64 > 34, will swap' },
      },
      {
        step: 2,
        type: 'SORT_SWAP',
        operation: 'SWAP',
        data_structure: 'sorting',
        line: 7,
        description: 'Swapped 64 and 34 -> [34, 64, 25, 12, 22]',
        state: [34, 64, 25, 12, 22],
        variables: { swapped: [34, 64] },
        highlight: { swapping: [0, 1] },
        log: { type: 'STEP', message: 'Swapped arr[0] and arr[1]' },
      },
      {
        step: 3,
        type: 'SORT_SWAP',
        operation: 'SWAP',
        data_structure: 'sorting',
        line: 7,
        description: 'Swapped 64 and 25 -> [34, 25, 64, 12, 22]',
        state: [34, 25, 64, 12, 22],
        variables: { swapped: [25, 64] },
        highlight: { swapping: [1, 2] },
        log: { type: 'STEP', message: 'Swapped arr[1] and arr[2]' },
      },
      {
        step: 4,
        type: 'SORT_SWAP',
        operation: 'SWAP',
        data_structure: 'sorting',
        line: 7,
        description: 'Swapped 64 and 12 -> [34, 25, 12, 64, 22]',
        state: [34, 25, 12, 64, 22],
        variables: { swapped: [12, 64] },
        highlight: { swapping: [2, 3] },
        log: { type: 'STEP', message: 'Swapped arr[2] and arr[3]' },
      },
      {
        step: 5,
        type: 'SORT_SWAP',
        operation: 'PASS_1_COMPLETE',
        data_structure: 'sorting',
        line: 7,
        description: 'Pass 1 complete: 64 bubbled to end index 4 [Sorted]',
        state: [34, 25, 12, 22, 64],
        variables: { sortedTailIndex: 4 },
        highlight: { sortedIndex: 4 },
        log: { type: 'STEP', message: 'Element 64 locked at index 4' },
      },
      {
        step: 6,
        type: 'SORT_SORTED',
        operation: 'SORT_COMPLETE',
        data_structure: 'sorting',
        line: 9,
        description: 'All passes complete! Fully sorted: [12, 22, 25, 34, 64]',
        state: [12, 22, 25, 34, 64],
        variables: { isSorted: true },
        highlight: { range: [0, 4] },
        log: { type: 'SUCCESS', message: 'Bubble sort finished successfully.' },
      },
    ],
  },

  // ==========================================
  // 13. HASH TABLE
  // ==========================================
  'hash_table-insert': {
    id: 'insert',
    name: 'Insert',
    description: 'Hash key into bucket index (key % NUM_BUCKETS) and resolve collisions',
    chapterId: 'hash_table',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(1)',
      timeWorst: 'O(n)',
      space: 'O(n)',
      notes: 'O(1) average lookup/insert; worst case O(n) when all keys hash to the same bucket.',
    },
    code: {
      python: `NUM_BUCKETS = 5
table = [[] for _ in range(NUM_BUCKETS)]

def insert(key, val):
    bucket = hash(key) % NUM_BUCKETS
    table[bucket].append((key, val))
    print(f"Key '{key}' hashed to bucket {bucket}")

insert("apple", 100)
insert("banana", 200)
insert("apricot", 300) # Collision with apple! Chaining handles it.
print("Table:", table)
`,
      c: `#include <stdio.h>

int main(void) {
    printf("Inserted apple -> bucket 2\\n");
    printf("Inserted banana -> bucket 4\\n");
    printf("Inserted apricot -> bucket 2 (collision resolved via chaining)\\n");
    return 0;
}
`,
      cpp: `#include <iostream>
#include <unordered_map>

int main() {
    std::unordered_map<std::string, int> map;
    map["apple"] = 100;
    map["banana"] = 200;
    std::cout << "Hash table size: " << map.size() << std::endl;
    return 0;
}
`,
      java: `import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("apple", 100);
        map.put("banana", 200);
        System.out.println("Map: " + map);
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'HASH_INSERT',
        operation: 'HASH_APPLE',
        data_structure: 'hash_table',
        line: 9,
        description: "hash('apple') % 5 = 2. Placed ('apple', 100) in bucket 2",
        state: [[], [], [['apple', 100]], [], []],
        variables: { key: 'apple', bucket: 2, val: 100 },
        highlight: { indices: [2] },
        log: { type: 'STEP', message: "Inserted 'apple' at bucket 2" },
      },
      {
        step: 2,
        type: 'HASH_INSERT',
        operation: 'HASH_BANANA',
        data_structure: 'hash_table',
        line: 10,
        description: "hash('banana') % 5 = 4. Placed ('banana', 200) in bucket 4",
        state: [[], [], [['apple', 100]], [], [['banana', 200]]],
        variables: { key: 'banana', bucket: 4, val: 200 },
        highlight: { indices: [4] },
        log: { type: 'STEP', message: "Inserted 'banana' at bucket 4" },
      },
      {
        step: 3,
        type: 'HASH_COLLISION',
        operation: 'CHAIN_APRICOT',
        data_structure: 'hash_table',
        line: 11,
        description: "COLLISION DETECTED! 'apricot' also hashes to bucket 2! Chaining: appended to bucket 2 list.",
        state: [[], [], [['apple', 100], ['apricot', 300]], [], [['banana', 200]]],
        variables: { key: 'apricot', bucket: 2, collision: true, chainLength: 2 },
        highlight: { indices: [2] },
        log: { type: 'WARN', message: 'Collision at bucket 2 resolved using separate chaining!' },
      },
    ],
  },

  // ==========================================
  // 14. RECURSION
  // ==========================================
  'recursion-factorial': {
    id: 'factorial',
    name: 'Factorial',
    description: 'Calculate n! using recursive call frames: n * factorial(n - 1)',
    chapterId: 'recursion',
    complexity: {
      timeBest: 'O(1)',
      timeAverage: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(n)',
      notes: 'Call stack grows to depth n before unwinding with base case return values.',
    },
    code: {
      python: `def factorial(n):
    print(f"CALL: factorial({n})")
    if n <= 1:
        print(f"BASE CASE REACHED: factorial({n}) = 1")
        return 1
    result = n * factorial(n - 1)
    print(f"RETURN: factorial({n}) = {result}")
    return result

print("Final result:", factorial(4))
`,
      c: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main(void) {
    printf("factorial(4) = %d\\n", factorial(4));
    return 0;
}
`,
      cpp: `#include <iostream>

int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

int main() {
    std::cout << "factorial(4) = " << factorial(4) << std::endl;
    return 0;
}
`,
      java: `public class Main {
    static int factorial(int n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }
    public static void main(String[] args) {
        System.out.println("factorial(4) = " + factorial(4));
    }
}
`,
    },
    generateTrace: () => [
      {
        step: 1,
        type: 'RECURSION_CALL',
        operation: 'CALL_F4',
        data_structure: 'recursion',
        line: 2,
        description: 'factorial(4) called. Pushing stack frame [depth 1]',
        state: ['factorial(4)'],
        variables: { n: 4, depth: 1 },
        call_stack: ['main()', 'factorial(4)'],
        log: { type: 'STEP', message: 'factorial(4) called' },
      },
      {
        step: 2,
        type: 'RECURSION_CALL',
        operation: 'CALL_F3',
        data_structure: 'recursion',
        line: 2,
        description: 'factorial(3) called. Pushing stack frame [depth 2]',
        state: ['factorial(4)', 'factorial(3)'],
        variables: { n: 3, depth: 2 },
        call_stack: ['main()', 'factorial(4)', 'factorial(3)'],
        log: { type: 'STEP', message: 'factorial(3) called' },
      },
      {
        step: 3,
        type: 'RECURSION_CALL',
        operation: 'CALL_F2',
        data_structure: 'recursion',
        line: 2,
        description: 'factorial(2) called. Pushing stack frame [depth 3]',
        state: ['factorial(4)', 'factorial(3)', 'factorial(2)'],
        variables: { n: 2, depth: 3 },
        call_stack: ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)'],
        log: { type: 'STEP', message: 'factorial(2) called' },
      },
      {
        step: 4,
        type: 'RECURSION_CALL',
        operation: 'BASE_CASE',
        data_structure: 'recursion',
        line: 4,
        description: 'BASE CASE: factorial(1) called. n <= 1 triggers return 1!',
        state: ['factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'],
        variables: { n: 1, depth: 4, baseCase: true, returnValue: 1 },
        call_stack: ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1)'],
        log: { type: 'INFO', message: 'Base case reached: factorial(1) returns 1' },
      },
      {
        step: 5,
        type: 'RECURSION_RETURN',
        operation: 'RETURN_F2',
        data_structure: 'recursion',
        line: 6,
        description: 'Unwinding: factorial(2) = 2 * 1 = 2. Popping frame.',
        state: ['factorial(4)', 'factorial(3)', 'factorial(2)'],
        variables: { n: 2, returnValue: 2 },
        call_stack: ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)'],
        log: { type: 'STEP', message: 'factorial(2) returned 2' },
      },
      {
        step: 6,
        type: 'RECURSION_RETURN',
        operation: 'RETURN_F3',
        data_structure: 'recursion',
        line: 6,
        description: 'Unwinding: factorial(3) = 3 * 2 = 6. Popping frame.',
        state: ['factorial(4)', 'factorial(3)'],
        variables: { n: 3, returnValue: 6 },
        call_stack: ['main()', 'factorial(4)', 'factorial(3)'],
        log: { type: 'STEP', message: 'factorial(3) returned 6' },
      },
      {
        step: 7,
        type: 'RECURSION_RETURN',
        operation: 'RETURN_F4',
        data_structure: 'recursion',
        line: 6,
        description: 'Unwinding: factorial(4) = 4 * 6 = 24. Final result computed!',
        state: ['factorial(4)'],
        variables: { n: 4, finalResult: 24 },
        call_stack: ['main()'],
        log: { type: 'SUCCESS', message: 'factorial(4) complete: 24' },
      },
    ],
  },
};
