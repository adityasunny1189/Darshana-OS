"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { type Hit, loadIndex, search, type SearchIndex } from "@/lib/search";

export function useSearchQuery(initial = "") {
  const [q, setQ] = useState(initial);
  const [ix, setIx] = useState<SearchIndex | null>(null);
  const deferred = useDeferredValue(q);
  useEffect(() => {
    let live = true;
    loadIndex().then((x) => live && setIx(x));
    return () => {
      live = false;
    };
  }, []);
  const hits = useMemo(() => (ix ? search(ix, deferred) : []), [ix, deferred]);
  return { q, setQ, hits, loading: !ix };
}

const FIELD: Record<string, string> = {
  h: "Headline",
  e: "Essence",
  k: "Concept",
  sa: "Sanskrit",
  w: "Word",
  tr: "Transliteration",
  en: "English",
  hi: "हिन्दी",
  ref: "Verse",
};

export function SearchResults({
  q,
  hits,
  loading,
  onNavigate,
  limit = 60,
}: {
  q: string;
  hits: Hit[];
  loading: boolean;
  onNavigate?: () => void;
  limit?: number;
}) {
  if (loading) return <p className="px-3 py-6 text-sm text-ink-3">Opening the index…</p>;
  if (!hits.length)
    return (
      <p className="px-3 py-6 text-sm text-ink-3">
        Nothing found for “{q}”. Try a Sanskrit or Hindi word (कर्म, समता), an English word, or a verse number like 2.47.
      </p>
    );

  const concepts = hits.filter((h) => h.kind === "concept");
  const chapters = hits.filter((h) => h.kind === "chapter");
  const questions = hits.filter((h) => h.kind === "question");
  const verses = hits.filter((h) => h.kind === "verse");
  const ents = (k: "tradition" | "text" | "thinker") => hits.filter((h) => h.kind === k);
  const ENT = [
    ["text", "Texts", "/texts/"],
    ["tradition", "Traditions", "/traditions/"],
    ["thinker", "Thinkers", "/thinkers/"],
  ] as const;

  return (
    <div className="space-y-4 pb-2">
      {concepts.length > 0 && (
        <Group label="Concepts">
          {concepts.slice(0, 6).map((h) =>
            h.kind === "concept" ? (
              <Row key={h.item.id} href={`/concepts/${h.item.id}`} onNavigate={onNavigate}>
                <span className="sanskrit text-lg">{h.item.sa}</span>
                <span className="text-ink">{h.item.en.split(" — ")[0]}</span>
                <span className="truncate text-sm text-ink-3">{h.item.s}</span>
              </Row>
            ) : null,
          )}
        </Group>
      )}
      {ENT.map(([k, label, base]) => {
        const list = ents(k);
        if (!list.length) return null;
        return (
          <Group key={k} label={label}>
            {list.slice(0, 5).map((h) =>
              h.kind === k ? (
                <Row key={h.item.id} href={`${base}${h.item.id}`} onNavigate={onNavigate}>
                  {h.item.sa && <span className="sanskrit">{h.item.sa}</span>}
                  <span className="text-ink">{h.item.en}</span>
                  <span className="truncate text-sm text-ink-3">{h.item.s}</span>
                </Row>
              ) : null,
            )}
          </Group>
        );
      })}
      {questions.length > 0 && (
        <Group label="Questions">
          {questions.slice(0, 5).map((h) =>
            h.kind === "question" ? (
              <Row key={(h.item.os ? "o" : "g") + h.item.id} href={h.item.os ? `/questions/${h.item.id}` : `/questions#${h.item.id}`} onNavigate={onNavigate}>
                <span className="text-ink">{h.item.en}</span>
                {!h.item.os && <span className="text-xs text-leaf">Gita</span>}
              </Row>
            ) : null,
          )}
        </Group>
      )}
      {chapters.length > 0 && (
        <Group label="Gita chapters">
          {chapters.slice(0, 4).map((h) =>
            h.kind === "chapter" ? (
              <Row key={h.item.c} href={`/chapter/${h.item.c}`} onNavigate={onNavigate}>
                <span className="eyebrow">Ch {h.item.c}</span>
                <span className="sanskrit">{h.item.sa}</span>
                <span className="truncate text-sm text-ink-3">{h.item.en}</span>
              </Row>
            ) : null,
          )}
        </Group>
      )}
      {verses.length > 0 && (
        <Group label={`Gita verses · ${verses.length}`}>
          {verses.slice(0, limit).map((h) =>
            h.kind === "verse" ? (
              <Link
                key={h.item.id}
                href={`/verse/${h.item.c}/${h.item.v}`}
                onClick={onNavigate}
                className="block rounded-xl px-3 py-3 transition-colors hover:bg-surface-2"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="eyebrow text-saffron">
                    {h.item.c}.{h.item.v}
                  </span>
                  <span className="text-[0.7rem] text-ink-3">{FIELD[h.field] ?? ""}</span>
                </div>
                {h.item.h && <p className="font-display text-[1.02rem] text-ink">{h.item.h.split(" | ")[0]}</p>}
                <p className="sanskrit line-clamp-1 text-[0.98rem] text-ink-2">{h.item.sa}</p>
                <p className={`line-clamp-2 text-sm text-ink-3 ${h.field === "hi" ? "hindi" : ""}`}>{h.snippet}</p>
              </Link>
            ) : null,
          )}
        </Group>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="eyebrow px-3 pb-1 pt-2">{label}</p>
      <div>{children}</div>
    </section>
  );
}

function Row({ href, children, onNavigate }: { href: string; children: React.ReactNode; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-baseline gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2"
    >
      {children}
    </Link>
  );
}
