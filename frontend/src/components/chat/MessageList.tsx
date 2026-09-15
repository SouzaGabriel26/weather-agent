"use client";

import { useEffect, useRef } from "react";

import type { Turn } from "@/lib/conversation/types";

import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";

const SUGGESTIONS = [
  "Qual o clima em São Paulo?",
  "Como está o tempo no Rio de Janeiro hoje?",
  "Oi, tudo bem?",
];

export function MessageList({
  turns,
  isStreaming,
  onSuggestion,
}: {
  turns: Turn[];
  isStreaming: boolean;
  onSuggestion: (text: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [turns]);

  if (turns.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <div>
          <h2 className="font-display text-4xl text-ink-100">
            Pergunte sobre o <em className="text-brass-400">clima</em>.
          </h2>
          <p className="mt-3 max-w-md text-[15px] text-ink-300">
            O agent decide se chama a ferramenta, executa, e responde — cada
            passo aparece aqui conforme chega pelo stream.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => onSuggestion(text)}
              className="rounded-full border border-ink-700 px-4 py-1.5 text-[13px] text-ink-300 transition hover:border-brass-500 hover:text-brass-300"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div role="log" aria-busy={isStreaming} className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-6 py-10">
        {turns.map((turn) =>
          turn.role === "user" ? (
            <UserMessage key={turn.id} turn={turn} />
          ) : (
            <AssistantMessage
              key={turn.id}
              turn={turn}
              isStreaming={isStreaming}
            />
          ),
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
