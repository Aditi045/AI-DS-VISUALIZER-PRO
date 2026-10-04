from typing import Any, Optional, List

class Node:
    def __init__(self, data: Any):
        self.data = data
        self.next: Optional['Node'] = None

class LinkedList:
    def __init__(self):
        self.head: Optional[Node] = None

    def insert_beginning(self, data: Any) -> None:
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def insert_end(self, data: Any) -> None:
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node

    def insert_at(self, data: Any, position: int) -> None:
        if position == 0:
            self.insert_beginning(data)
            return
            
        new_node = Node(data)
        current = self.head
        for _ in range(position - 1):
            if current is None:
                raise IndexError("Position out of bounds")
            current = current.next
            
        if current is None:
            raise IndexError("Position out of bounds")
            
        new_node.next = current.next
        current.next = new_node

    def delete(self, data: Any) -> bool:
        if not self.head:
            return False
            
        if self.head.data == data:
            self.head = self.head.next
            return True
            
        current = self.head
        while current.next and current.next.data != data:
            current = current.next
            
        if current.next:
            current.next = current.next.next
            return True
            
        return False

    def search(self, data: Any) -> bool:
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False

    def reverse(self) -> None:
        prev = None
        current = self.head
        while current:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        self.head = prev

    def to_list(self) -> List[Any]:
        result = []
        current = self.head
        while current:
            result.append(current.data)
            current = current.next
        return result
