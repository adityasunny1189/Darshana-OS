"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface CmpData {
  id: string;
  topic: string;
  intro: string;
  note: string;
  concept: string | null;
  rows: {
    tradition: string;
    name: string;
    sa: string;
    claim: string;
    detail: string;
    sources: { id: string; label: string; ref?: string }[];
  }[];
}

export function CompareTool({ data }: { data: CmpData[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const topicId = params.get("topic") ?? data[0]?.id;
  const topic = data.find((d) => d.id === topicId) ?? data[0];
  const wanted = params.get("traditions")?.split(",").filter(Boolean) ?? [];
  const available = topic?.rows.map((r) => r.tradition) ?? [];
  const chosen = wanted.filter((x) => available.includes(x));
  const selected = chosen.length ? chosen : available.slice(0, 4);

  const update = (next: { topic?: string; traditions?: string[] }) => {
    const sp = new URLSearchParams(params.toString());
    if (next.topic) sp.set("topic", next.topic);
    if (next.traditions) sp.set("traditions", next.traditions.join(","));
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  if (!topic) return <p className="text-ink-3">Comparisons are not available yet.</p>;
  const rows = topic.rows.filter((r) => selected.includes(r.tradition));

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-3">1 · The question</p>
        <div className="flex flex-wrap gap-2">
          {data.map((d) => (
            <button
              key={d.id}
              onClick={() => update({ topic: d.id, traditions: selected })}
              aria-pressed={d.id === topic.id}
              className={`rounded-full border px-4 py-2 font-display text-lg transition-colors ${
                d.id === topic.id ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink-2 hover:border-line-strong"
              }`}
            >
              {d.topic}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="eyebrow mb-3">2 · The traditions ({selected.length} of {available.length})</p>
        <div className="flex flex-wrap gap-2">
          {topic.rows.map((r) => {
            const on = selected.includes(r.tradition);
            return (
              <button
                key={r.tradition}
                onClick={() => {
                  const next = on ? selected.filter((x) => x !== r.tradition) : [...selected, r.tradition];
                  if (next.length) update({ traditions: next });
                }}
                aria-pressed={on}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  on ? "border-saffron/50 bg-saffron-soft text-ink" : "border-line text-ink-3 hover:border-line-strong"
                }`}
              >
                {on ? "✓ " : "+ "}
                {r.name.replace(/ \(.+\)$/, "")}
              </button>
            );
          })}
          <button onClick={() => update({ traditions: available })} className="px-2 text-sm text-ink-3 underline-offset-4 hover:underline">
            all
          </button>
        </div>
      </div>

      <div className="mb-8 max-w-3xl">
        <h2 className="font-display text-3xl leading-tight">{topic.topic}</h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-2">{topic.intro}</p>
      </div>

      {/* side-by-side on wide screens, stacked on phones */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${rows.length > 3 ? 240 : 300}px, 1fr))` }}>
        {rows.map((r) => (
          <article key={r.tradition} className="card rise flex flex-col p-6">
            <Link href={`/traditions/${r.tradition}`} className="group mb-4 block">
              {r.sa && (
                <span lang="sa" className="sanskrit block text-xl text-ink-2">
                  {r.sa}
                </span>
              )}
              <span className="font-display text-xl text-ink group-hover:text-saffron">{r.name}</span>
            </Link>
            <p className="font-display mb-3 text-[1.35rem] leading-snug text-ink">{r.claim}</p>
            <p className="mb-5 leading-relaxed text-ink-2">{r.detail}</p>
            {r.sources.length > 0 && (
              <div className="mt-auto border-t border-line pt-4">
                <p className="eyebrow mb-2">Rests on</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.sources.map((s, i) => (
                    <Link key={i} href={`/texts/${s.id}`} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-2 hover:border-saffron hover:text-saffron">
                      {s.label}
                      {s.ref ? ` ${s.ref}` : ""}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {topic.note && (
        <aside className="mt-10 max-w-3xl rounded-3xl bg-surface-2 p-6 sm:p-8">
          <p className="eyebrow mb-2">What the disagreement is really about</p>
          <p className="reader text-ink">{topic.note}</p>
        </aside>
      )}

      <div className="mt-10 rounded-3xl border border-dashed border-line-strong p-6 sm:p-8">
        <p className="eyebrow mb-2">Reflect</p>
        <p className="font-display text-xl leading-relaxed text-ink">
          Which of these descriptions matches your own experience — and which challenges it? What would you need to know
          to decide between them?
        </p>
        {topic.concept && (
          <Link href={`/concepts/${topic.concept}`} className="mt-4 inline-flex text-saffron underline-offset-4 hover:underline">
            Go deeper into the concept →
          </Link>
        )}
      </div>
    </div>
  );
}
