"use client";

import Link from "next/link";
import { useGita, useHydrated } from "@/lib/store";

/** "Begin" or "Continue at 2.14" — the first unvisited verse after the last one you read here. */
export function ContinueChapter({ chapter, count }: { chapter: number; count: number }) {
  const hydrated = useHydrated();
  const visited = useGita((s) => s.visited);
  const last = useGita((s) => s.recent.find((id) => id.startsWith(`${chapter}.`)));
  let target = 1;
  let label = "Begin reading";
  if (hydrated && last) {
    const n = Number(last.split(".")[1]);
    target = n;
    for (let i = n; i <= count; i++) {
      if (!visited[`${chapter}.${i}`]) {
        target = i;
        break;
      }
    }
    label = `Continue at ${chapter}.${target}`;
  }
  return (
    <Link href={`/verse/${chapter}/${target}`} className="rounded-full bg-ink px-6 py-3 text-bg transition-transform hover:-translate-y-0.5">
      {label} →
    </Link>
  );
}
