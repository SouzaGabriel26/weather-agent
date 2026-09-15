import type { UserTurn } from "@/lib/conversation/types";

export function UserMessage({ turn }: { turn: UserTurn }) {
  return (
    <div className="flex justify-end animate-rise">
      <p className="max-w-[80%] rounded-2xl rounded-br-sm border border-ink-700 bg-ink-800 px-4 py-2.5 text-[15px] leading-relaxed text-ink-100">
        {turn.content}
      </p>
    </div>
  );
}
