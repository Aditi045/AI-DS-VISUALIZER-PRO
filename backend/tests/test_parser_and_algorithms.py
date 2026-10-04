from app.ai.parser import parse_local
from app.ai.validator import validate_operations
from app.algorithms.searching import binary_search
from app.algorithms.sorting import merge_sort


def test_stack_demo_command_is_structured():
    parsed = parse_local("Create a stack and push 10, 20 and 30.")
    assert parsed.data_structure == "stack"
    assert [op.type for op in parsed.operations] == ["clear", "push", "push", "push"]
    assert [op.value for op in parsed.operations[1:]] == [10, 20, 30]


def test_invalid_operation_is_rejected():
    result = validate_operations({"data_structure": "stack", "operations": [{"type": "enqueue", "value": 1}]})
    assert result["success"] is False


def test_algorithms_return_steps_and_metadata():
    assert binary_search([1, 3, 5], 5)["result"] == 2
    result = merge_sort([3, 1, 2])
    assert result["result"] == [1, 2, 3]
    assert result["steps"]
    assert result["time_complexity"] == "O(n log n)"
