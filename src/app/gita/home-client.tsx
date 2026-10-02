"use client";

import Link from "next/link";
import { useGita, useHydrated } from "@/lib/store";
import { IconClock } from "@/components/icons";

export interface DailyVerse {
  id: string;
  sanskrit: string[];
  hindi: string;
  english: string | null;
  essence: { en: string; hi: string };
  headline: { en: string; hi: string };
}

export interface ContinueInfo {
  id: string;
  chapterName: string;
  headline: string | null;
  sa: string;
  total: number;
}

/** "Continue where you left off" — appears only once you have read something. */
export function ContinueLearning({ lookup }: { lookup: Record<string, ContinueInfo> }) {
  const hydrated = useHydrated();
  const last = useGita((s) => s.last);
  const visited = useGita((s) => s.visited);
  if (!hydrated || !last) return null;
  const info = lookup[last.id];
  if (!info) return null;
  const [c] = last.id.split(".");
  const seen = Object.keys(visited).filter((v) => v.startsWith(`${c}.`)).length;
  const remaining = info.total - seen;
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6" aria-label="Continue where you left off">
      <Link
        href={`/verse/${last.id.replace(".", "/")}`}
        className="card rise group grid gap-5 p-6 transition-colors hover:border-line-strong sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"
      >
        <div>
          <p className="eyebrow mb-2">Continue where you left off</p>
          <p className="font-display text-2xl text-ink">
            {info.headline ?? `Chapter ${c} · Verse ${last.id.split(".")[1]}`}
          </p>
          <p className="mt-1 text-sm text-ink-3">
            {last.id} · <span className="sanskrit">{info.chapterName}</span>
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1 w-40 overflow-hidden rounded-full bg-line">
              <div className="h-full bg-saffron" style={{ width: `${(seen / info.total) * 100}%` }} />
            </div>
            <span className="text-xs text-ink-3">
              {seen} of {info.total} verses explored
            </span>
            {remaining > 0 && (
              <span className="flex items-center gap-1 text-xs text-ink-3">
                <IconClock size={13} /> ~{Math.max(1, Math.round(remaining * 1.5))} min left in chapter
              </span>
            )}
          </div>
        </div>
        <span className="justify-self-start rounded-full bg-ink px-5 py-2.5 text-bg transition-transform group-hover:translate-x-1 sm:justify-self-end">
          Continue →
        </span>
      </Link>
    </section>
  );
}

/** Today's verse: deterministic by the reader's local date, no server involved. */
export function TodaysVerse({ pool }: { pool: DailyVerse[] }) {
  const hydrated = useHydrated();
  if (!pool.length) return null;
  const d = new Date();
  const dayNumber = hydrated ? Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000) : 0;
  const v = pool[(dayNumber * 7919) % pool.length];
  const [c, n] = v.id.split(".");
  return (
    <div className={`transition-opacity duration-700 ${hydrated ? "opacity-100" : "opacity-0"}`}>
      <p className="eyebrow mb-6 text-center">
        Today’s verse · {hydrated ? d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }) : ""}
      </p>
      <p lang="sa" className="sanskrit text-center text-[clamp(1.3rem,3.6vw,1.9rem)] leading-[1.85] text-ink">
        {v.sanskrit.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </p>
      <p className="font-display mx-auto mt-8 max-w-2xl text-center text-2xl leading-snug text-ink">
        <span className="lang-en">{v.essence.en}</span>
        <span className="lang-hi hindi">{v.essence.hi}</span>
      </p>
      <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-[0.97rem] md:grid-cols-2">
        <p lang="hi" className="show-hi hindi leading-[1.9] text-ink-2">
          {v.hindi}
        </p>
        {v.english && <p className="show-en font-serif leading-relaxed text-ink-2">{v.english}</p>}
      </div>
      <div className="mt-8 text-center">
        <Link href={`/verse/${c}/${n}`} className="inline-flex rounded-full border border-line px-5 py-2.5 text-ink-2 transition-colors hover:border-saffron hover:text-saffron">
          Read {v.id} with Swamiji’s explanation →
        </Link>
      </div>
    </div>
  );
}
