export interface SseMessage {
  event: string;
  data: string;
}

export async function* readSse(
  response: Response,
): AsyncGenerator<SseMessage> {
  if (!response.body) {
    throw new Error("Response has no body to read");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let separator = buffer.indexOf("\n\n");
      while (separator !== -1) {
        const block = buffer.slice(0, separator);
        buffer = buffer.slice(separator + 2);

        const message = parseBlock(block);
        if (message) yield message;

        separator = buffer.indexOf("\n\n");
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function parseBlock(block: string): SseMessage | null {
  let event = "message";
  const data: string[] = [];

  for (const line of block.split("\n")) {
    if (line.startsWith(":")) continue;

    if (line.startsWith("event:")) {
      event = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      data.push(line.slice("data:".length).trimStart());
    }
  }

  if (data.length === 0) return null;
  return { event, data: data.join("\n") };
}
