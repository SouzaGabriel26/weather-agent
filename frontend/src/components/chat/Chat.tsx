"use client";

import { useAgentStream } from "@/hooks/useAgentStream";

import { Composer } from "./Composer";
import { MessageList } from "./MessageList";

export function Chat() {
  const { turns, status, error, isStreaming, send, stop, reset } =
    useAgentStream();

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-ink-800 px-6 py-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-2xl italic text-ink-100">
            Weather Agent
          </h1>
          <span className="hidden font-mono text-[11px] tracking-wider text-ink-400 sm:inline">
            langgraph · astream_events v2 · sse
          </span>
        </div>
        <div className="flex items-center gap-4">
          <StatusPill status={status} />
          {turns.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="font-mono text-[12px] text-ink-400 transition hover:text-ink-100"
            >
              limpar
            </button>
          )}
        </div>
      </header>

      <MessageList turns={turns} isStreaming={isStreaming} onSuggestion={send} />

      {error && (
        <div className="border-t border-rust-400/30 bg-rust-400/10 px-6 py-2.5 text-center font-mono text-[12.5px] text-rust-400">
          {error}
        </div>
      )}

      <Composer isStreaming={isStreaming} onSend={send} onStop={stop} />
    </div>
  );
}

function StatusPill({ status }: { status: "idle" | "streaming" | "error" }) {
  const label = { idle: "pronto", streaming: "streaming", error: "erro" }[status];
  const dot = {
    idle: "bg-ink-600",
    streaming: "bg-brass-400 animate-breathe",
    error: "bg-rust-400",
  }[status];

  return (
    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
