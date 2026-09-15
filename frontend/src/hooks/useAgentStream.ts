"use client";

/** Wires the event generator to the conversation reducer; exposes send/stop/reset. */

import { useCallback, useReducer, useRef } from "react";

import { executeAgent } from "@/lib/stream/client";
import { conversationReducer, initialConversation } from "@/lib/conversation/reducer";

export function useAgentStream() {
  const [state, dispatch] = useReducer(
    conversationReducer,
    initialConversation,
  );
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (content: string) => {
    const text = content.trim();
    if (!text || abortRef.current) return;

    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "submit", id: crypto.randomUUID(), content: text });

    try {
      for await (const event of executeAgent(text, controller.signal)) {
        dispatch({ type: "event", event });
      }
      dispatch({ type: "done" });
    } catch (error) {
      // Abort is a user decision, not an error: close the partial turn.
      if (controller.signal.aborted) {
        dispatch({ type: "done" });
      } else {
        const message = error instanceof Error ? error.message : String(error);
        dispatch({ type: "fail", error: message });
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    stop();
    dispatch({ type: "reset" });
  }, [stop]);

  return {
    turns: state.turns,
    status: state.status,
    error: state.error,
    isStreaming: state.status === "streaming",
    send,
    stop,
    reset,
  };
}
