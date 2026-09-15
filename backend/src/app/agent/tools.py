import asyncio
from typing import Any

from langchain_core.tools import tool

@tool
async def get_weather(city: str) -> dict[str, Any]:
  """Return the current weather for a city.

  Use this tool whenever the user asks about the weather, temperature
  or conditions in any location.

  Args:
      city: The city name, e.g. "São Paulo".
  """
  
  await asyncio.sleep(2)
  return {
      "city": city,
      "temp_c": 22,
      "condition": "parcialmente nublado",
  }