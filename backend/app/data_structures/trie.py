class TrieNode:
    def __init__(self): self.children: dict[str, TrieNode] = {}; self.terminal = False


class Trie:
    def __init__(self): self.root = TrieNode()
    def insert(self, word: str) -> None:
        node = self.root
        for char in word: node = node.children.setdefault(char, TrieNode())
        node.terminal = True
    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children: return False
            node = node.children[char]
        return node.terminal
    def prefix_search(self, prefix: str) -> list[str]:
        node = self.root
        for char in prefix:
            if char not in node.children: return []
            node = node.children[char]
        result: list[str] = []
        def walk(current: TrieNode, suffix: str) -> None:
            if current.terminal: result.append(prefix + suffix)
            for char, child in current.children.items(): walk(child, suffix + char)
        walk(node, ""); return result
