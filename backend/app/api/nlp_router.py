from fastapi import APIRouter

from app.ai.parser import parse_natural_language
from app.ai.schemas import ParseRequest
from app.ai.validator import validate_operations

router = APIRouter()


@router.post("/parse")
async def parse_command(request: ParseRequest):
    return validate_operations(parse_natural_language(request.command))
