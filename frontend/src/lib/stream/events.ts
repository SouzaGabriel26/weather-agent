/** Formato do fio: o StreamEvent como o backend serializa. Só os campos lidos pelo front. */

// Mensagens LangChain (dentro de `data`)

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  id: string | null;
  type: "tool_call";
}

export interface AIMessageChunk {
  type: "AIMessageChunk";
  content: string;
  tool_calls: ToolCall[];
}

export interface AIMessage {
  type: "ai";
  content: string;
  tool_calls: ToolCall[];
}

export interface ToolMessage {
  type: "tool";
  name: string;
  content: string;
  tool_call_id: string;
  status: "success" | "error";
}

// Envelope do StreamEvent (astream_events v2)

interface BaseEvent {
  name: string;
  run_id: string;
  tags: string[];
  metadata: Record<string, unknown>;
  parent_ids: string[];
}

export type StreamEvent = BaseEvent &
  (
    | { event: "on_chat_model_start"; data: { input: unknown } }
    | { event: "on_chat_model_stream"; data: { chunk: AIMessageChunk } }
    | { event: "on_chat_model_end"; data: { output: AIMessage } }
    | { event: "on_tool_start"; data: { input: Record<string, unknown> } }
    | {
        event: "on_tool_end";
        data: { output: ToolMessage; input: Record<string, unknown> };
      }
  );

export type StreamEventType = StreamEvent["event"];

const KNOWN_EVENTS: ReadonlySet<string> = new Set<StreamEventType>([
  "on_chat_model_start",
  "on_chat_model_stream",
  "on_chat_model_end",
  "on_tool_start",
  "on_tool_end",
]);

// Fronteira: JSON desconhecido -> StreamEvent tipado (AC-06)

export class UnknownStreamEventError extends Error {
  constructor(public readonly eventType: string) {
    super(`Unknown stream event type: "${eventType}"`);
    this.name = "UnknownStreamEventError";
  }
}

export function toStreamEvent(raw: unknown): StreamEvent {
  if (typeof raw !== "object" || raw === null || !("event" in raw)) {
    throw new Error("Malformed stream event: missing `event` field");
  }

  const eventType = (raw as { event: unknown }).event;
  if (typeof eventType !== "string" || !KNOWN_EVENTS.has(eventType)) {
    throw new UnknownStreamEventError(String(eventType));
  }

  return raw as StreamEvent;
}
