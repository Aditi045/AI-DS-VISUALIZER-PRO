from typing import Any, Optional, List, Dict

class TreeNode:
    def __init__(self, key: Any):
        self.key = key
        self.left: Optional['TreeNode'] = None
        self.right: Optional['TreeNode'] = None

class BST:
    def __init__(self):
        self.root: Optional[TreeNode] = None

    def insert(self, key: Any) -> None:
        if self.root is None:
            self.root = TreeNode(key)
        else:
            self._insert_recursive(self.root, key)

    def _insert_recursive(self, node: TreeNode, key: Any) -> None:
        if key < node.key:
            if node.left is None:
                node.left = TreeNode(key)
            else:
                self._insert_recursive(node.left, key)
        elif key > node.key:
            if node.right is None:
                node.right = TreeNode(key)
            else:
                self._insert_recursive(node.right, key)

    def search(self, key: Any) -> bool:
        return self._search_recursive(self.root, key)

    def _search_recursive(self, node: Optional[TreeNode], key: Any) -> bool:
        if node is None:
            return False
        if node.key == key:
            return True
        if key < node.key:
            return self._search_recursive(node.left, key)
        return self._search_recursive(node.right, key)

    def delete(self, key: Any) -> None:
        self.root = self._delete_recursive(self.root, key)

    def _delete_recursive(self, node: Optional[TreeNode], key: Any) -> Optional[TreeNode]:
        if node is None:
            return node

        if key < node.key:
            node.left = self._delete_recursive(node.left, key)
        elif key > node.key:
            node.right = self._delete_recursive(node.right, key)
        else:
            if node.left is None:
                return node.right
            elif node.right is None:
                return node.left

            # Node with two children: Get the inorder successor (smallest in the right subtree)
            temp = self._min_value_node(node.right)
            node.key = temp.key
            node.right = self._delete_recursive(node.right, temp.key)

        return node

    def _min_value_node(self, node: TreeNode) -> TreeNode:
        current = node
        while current.left is not None:
            current = current.left
        return current

    def inorder(self) -> List[Any]:
        result = []
        self._inorder_recursive(self.root, result)
        return result

    def _inorder_recursive(self, node: Optional[TreeNode], result: List[Any]) -> None:
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.key)
            self._inorder_recursive(node.right, result)
            
    def preorder(self) -> List[Any]:
        result = []
        self._preorder_recursive(self.root, result)
        return result

    def _preorder_recursive(self, node: Optional[TreeNode], result: List[Any]) -> None:
        if node:
            result.append(node.key)
            self._preorder_recursive(node.left, result)
            self._preorder_recursive(node.right, result)

    def postorder(self) -> List[Any]:
        result = []
        self._postorder_recursive(self.root, result)
        return result

    def _postorder_recursive(self, node: Optional[TreeNode], result: List[Any]) -> None:
        if node:
            self._postorder_recursive(node.left, result)
            self._postorder_recursive(node.right, result)
            result.append(node.key)

    def to_dict(self) -> Optional[Dict]:
        if not self.root:
            return None
        return self._node_to_dict(self.root)
        
    def _node_to_dict(self, node: Optional[TreeNode]) -> Optional[Dict]:
        if not node:
            return None
        return {
            "key": node.key,
            "left": self._node_to_dict(node.left),
            "right": self._node_to_dict(node.right)
        }
