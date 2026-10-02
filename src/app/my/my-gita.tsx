"use client";

import Link from "next/link";
import { actions, useGita, useHydrated } from "@/lib/store";
import { IconBookmark, IconNote } from "@/components/icons";

export interface MiniVerse {
  id: string;
  headline: string | null;
  sa: string;
}
export interface MiniConcept {
  id: string;
  sa: string;
  en: string;
}

export interface Entity {
  label: string;
  href: string;
  kind: string;
}
export interface MiniPath {
  id: string;
  title: string;
  keys: string[];
}

export function MyGita({
  verses,
  concepts,
  chapterCounts,
  entities,
  paths,
}: {
  verses: Record<string, MiniVerse>;
  concepts: Record<string, MiniConcept>;
  chapterCounts: number[];
  entities: Record<string, Entity>;
  paths: MiniPath[];
}) {
  const hydrated = useHydrated();
  const s = useGita((x) => x);
  if (!hydrated) return <div className="h-96" />;

  const visited = Object.keys(s.visited);
  const understood = Object.keys(s.understood);
  const notes = Object.entries(s.notes).sort((a, b) => b[1].at - a[1].at);
  const bm = s.bookmarks;
  const chaptersTouched = new Set(visited.map((v) => v.split(".")[0])).size;
  const days = s.days.length;

  const verseLink = (id: string) => `/verse/${id.split(".").join("/")}`;
  const explored = Object.keys(s.seen).filter((k) => entities[k]);
  const empty = visited.length === 0 && bm.length === 0 && notes.length === 0 && explored.length === 0;
  const seenKey = (k: string) => (k.startsWith("gita:") ? !!s.visited[k.slice(5)] : !!s.seen[k]);
  const startedPaths = paths.filter((p) => p.keys.some(seenKey));

  if (empty)
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <p className="font-display mb-3 text-2xl">Nothing here yet — and that’s a fine place to begin.</p>
        <p className="mb-6 text-ink-2">
          As you explore, the ideas, texts and verses you open, save and write about will gather here. It all stays in this browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/questions" className="rounded-full bg-ink px-5 py-2.5 text-bg">
            Start with a question →
          </Link>
          <Link href="/verse/2/47" className="rounded-full border border-line-strong px-5 py-2.5">
            Read a Gita verse
          </Link>
        </div>
      </div>
    );

  return (
    <div className="space-y-16">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat n={explored.length} label="ideas, texts & traditions explored" />
        <Stat n={visited.length} label="Gita verses explored" />
        <Stat n={bm.length} label="saved" />
        <Stat n={days} label={days === 1 ? "day of reading" : "days of reading"} />
      </section>

      {startedPaths.length > 0 && (
        <section>
          <h2 className="eyebrow mb-5">Learning paths in progress</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {startedPaths.map((p) => {
              const n = p.keys.filter(seenKey).length;
              return (
                <li key={p.id}>
                  <Link href={`/paths/${p.id}`} className="card block p-5 hover:border-line-strong">
                    <span className="font-display text-lg text-ink">{p.title}</span>
                    <span className="mt-3 flex items-center gap-3">
                      <span className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                        <span className="block h-full bg-saffron" style={{ width: `${(n / p.keys.length) * 100}%` }} />
                      </span>
                      <span className="text-xs text-ink-3">
                        {n}/{p.keys.length}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {s.recentEntities.filter((k) => entities[k]).length > 0 && (
        <section>
          <h2 className="eyebrow mb-5">Recently explored ideas</h2>
          <div className="flex flex-wrap gap-2">
            {s.recentEntities
              .filter((k) => entities[k])
              .slice(0, 24)
              .map((k) => (
                <Link key={k} href={entities[k].href} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-2 hover:border-saffron hover:text-saffron">
                  <span className="text-ink-3">{entities[k].kind} · </span>
                  {entities[k].label}
                </Link>
              ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="eyebrow mb-5">Your progress through the Gita · {chaptersTouched} of 18 chapters opened · {understood.length} understood</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">
          {chapterCounts.map((count, i) => {
            const c = i + 1;
            const n = visited.filter((v) => v.startsWith(`${c}.`)).length;
            return (
              <Link key={c} href={`/chapter/${c}`} className="card group p-3 text-center hover:border-line-strong">
                <span className="font-display block text-lg text-ink-2 group-hover:text-saffron">{c}</span>
                <span className="mt-2 block h-1 overflow-hidden rounded-full bg-line">
                  <span className="block h-full bg-saffron" style={{ width: `${(n / count) * 100}%` }} />
                </span>
                <span className="mt-1 block text-[0.65rem] text-ink-3">
                  {n}/{count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {bm.length > 0 && (
        <section>
          <h2 className="eyebrow mb-5 flex items-center gap-2">
            <IconBookmark size={14} /> Saved · {bm.length}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {bm.map((b) => {
              let href = "#";
              let title = b.label ?? b.id;
              let sub = "";
              if (b.kind === "verse") {
                href = verseLink(b.id);
                title = verses[b.id]?.headline ?? `Verse ${b.id}`;
                sub = verses[b.id]?.sa ?? "";
              } else if (b.kind === "example") {
                const vid = b.id.split("#")[0];
                href = verseLink(vid);
                sub = `Example from ${vid}`;
              } else if (b.kind === "concept") {
                href = `/concepts/${b.id}`;
                title = concepts[b.id] ? `${concepts[b.id].sa} · ${concepts[b.id].en.split(" — ")[0]}` : b.id;
                sub = "Concept";
              } else if (b.kind === "question") {
                href = `/questions#${b.id}`;
                sub = "Gita question";
              } else {
                const key = `${b.kind === "os-question" ? "question" : b.kind}:${b.id}`;
                const e = entities[key];
                if (e) {
                  href = e.href;
                  title = e.label;
                  sub = e.kind;
                } else if (b.kind === "path") {
                  href = `/paths/${b.id}`;
                  sub = "Learning path";
                }
              }
              return (
                <li key={b.kind + b.id} className="card flex items-start gap-3 p-4">
                  <Link href={href} className="min-w-0 flex-1">
                    <span className="eyebrow block !text-saffron">{b.kind === "verse" ? `Gita ${b.id}` : b.kind === "os-question" ? "question" : b.kind}</span>
                    <span className="font-display block text-lg leading-snug text-ink">{title}</span>
                    {sub && <span className={`block truncate text-sm text-ink-3 ${b.kind === "verse" ? "sanskrit" : ""}`}>{sub}</span>}
                  </Link>
                  <button onClick={() => actions.toggleBookmark(b)} className="text-xs text-ink-3 hover:text-ink" aria-label="Remove">
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {notes.length > 0 && (
        <section>
          <h2 className="eyebrow mb-5 flex items-center gap-2">
            <IconNote size={14} /> Notes · {notes.length}
          </h2>
          <ul className="space-y-3">
            {notes.map(([id, n]) => (
              <li key={id} className="card p-5">
                <Link href={verseLink(id)} className="eyebrow !text-saffron">
                  {id} {verses[id]?.headline ? `· ${verses[id].headline}` : ""}
                </Link>
                <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-2">{n.text}</p>
                <p className="mt-2 text-xs text-ink-3">{new Date(n.at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {s.recent.length > 0 && (
        <section>
          <h2 className="eyebrow mb-5">Recently read</h2>
          <div className="flex flex-wrap gap-2">
            {s.recent.slice(0, 20).map((id) => (
              <Link key={id} href={verseLink(id)} className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-2 hover:border-saffron hover:text-saffron">
                {id}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-line pt-8 text-sm text-ink-3">
        <p className="mb-3">Your reading history, notes, saves and path progress are stored only in this browser (localStorage). No account, no server.</p>
        <button
          onClick={() => {
            if (confirm("Clear your reading history, bookmarks and notes from this browser?")) actions.resetAll();
          }}
          className="rounded-full border border-line px-4 py-2 hover:border-line-strong hover:text-ink"
        >
          Clear my data
        </button>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="card p-5">
      <p className="font-display text-4xl text-ink">{n}</p>
      <p className="mt-1 text-sm text-ink-3">{label}</p>
    </div>
  );
}
