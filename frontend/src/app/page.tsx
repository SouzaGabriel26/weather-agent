"use client";

import { useAgentStream } from "@/hooks/useAgentStream";

export default function Home() {
  const { turns, status, error, send, stop } = useAgentStream();

  return (
    <main className="space-y-4 p-8 font-mono text-xs">
      <div className="flex items-center gap-2">
        <button
          onClick={() => send("Qual o clima em São Paulo?")}
          className="rounded border px-3 py-1"
        >
          perguntar
        </button>
        <button onClick={stop} className="rounded border px-3 py-1">
          parar
        </button>
        <span>status: {status}</span>
        {error && <span className="text-red-600">{error}</span>}
      </div>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(turns, null, 2)}
      </pre>
    </main>
  );
}
