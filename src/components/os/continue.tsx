"use client";

import Link from "next/link";
import { useGita, useHydrated } from "@/lib/store";

/** Continue where you left off — last Gita verse and the last OS pages you explored. */
export function ContinueOS({ lookup }: { lookup: Record<string, { label: string; href: string; kind: string }> }) {
  const hydrated = useHydrated();
  const last = useGita((s) => s.last);
  const recent = useGita((s) => s.recentEntities);
  if (!hydrated) return null;
  const items = recent.map((k) => lookup[k]).filter(Boolean).slice(0, 4);
  if (!last && !items.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-label="Continue exploring">
      <div className="card rise flex flex-wrap items-center gap-3 p-5 sm:p-6">
        <span className="eyebrow mr-2">Continue</span>
        {last && (
          <Link href={`/verse/${last.id.replace(".", "/")}`} className="rounded-full bg-ink px-4 py-2 text-sm text-bg">
            Gita {last.id} →
          </Link>
        )}
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="rounded-full border border-line px-4 py-2 text-sm text-ink-2 hover:border-saffron hover:text-saffron">
            <span className="text-ink-3">{it.kind} · </span>
            {it.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
