import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { chapterById, type ChapterId } from './programCatalog';

type Language = 'c' | 'cpp' | 'java' | 'python';
type Speed = 'very-slow' | 'slow' | 'normal' | 'fast' | 'very-fast';
type ProgramName = 'array' | 'stack' | 'queue' | 'circular_queue' | 'linked_list' | 'doubly_linked_list' | 'binary_tree' | 'bst' | 'heap' | 'graph' | 'searching' | 'sorting' | 'hash_table' | 'recursion';
type Step = { step: number; description: string; operation: string; data_structure: string; line: number };
type Props = { api: string; chapter?: ChapterId; selectedProgram?: string; onProgramChange?: (program: string) => void };

const examples: Record<Language, string> = {
  python: `stack = []\nstack.append(10)\nstack.append(20)\nprint("Stack:", stack)\nprint("Popped:", stack.pop())`,
  c: `#include <stdio.h>\nint main(void) {\n    int stack[3];\n    int size = 0;\n    stack[size++] = 10;\n    stack[size++] = 20;\n    printf("Stack size: %d\\n", size);\n    return 0;\n}`,
  cpp: `#include <iostream>\n#include <stack>\nint main() {\n    std::stack<int> stack;\n    stack.push(10);\n    stack.push(20);\n    std::cout << "Top: " << stack.top() << std::endl;\n    return 0;\n}`,
  java: `import java.util.Stack;\npublic class Main {\n  public static void main(String[] args) {\n    Stack<Integer> stack = new Stack<>();\n    stack.push(10);\n    stack.push(20);\n    System.out.println("Top: " + stack.peek());\n  }\n}`,
};

const arrayInput = '1\n5\n10 20 30 40 50\n2\n3\n3\n99\n4\n2\n5\n3\n100\n6\n100\n7\n';

const arrayPrograms: Record<Language, string> = {
  c: `#include <stdio.h>

#define MAX_SIZE 100

void menu(void) {
    printf("\\n========================================\\n");
    printf("           ARRAY OPERATIONS\\n");
    printf("========================================\\n");
    printf("1. Create Array\\n2. Traverse\\n3. Insert\\n4. Delete\\n5. Update\\n6. Search\\n7. Exit\\n");
    printf("Enter your choice: ");
}

int main(void) {
    int array[MAX_SIZE], size = 0, choice, count, position, value, i;
    while (1) {
        menu();
        if (scanf("%d", &choice) != 1) { printf("Invalid choice! Please try again.\\n"); break; }
        switch (choice) {
        case 1:
            printf("Enter number of elements: "); scanf("%d", &count);
            if (count < 0 || count > MAX_SIZE) { printf("Invalid array size!\\n"); break; }
            size = count;
            for (i = 0; i < size; i++) scanf("%d", &array[i]);
            printf("@AIDS|ARRAY_CREATE|index=-1|value=%d\\n", size);
            printf("Array created successfully!\\n");
            break;
        case 2:
            if (size == 0) { printf("Array is empty!\\n"); break; }
            printf("Array elements: ");
            for (i = 0; i < size; i++) { printf("@AIDS|ARRAY_ACCESS|index=%d|value=%d\\n", i, array[i]); printf("%d ", array[i]); }
            printf("\\n");
            break;
        case 3:
            if (size == MAX_SIZE) { printf("Array is full!\\n"); break; }
            printf("Enter position for insertion: "); scanf("%d", &position);
            printf("Enter element to insert: "); scanf("%d", &value);
            if (position < 1 || position > size + 1) { printf("Invalid position!\\n"); break; }
            for (i = size; i >= position; i--) { array[i] = array[i - 1]; printf("@AIDS|ARRAY_SHIFT|index=%d|value=%d\\n", i, array[i]); }
            array[position - 1] = value; size++;
            printf("@AIDS|ARRAY_INSERT|index=%d|value=%d\\n", position - 1, value);
            printf("Element inserted successfully!\\n");
            break;
        case 4:
            if (size == 0) { printf("Array is empty!\\n"); break; }
            printf("Enter position to delete: "); scanf("%d", &position);
            if (position < 1 || position > size) { printf("Invalid position!\\n"); break; }
            value = array[position - 1];
            for (i = position - 1; i < size - 1; i++) { array[i] = array[i + 1]; printf("@AIDS|ARRAY_SHIFT|index=%d|value=%d\\n", i, array[i]); }
            size--; printf("@AIDS|ARRAY_DELETE|index=%d|value=%d\\n", position - 1, value);
            printf("Element deleted successfully!\\n");
            break;
        case 5:
            if (size == 0) { printf("Array is empty!\\n"); break; }
            printf("Enter position to update: "); scanf("%d", &position);
            printf("Enter new element: "); scanf("%d", &value);
            if (position < 1 || position > size) { printf("Invalid position!\\n"); break; }
            array[position - 1] = value; printf("@AIDS|ARRAY_UPDATE|index=%d|value=%d\\n", position - 1, value);
            printf("Element updated successfully!\\n");
            break;
        case 6:
            if (size == 0) { printf("Array is empty!\\n"); break; }
            printf("Enter element to search: "); scanf("%d", &value);
            for (i = 0; i < size; i++) { printf("@AIDS|ARRAY_COMPARE|index=%d|value=%d\\n", i, array[i]); if (array[i] == value) { printf("@AIDS|ARRAY_FOUND|index=%d|value=%d\\n", i, value); printf("Element found at position: %d\\n", i + 1); break; } }
            if (i == size) { printf("@AIDS|ARRAY_NOT_FOUND|index=-1|value=%d\\n", value); printf("Element not found!\\n"); }
            break;
        case 7: printf("Program terminated successfully.\\n"); return 0;
        default: printf("Invalid choice! Please try again.\\n");
        }
    }
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

const int MAX_SIZE = 100;
void menu() {
    cout << "\\n========================================\\n           ARRAY OPERATIONS\\n========================================\\n";
    cout << "1. Create Array\\n2. Traverse\\n3. Insert\\n4. Delete\\n5. Update\\n6. Search\\n7. Exit\\nEnter your choice: ";
}
int main() {
    int array[MAX_SIZE], size = 0, choice, count, position, value, i;
    while (true) {
        menu(); if (!(cin >> choice)) { cout << "Invalid choice! Please try again.\\n"; break; }
        switch (choice) {
        case 1: cout << "Enter number of elements: "; cin >> count; if (count < 0 || count > MAX_SIZE) { cout << "Invalid array size!\\n"; break; } size = count; for (i=0;i<size;i++) cin >> array[i]; cout << "@AIDS|ARRAY_CREATE|index=-1|value=" << size << "\\nArray created successfully!\\n"; break;
        case 2: if (!size) { cout << "Array is empty!\\n"; break; } cout << "Array elements: "; for(i=0;i<size;i++){ cout << "@AIDS|ARRAY_ACCESS|index=" << i << "|value=" << array[i] << "\\n" << array[i] << " "; } cout << "\\n"; break;
        case 3: if(size==MAX_SIZE){cout<<"Array is full!\\n";break;} cout<<"Enter position for insertion: ";cin>>position;cout<<"Enter element to insert: ";cin>>value;if(position<1||position>size+1){cout<<"Invalid position!\\n";break;}for(i=size;i>=position;i--){array[i]=array[i-1];cout<<"@AIDS|ARRAY_SHIFT|index="<<i<<"|value="<<array[i]<<"\\n";}array[position-1]=value;size++;cout<<"@AIDS|ARRAY_INSERT|index="<<position-1<<"|value="<<value<<"\\nElement inserted successfully!\\n";break;
        case 4: if(!size){cout<<"Array is empty!\\n";break;}cout<<"Enter position to delete: ";cin>>position;if(position<1||position>size){cout<<"Invalid position!\\n";break;}value=array[position-1];for(i=position-1;i<size-1;i++){array[i]=array[i+1];cout<<"@AIDS|ARRAY_SHIFT|index="<<i<<"|value="<<array[i]<<"\\n";}size--;cout<<"@AIDS|ARRAY_DELETE|index="<<position-1<<"|value="<<value<<"\\nElement deleted successfully!\\n";break;
        case 5: if(!size){cout<<"Array is empty!\\n";break;}cout<<"Enter position to update: ";cin>>position;cout<<"Enter new element: ";cin>>value;if(position<1||position>size){cout<<"Invalid position!\\n";break;}array[position-1]=value;cout<<"@AIDS|ARRAY_UPDATE|index="<<position-1<<"|value="<<value<<"\\nElement updated successfully!\\n";break;
        case 6: if(!size){cout<<"Array is empty!\\n";break;}cout<<"Enter element to search: ";cin>>value;for(i=0;i<size;i++){cout<<"@AIDS|ARRAY_COMPARE|index="<<i<<"|value="<<array[i]<<"\\n";if(array[i]==value){cout<<"@AIDS|ARRAY_FOUND|index="<<i<<"|value="<<value<<"\\nElement found at position: "<<i+1<<"\\n";break;}}if(i==size)cout<<"@AIDS|ARRAY_NOT_FOUND|index=-1|value="<<value<<"\\nElement not found!\\n";break;
        case 7: cout<<"Program terminated successfully.\\n"; return 0;
        default: cout<<"Invalid choice! Please try again.\\n";
        }
    }
    return 0;
}`,
  java: `import java.util.Scanner;

public class Main {
    static final int MAX_SIZE = 100;
    static void menu() { System.out.println("\\n========================================\\n           ARRAY OPERATIONS\\n========================================\\n1. Create Array\\n2. Traverse\\n3. Insert\\n4. Delete\\n5. Update\\n6. Search\\n7. Exit\\nEnter your choice: "); }
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in); int[] array = new int[MAX_SIZE]; int size=0, choice, count, position, value, i;
        while (true) {
            menu(); if (!input.hasNextInt()) { System.out.println("Invalid choice! Please try again."); break; } choice=input.nextInt();
            switch(choice) {
            case 1: System.out.print("Enter number of elements: "); count=input.nextInt(); if(count<0||count>MAX_SIZE){System.out.println("Invalid array size!");break;} size=count; for(i=0;i<size;i++)array[i]=input.nextInt(); System.out.println("@AIDS|ARRAY_CREATE|index=-1|value="+size+"\\nArray created successfully!"); break;
            case 2: if(size==0){System.out.println("Array is empty!");break;} System.out.print("Array elements: "); for(i=0;i<size;i++){System.out.println("@AIDS|ARRAY_ACCESS|index="+i+"|value="+array[i]);System.out.print(array[i]+" ");}System.out.println();break;
            case 3: if(size==MAX_SIZE){System.out.println("Array is full!");break;}System.out.print("Enter position for insertion: ");position=input.nextInt();System.out.print("Enter element to insert: ");value=input.nextInt();if(position<1||position>size+1){System.out.println("Invalid position!");break;}for(i=size;i>=position;i--){array[i]=array[i-1];System.out.println("@AIDS|ARRAY_SHIFT|index="+i+"|value="+array[i]);}array[position-1]=value;size++;System.out.println("@AIDS|ARRAY_INSERT|index="+(position-1)+"|value="+value+"\\nElement inserted successfully!");break;
            case 4: if(size==0){System.out.println("Array is empty!");break;}System.out.print("Enter position to delete: ");position=input.nextInt();if(position<1||position>size){System.out.println("Invalid position!");break;}value=array[position-1];for(i=position-1;i<size-1;i++){array[i]=array[i+1];System.out.println("@AIDS|ARRAY_SHIFT|index="+i+"|value="+array[i]);}size--;System.out.println("@AIDS|ARRAY_DELETE|index="+(position-1)+"|value="+value+"\\nElement deleted successfully!");break;
            case 5: if(size==0){System.out.println("Array is empty!");break;}System.out.print("Enter position to update: ");position=input.nextInt();System.out.print("Enter new element: ");value=input.nextInt();if(position<1||position>size){System.out.println("Invalid position!");break;}array[position-1]=value;System.out.println("@AIDS|ARRAY_UPDATE|index="+(position-1)+"|value="+value+"\\nElement updated successfully!");break;
            case 6: if(size==0){System.out.println("Array is empty!");break;}System.out.print("Enter element to search: ");value=input.nextInt();for(i=0;i<size;i++){System.out.println("@AIDS|ARRAY_COMPARE|index="+i+"|value="+array[i]);if(array[i]==value){System.out.println("@AIDS|ARRAY_FOUND|index="+i+"|value="+value+"\\nElement found at position: "+(i+1));break;}}if(i==size)System.out.println("@AIDS|ARRAY_NOT_FOUND|index=-1|value="+value+"\\nElement not found!");break;
            case 7: System.out.println("Program terminated successfully."); input.close(); return;
            default: System.out.println("Invalid choice! Please try again.");
            }
        }
        input.close();
    }
}`,
  python: `MAX_SIZE = 100

def show_menu():
    print("\\n========================================")
    print("           ARRAY OPERATIONS")
    print("========================================")
    print("1. Create Array\\n2. Traverse\\n3. Insert\\n4. Delete\\n5. Update\\n6. Search\\n7. Exit")

array = []
while True:
    show_menu()
    try:
        choice = int(input("Enter your choice: "))
    except (ValueError, EOFError):
        print("Invalid choice! Please try again.")
        break
    if choice == 1:
        count = int(input("Enter number of elements: "))
        if count < 0 or count > MAX_SIZE: print("Invalid array size!"); continue
        array = [int(value) for value in input("Enter elements: ").split()]
        if len(array) != count: print("Please enter exactly the requested number of elements!"); continue
        print(f"@AIDS|ARRAY_CREATE|index=-1|value={len(array)}")
        print("Array created successfully!")
    elif choice == 2:
        if not array: print("Array is empty!"); continue
        print("Array elements:", end=" ")
        for index, value in enumerate(array): print(f"\\n@AIDS|ARRAY_ACCESS|index={index}|value={value}", value, end=" ")
        print()
    elif choice == 3:
        if len(array) == MAX_SIZE: print("Array is full!"); continue
        position, value = int(input("Enter position for insertion: ")), int(input("Enter element to insert: "))
        if not 1 <= position <= len(array) + 1: print("Invalid position!"); continue
        array.insert(position - 1, value); print(f"@AIDS|ARRAY_INSERT|index={position-1}|value={value}"); print("Element inserted successfully!")
    elif choice == 4:
        if not array: print("Array is empty!"); continue
        position = int(input("Enter position to delete: "))
        if not 1 <= position <= len(array): print("Invalid position!"); continue
        value = array.pop(position - 1); print(f"@AIDS|ARRAY_DELETE|index={position-1}|value={value}"); print("Element deleted successfully!")
    elif choice == 5:
        if not array: print("Array is empty!"); continue
        position, value = int(input("Enter position to update: ")), int(input("Enter new element: "))
        if not 1 <= position <= len(array): print("Invalid position!"); continue
        array[position - 1] = value; print(f"@AIDS|ARRAY_UPDATE|index={position-1}|value={value}"); print("Element updated successfully!")
    elif choice == 6:
        if not array: print("Array is empty!"); continue
        value = int(input("Enter element to search: "))
        for index, current in enumerate(array):
            print(f"@AIDS|ARRAY_COMPARE|index={index}|value={current}")
            if current == value: print(f"@AIDS|ARRAY_FOUND|index={index}|value={value}"); print(f"Element found at position: {index + 1}"); break
        else: print(f"@AIDS|ARRAY_NOT_FOUND|index=-1|value={value}"); print("Element not found!")
    elif choice == 7:
        print("Program terminated successfully."); break
    else:
        print("Invalid choice! Please try again.")`,
};

const speedMs: Record<Speed, number> = { 'very-slow': 1800, slow: 1200, normal: 700, fast: 350, 'very-fast': 120 };
const programLabels: Partial<Record<ProgramName, string>> = { array: 'Array', stack: 'Stack', queue: 'Queue', circular_queue: 'Circular Queue', linked_list: 'Linked List', doubly_linked_list: 'Doubly Linked List', binary_tree: 'Binary Tree', bst: 'Binary Search Tree', heap: 'Heap', graph: 'Graph', searching: 'Searching', sorting: 'Sorting', hash_table: 'Hash Table' };
programLabels.recursion = 'Recursion';

const pythonPrograms: Record<ProgramName, string> = {
  array: 'values = [30, 10, 20]\nvalues.insert(1, 15)\nvalues[0] = 25\nprint("Array:", values)\nprint("Search 20:", values.index(20))',
  stack: examples.python,
  queue: 'from collections import deque\nqueue = deque([10, 20])\nqueue.append(30)\nprint("Queue:", list(queue))\nprint("Dequeue:", queue.popleft())\nprint("Front:", queue[0])',
  circular_queue: 'from collections import deque\nqueue = deque(maxlen=3)\nfor value in (10, 20, 30, 40): queue.append(value)\nprint("Circular queue:", list(queue))\nprint("Front:", queue[0], "Rear:", queue[-1])',
  linked_list: 'values = []\nvalues.insert(0, 20)\nvalues.append(30)\nvalues.insert(1, 25)\nprint("Linked list:", values)\nprint("Search 25:", values.index(25))',
  doubly_linked_list: 'from collections import deque\nvalues = deque([10, 20])\nvalues.appendleft(5)\nvalues.append(30)\nprint("Forward:", list(values))\nprint("Backward:", list(reversed(values)))',
  binary_tree: 'tree = {"value": 50, "left": {"value": 30}, "right": {"value": 70}}\nprint("Preorder:", [50, 30, 70])\nprint("Inorder:", [30, 50, 70])',
  bst: 'values = [50, 30, 70, 20, 40]\nvalues.sort()\nprint("BST inorder:", values)\nprint("Search 40:", 40 in values)\nvalues.remove(20)\nprint("After delete:", values)',
  heap: 'import heapq\nheap = [30, 10, 20]\nheapq.heapify(heap)\nheapq.heappush(heap, 5)\nprint("Min heap:", heap)\nprint("Extract:", heapq.heappop(heap))',
  graph: 'from collections import deque\ngraph = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}\nseen = []\nqueue = deque(["A"])\nwhile queue:\n    node = queue.popleft(); seen.append(node); queue.extend(graph[node])\nprint("BFS:", seen)\nprint("Edges:", graph)',
  searching: 'values = [10, 20, 30, 40]\ntarget = 30\nfor index, value in enumerate(values):\n    print("Compare", index, value)\n    if value == target: print("Found at:", index); break',
  sorting: 'values = [30, 10, 20, 5]\nfor i in range(len(values)):\n    for j in range(len(values) - i - 1):\n        if values[j] > values[j + 1]: values[j], values[j + 1] = values[j + 1], values[j]\nprint("Bubble sorted:", values)',
  hash_table: 'table = [[] for _ in range(5)]\nfor key, value in (("a", 10), ("f", 20)):\n    table[hash(key) % 5].append((key, value))\nprint("Buckets:", table)\nprint("Search a:", any(key == "a" for bucket in table for key, _ in bucket))',
  recursion: 'def factorial(n):\n    print("call factorial", n)\n    return 1 if n <= 1 else n * factorial(n - 1)\nprint("Factorial:", factorial(4))',
};

const cBodies: Record<ProgramName, string> = {
  array: 'int a[5] = {30, 10, 20, 0, 0}; int size = 3; a[1] = 15; a[size++] = 40; printf("Array: "); for (int i=0;i<size;i++) printf("%d ", a[i]); printf("\\nSearch 20: "); for (int i=0;i<size;i++) if(a[i]==20) printf("%d",i);',
  stack: 'int stack[5] = {10,20}; int top = 1; stack[++top] = 30; printf("Push 30\\nTop: %d\\n", stack[top]); printf("Pop: %d\\n", stack[top--]);',
  queue: 'int q[5] = {10,20}; int front=0, rear=2; q[rear++]=30; printf("Queue: "); for(int i=front;i<rear;i++) printf("%d ",q[i]); printf("\\nDequeue: %d\\n",q[front++]);',
  circular_queue: 'int q[3]={10,20,30}; int front=0,rear=0; rear=(rear+1)%3; q[rear]=40; printf("Circular front: %d rear: %d\\n",q[front],q[rear]);',
  linked_list: 'int values[5]={10,20}; int size=2; for(int i=size;i>0;i--) values[i]=values[i-1]; values[0]=5; values[size++]=30; printf("Linked list: "); for(int i=0;i<size;i++) printf("%d ",values[i]);',
  doubly_linked_list: 'int values[5]={10,20,30}; int size=3; printf("Forward: "); for(int i=0;i<size;i++) printf("%d ",values[i]); printf("\\nBackward: "); for(int i=size-1;i>=0;i--) printf("%d ",values[i]);',
  binary_tree: 'printf("Preorder: 50 30 20 40 70\\nInorder: 20 30 40 50 70\\nPostorder: 20 40 30 70 50\\n");',
  bst: 'int values[5]={50,30,70,20,40}; int size=5; printf("BST inorder: 20 30 40 50 70\\nSearch 40: found\\n"); size--; printf("Delete 20; nodes remaining: %d\\n",size);',
  heap: 'int heap[5]={10,20,30,0,0}; int size=3; heap[size++]=5; printf("Min heap insert 5; extract: 5\\nHeap size: %d\\n",size-1);',
  graph: 'printf("Graph edges: A-B A-C B-D\\nBFS: A B C D\\nDFS: A B D C\\n");',
  searching: 'int a[4]={10,20,30,40}, target=30; for(int i=0;i<4;i++){printf("Compare index %d\\n",i); if(a[i]==target){printf("Found at %d\\n",i);break;}}',
  sorting: 'int a[4]={30,10,20,5}; for(int i=0;i<4;i++) for(int j=0;j<3-i;j++) if(a[j]>a[j+1]){int t=a[j];a[j]=a[j+1];a[j+1]=t;} printf("Bubble sorted: "); for(int i=0;i<4;i++)printf("%d ",a[i]);',
  hash_table: 'printf("Hash a -> bucket 2\\nHash f -> bucket 2 (collision)\\nChaining search a: found\\n");',
  recursion: 'int factorial(int n){printf("call factorial %d\\n",n);return n<=1?1:n*factorial(n-1);} printf("Factorial: %d\\n",factorial(4));',
};

const cppBodies: Record<ProgramName, string> = Object.fromEntries(Object.entries(cBodies).map(([key, body]) => [key as ProgramName, body.replaceAll('printf', 'std::printf')])) as Record<ProgramName, string>;
cppBodies.recursion = 'std::cout << "Factorial: " << factorial(4) << std::endl;';
const javaBodies: Record<ProgramName, string> = {
  array: 'int[] a={30,10,20}; a[1]=15; System.out.println("Array: "+Arrays.toString(a)+"\\nSearch 20: 2");', stack: 'Stack<Integer> s=new Stack<>(); s.push(10); s.push(20); s.push(30); System.out.println("Push 30\\nTop: "+s.peek()+"\\nPop: "+s.pop());', queue: 'Queue<Integer> q=new ArrayDeque<>(List.of(10,20)); q.add(30); System.out.println("Queue: "+q+"\\nDequeue: "+q.remove()+"\\nFront: "+q.peek());', circular_queue: 'Deque<Integer> q=new ArrayDeque<>(List.of(10,20,30)); q.removeFirst(); q.addLast(40); System.out.println("Circular queue: "+q+"\\nFront: "+q.peekFirst()+" Rear: "+q.peekLast());', linked_list: 'List<Integer> v=new LinkedList<>(List.of(10,20)); v.addFirst(5); v.add(30); System.out.println("Linked list: "+v+"\\nSearch 20: "+v.indexOf(20));', doubly_linked_list: 'LinkedList<Integer> v=new LinkedList<>(List.of(10,20,30)); v.addFirst(5); System.out.println("Forward: "+v+"\\nBackward: "+new ArrayList<>(v.reversed()));', binary_tree: 'System.out.println("Preorder: 50 30 20 40 70\\nInorder: 20 30 40 50 70\\nPostorder: 20 40 30 70 50");', bst: 'TreeSet<Integer> t=new TreeSet<>(Set.of(50,30,70,20,40)); System.out.println("BST inorder: "+t+"\\nSearch 40: "+t.contains(40)); t.remove(20); System.out.println("After delete: "+t);', heap: 'PriorityQueue<Integer> h=new PriorityQueue<>(List.of(30,10,20)); h.add(5); System.out.println("Min heap extract: "+h.poll()+"\\nHeap: "+h);', graph: 'Map<String,List<String>> g=Map.of("A",List.of("B","C"),"B",List.of("D"),"C",List.of(),"D",List.of()); System.out.println("Edges: "+g+"\\nBFS: A B C D\\nDFS: A B D C");', searching: 'int[] a={10,20,30,40}; for(int i=0;i<a.length;i++){System.out.println("Compare index "+i); if(a[i]==30){System.out.println("Found at "+i);break;}}', sorting: 'int[] a={30,10,20,5}; Arrays.sort(a); System.out.println("Sorted: "+Arrays.toString(a));', hash_table: 'Map<String,Integer> m=new HashMap<>(); m.put("a",10); m.put("f",20); System.out.println("Hash buckets: "+m+"\\nSearch a: "+m.containsKey("a"));', recursion: 'System.out.println("Factorial: "+factorial(4));',
};

function exampleFor(program: ProgramName, language: Language): string {
  if (program === 'array') return arrayPrograms[language];
  if (language === 'python') return pythonPrograms[program];
  if (language === 'c') return `#include <stdio.h>\n#include <stdlib.h>\nint factorial(int n){printf("call factorial %d\\n",n);return n<=1?1:n*factorial(n-1);}\nint main(void){ ${cBodies[program]} return 0; }`;
  if (language === 'cpp') return `#include <bits/stdc++.h>\nusing namespace std;\nint factorial(int n){ std::cout << "call factorial " << n << std::endl; return n<=1?1:n*factorial(n-1); }\nint main(){ ${cppBodies[program]} return 0; }`;
  return `import java.util.*;\npublic class Main {\n  static int factorial(int n){ System.out.println("call factorial "+n); return n<=1?1:n*factorial(n-1); }\n  public static void main(String[] args){ ${javaBodies[program]} }\n}`;
}

export default function ProgramEditor({ api, chapter = 'stack', selectedProgram = 'push', onProgramChange }: Props) {
  const [language, setLanguage] = useState<Language>('python');
  const [program, setProgram] = useState<ProgramName>('stack');
  const [speed, setSpeed] = useState<Speed>('normal');
  const [code, setCode] = useState(examples.python);
  const [programInput, setProgramInput] = useState('');
  const [status, setStatus] = useState('Ready to run your program.');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<{ type: string; message: string; line?: number | null; tool_output?: string } | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const lines = useMemo(() => code.split('\n'), [code]);
  const activeChapter = chapterById(chapter);
  const activeProgram = activeChapter.programs.find(item => item.id === selectedProgram) ?? activeChapter.programs[0];

  useEffect(() => {
    const structure = chapter as ProgramName;
    setProgram(structure);
    setCode(exampleFor(structure, language));
    setProgramInput(structure === 'array' ? arrayInput : '');
    setOutput(''); setError(null); setSteps([]); setCurrentStep(-1); setErrorLine(null);
  }, [chapter, selectedProgram]);

  useEffect(() => {
    if (!playing || !steps.length) return;
    const timer = window.setInterval(() => setCurrentStep(value => {
      if (value >= steps.length - 1) { setPlaying(false); return value; }
      const next = value + 1;
      if (breakpoints.includes(steps[next].line)) { setPlaying(false); setStatus(`Breakpoint hit at line ${steps[next].line}.`); }
      return next;
    }), speedMs[speed]);
    return () => window.clearInterval(timer);
  }, [playing, steps, speed, breakpoints]);

  const changeLanguage = (next: Language) => { setLanguage(next); setCode(exampleFor(program, next)); setProgramInput(program === 'array' ? arrayInput : ''); setOutput(''); setError(null); setSteps([]); setCurrentStep(-1); setStatus(`${next.toUpperCase()} example loaded.`); };
  const copyCode = async () => { await navigator.clipboard.writeText(code); setStatus('Code copied to clipboard.'); };
  const shareEditor = async () => { const url = `${window.location.origin}${window.location.pathname}?editor=1&language=${language}&program=${program}&code=${encodeURIComponent(code)}`; await navigator.clipboard.writeText(url); setStatus('Private code share link copied.'); };
  const run = async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setPlaying(false); setOutput(''); setError(null); setSteps([]); setCurrentStep(-1);
    setErrorLine(null);
    if (!code.trim()) { setError({ type: 'VALIDATION_ERROR', message: 'Program code cannot be empty.' }); return; }
    try {
      setStatus('Validating and preparing program…');
      const result = await axios.post(`${api}/api/program/run`, { language, code, input_data: programInput }, { signal: controllerRef.current.signal });
      if (!result.data.success) { setStatus(result.data.status ?? 'Execution failed'); setError(result.data.error); setErrorLine(result.data.error?.line ?? null); return; }
      setStatus(result.data.visualization_supported ? 'Completed — visualization steps ready.' : 'Completed — output ready.');
      setOutput(result.data.output || '(Program produced no output.)');
      setSteps(result.data.steps ?? []); setCurrentStep(result.data.steps?.length ? 0 : -1); setPlaying(Boolean(result.data.steps?.length));
    } catch (requestError) {
      if (axios.isCancel(requestError)) { setStatus('Stopped'); return; }
      setStatus('Backend unavailable');
      setError({ type: 'CONNECTION_ERROR', message: axios.isAxiosError(requestError) ? 'Could not connect to the program execution backend.' : 'The program could not be submitted.' });
    }
  };
  const stop = () => { controllerRef.current?.abort(); setPlaying(false); setStatus('Stopped'); };
  const reset = () => { controllerRef.current?.abort(); setPlaying(false); setOutput(''); setError(null); setErrorLine(null); setSteps([]); setCurrentStep(-1); setStatus('Ready to run your program.'); };
  const stepOnce = () => { setPlaying(false); setCurrentStep(value => Math.min(value + 1, Math.max(steps.length - 1, 0))); };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') { event.preventDefault(); void run(); }
      else if (event.key === 'F10') { event.preventDefault(); stepOnce(); }
      else if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'r') { event.preventDefault(); reset(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const activeStep = steps[Math.max(currentStep, 0)];
  const visibleSteps = steps.slice(0, Math.max(currentStep + 1, 1));
  const valueFrom = (description: string) => (description.match(/\((-?\d+(?:\.\d+)?)\)/)?.[1] ?? description.replace(/^[^(]+\(/, '').replace(/\)$/, '')) || '—';
  const renderVisualization = () => {
    const structure = activeChapter.id;
    const stepValues = visibleSteps.map(step => valueFrom(step.description)).filter(value => value !== '—');
    const values = stepValues.length ? stepValues.slice(-6) : ['10', '20', '30', '40'];
    const activeValue = activeStep ? valueFrom(activeStep.description) : '—';
    if (!steps.length) return <div className="empty-visual-state"><div className="empty-visual-icon">⌘</div><strong>Visualization canvas ready</strong><p>Run your program to populate live execution state.</p><small>Supported operations become interactive steps.</small></div>;
    if (structure === 'recursion') return <div className="structure-canvas recursion-canvas"><div className="canvas-caption">CALL ↓ · RETURN ↑</div><div className="call-stack-visual">{visibleSteps.map((step, index) => <div className={index === visibleSteps.length - 1 ? 'call-frame active-node' : 'call-frame'} key={step.step}><b>{step.description.replace('FUNCTION_CALL', 'factorial')}</b><small>depth {index + 1} · line {step.line}</small></div>)}</div></div>;
    if (structure === 'graph') return <div className="structure-canvas graph-canvas"><div className="graph-links"><i /><i /><i /><i /></div><div className="graph-nodes">{['A','B','C','D','E','F'].map((node, index) => <span className={index < visibleSteps.length ? 'graph-node visited' : index === visibleSteps.length ? 'graph-node active-node' : 'graph-node'} key={node}>{node}</span>)}</div><div className="canvas-caption">{activeStep?.operation || 'TRAVERSAL'} · visited {Math.min(visibleSteps.length, 6)} nodes</div></div>;
    if (['binary_tree','bst','heap'].includes(structure)) {
      const treeValues = (stepValues.length ? stepValues : ['50','30','70','20','40','60','80']).slice(0, 7);
      while (treeValues.length < 7) treeValues.push(['50','30','70','20','40','60','80'][treeValues.length]);
      return <div className="structure-canvas tree-canvas"><div className="tree-caption"><span>{structure === 'bst' ? 'ORDERED TREE' : structure === 'heap' ? 'HEAP STRUCTURE' : 'BINARY TREE'}</span><b>{activeStep?.operation || 'TRAVERSE'}</b></div><div className="tree-level tree-root"><span className={treeValues[0] === activeValue ? 'tree-node active-node' : 'tree-node'}>{treeValues[0]}</span></div><div className="tree-edges tree-edges-wide" /><div className="tree-level"><span className={treeValues[1] === activeValue ? 'tree-node active-node' : 'tree-node'}>{treeValues[1]}</span><span className={treeValues[2] === activeValue ? 'tree-node active-node' : 'tree-node'}>{treeValues[2]}</span></div><div className="tree-edges tree-edges-wide" /><div className="tree-level tree-leaves">{treeValues.slice(3, 7).map((value, index) => <span className={value === activeValue ? 'tree-node active-node' : index < Math.max(visibleSteps.length - 3, 0) ? 'tree-node visited' : 'tree-node'} key={`${value}-${index}`}>{value}</span>)}</div><div className="canvas-caption">{activeStep?.description || 'Waiting for traversal state'}</div></div>;
    }
    if (structure === 'queue' || structure === 'circular_queue') {
      if (structure === 'circular_queue') return <div className="structure-canvas circular-queue-canvas"><div className="circular-queue-title"><span>FRONT</span><b>{activeStep?.operation || 'READY'}</b><span>REAR</span></div><div className="circular-track">{values.slice(0, 6).map((value, index) => <span className={value === activeValue ? 'circular-node active-node' : index < visibleSteps.length ? 'circular-node visited' : 'circular-node'} key={`${value}-${index}`}><b>{value}</b><small>{index}</small></span>)}<i className="circular-arrow arrow-one">↗</i><i className="circular-arrow arrow-two">↙</i></div><div className="canvas-caption">{activeStep?.description || 'Circular queue state'} · curved links show wrap-around</div></div>;
      return <div className="structure-canvas queue-visual-canvas"><div className="queue-endpoints"><span>FRONT <b>↓</b></span><strong>{activeStep?.operation || 'QUEUE'}</strong><span>REAR <b>↑</b></span></div><div className="queue-track">{values.slice(0, 6).map((value, index) => <span className={value === activeValue ? 'queue-node active-node' : index < visibleSteps.length ? 'queue-node visited' : 'queue-node'} key={`${value}-${index}`}>{value}{index < Math.min(values.length - 1, 5) && <i>→</i>}</span>)}</div><div className="canvas-caption">{activeStep?.description || 'Queue state'} · enqueue enters at rear</div></div>;
    }
    if (structure === 'linked_list' || structure === 'doubly_linked_list') {
      const listValues = values.slice(0, 5);
      if (structure === 'doubly_linked_list') return <div className="structure-canvas doubly-list-canvas"><div className="list-caption"><span>PREV</span><b>VALUE</b><span>NEXT</span></div><div className="doubly-list-track"><em>NULL</em>{listValues.map((value, index) => <div className={value === activeValue ? 'doubly-node active-node' : index < visibleSteps.length ? 'doubly-node visited' : 'doubly-node'} key={`${value}-${index}`}><small>←</small><b>{value}</b><small>→</small></div>)}<em>NULL</em></div><div className="canvas-caption">{activeStep?.description || 'Bidirectional traversal'} · forward and backward links</div></div>;
      return <div className="structure-canvas linked-list-canvas"><div className="list-head">HEAD <b>↓</b></div><div className="linked-list-track">{listValues.map((value, index) => <div className="linked-list-unit" key={`${value}-${index}`}><div className={value === activeValue ? 'linked-node active-node' : index < visibleSteps.length ? 'linked-node visited' : 'linked-node'}><b>{value}</b><small>NEXT</small></div>{index < listValues.length - 1 ? <span className="list-arrow">→</span> : <span className="list-null">→ NULL</span>}</div>)}</div><div className="canvas-caption">{activeStep?.description || 'Linked list traversal'} · next pointers</div></div>;
    }
    if (structure === 'searching') {
      const searchValues = values.slice(0, 7);
      return <div className="structure-canvas searching-canvas"><div className="search-range"><span>LOW <b>0</b></span><span>MID <b>{Math.max(Math.floor(searchValues.length / 2), 0)}</b></span><span>HIGH <b>{Math.max(searchValues.length - 1, 0)}</b></span></div><div className="array-cells">{searchValues.map((value, index) => <span className={value === activeValue ? 'array-cell search-current active-node' : index < visibleSteps.length ? 'array-cell search-visited' : 'array-cell'} key={`${value}-${index}`}>{value}</span>)}</div><div className="canvas-caption">{activeStep?.operation === 'FOUND' ? 'FOUND' : activeStep?.description || 'Checking search range'}</div></div>;
    }
    if (structure === 'sorting') {
      const sortValues = values.map(value => Number(value)).filter(value => Number.isFinite(value));
      const max = Math.max(...sortValues, 1);
      return <div className="structure-canvas sorting-canvas"><div className="sort-metrics"><span>COMPARISONS <b>{visibleSteps.length}</b></span><span>CURRENT <b>{activeValue}</b></span><span>STEP <b>{currentStep + 1}</b></span></div><div className="sort-bars">{sortValues.map((value, index) => <div className={index === sortValues.length - 1 ? 'sort-bar current' : index < visibleSteps.length ? 'sort-bar compared' : 'sort-bar'} key={`${value}-${index}`}><b>{value}</b><i style={{ height: `${Math.max((value / max) * 100, 12)}%` }} /></div>)}</div><div className="canvas-caption">{activeStep?.operation || 'COMPARE'} · cyan compare, purple swap, green sorted</div></div>;
    }
    if (structure === 'hash_table') return <div className="structure-canvas hash-canvas"><div className="hash-title"><span>INDEX</span><b>BUCKET / CHAIN</b></div><div className="hash-buckets">{Array.from({ length: 6 }, (_, index) => <div className={index === (visibleSteps.length - 1) % 6 ? 'hash-bucket active-node' : 'hash-bucket'} key={index}><span>{index}</span><i>→</i><b>{values[index % values.length] ?? '—'}</b>{index % 2 === 1 && <em>→ {values[(index + 1) % values.length] ?? '—'}</em>}</div>)}</div><div className="canvas-caption">{activeStep?.description || 'Bucket inspection'} · chained collisions stay visible</div></div>;
    if (structure === 'array') {
      return <div className="structure-canvas array-canvas"><div className="array-indexes">{values.map((_, index) => <span key={index}>{index}</span>)}</div><div className="array-cells">{values.map((value, index) => <span className={value === activeValue ? 'array-cell active-node' : 'array-cell'} key={`${value}-${index}`}>{value}</span>)}</div><div className="canvas-caption">{activeStep?.operation || 'TRAVERSE'} · active index {Math.max(visibleSteps.length - 1, 0)}</div></div>;
    }
    const nodes = visibleSteps.filter(step => !['POP','DEQUEUE','DELETE'].includes(step.operation)).map(step => valueFrom(step.description));
    const shown = nodes.length ? nodes.slice(-6) : ['10','20','30'];
    return <div className="structure-canvas stack-canvas"><div className="structure-label">TOP ↓</div><div className="structure-nodes">{shown.map((value, index) => <span className={index === shown.length - 1 ? 'structure-node active-node' : 'structure-node'} key={`${value}-${index}`}>{value}</span>)}</div><div className="canvas-caption">{activeStep?.operation || 'INSERT'} · {activeStep?.data_structure || programLabels[structure]}</div></div>;
  };
  return <section className="program-editor-page">
    <div className="playground-hero"><div><p className="eyebrow">AI DATA STRUCTURE LABORATORY</p><h2>Interactive execution workspace</h2><p className="program-subtitle">{activeChapter.label} <span className="breadcrumb-separator">/</span> {activeProgram.name} · {activeProgram.description}</p></div><div className="engine-ready"><i /> ENGINE READY <span>LOCAL RUNTIME</span></div></div>
    <div className="workspace-summary"><div><span>CHAPTER</span><strong>{activeChapter.label}</strong></div><div><span>PROGRAM</span><strong>{activeProgram.name}</strong></div><div><span>LANGUAGE</span><strong>{language.toUpperCase()}</strong></div><div><span>STATUS</span><strong className={playing ? 'status-live' : ''}>{playing ? 'RUNNING' : steps.length ? 'COMPLETE' : 'READY'}</strong></div><div className="program-header-actions"><button title="Select all code" onClick={() => document.querySelector<HTMLTextAreaElement>('.code-input-wrap textarea')?.select()}>Select all</button><button title="Copy code" onClick={() => void copyCode()}>Copy</button><button title="Copy a private code link" onClick={() => void shareEditor()}>Share</button></div></div>
    <div className="editor-controls panel"><label>Language<select value={language} onChange={e => changeLanguage(e.target.value as Language)}><option value="c">C</option><option value="cpp">C++</option><option value="java">Java</option><option value="python">Python</option></select></label><label>Program<select value={selectedProgram} onChange={e => { const next = e.target.value; onProgramChange?.(next); setCode(exampleFor(program, language)); setProgramInput(program === 'array' ? arrayInput : ''); setSteps([]); setCurrentStep(-1); setOutput(''); setError(null); }}><option value={activeProgram.id}>{activeProgram.name}</option>{activeChapter.programs.filter(item => item.id !== activeProgram.id).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Execution speed<select value={speed} onChange={e => setSpeed(e.target.value as Speed)}><option value="very-slow">Very Slow</option><option value="slow">Slow</option><option value="normal">Normal</option><option value="fast">Fast</option><option value="very-fast">Very Fast</option></select></label><label className="program-input-field">Program input<textarea value={programInput} onChange={e => setProgramInput(e.target.value)} aria-label="Program input" placeholder="Optional stdin values" /></label><div className="editor-actions"><button onClick={() => { setCode(exampleFor(program, language)); setProgramInput(program === 'array' ? arrayInput : ''); }}>Load example</button><button onClick={() => { setCode(''); setOutput(''); setError(null); }}>Clear</button><button className="run-program" onClick={() => void run()}>▶ Run Program</button><button onClick={stepOnce} disabled={!steps.length} title="Step (F10)">⏭ Step</button><button onClick={() => setPlaying(false)} disabled={!playing} title="Pause">⏸ Pause</button><button onClick={stop} disabled={!playing} title="Stop">■ Stop</button><button onClick={reset} title="Reset (Ctrl+Shift+R)">↻ Reset</button></div></div>
    <div className="editor-grid"><div className="code-editor panel"><div className="editor-title"><span><b className="file-dot" /> main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language}</span><small>{language.toUpperCase()} · {lines.length} lines · {status}</small></div><div className="code-input-wrap"><div className="line-numbers">{lines.map((_, index) => <button className={errorLine === index + 1 ? 'line-number error-line' : currentStep >= 0 && steps[currentStep]?.line === index + 1 ? 'line-number current-line' : 'line-number'} key={index} onClick={() => setBreakpoints(value => value.includes(index + 1) ? value.filter(line => line !== index + 1) : [...value, index + 1])} aria-label={`Toggle breakpoint on line ${index + 1}`}>{breakpoints.includes(index + 1) ? '●' : index + 1}</button>)}</div><textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} aria-label="Program code editor" /></div></div><div className="program-visual panel"><div className="editor-title"><span><i className="live-indicator" /> LIVE VISUALIZATION</span><small>{steps.length ? `STEP ${Math.max(currentStep + 1, 1)} / ${steps.length}` : 'NO RUN YET'}</small></div><div className="visual-hud"><div><span>STATUS</span><strong className={playing ? 'status-live' : ''}>{playing ? '● RUNNING' : steps.length ? '● COMPLETE' : '● READY'}</strong></div><div><span>CURRENT OPERATION</span><strong>{activeStep?.description || '—'}</strong></div><div><span>LINE</span><strong>{activeStep?.line ? `Line ${activeStep.line}` : '—'}</strong></div></div>{renderVisualization()}</div></div>
    <div className="debugger-shell panel"><div className="debugger-tabs"><span className="active">CALL STACK</span><span>VARIABLES</span><span>MEMORY</span><span>BREAKPOINTS <b>{breakpoints.length}</b></span><span className="debugger-runtime">RUNTIME INSPECTOR</span></div><div className="debugger-grid"><div><strong>runtime</strong><p>Detailed call-stack tracking is unavailable for this execution.</p></div><div><strong>verified state</strong><p>{steps.length ? `${steps.length} visualization event${steps.length === 1 ? '' : 's'} captured.` : 'No execution state available yet.'}</p></div><div><strong>breakpoints</strong><p>{breakpoints.length ? `${breakpoints.length} active line${breakpoints.length === 1 ? '' : 's'}.` : 'Click a line number to add one.'}</p></div></div></div>
    <div className="timeline-panel panel"><div className="editor-title"><span>EXECUTION TIMELINE <small className="timeline-count">{steps.length ? `${Math.max(currentStep + 1, 1)} / ${steps.length}` : '0 / 0'}</small></span><div className="timeline-actions"><button onClick={() => setCurrentStep(value => Math.max(value - 1, 0))} disabled={!steps.length}>◀ Previous</button><button onClick={() => setPlaying(true)} disabled={!steps.length}>▶ Run</button><button onClick={() => setPlaying(false)} disabled={!steps.length}>⏸ Pause</button><button onClick={() => { setPlaying(false); setCurrentStep(-1); }} disabled={!steps.length}>⏹ Reset</button></div></div><div className="timeline-progress"><i style={{ width: `${steps.length ? Math.max(((currentStep + 1) / steps.length) * 100, 0) : 0}%` }} /></div><div className="timeline-list">{steps.length ? steps.map((step, index) => <button className={index === currentStep ? 'timeline-step current' : index < currentStep ? 'timeline-step complete' : 'timeline-step'} key={step.step} onClick={() => { setPlaying(false); setCurrentStep(index); }}> <b>{index < currentStep ? '✓' : index === currentStep ? '▶' : '○'}</b> Step {step.step} · {step.description} <small>line {step.line}</small></button>) : <p className="empty-editor-state">Run the program to create an inspectable execution timeline.</p>}</div></div>
    <div className="output-panel panel"><div className="editor-title"><span>CONSOLE <small className="console-connected">● CONNECTED</small></span><div><button className="console-clear" onClick={() => { setOutput(''); setError(null); }}>Clear console</button><small>{language.toUpperCase()}</small></div></div>{error ? <div className="program-error"><strong>❌ {error.type}</strong><p>{error.message}</p>{error.line && <small>Line: {error.line}</small>}{error.tool_output && <pre>{error.tool_output}</pre>}</div> : <pre className="program-output">{output ? `$ program started\n\n${output}` : '$ Waiting for execution…\n\nRun a program to stream output and errors here.'}</pre>}</div>
  </section>;
}
