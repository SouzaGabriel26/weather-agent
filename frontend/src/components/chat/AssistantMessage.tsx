import type { AssistantPart, AssistantTurn } from "@/lib/conversation/types";

import { TextPart } from "./parts/TextPart";
import { ToolCallPart } from "./parts/ToolCallPart";
import { ToolResultPart } from "./parts/ToolResultPart";

export function AssistantMessage({
  turn,
  isStreaming,
}: {
  turn: AssistantTurn;
  isStreaming: boolean;
}) {
  const thinking = isStreaming && turn.parts.length === 0;

  return (
    <div className="relative pl-6">
      <span className="absolute top-2 bottom-2 left-[5px] w-px bg-ink-700" />

      {thinking && (
        <div className="relative animate-rise">
          <Marker active />
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
            pensando
          </span>
        </div>
      )}

      <div className="space-y-6">
        {turn.parts.map((part) => (
          <div key={part.runId + part.kind} className="relative">
            <Marker active={isPartActive(part)} />
            {renderPart(part)}
          </div>
        ))}
      </div>
    </div>
  );
}

// AC-06: tipo -> renderer. O `never` garante que toda parte tem um.
function renderPart(part: AssistantPart) {
  switch (part.kind) {
    case "text":
      return <TextPart part={part} />;
    case "tool_call":
      return <ToolCallPart part={part} />;
    case "tool_result":
      return <ToolResultPart part={part} />;
    default: {
      const unreachable: never = part;
      throw new Error(`Unhandled part: ${JSON.stringify(unreachable)}`);
    }
  }
}

function isPartActive(part: AssistantPart): boolean {
  return (
    (part.kind === "text" && part.status === "streaming") ||
    (part.kind === "tool_result" && part.status === "running")
  );
}

function Marker({ active }: { active: boolean }) {
  return (
    <span
      className={`absolute top-[5px] -left-6 h-[7px] w-[7px] rounded-full ring-4 ring-ink-950 ${
        active ? "bg-brass-400 animate-breathe" : "bg-ink-600"
      }`}
    />
  );
}
