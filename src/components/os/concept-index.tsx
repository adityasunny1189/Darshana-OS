"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SeenDot } from "./seen";

interface Item {
  id: string;
  sa: string;
  en: string;
  gloss: string;
  iast: string;
  short: string;
  traditions: string[];
  gita: boolean;
}

export function ConceptIndex({ items, traditions }: { items: Item[]; traditions: { id: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const [t, setT] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items
      .filter((c) => !t || c.traditions.includes(t))
      .filter((c) => !s || [c.en, c.gloss, c.iast, c.short, c.id].some((x) => x.toLowerCase().includes(s)) || c.sa.includes(q.trim()))
      .sort((a, b) => a.en.localeCompare(b.en));
  }, [items, q, t]);
  return (
    <section aria-labelledby="all-concepts">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 id="all-concepts" className="font-display mr-auto text-2xl">
          All concepts <span className="text-ink-3">· {list.length}</span>
        </h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter: karma, आत्मा, emptiness…"
          aria-label="Filter concepts"
          className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm outline-none focus:border-line-strong sm:w-64"
        />
        <select value={t} onChange={(e) => setT(e.target.value)} aria-label="Tradition" className="rounded-full border border-line bg-surface px-3 py-2 text-sm text-ink-2">
          <option value="">Used by any tradition</option>
          {traditions.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Link key={c.id} href={`/concepts/${c.id}`} className="card group flex flex-col p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong">
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span lang="sa" className="sanskrit text-2xl text-ink group-hover:text-saffron">
                {c.sa}
              </span>
              <SeenDot k={`concept:${c.id}`} />
            </div>
            <span className="font-display text-lg text-ink-2">
              {c.en}
              {c.gloss && <span className="text-ink-3"> · {c.gloss}</span>}
            </span>
            <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-3">{c.short}</span>
            <span className="mt-3 flex gap-2 text-[0.68rem] text-ink-3">
              <span>{c.traditions.length} traditions</span>
              {c.gita && <span className="text-leaf">· Gita layer</span>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
