import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapterIndex, getChapterMeta, getConcept, getCuratedVerse, getSourceChapter, verseCards } from "@/lib/data";
import type { Concept } from "@/lib/types";
import { Bi, L } from "@/components/bi";
import { Motif } from "@/components/motif";
import { ChapterProgress, SeenMark, VerseDots } from "@/components/progress";
import { ConceptChips, LayerTag, VerseCardView } from "@/components/verse/sections";
import { Disclosure } from "@/components/disclosure";
import { RichText } from "@/components/rich-text";
import { IconArrowRight } from "@/components/icons";
import { ContinueChapter } from "./continue";

export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: 18 }, (_, i) => ({ c: String(i + 1) }));
}

export async function generateMetadata({ params }: PageProps<"/chapter/[c]">): Promise<Metadata> {
  const { c } = await params;
  const m = getChapterMeta(+c);
  return { title: `Chapter ${c} · ${m.nameIast}`, description: m.tagline.en };
}

export default async function ChapterPage({ params }: PageProps<"/chapter/[c]">) {
  const { c: cs } = await params;
  const c = Number(cs);
  const src = getSourceChapter(c);
  if (!src) notFound();
  const m = getChapterMeta(c);
  const count = src.verses.length;
  const concepts = m.keyConcepts.map(getConcept).filter((x): x is Concept => !!x);
  const key = verseCards(m.keyVerses);
  const nextCh = c < 18 ? getChapterMeta(c + 1) : null;
  const index = getChapterIndex();

  return (
    <div className="lamp">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="pt-6 text-sm text-ink-3">
          <Link href="/chapters" className="hover:text-ink">
            <L en="All chapters" hi="सभी अध्याय" />
          </Link>
        </nav>

        {/* header */}
        <header className="grid items-end gap-8 pb-14 pt-12 sm:pt-20 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow mb-5">
              Chapter {c} · {count} verses
            </p>
            <h1 lang="sa" className="sanskrit rise text-[clamp(2.4rem,7vw,4.4rem)] leading-[1.25] text-ink">
              {m.nameSa}
            </h1>
            <p className="font-display mt-2 text-2xl text-ink-2">
              {m.nameIast} <span className="text-ink-3">· {m.nameEn}</span>
            </p>
            <Bi t={m.tagline} as="p" className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2" />
          </div>
          <div className="hidden md:block">
            <Motif name={m.motif} size={150} className="breathe text-gold/50" />
          </div>
        </header>

        <div className="mb-14 flex flex-wrap items-center gap-4">
          <ContinueChapter chapter={c} count={count} />
          <div className="flex min-w-48 flex-1 items-center gap-3">
            <ChapterProgress chapter={c} total={count} />
            <ChapterProgress chapter={c} total={count} variant="text" />
          </div>
        </div>

        {/* what is happening */}
        {m.overview.en && (
          <section className="grid gap-10 border-t border-line py-14 md:grid-cols-[14rem_1fr]" aria-labelledby="happening">
            <div>
              <h2 id="happening" className="font-display text-2xl">
                <L en="What is happening here?" hi="यहाँ क्या हो रहा है?" />
              </h2>
              <div className="mt-3">
                <LayerTag kind="summary" />
              </div>
            </div>
            <div className="space-y-6">
              <Bi t={m.overview} as="p" className="reader text-ink" />
              {m.whyHere.en && (
                <div className="rounded-2xl bg-surface-2 p-6">
                  <p className="eyebrow mb-2">
                    <L en="Why it comes here" hi="यह अध्याय यहाँ क्यों" />
                  </p>
                  <Bi t={m.whyHere} as="p" className="reader text-ink-2" />
                </div>
              )}
            </div>
          </section>
        )}

        {/* theme + questions */}
        {(m.questions.length > 0 || concepts.length > 0) && (
          <section className="grid gap-10 border-t border-line py-14 md:grid-cols-2">
            {m.questions.length > 0 && (
              <div>
                <h2 className="eyebrow mb-5">
                  <L en="Questions this chapter answers" hi="इस अध्यायके प्रश्न" />
                </h2>
                <ul className="space-y-4">
                  {m.questions.map((q, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-display text-xl text-saffron">?</span>
                      <Bi t={q} className="font-display text-xl leading-snug text-ink" hiClassName="!text-lg" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-8">
              {m.theme.en && (
                <div>
                  <h2 className="eyebrow mb-3">
                    <L en="Central theme" hi="मुख्य विषय" />
                  </h2>
                  <Bi t={m.theme} as="p" className="font-display text-2xl leading-snug text-ink" />
                </div>
              )}
              {concepts.length > 0 && <ConceptChips concepts={concepts} />}
            </div>
          </section>
        )}

        {/* key verses */}
        {key.length > 0 && (
          <section className="border-t border-line py-14" aria-labelledby="key">
            <h2 id="key" className="font-display mb-6 text-2xl">
              <L en="Verses to begin with" hi="मुख्य श्लोक" />
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {key.map((k) => (
                <VerseCardView key={k.id} card={k} />
              ))}
            </div>
          </section>
        )}

        {/* the journey */}
        <section className="border-t border-line py-14" aria-labelledby="journey">
          <h2 id="journey" className="font-display mb-2 text-3xl">
            <L en="The journey" hi="अध्यायकी यात्रा" />
          </h2>
          <p className="mb-10 max-w-2xl text-ink-3">
            <L
              en={`${count} verses, in ${m.sections.length} movements — following how Swamiji links each verse to the one before.`}
              hi={`${count} श्लोक, ${m.sections.length} प्रकरणोंमें — स्वामीजीके ‘सम्बन्ध’ के अनुसार।`}
            />
          </p>
          <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-[1.15rem] before:top-6 before:w-px before:bg-line">
            {m.sections.map((s, si) => {
              const verses = src.verses.filter((v) => v.verse >= s.from && v.verse <= s.to);
              return (
                <li key={si} className="relative pl-12">
                  <span className="absolute left-0 top-5 grid h-9 w-9 place-items-center rounded-full border border-line bg-bg font-display text-sm text-ink-2">
                    {si + 1}
                  </span>
                  <Disclosure
                    defaultOpen={si === 0}
                    summary={
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <Bi t={s.title} as="h3" className="font-display text-xl text-ink" />
                          <span className="text-sm text-ink-3">
                            {s.from === s.to ? `Verse ${s.from}` : `Verses ${s.from}–${s.to}`}
                          </span>
                        </div>
                        {s.summary.en && <Bi t={s.summary} as="p" className="mt-1.5 text-[0.97rem] leading-relaxed text-ink-2" />}
                        <div className="mt-3">
                          <VerseDots chapter={c} from={s.from} to={s.to} />
                        </div>
                      </div>
                    }
                  >
                    <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
                      {verses.map((v) => {
                        const cv = getCuratedVerse(v.id);
                        return (
                          <li key={v.id}>
                            <Link href={`/verse/${c}/${v.verse}`} className="group flex gap-4 px-4 py-4 transition-colors hover:bg-surface-2 sm:px-5">
                              <span className="w-10 shrink-0 pt-1 font-display text-ink-3 group-hover:text-saffron">
                                {c}.{v.verse}
                              </span>
                              <span className="min-w-0 flex-1">
                                {cv ? (
                                  <Bi t={cv.headline} as="span" className="font-display block text-lg leading-snug text-ink" />
                                ) : null}
                                <span lang="sa" className="sanskrit block truncate text-[1.02rem] text-ink-2">
                                  {v.sanskrit[0]}
                                </span>
                                <span lang="hi" className="hindi line-clamp-1 text-sm text-ink-3">
                                  {v.hindi}
                                </span>
                              </span>
                              <span className="flex items-center pt-2">
                                <SeenMark id={v.id} />
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Disclosure>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Swamiji's introduction */}
        {src.intro.hi.length > 0 && (
          <section className="border-t border-line py-14" aria-labelledby="intro">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <h2 id="intro" className="font-display text-2xl">
                <span className="hindi">अवतरणिका</span> <span className="text-ink-3">· Swamiji’s introduction</span>
              </h2>
              <LayerTag kind="source" />
            </div>
            <Disclosure summary={<span className="text-ink-2">Read the introduction to this chapter (Hindi, from the book)</span>}>
              <div lang="hi" className="prose-source hindi reader mt-6 max-w-[68ch] text-ink">
                {src.intro.hi.map((b, i) =>
                  b.type === "heading" ? (
                    <h4 key={i} className="font-display mt-8 text-xl text-saffron">{b.text}</h4>
                  ) : (
                    <p key={i}>
                      <RichText text={b.text} lang="hi" />
                    </p>
                  ),
                )}
              </div>
            </Disclosure>
          </section>
        )}

        {nextCh && (
          <Link
            href={`/chapter/${c + 1}`}
            className="group mt-6 flex items-center justify-between gap-6 rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:p-8"
          >
            <div>
              <p className="eyebrow mb-2">Next chapter · {index[c]?.verseCount} verses</p>
              <p lang="sa" className="sanskrit text-2xl">{nextCh.nameSa}</p>
              <Bi t={nextCh.subtitle} as="p" className="font-display text-lg text-ink-2" />
            </div>
            <IconArrowRight className="shrink-0 text-ink-3 transition-transform group-hover:translate-x-1" size={26} />
          </Link>
        )}
      </div>
    </div>
  );
}
