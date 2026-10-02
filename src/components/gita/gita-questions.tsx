import Link from "next/link";
import { getConcept, getQuestions, verseCards } from "@/lib/data";
import { Bi, L } from "@/components/bi";
import { LayerTag } from "@/components/verse/sections";
import { BookmarkButton } from "@/components/verse/verse-client";

/** The Sadhak Sanjivani–grounded Gita questions (anchors: /questions#<id>). */
export function GitaQuestions() {
  const qs = getQuestions();
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h2 id="gita-questions" className="font-display text-3xl">
          <L en="Answered from the Bhagavad Gita" hi="गीताके अनुसार उत्तर" />
        </h2>
        <LayerTag kind="summary" />
      </div>
      <p className="mb-8 max-w-2xl text-ink-2">
        <L
          en="These answers stay close to what Swami Ramsukhdas says in Sadhak Sanjivani, and point you to the verses."
          hi="ये उत्तर साधक-संजीवनीमें स्वामीजीके कथनके अनुसार हैं।"
        />
      </p>

      <div className="space-y-4">
        {qs.map((q, i) => {
          const verses = verseCards(q.verses);
          return (
            <details key={q.id} id={q.id} className="card group scroll-mt-24 open:shadow-[var(--shadow)]" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 sm:p-7 [&::-webkit-details-marker]:hidden">
                <span className="font-display mt-0.5 text-2xl text-saffron">?</span>
                <Bi t={q.q} as="h2" className="font-display flex-1 text-[1.4rem] leading-snug text-ink" hiClassName="!text-xl" />
                <span className="mt-2 text-ink-3 transition-transform duration-500 group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-7 sm:px-7 sm:pl-[4.2rem]">
                <Bi t={q.answer} as="p" className="reader mb-6 text-ink-2" />
                <div className="mb-5 grid gap-2 sm:grid-cols-2">
                  {verses.map((v) => (
                    <Link
                      key={v.id}
                      href={`/verse/${v.chapter}/${v.verse}`}
                      className="flex items-baseline gap-3 rounded-xl border border-line px-4 py-3 transition-colors hover:border-saffron"
                    >
                      <span className="font-display text-saffron">{v.id}</span>
                      <span className="min-w-0 flex-1">
                        {v.headline ? (
                          <Bi t={v.headline} className="line-clamp-2 text-sm text-ink" />
                        ) : (
                          <span lang="sa" className="sanskrit line-clamp-1 text-ink-2">{v.sanskrit[0]}</span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {q.concepts.map((cid) => {
                    const c = getConcept(cid);
                    return c ? (
                      <Link key={cid} href={`/concepts/${cid}`} className="rounded-full bg-surface-2 px-3 py-1 text-sm text-ink-2 hover:text-saffron">
                        <span className="sanskrit">{c.sa}</span> · {c.en}
                      </Link>
                    ) : null;
                  })}
                  <span className="ml-auto">
                    <BookmarkButton kind="question" id={q.id} label={q.q.en} compact />
                  </span>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
