import Link from "next/link";
import {
  curatedVerseIds,
  getAllChapterMeta,
  getChapterIndex,
  getConcepts,
  getCuratedVerse,
  getCuratedVerses,
  getJourneys,
  getPaths,
  getQuestions,
  getSourceVerse,
  verseCards,
} from "@/lib/data";
import { Bi, L } from "@/components/bi";
import { Motif } from "@/components/motif";
import { ChapterProgress } from "@/components/progress";
import { VerseCardView } from "@/components/verse/sections";
import { ContinueLearning, TodaysVerse, type ContinueInfo, type DailyVerse } from "./home-client";

const POPULAR = ["karma", "atma", "samatva", "asakti", "bhakti", "sharanagati", "jnana", "sthitaprajna"];
const FEATURED = ["2.47", "2.14", "2.62", "3.35", "6.5", "12.13", "18.66"];

export const metadata = { title: "Bhagavad Gita — Sadhak Sanjivani" };

export default function GitaHome() {
  const chapters = getAllChapterMeta();
  const index = getChapterIndex();
  const journeys = getJourneys();
  const paths = getPaths();
  const questions = getQuestions().slice(0, 6);
  const concepts = getConcepts();
  const popular = POPULAR.map((id) => concepts.find((c) => c.id === id)).filter((c) => !!c);
  const featured = verseCards(FEATURED.filter((id) => getCuratedVerse(id)));

  // daily verse pool: curated key verses outside the chapter-2 narrative opening
  const pool: DailyVerse[] = curatedVerseIds()
    .filter((id) => !/^1\./.test(id) && !/^2\.([1-9]|10)$/.test(id))
    .map((id) => {
      const cv = getCuratedVerse(id)!;
      const [c, v] = id.split(".").map(Number);
      const s = getSourceVerse(c, v)!;
      return { id, sanskrit: s.sanskrit, hindi: s.hindi, english: s.english, essence: cv.essence, headline: cv.headline };
    });

  const curated = getCuratedVerses();
  const lookup: Record<string, ContinueInfo> = {};
  for (const ch of index)
    for (const v of ch.verses) {
      const id = `${ch.chapter}.${v.n}`;
      lookup[id] = { id, chapterName: chapters[ch.chapter - 1].nameSa, headline: curated.get(id)?.headline.en ?? null, sa: v.first, total: ch.verseCount };
    }

  return (
    <div>
      {/* ---------- hero ---------- */}
      <section className="lamp relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
          <svg width="820" height="820" viewBox="0 0 820 820" className="slowspin text-gold/15">
            {Array.from({ length: 5 }, (_, i) => (
              <circle key={i} cx="410" cy="410" r={140 + i * 62} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray={i % 2 ? "2 10" : "none"} />
            ))}
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2;
              return <line key={i} x1={410 + Math.cos(a) * 140} y1={410 + Math.sin(a) * 140} x2={410 + Math.cos(a) * 388} y2={410 + Math.sin(a) * 388} stroke="currentColor" strokeWidth="0.6" />;
            })}
          </svg>
        </div>
        <div className="relative mx-auto flex min-h-[min(calc(100dvh-3.5rem),52rem)] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <p lang="sa" className="sanskrit fade-in mb-8 text-lg text-gold">
            श्रीमद्भगवद्गीता
          </p>
          <h1 className="font-display rise text-[clamp(3rem,10vw,6.5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            The Bhagavad Gita
          </h1>
          <p className="font-display rise mt-6 text-[clamp(1.4rem,3.4vw,2.1rem)] italic text-ink-2" style={{ animationDelay: "200ms" }}>
            A journey from confusion to clarity.
          </p>
          <p className="rise mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-2" style={{ animationDelay: "380ms" }}>
            <L
              en="Explore Krishna’s teachings through the wisdom of Sadhak Sanjivani — one verse, one idea, one realization at a time."
              hi="साधक-संजीवनीके प्रकाशमें भगवान्‌की वाणी — एक श्लोक, एक बात, एक अनुभूति।"
            />
          </p>
          <div className="rise mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "540ms" }}>
            <Link href="/journey/clarity" className="rounded-full bg-ink px-7 py-3.5 text-bg transition-transform hover:-translate-y-0.5">
              Begin the journey
            </Link>
            <Link href="/chapters" className="rounded-full border border-line-strong px-7 py-3.5 text-ink transition-colors hover:border-ink">
              Explore chapters
            </Link>
          </div>
          <p className="fade-in mt-16 text-sm text-ink-3" style={{ animationDelay: "900ms" }}>
            18 chapters · 700 verses · Sanskrit, हिन्दी & English
          </p>
        </div>
      </section>

      <div className="-mt-6 mb-20">
        <ContinueLearning lookup={lookup} />
      </div>

      {/* ---------- start with a question ---------- */}
      {journeys.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="brings">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <p className="font-display text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.1] text-ink">
                You don’t have to read the entire Gita today.
              </p>
              <p className="font-display mt-3 text-2xl italic text-ink-3">Start with one question.</p>
            </div>
            <div>
              <h2 id="brings" className="eyebrow mb-5">
                <L en="What brings you here?" hi="आप यहाँ किस लिये आये हैं?" />
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {journeys.map((j) => (
                  <Link
                    key={j.id}
                    href={`/journey/${j.id}`}
                    className="rounded-full border border-line bg-surface px-5 py-3 text-[1.02rem] text-ink transition-[border-color,transform,color] duration-300 hover:-translate-y-0.5 hover:border-saffron hover:text-saffron"
                  >
                    <Bi t={j.label} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- today's verse ---------- */}
      <section className="border-y border-line bg-surface/60 py-20" aria-label="Today's verse">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <TodaysVerse pool={pool} />
        </div>
      </section>

      {/* ---------- 18 chapters ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6" aria-labelledby="explore">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">
              <L en="Explore the Gita" hi="गीता-दर्शन" />
            </p>
            <h2 id="explore" className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight">
              <L en="Eighteen destinations." hi="अठारह पड़ाव।" />
            </h2>
          </div>
          <Link href="/chapters" className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
            All chapters →
          </Link>
        </div>
        <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {chapters.map((ch) => (
            <li key={ch.chapter}>
              <Link href={`/chapter/${ch.chapter}`} className="group flex h-full flex-col bg-surface p-4 transition-colors hover:bg-surface-2 sm:p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-display text-sm text-ink-3">{String(ch.chapter).padStart(2, "0")}</span>
                  <Motif name={ch.motif} size={26} className="text-gold/60 transition-colors group-hover:text-saffron" />
                </div>
                <span lang="sa" className="sanskrit mb-1 text-[1.05rem] leading-snug text-ink">
                  {ch.nameSa}
                </span>
                <Bi t={ch.subtitle} className="mb-4 text-[0.8rem] leading-snug text-ink-3" />
                <div className="mt-auto">
                  <ChapterProgress chapter={ch.chapter} total={index[ch.chapter - 1]?.verseCount ?? 0} />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- popular concepts ---------- */}
      {popular.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6" aria-labelledby="popular">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="popular" className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">
              <L en="Ideas to explore" hi="विचारणीय विषय" />
            </h2>
            <Link href="/concepts" className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
              See the map of ideas →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {popular.map((c) => (
              <Link key={c!.id} href={`/concepts/${c!.id}`} className="card group p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong">
                <span lang="sa" className="sanskrit block text-[1.7rem] text-ink group-hover:text-saffron">
                  {c!.sa}
                </span>
                <span className="font-display block text-lg text-ink-2">{c!.en}</span>
                <Bi t={c!.short} as="span" className="mt-2 line-clamp-2 block text-sm text-ink-3" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- learning paths ---------- */}
      {paths.length > 0 && (
        <section className="border-t border-line bg-surface/50 py-24" aria-labelledby="paths">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[1fr_1.5fr]">
            <div>
              <p className="eyebrow mb-3">
                <L en="Learning paths" hi="अध्ययनके मार्ग" />
              </p>
              <h2 id="paths" className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">
                <L en="New to the Gita? Walk it in order of ideas." hi="गीतामें नये हैं? विषयोंके क्रमसे चलिये।" />
              </h2>
            </div>
            <div>
              {paths[0] && (
                <Link href={`/paths/${paths[0].id}`} className="card group block p-6 transition-colors hover:border-line-strong sm:p-8">
                  <Bi t={paths[0].title} as="p" className="font-display mb-6 text-2xl text-ink" />
                  <ol className="space-y-0">
                    {paths[0].steps.map((s, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <span className="flex flex-col items-center">
                          <span className="h-2.5 w-2.5 rounded-full border border-saffron bg-bg" />
                          {i < paths[0].steps.length - 1 && <span className="h-6 w-px bg-line-strong" />}
                        </span>
                        <Bi t={s.title} className={`-mt-6 text-ink-2 ${i === paths[0].steps.length - 1 ? "!mt-0" : ""}`} />
                      </li>
                    ))}
                  </ol>
                  <span className="mt-6 inline-block text-saffron">Start here →</span>
                </Link>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {paths.slice(1).map((p) => (
                  <Link key={p.id} href={`/paths/${p.id}`} className="card p-5 transition-colors hover:border-line-strong">
                    <Bi t={p.title} as="p" className="font-display text-lg text-ink" />
                    <p className="mt-1 text-sm text-ink-3">{p.steps.length} steps</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- questions ---------- */}
      {questions.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6" aria-labelledby="questions">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="questions" className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">
              <L en="Questions you might have" hi="आपके प्रश्न" />
            </h2>
            <Link href="/questions" className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
              All questions →
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {questions.map((q) => (
              <Link key={q.id} href={`/questions#${q.id}`} className="group flex items-start gap-4 rounded-2xl border border-line p-5 transition-colors hover:border-saffron">
                <span className="font-display text-xl text-saffron">?</span>
                <Bi t={q.q} className="font-display text-xl leading-snug text-ink group-hover:text-saffron" hiClassName="!text-lg" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- featured teachings ---------- */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6" aria-labelledby="featured">
          <h2 id="featured" className="eyebrow mb-6">
            <L en="Featured teachings" hi="मुख्य उपदेश" />
          </h2>
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {featured.map((v) => (
              <div key={v.id} className="w-[78vw] shrink-0 snap-start sm:w-auto">
                <VerseCardView card={v} />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/quick" className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
              Quick read: the Gita in its key verses →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
