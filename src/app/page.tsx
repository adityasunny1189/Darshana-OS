import Link from "next/link";
import {
  getComparisons,
  getOsConcept,
  getOsPaths,
  getOsQuestion,
  getText,
  getThinker,
  getTradition,
  getTraditions,
  getTexts,
  resolve,
} from "@/lib/os/data";
import { curatedVerseIds, getCuratedVerse, getSourceVerse } from "@/lib/data";
import { Motif } from "@/components/motif";
import { MoreLink, SourceTag } from "@/components/os/parts";
import { ContinueOS } from "@/components/os/continue";
import { TodaysVerse, type DailyVerse } from "./gita/home-client";

const HOME_QUESTIONS = ["self", "mind", "dharma", "karma", "reality", "bhakti", "freedom", "death", "god", "suffering"];
const DARSHANAS = ["nyaya", "vaisheshika", "sankhya", "yoga", "mimamsa", "vedanta"];
const CONCEPTS = ["atma", "brahman", "karma", "dharma", "maya", "moksha", "anatta", "anekantavada", "shunyata", "bhakti", "prakriti", "hukam"];
const TEXTS = ["bhagavad-gita", "katha-upanishad", "yoga-sutras", "sankhya-karika", "dhammapada", "tattvartha-sutra", "vivekachudamani", "guru-granth-sahib", "tirukkural", "mulamadhyamakakarika"];
const THINKERS = ["shankara", "ramanuja", "madhva", "patanjali", "nagarjuna", "mahavira", "abhinavagupta", "guru-nanak", "ramana-maharshi"];

export default function Home() {
  const questions = HOME_QUESTIONS.map(getOsQuestion).filter((q) => !!q);
  const darshanas = DARSHANAS.map(getTradition).filter((t) => !!t);
  const concepts = CONCEPTS.map(getOsConcept).filter((c) => !!c);
  const texts = TEXTS.map(getText).filter((t) => !!t);
  const thinkers = THINKERS.map(getThinker).filter((t) => !!t);
  const selfCmp = getComparisons().find((c) => c.id === "self");
  const paths = getOsPaths();
  const traditionCount = getTraditions().length;
  const textCount = getTexts().length;

  const pool: DailyVerse[] = curatedVerseIds()
    .filter((id) => !/^1\./.test(id) && !/^2\.([1-9]|10)$/.test(id))
    .map((id) => {
      const cv = getCuratedVerse(id)!;
      const [c, v] = id.split(".").map(Number);
      const s = getSourceVerse(c, v)!;
      return { id, sanskrit: s.sanskrit, hindi: s.hindi, english: s.english, essence: cv.essence, headline: cv.headline };
    });

  const lookup: Record<string, { label: string; href: string; kind: string }> = {};
  for (const t of getTraditions()) lookup[`tradition:${t.id}`] = { label: t.name.en, href: `/traditions/${t.id}`, kind: "Tradition" };
  for (const t of getTexts()) lookup[`text:${t.id}`] = { label: t.title.en, href: `/texts/${t.id}`, kind: "Text" };

  return (
    <div>
      {/* ---------- hero ---------- */}
      <section className="lamp relative overflow-hidden">
        <HeroArt />
        <div className="relative mx-auto flex min-h-[min(calc(100dvh-3.5rem),50rem)] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <p lang="sa" className="sanskrit fade-in mb-6 text-lg text-gold">
            दर्शन · darśana — a way of seeing
          </p>
          <h1 className="font-display rise text-[clamp(3rem,10vw,6.4rem)] leading-[0.95] tracking-[-0.03em] text-ink">Indian Philosophy</h1>
          <p className="font-display rise mt-6 max-w-3xl text-[clamp(1.35rem,3.2vw,2rem)] italic leading-snug text-ink-2" style={{ animationDelay: "200ms" }}>
            Explore the ideas that shaped thousands of years of Indian thought.
          </p>
          <p className="rise mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-2" style={{ animationDelay: "380ms" }}>
            From the Upanishads and Bhagavad Gita to Yoga, Vedanta, Buddhism, Jainism, Shaivism and beyond.
          </p>
          <div className="rise mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "540ms" }}>
            <Link href="/explore" className="rounded-full bg-ink px-7 py-3.5 text-bg transition-transform hover:-translate-y-0.5">
              Explore philosophy
            </Link>
            <a href="#questions" className="rounded-full border border-line-strong px-7 py-3.5 text-ink transition-colors hover:border-ink">
              Start with a question
            </a>
          </div>
          <p className="fade-in mt-14 text-sm text-ink-3" style={{ animationDelay: "900ms" }}>
            {traditionCount} traditions · {textCount} texts · concepts, thinkers and comparisons — all connected
          </p>
        </div>
      </section>

      <div className="-mt-4 mb-6">
        <ContinueOS lookup={lookup} />
      </div>

      {/* ---------- questions ---------- */}
      <section id="questions" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6" aria-labelledby="q-title">
        <p className="eyebrow mb-3">Question first</p>
        <h2 id="q-title" className="font-display mb-10 max-w-3xl text-[clamp(2rem,4.6vw,3.1rem)] leading-tight">
          What are you trying to understand?
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {questions.map((q, i) => (
            <Link
              key={q!.id}
              href={`/questions/${q!.id}`}
              className="card rise group flex flex-col p-5 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-line-strong"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Motif name={q!.motif} size={34} className="mb-6 text-gold/70 transition-colors group-hover:text-saffron" />
              <span className="font-display text-xl leading-snug text-ink">{q!.q}</span>
              <span className="mt-3 text-xs text-ink-3">
                {q!.traditions.length} traditions · {q!.concepts.length} concepts
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <MoreLink href="/questions">All questions</MoreLink>
        </div>
      </section>

      {/* ---------- explorer teaser ---------- */}
      <section className="border-y border-line bg-surface/60 py-20" aria-labelledby="universe">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">The philosophy explorer</p>
            <h2 id="universe" className="font-display text-[clamp(1.9rem,4.4vw,2.9rem)] leading-tight">
              Not a list of books — a map of ideas.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Vedanta and its schools, the six darshanas, Buddhist and Jain thought, Shaiva and Shakta traditions, Bhakti,
              Sikh philosophy and Tamil ethics — each connected to the concepts, texts and thinkers it shares with the
              others.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/explore" className="rounded-full bg-ink px-6 py-3 text-bg">
                Open the explorer
              </Link>
              <Link href="/traditions" className="rounded-full border border-line-strong px-6 py-3">
                Browse traditions
              </Link>
            </div>
          </div>
          <Link href="/explore" aria-label="Open the explorer" className="group block">
            <MiniUniverse />
          </Link>
        </div>
      </section>

      {/* ---------- six darshanas ---------- */}
      {darshanas.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6" aria-labelledby="six">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">षड्दर्शन</p>
              <h2 id="six" className="font-display text-[clamp(1.9rem,4.4vw,2.9rem)] leading-tight">
                The six darshanas
              </h2>
            </div>
            <MoreLink href="/darshanas">Compare all six</MoreLink>
          </div>
          <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
            {darshanas.map((d, i) => (
              <li key={d!.id}>
                <Link href={`/traditions/${d!.id}`} className="group flex h-full flex-col bg-surface p-5 transition-colors hover:bg-surface-2">
                  <span className="font-display text-sm text-ink-3">{i + 1}</span>
                  <span lang="sa" className="sanskrit mt-4 text-2xl text-ink group-hover:text-saffron">
                    {d!.name.sa}
                  </span>
                  <span className="font-display text-lg text-ink-2">{d!.name.en}</span>
                  <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-3">{d!.tagline}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---------- compare ---------- */}
      {selfCmp && (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6" aria-labelledby="cmp">
          <div className="card overflow-hidden">
            <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_1.5fr]">
              <div>
                <p className="eyebrow mb-3">Compare perspectives</p>
                <h2 id="cmp" className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">
                  {selfCmp.topic}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-2">{selfCmp.intro}</p>
                <p className="mt-4 text-sm text-ink-3">Understand → compare → reflect. No view is ranked.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/compare?topic=self" className="rounded-full bg-ink px-5 py-2.5 text-sm text-bg">
                    Compare traditions
                  </Link>
                  <SourceTag type="editorial" />
                </div>
              </div>
              <dl className="divide-y divide-line">
                {selfCmp.rows.slice(0, 6).map((r) => {
                  const t = getTradition(r.tradition);
                  return (
                    <div key={r.tradition} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                      <dt className="font-display text-ink">{t?.name.en.replace(/ \(.+\)$/, "").replace(" Vedanta", "")}</dt>
                      <dd className="text-ink-2">{r.claim}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* ---------- concepts ---------- */}
      {concepts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6" aria-labelledby="concepts">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="concepts" className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">
              Concepts that travel across traditions
            </h2>
            <MoreLink href="/concepts">All concepts</MoreLink>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {concepts.map((c) => (
              <Link key={c!.id} href={`/concepts/${c!.id}`} className="card group p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong">
                <span lang="sa" className="sanskrit block text-[1.6rem] text-ink group-hover:text-saffron">
                  {c!.name.sa}
                </span>
                <span className="font-display block text-[1.05rem] leading-snug text-ink-2">{c!.name.en.split(" — ")[0]}</span>
                <span className="mt-2 block text-xs text-ink-3">{c!.traditions.length} traditions</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- gita module ---------- */}
      <section className="border-y border-line bg-surface/60 py-20" aria-label="Bhagavad Gita">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 grid items-end gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow mb-3">First complete module</p>
              <h2 className="font-display text-[clamp(1.9rem,4.4vw,2.9rem)] leading-tight">The Bhagavad Gita, with Sadhak Sanjivani</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-2">
                All 700 verses — Sanskrit, Hindi and English, word-by-word meanings and Swami Ramsukhdas’s full
                commentary — with a learning layer for every verse of Chapter 2 and the key verses of every chapter.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/gita" className="rounded-full bg-ink px-6 py-3 text-bg">
                Open the Gita
              </Link>
              <SourceTag type="ingested" />
            </div>
          </div>
          <TodaysVerse pool={pool} />
        </div>
      </section>

      {/* ---------- texts ---------- */}
      {texts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6" aria-labelledby="texts">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="texts" className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">
              A library that knows how its books connect
            </h2>
            <MoreLink href="/texts">The whole library</MoreLink>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3">
            {texts.map((t) => (
              <Link
                key={t!.id}
                href={`/texts/${t!.id}`}
                className="card group flex w-60 shrink-0 snap-start flex-col p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong"
              >
                <span className="eyebrow mb-4">{t!.category.replace(/-/g, " ")}</span>
                {t!.title.sa && (
                  <span lang="sa" className="sanskrit text-lg leading-snug text-ink-2">
                    {t!.title.sa}
                  </span>
                )}
                <span className="font-display text-xl leading-snug text-ink group-hover:text-saffron">{t!.title.en}</span>
                <span className="mt-2 line-clamp-3 text-sm text-ink-3">{t!.summary}</span>
                <span className="mt-auto pt-4">
                  <SourceTag type={t!.ingested ? "ingested" : "not-ingested"} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- paths ---------- */}
      {paths.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6" aria-labelledby="paths">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="paths" className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">
              Learning paths
            </h2>
            <MoreLink href="/paths">All paths</MoreLink>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {paths.map((p) => (
              <Link key={p.id} href={`/paths/${p.id}`} className="card group p-6 transition-colors hover:border-line-strong sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="eyebrow">{p.level}</span>
                  <span className="text-xs text-ink-3">{p.steps.length} steps</span>
                </div>
                <p className="font-display mb-2 text-2xl text-ink group-hover:text-saffron">{p.title}</p>
                <p className="mb-5 text-sm leading-relaxed text-ink-2">{p.description}</p>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-3">
                  {p.steps.slice(0, 6).map((s, i) => (
                    <span key={i} className="flex items-center gap-2">
                      {resolve(s.kind, s.id)?.label.replace("Bhagavad Gita ", "Gita ") ?? s.title}
                      {i < Math.min(5, p.steps.length - 1) && <span className="text-line-strong">→</span>}
                    </span>
                  ))}
                  {p.steps.length > 6 && <span>…</span>}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- thinkers ---------- */}
      {thinkers.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-labelledby="thinkers">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="thinkers" className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">
              Thinkers in conversation
            </h2>
            <MoreLink href="/thinkers">All thinkers</MoreLink>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {thinkers.map((t) => (
              <Link key={t!.id} href={`/thinkers/${t!.id}`} className="group rounded-2xl border border-line p-4 text-center transition-colors hover:border-saffron">
                <span className="font-display mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-lg text-gold">
                  {t!.name.en.replace(/^(Adi |Swami |Guru )/, "")[0]}
                </span>
                <span className="block text-sm leading-snug text-ink group-hover:text-saffron">{t!.name.en.replace(/, the Buddha$/, "")}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function HeroArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
      <svg width="900" height="900" viewBox="0 0 900 900" className="slowspin text-gold/15">
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx="450" cy="450" r={120 + i * 62} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray={i % 2 ? "2 9" : "none"} />
        ))}
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r = i % 3 === 0 ? 430 : 368;
          return <circle key={i} cx={450 + Math.cos(a) * r} cy={450 + Math.sin(a) * r} r={i % 3 === 0 ? 3 : 1.6} fill="currentColor" />;
        })}
      </svg>
    </div>
  );
}

function MiniUniverse() {
  const labels = ["Vedanta", "Yoga", "Sankhya", "Nyaya", "Vaisheshika", "Mimamsa", "Buddhism", "Jainism", "Shaivism", "Shaktism", "Bhakti", "Sikh"];
  return (
    <svg viewBox="0 0 520 520" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" role="img" aria-label="Traditions around a centre">
      <circle cx="260" cy="260" r="190" fill="none" stroke="var(--line-strong)" strokeDasharray="2 6" />
      <circle cx="260" cy="260" r="110" fill="none" stroke="var(--line)" />
      {labels.map((l, i) => {
        const a = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
        const x = 260 + Math.cos(a) * 190;
        const y = 260 + Math.sin(a) * 190;
        const b = labels[(i + 5) % labels.length];
        const bi = labels.indexOf(b);
        const ba = (bi / labels.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <g key={l}>
            <path d={`M${x},${y} Q260,260 ${260 + Math.cos(ba) * 190},${260 + Math.sin(ba) * 190}`} fill="none" stroke="var(--saffron)" strokeOpacity=".18" />
            <line x1="260" y1="260" x2={x} y2={y} stroke="var(--line)" />
            <circle cx={x} cy={y} r="7" fill="var(--surface)" stroke="var(--gold)" strokeWidth="1.5" />
            <text x={x} y={y + (y > 260 ? 24 : -14)} textAnchor="middle" fontSize="13" fill="var(--ink-2)" style={{ fontFamily: "var(--font-sans)" }}>
              {l}
            </text>
          </g>
        );
      })}
      <circle cx="260" cy="260" r="38" fill="var(--surface)" stroke="var(--gold)" />
      <text x="260" y="266" textAnchor="middle" fontSize="16" fill="var(--ink)" className="sanskrit">
        दर्शन
      </text>
    </svg>
  );
}
