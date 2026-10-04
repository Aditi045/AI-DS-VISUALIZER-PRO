from typing import Dict, Any
from app.data_structures.stack import Stack
from app.data_structures.queue import Queue
from app.data_structures.linked_list import LinkedList
from app.data_structures.bst import BST
from app.data_structures.heap import Heap
from app.data_structures.graph import Graph

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        
    def get_session(self, session_id: str) -> Dict[str, Any]:
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "stack": Stack(),
                "queue": Queue(),
                "linked_list": LinkedList(),
                "doubly_linked_list": LinkedList(),
                "bst": BST(),
                "heap": Heap(),
                "graph": Graph()
            }
        return self.sessions[session_id]
        
    def clear_session(self, session_id: str, ds_name: str = None):
        if session_id in self.sessions:
            if ds_name and ds_name in self.sessions[session_id]:
                # Reset specific DS
                if ds_name == "stack": self.sessions[session_id]["stack"] = Stack()
                elif ds_name == "queue": self.sessions[session_id]["queue"] = Queue()
                elif ds_name == "linked_list": self.sessions[session_id]["linked_list"] = LinkedList()
                elif ds_name == "doubly_linked_list": self.sessions[session_id]["doubly_linked_list"] = LinkedList()
                elif ds_name == "bst": self.sessions[session_id]["bst"] = BST()
                elif ds_name == "heap": self.sessions[session_id]["heap"] = Heap()
                elif ds_name == "graph": self.sessions[session_id]["graph"] = Graph()
            else:
                del self.sessions[session_id]

session_manager = SessionManager()
