/** HTTP client for the agent: POST /agent/execute -> generator of validated StreamEvents. */

import { toStreamEvent, type StreamEvent } from "./events";
import { readSse } from "./sse";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function* executeAgent(
  message: string,
  signal?: AbortSignal,
): AsyncGenerator<StreamEvent> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const response = await fetch(`${API_URL}/agent/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Agent request failed: ${response.status} ${response.statusText}`,
    );
  }

  for await (const sse of readSse(response)) {
    yield toStreamEvent(JSON.parse(sse.data));
  }
}
