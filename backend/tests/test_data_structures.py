from app.data_structures.stack import Stack
from app.data_structures.queue import Queue
from app.data_structures.linked_list import LinkedList
from app.data_structures.bst import BST
from app.data_structures.heap import Heap
from app.data_structures.graph import Graph

def test_stack():
    s = Stack()
    assert s.is_empty() == True
    s.push(10)
    s.push(20)
    assert s.size() == 2
    assert s.peek() == 20
    assert s.pop() == 20
    assert s.size() == 1
    assert s.pop() == 10
    assert s.pop() == None

def test_queue():
    q = Queue()
    assert q.is_empty() == True
    q.enqueue(1)
    q.enqueue(2)
    assert q.size() == 2
    assert q.front() == 1
    assert q.dequeue() == 1
    assert q.size() == 1

def test_linked_list():
    ll = LinkedList()
    ll.insert_end(10)
    ll.insert_end(20)
    ll.insert_beginning(5)
    assert ll.to_list() == [5, 10, 20]
    ll.delete(10)
    assert ll.to_list() == [5, 20]

def test_bst():
    tree = BST()
    tree.insert(50)
    tree.insert(30)
    tree.insert(70)
    assert tree.search(30) == True
    assert tree.search(100) == False
    assert tree.inorder() == [30, 50, 70]
    tree.delete(30)
    assert tree.inorder() == [50, 70]

def test_heap():
    h = Heap()
    h.insert(10)
    h.insert(5)
    h.insert(20)
    assert h.extract() == 5
    assert h.extract() == 10

def test_graph():
    g = Graph()
    g.add_edge("A", "B")
    g.add_edge("A", "C")
    assert "B" in g.neighbors("A")
    assert "C" in g.neighbors("A")
    g.remove_edge("A", "B")
    assert "B" not in g.neighbors("A")
