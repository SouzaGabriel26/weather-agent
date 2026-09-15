import type { ToolResultPart as ToolResultPartModel } from "@/lib/conversation/types";

import { Label } from "./TextPart";

export function ToolResultPart({ part }: { part: ToolResultPartModel }) {
  if (part.status === "running") {
    return (
      <div className="animate-rise">
        <Label>tool result</Label>
        <div className="mt-1.5 flex items-center gap-2 font-mono text-[13px] text-ink-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brass-400 animate-breathe" />
          executando <span className="text-brass-400">{part.name}</span>…
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise">
      <Label>{part.status === "error" ? "tool error" : "tool result"}</Label>
      <pre
        className={`mt-1.5 overflow-x-auto rounded-md border px-3.5 py-3 font-mono text-[12.5px] leading-relaxed ${
          part.status === "error"
            ? "border-rust-400/40 bg-rust-400/5 text-rust-400"
            : "border-ink-700 bg-ink-900 text-ink-100"
        }`}
      >
        {prettyJson(part.output)}
      </pre>
    </div>
  );
}

function prettyJson(raw: string | null): string {
  if (raw === null) return "";
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}
