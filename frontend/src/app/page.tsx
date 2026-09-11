"use client";

import { executeAgent } from "@/lib/agent";

export default function Home() {
  async function run() {
    for await (const ev of executeAgent("Qual o clima em São Paulo?")) {
      console.log(ev.event, ev);
    }
    console.log("done");
  }

  return (
    <main className="p-8">
      <button onClick={run} className="rounded border px-4 py-2">
        testar stream
      </button>
    </main>
  );
}
