import json
from collections.abc import AsyncIterator
from typing import Any

def _default(obj: Any) -> Any:
  if hasattr(obj, "model_dump"):
    return obj.model_dump()
  return str(obj)

def format_sse(event: dict[str, Any]) -> str:
  payload = json.dumps(event, default=_default, ensure_ascii=False)
  return f"event: {event['event']}\ndata: {payload}\n\n"

async def sse_stream(events: AsyncIterator[dict[str, Any]]) -> AsyncIterator[str]:
  async for event in events:
    yield format_sse(event)