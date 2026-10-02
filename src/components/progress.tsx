"use client";

import { useGita, useHydrated } from "@/lib/store";

/** Gentle progress: how many verses of a chapter you've explored. */
export function ChapterProgress({ chapter, total, variant = "bar" }: { chapter: number; total: number; variant?: "bar" | "ring" | "text" }) {
  const hydrated = useHydrated();
  const seen = useGita((s) => Object.keys(s.visited).filter((id) => id.startsWith(`${chapter}.`)).length);
  const n = hydrated ? seen : 0;
  const pct = total ? n / total : 0;
  if (variant === "text")
    return <span className="whitespace-nowrap text-xs text-ink-3">{n > 0 ? `${n} of ${total} explored` : `${total} verses`}</span>;
  if (variant === "ring") {
    const r = 15;
    const c = 2 * Math.PI * r;
    return (
      <svg width="38" height="38" viewBox="0 0 38 38" aria-label={`${n} of ${total} verses explored`}>
        <circle cx="19" cy="19" r={r} fill="none" stroke="var(--line)" strokeWidth="2" />
        <circle
          cx="19"
          cy="19"
          r={r}
          fill="none"
          stroke="var(--saffron)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 19 19)"
          style={{ transition: "stroke-dashoffset 1s var(--ease-calm)" }}
        />
      </svg>
    );
  }
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-line" aria-label={`${n} of ${total} verses explored`}>
      <div className="h-full rounded-full bg-saffron transition-[width] duration-1000" style={{ width: `${pct * 100}%` }} />
    </div>
  );
}

/** Dots for verses in a range, filled once visited. */
export function VerseDots({ chapter, from, to }: { chapter: number; from: number; to: number }) {
  const hydrated = useHydrated();
  const visited = useGita((s) => s.visited);
  return (
    <div className="flex flex-wrap gap-1" aria-hidden>
      {Array.from({ length: to - from + 1 }, (_, i) => {
        const on = hydrated && !!visited[`${chapter}.${from + i}`];
        return <span key={i} className={`h-1.5 w-1.5 rounded-full ${on ? "bg-saffron" : "bg-line-strong/60"}`} />;
      })}
    </div>
  );
}

export function SeenMark({ id }: { id: string }) {
  const hydrated = useHydrated();
  const on = useGita((s) => !!s.visited[id]);
  if (!hydrated || !on) return null;
  return <span className="h-1.5 w-1.5 rounded-full bg-saffron" aria-label="explored" />;
}
