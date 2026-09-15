import type { ToolCallPart as ToolCallPartModel } from "@/lib/conversation/types";

import { Label } from "./TextPart";

export function ToolCallPart({ part }: { part: ToolCallPartModel }) {
  const args = Object.entries(part.call.args);

  return (
    <div className="animate-rise">
      <Label>tool call</Label>
      <div className="mt-1.5 font-mono text-[13px] leading-relaxed">
        <span className="text-brass-400">{part.call.name}</span>
        <span className="text-ink-400">(</span>
        {args.map(([key, value], i) => (
          <span key={key}>
            <span className="text-ink-300">{key}</span>
            <span className="text-ink-400">=</span>
            <span className="text-sky-400">{JSON.stringify(value)}</span>
            {i < args.length - 1 && <span className="text-ink-400">, </span>}
          </span>
        ))}
        <span className="text-ink-400">)</span>
      </div>
    </div>
  );
}
