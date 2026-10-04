from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()


class ChallengeRequest(BaseModel):
    topic: str = Field(default="stack", max_length=80)
    difficulty: str = Field(default="easy", max_length=20)


@router.post("/")
async def generate_challenge(request: ChallengeRequest):
    topic = request.topic.lower()
    if "queue" in topic:
        question = "Which principle does a queue follow?"
        options = ["LIFO", "FIFO", "Random access", "Divide and conquer"]
        answer = 1
        explanation = "A queue removes elements in the same order they were added: First In, First Out."
    elif "bst" in topic:
        question = "What is the average search complexity in a balanced BST?"
        options = ["O(1)", "O(log n)", "O(n²)", "O(2ⁿ)"]
        answer = 1
        explanation = "Each comparison eliminates roughly half the remaining tree when the tree is balanced."
    else:
        question = "What is the complexity of stack push?"
        options = ["O(1)", "O(log n)", "O(n)", "O(n²)"]
        answer = 0
        explanation = "Push appends one item at the top without scanning the stack."
    return {"success": True, "challenge": {"topic": request.topic, "difficulty": request.difficulty, "question": question, "options": options, "correct_index": answer, "explanation": explanation, "complexity": "O(1)"}}
