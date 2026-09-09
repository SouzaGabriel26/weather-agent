from collections.abc import AsyncIterator
from typing import Any

from langchain_core.messages import HumanMessage

from app.agent.graph import build_graph

_graph = build_graph()


async def execute(message: str) -> AsyncIterator[dict[str, Any]]:
    """Roda o grafo e emite os eventos do stream."""
    async for event in _graph.astream_events(
        {"messages": HumanMessage(message)},
        version="v2",
        include_types=["chat_model", "tool"],
    ):
        yield event
