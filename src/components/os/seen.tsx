"use client";

import { useEffect } from "react";
import { actions, useGita, useHydrated } from "@/lib/store";

/** Records that an entity page was explored (for My Library). */
export function Seen({ k }: { k: string }) {
  useEffect(() => {
    actions.see(k);
  }, [k]);
  return null;
}

export function SeenDot({ k }: { k: string }) {
  const hydrated = useHydrated();
  const on = useGita((s) => !!s.seen[k] || (k.startsWith("gita:") && !!s.visited[k.slice(5)]));
  if (!hydrated || !on) return null;
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" aria-label="explored" />;
}
