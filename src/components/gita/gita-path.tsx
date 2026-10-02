import Link from "next/link";
import { getConcept, getPaths, verseCards } from "@/lib/data";
import { Bi, L } from "@/components/bi";
import { SeenMark } from "@/components/progress";
import { LayerTag } from "@/components/verse/sections";

/** A Gita learning path (Sadhak Sanjivani layer). */
export function GitaPathView({ id }: { id: string }) {
  const p = getPaths().find((x) => x.id === id);
  if (!p) return null;
  const seq = `p-${p.id}`;
  const first = p.steps[0]?.verses[0];

  return (
    <div className="lamp">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="pt-6 text-sm text-ink-3">
          <Link href="/paths" className="hover:text-ink">
            <L en="All paths" hi="सभी मार्ग" />
          </Link>
        </nav>
        <header className="pb-12 pt-14 sm:pt-20">
          <p className="eyebrow mb-4">{p.steps.length} steps</p>
          <Bi t={p.title} as="h1" className="font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[1.08]" />
          <Bi t={p.description} as="p" className="mt-5 text-lg leading-relaxed text-ink-2" />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {first && (
              <Link href={`/verse/${first.replace(".", "/")}?seq=${seq}`} className="rounded-full bg-ink px-6 py-3 text-bg">
                Start the path →
              </Link>
            )}
            <LayerTag kind="summary" />
          </div>
        </header>

        <ol className="relative space-y-10 border-l border-line pb-10 pl-8 sm:pl-10">
          {p.steps.map((s, i) => {
            const cards = verseCards(s.verses);
            return (
              <li key={i} className="relative">
                <span className="absolute -left-[3.05rem] top-0 grid h-9 w-9 place-items-center rounded-full border border-line bg-bg font-display text-ink-2 sm:-left-[3.55rem]">
                  {i + 1}
                </span>
                <Bi t={s.title} as="h2" className="font-display mb-2 text-2xl text-ink" />
                <Bi t={s.summary} as="p" className="reader mb-5 text-ink-2" />
                <div className="space-y-2">
                  {cards.map((v) => (
                    <Link
                      key={v.id}
                      href={`/verse/${v.chapter}/${v.verse}?seq=${seq}`}
                      className="card group flex items-center gap-4 px-5 py-4 transition-colors hover:border-line-strong"
                    >
                      <span className="w-12 shrink-0 font-display text-saffron">{v.id}</span>
                      <span className="min-w-0 flex-1">
                        {v.headline && <Bi t={v.headline} as="span" className="font-display block leading-snug text-ink" />}
                        <span lang="sa" className="sanskrit block truncate text-ink-2">{v.sanskrit[0]}</span>
                      </span>
                      <SeenMark id={v.id} />
                    </Link>
                  ))}
                </div>
                {s.concepts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.concepts.map((cid) => {
                      const c = getConcept(cid);
                      return c ? (
                        <Link key={cid} href={`/concepts/${cid}`} className="text-sm text-ink-3 hover:text-saffron">
                          <span className="sanskrit">{c.sa}</span> · {c.en}
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
