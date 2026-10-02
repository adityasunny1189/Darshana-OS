"use client";

import { useGita, useHydrated, type GitaState } from "@/lib/store";

export function isSeen(s: GitaState, key: string) {
  if (key.startsWith("gita:")) return !!s.visited[key.slice(5)];
  return !!s.seen[key];
}

/** Gentle progress for a learning path: how many steps you've opened. */
export function PathProgress({ keys }: { keys: string[] }) {
  const hydrated = useHydrated();
  const n = useGita((s) => keys.filter((k) => isSeen(s, k)).length);
  const done = hydrated ? n : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1" aria-hidden>
        {keys.map((k, i) => (
          <PathDot key={k + i} k={k} />
        ))}
      </div>
      <span className="whitespace-nowrap text-xs text-ink-3">
        {done ? `${done} of ${keys.length} explored` : `${keys.length} steps`}
      </span>
    </div>
  );
}

function PathDot({ k }: { k: string }) {
  const hydrated = useHydrated();
  const on = useGita((s) => isSeen(s, k));
  return <span className={`h-1 flex-1 rounded-full ${hydrated && on ? "bg-saffron" : "bg-line"}`} />;
}
