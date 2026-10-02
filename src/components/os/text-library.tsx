"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SeenDot } from "./seen";

interface T {
  id: string;
  title: string;
  sa?: string;
  category: string;
  sourceType: string;
  difficulty: string;
  traditions: string[];
  summary: string;
  ingested: boolean;
  advanced: boolean;
}

const CATEGORY_ORDER = ["veda", "upanishad", "sutra", "itihasa", "purana", "smriti", "agama-tantra", "canonical-scripture", "ethical-classic", "prakarana", "bhashya", "devotional", "commentary", "modern-exposition"];
const CATEGORY_LABEL: Record<string, string> = {
  veda: "Veda",
  upanishad: "Upanishads",
  sutra: "Sutras",
  itihasa: "Itihasa (epics)",
  purana: "Puranas",
  smriti: "Smriti",
  "agama-tantra": "Agama & Tantra",
  "canonical-scripture": "Canonical scriptures",
  "ethical-classic": "Ethical classics",
  prakarana: "Prakarana (introductory treatises)",
  bhashya: "Bhashyas (commentaries on the sutras & Gita)",
  devotional: "Devotional works",
  commentary: "Commentaries",
  "modern-exposition": "Modern expositions",
};
const LEVELS = [
  ["all", "All levels"],
  ["beginner", "Beginner"],
  ["intermediate", "Intermediate"],
  ["advanced", "Advanced"],
] as const;

export function TextLibrary({ texts, traditions }: { texts: T[]; traditions: { id: string; name: string }[] }) {
  const [q, setQ] = useState("");
  const [trad, setTrad] = useState("");
  const [level, setLevel] = useState<(typeof LEVELS)[number][0]>("all");
  const filtered = useMemo(
    () =>
      texts.filter((t) => {
        if (trad && !t.traditions.includes(trad)) return false;
        if (level !== "all" && !t.difficulty.includes(level)) return false;
        const s = q.trim().toLowerCase();
        return !s || t.title.toLowerCase().includes(s) || t.summary.toLowerCase().includes(s) || (t.sa ?? "").includes(q.trim());
      }),
    [texts, trad, level, q],
  );
  const cats = CATEGORY_ORDER.filter((c) => filtered.some((t) => t.category === c));
  const other = filtered.filter((t) => !CATEGORY_ORDER.includes(t.category));

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-4 mb-10 flex flex-wrap items-center gap-2 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-full sm:border sm:px-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter texts…"
          aria-label="Filter texts"
          className="min-w-40 flex-1 rounded-full border border-line bg-surface px-4 py-1.5 text-sm outline-none focus:border-line-strong"
        />
        <select value={trad} onChange={(e) => setTrad(e.target.value)} aria-label="Tradition" className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-2">
          <option value="">All traditions</option>
          {traditions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1 rounded-full bg-surface-2 p-1 text-xs">
          {LEVELS.map(([k, l]) => (
            <button key={k} onClick={() => setLevel(k)} aria-pressed={level === k} className={`rounded-full px-3 py-1 ${level === k ? "bg-surface text-ink shadow-sm" : "text-ink-3"}`}>
              {l}
            </button>
          ))}
        </div>
        <span className="text-xs text-ink-3">{filtered.length} texts</span>
      </div>

      {[...cats, ...(other.length ? ["other"] : [])].map((c) => {
        const list = c === "other" ? other : filtered.filter((t) => t.category === c);
        return (
          <section key={c} className="mb-12">
            <h2 className="eyebrow mb-4 border-b border-line pb-3">{CATEGORY_LABEL[c] ?? "Other"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((t) => (
                <Link
                  key={t.id}
                  href={`/texts/${t.id}`}
                  className={`group flex flex-col rounded-2xl border p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 ${
                    t.ingested ? "border-leaf/40 bg-surface" : "border-line bg-surface/70 hover:border-line-strong"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    {t.sa ? (
                      <span lang="sa" className="sanskrit truncate text-lg text-ink-2">
                        {t.sa}
                      </span>
                    ) : (
                      <span />
                    )}
                    <SeenDot k={`text:${t.id}`} />
                  </div>
                  <span className="font-display text-xl leading-snug text-ink group-hover:text-saffron">{t.title}</span>
                  <span className="mt-2 line-clamp-2 text-sm text-ink-3">{t.summary}</span>
                  <span className="mt-4 flex flex-wrap gap-2 text-[0.68rem]">
                    <span className={`rounded-full border px-2 py-0.5 ${t.ingested ? "border-leaf/40 text-leaf" : "border-dashed border-line-strong text-ink-3"}`}>
                      {t.ingested ? "Full text" : "Not yet ingested"}
                    </span>
                    <span className="rounded-full border border-line px-2 py-0.5 capitalize text-ink-3">{t.difficulty.replace("-", " → ")}</span>
                    {t.sourceType === "modern-exposition" && <span className="rounded-full border border-indigo/30 px-2 py-0.5 text-indigo">Modern</span>}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
