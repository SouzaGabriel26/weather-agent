import type { StreamEvent, ToolCall } from "./events";

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

export const initialConversation: ConversationState = {
  turns: [],
  status: "idle",
  error: null,
};

export function conversationReducer(
  state: ConversationState,
  action: ConversationAction,
): ConversationState {
  switch (action.type) {
    case "submit":
      return {
        turns: [
          ...state.turns,
          { id: action.id, role: "user", content: action.content },
          { id: `${action.id}:assistant`, role: "assistant", parts: [] },
        ],
        status: "streaming",
        error: null,
      };

    case "event":
      return updateLastAssistant(state, (turn) =>
        applyEvent(turn, action.event),
      );

    case "done":
      return { ...state, status: "idle" };

    case "fail":
      return { ...state, status: "error", error: action.error };

    case "reset":
      return initialConversation;
  }
}

function updateLastAssistant(
  state: ConversationState,
  update: (turn: AssistantTurn) => AssistantTurn,
): ConversationState {
  const index = state.turns.length - 1;
  const last = state.turns[index];
  if (!last || last.role !== "assistant") return state;

  const turns = state.turns.slice();
  turns[index] = update(last);
  return { ...state, turns };
}

function applyEvent(turn: AssistantTurn, event: StreamEvent): AssistantTurn {
  switch (event.event) {
    case "on_chat_model_start":
      return withParts(turn, [
        ...turn.parts,
        { kind: "text", runId: event.run_id, content: "", status: "streaming" },
      ]);

    case "on_chat_model_stream":
      return withParts(
        turn,
        turn.parts.map((part) =>
          part.kind === "text" && part.runId === event.run_id
            ? { ...part, content: part.content + event.data.chunk.content }
            : part,
        ),
      );

    case "on_chat_model_end": {
      const { content, tool_calls } = event.data.output;
      return withParts(
        turn,
        turn.parts.flatMap((part) => {
          if (part.kind !== "text" || part.runId !== event.run_id) {
            return [part];
          }

          const finished: AssistantPart[] = content
            ? [{ ...part, content, status: "done" }]
            : [];
          const calls: AssistantPart[] = tool_calls.map((call) => ({
            kind: "tool_call",
            runId: event.run_id,
            call,
          }));
          return [...finished, ...calls];
        }),
      );
    }

    case "on_tool_start":
      return withParts(turn, [
        ...turn.parts,
        {
          kind: "tool_result",
          runId: event.run_id,
          name: event.name,
          input: event.data.input,
          output: null,
          status: "running",
        },
      ]);

    case "on_tool_end":
      return withParts(
        turn,
        turn.parts.map((part) =>
          part.kind === "tool_result" && part.runId === event.run_id
            ? {
                ...part,
                output: event.data.output.content,
                status:
                  event.data.output.status === "success" ? "done" : "error",
              }
            : part,
        ),
      );

    default: {
      const unreachable: never = event;
      throw new Error(
        `Unhandled stream event: ${JSON.stringify(unreachable)}`,
      );
    }
  }
}

function withParts(
  turn: AssistantTurn,
  parts: AssistantPart[],
): AssistantTurn {
  return { ...turn, parts };
}
