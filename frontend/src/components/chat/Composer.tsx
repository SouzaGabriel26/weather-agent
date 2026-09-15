"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";

export function Composer({
  isStreaming,
  onSend,
  onStop,
}: {
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const [value, setValue] = useState("");
  const canSend = value.trim().length > 0 && !isStreaming;

  function submit() {
    if (!canSend) return;
    onSend(value);
    setValue("");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-ink-800 bg-ink-950/80 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-2xl items-end gap-3 px-6 py-4">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Pergunte sobre o clima de uma cidade…"
          className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-[15px] leading-relaxed text-ink-100 placeholder:text-ink-400 focus:border-brass-500 focus:outline-none"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="h-[44px] rounded-xl border border-ink-600 px-4 font-mono text-[13px] text-ink-300 transition hover:border-rust-400 hover:text-rust-400"
          >
            parar
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            className="h-[44px] rounded-xl bg-brass-400 px-5 font-mono text-[13px] font-medium text-ink-950 transition hover:bg-brass-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            enviar
          </button>
        )}
      </div>
    </form>
  );
}
