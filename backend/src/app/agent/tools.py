import asyncio
from typing import Any

from langchain_core.tools import tool

@tool
async def get_weather(city: str) -> dict[str, Any]:
  """Retorna o clima atual de uma cidade.

    Use esta ferramenta sempre que o usuário perguntar sobre clima,
    tempo, temperatura ou condições meteorológicas de algum lugar.

    Args:
        city: O nome da cidade, por exemplo "São Paulo".
    """
  
  await asyncio.sleep(2)
  return {
      "city": city,
      "temp_c": 22,
      "condition": "parcialmente nublado",
  }