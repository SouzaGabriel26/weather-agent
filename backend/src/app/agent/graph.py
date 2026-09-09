from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

from app.agent.tools import get_weather
from app.settings import settings

TOOLS = [get_weather]

SYSTEM_PROMPT = (
    "Você é um assistente de clima. "
    "Quando o usuário perguntar sobre o tempo em algum lugar, "
    "use a ferramenta get_weather e responda em português, "
    "em uma frase curta, citando a temperatura e a condição."
)

def build_graph():
  llm = ChatOpenAI(
    model=settings.openai_model,
    api_key=settings.openai_api_key,
    temperature=0,
  ).bind_tools(TOOLS)

  async def call_model(state: MessagesState) -> dict:
    messages = [SystemMessage(SYSTEM_PROMPT), *state["messages"]]
    response = await llm.ainvoke(messages)
    return {"messages": [response]}

  def should_continue(state: MessagesState) -> str:
    last = state["messages"][-1]
    if last.tool_calls:
      return "tools"
    return END

  builder = StateGraph(MessagesState)
  builder.add_node("model", call_model)
  builder.add_node("tools", ToolNode(TOOLS))

  builder.add_edge(START, "model")
  builder.add_conditional_edges("model", should_continue, ["tools", END])
  builder.add_edge("tools", "model")

  return builder.compile()