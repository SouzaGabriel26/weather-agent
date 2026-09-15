import type { TextPart as TextPartModel } from "@/lib/conversation/types";

export function TextPart({ part }: { part: TextPartModel }) {
  const streaming = part.status === "streaming";

  return (
    <div className="animate-rise">
      <Label>{streaming ? "respondendo" : "resposta"}</Label>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-100">
        {part.content}
        {streaming && (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-brass-400 animate-caret"
          />
        )}
      </p>
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
      {children}
    </span>
  );
}
