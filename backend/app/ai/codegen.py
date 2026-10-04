"""Generate educational source code for the selected execution language."""
from __future__ import annotations

from typing import Any

from app.ai.schemas import LanguageName, Operation


def _value(value: Any, language: LanguageName) -> str:
    if isinstance(value, str):
        escaped = value.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{escaped}"'
    if value is None:
        return "NULL" if language in {"c", "cpp"} else ("null" if language == "java" else "None")
    return repr(value) if language == "python" else str(value)


def generate_source(language: LanguageName, data_structure: str, operations: list[Operation]) -> str:
    values = [_value(op.value, language) for op in operations if op.value is not None]
    if language == "python":
        lines = ["# AI-DS Visualizer Pro", "from collections import deque", "", f"{data_structure} = []"]
        for op in operations:
            if op.type in {"clear"}: lines.append(f"{data_structure}.clear()")
            elif op.type in {"push", "insert", "insert_end", "insert_beginning", "enqueue"}: lines.append(f"{data_structure}.append({_value(op.value, language)})")
            elif op.type in {"pop", "dequeue", "extract"}: lines.append(f"{data_structure}.pop(0)" if data_structure == "queue" else f"{data_structure}.pop()")
            elif op.type in {"peek", "front"}: lines.append(f"print({data_structure}[0] if {data_structure} else None)")
        return "\n".join(lines)

    if language == "c":
        lines = ["#include <stdio.h>", "#define CAPACITY 100", "int main(void) {", "    int data[CAPACITY];", "    int size = 0;"]
        for op in operations:
            if op.type in {"clear"}: lines.append("    size = 0;")
            elif op.type in {"push", "insert", "insert_end", "enqueue"}: lines.append(f"    data[size++] = {_value(op.value, language)};")
            elif op.type in {"pop", "dequeue", "extract"}: lines.append("    if (size > 0) size--;")
            elif op.type in {"peek", "front"}: lines.append("    if (size > 0) printf(\"%d\\n\", data[0]);")
        lines.extend(["    return 0;", "}"])
        return "\n".join(lines)

    if language == "cpp":
        lines = ["#include <iostream>", "#include <vector>", "using namespace std;", "int main() {", "    vector<int> data;"]
        for op in operations:
            if op.type == "clear": lines.append("    data.clear();")
            elif op.type in {"push", "insert", "insert_end", "enqueue"}: lines.append(f"    data.push_back({_value(op.value, language)});")
            elif op.type in {"pop", "dequeue", "extract"}: lines.append("    if (!data.empty()) data.pop_back();")
            elif op.type in {"peek", "front"}: lines.append("    if (!data.empty()) cout << data.front() << endl;")
        lines.extend(["    return 0;", "}"])
        return "\n".join(lines)

    lines = ["import java.util.*;", "public class Main {", "  public static void main(String[] args) {", "    ArrayList<Integer> data = new ArrayList<>();"]
    for op in operations:
        if op.type == "clear": lines.append("    data.clear();")
        elif op.type in {"push", "insert", "insert_end", "enqueue"}: lines.append(f"    data.add({_value(op.value, language)});")
        elif op.type in {"pop", "dequeue", "extract"}: lines.append("    if (!data.isEmpty()) data.remove(data.size() - 1);")
        elif op.type in {"peek", "front"}: lines.append("    if (!data.isEmpty()) System.out.println(data.get(0));")
    lines.extend(["  }", "}"])
    return "\n".join(lines)
