from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.agent.runner import execute
from app.api.schemas import ExecuteRequest
from app.api.sse import sse_stream

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/execute")
async def execute_agent(body: ExecuteRequest) -> StreamingResponse:
  return StreamingResponse(
    sse_stream(execute(body.message)),
    media_type="text/event-stream",
    headers={
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    }
  )