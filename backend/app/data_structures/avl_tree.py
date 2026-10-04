from __future__ import annotations

from typing import Optional


class AVLNode:
    def __init__(self, key: int): self.key = key; self.height = 1; self.left: Optional[AVLNode] = None; self.right: Optional[AVLNode] = None


class AVLTree:
    def __init__(self): self.root: Optional[AVLNode] = None
    def _height(self, node: Optional[AVLNode]) -> int: return node.height if node else 0
    def _update(self, node: AVLNode) -> None: node.height = 1 + max(self._height(node.left), self._height(node.right))
    def _rotate_right(self, node: AVLNode) -> AVLNode:
        child = node.left; assert child is not None; node.left = child.right; child.right = node; self._update(node); self._update(child); return child
    def _rotate_left(self, node: AVLNode) -> AVLNode:
        child = node.right; assert child is not None; node.right = child.left; child.left = node; self._update(node); self._update(child); return child
    def _insert(self, node: Optional[AVLNode], key: int) -> AVLNode:
        if not node: return AVLNode(key)
        if key < node.key: node.left = self._insert(node.left, key)
        elif key > node.key: node.right = self._insert(node.right, key)
        else: return node
        self._update(node); balance = self._height(node.left) - self._height(node.right)
        if balance > 1 and node.left and key < node.left.key: return self._rotate_right(node)
        if balance < -1 and node.right and key > node.right.key: return self._rotate_left(node)
        if balance > 1 and node.left: node.left = self._rotate_left(node.left); return self._rotate_right(node)
        if balance < -1 and node.right: node.right = self._rotate_right(node.right); return self._rotate_left(node)
        return node
    def insert(self, key: int) -> None: self.root = self._insert(self.root, key)
    def inorder(self) -> list[int]:
        result: list[int] = []
        def walk(node: Optional[AVLNode]) -> None:
            if node: walk(node.left); result.append(node.key); walk(node.right)
        walk(self.root); return result
