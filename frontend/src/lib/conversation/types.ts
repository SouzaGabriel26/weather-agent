/** UI model. Does not mirror the backend — the wire format lives in `@/lib/stream/events`. */

import type { StreamEvent, ToolCall } from "@/lib/stream/events";

// Parts of an assistant turn (AC-07)

export interface TextPart {
  kind: "text";
  runId: string;
  content: string;
  status: "streaming" | "done";
}

export interface ToolCallPart {
  kind: "tool_call";
  runId: string;
  call: ToolCall;
}

export interface ToolResultPart {
  kind: "tool_result";
  runId: string;
  name: string;
  input: Record<string, unknown>;
  output: string | null;
  status: "running" | "done" | "error";
}

export type AssistantPart = TextPart | ToolCallPart | ToolResultPart;

// Conversation turns

export interface UserTurn {
  id: string;
  role: "user";
  content: string;
}

export interface AssistantTurn {
  id: string;
  role: "assistant";
  parts: AssistantPart[];
}

export type Turn = UserTurn | AssistantTurn;

// State and actions

export interface ConversationState {
  turns: Turn[];
  status: "idle" | "streaming" | "error";
  error: string | null;
}

export type ConversationAction =
  | { type: "submit"; id: string; content: string }
  | { type: "event"; event: StreamEvent }
  | { type: "done" }
  | { type: "fail"; error: string }
  | { type: "reset" };
