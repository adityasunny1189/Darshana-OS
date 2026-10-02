import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  getChapterIndex,
  getChapterMeta,
  getConcept,
  getCuratedVerse,
  getSourceChapter,
  getSourceVerse,
  verseCards,
} from "@/lib/data";
import { sequencesFor } from "@/lib/sequences";
import type { Concept } from "@/lib/types";
import { Bi, L } from "@/components/bi";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";
import { Commentary } from "@/components/verse/commentary";
import { JourneyBar } from "@/components/verse/journey-bar";
import {
  ConceptChips,
  ContextLink,
  LayerTag,
  LearnLayer,
  SanskritVerse,
  SourceNote,
  Translations,
  VerseCardView,
  WordByWord,
} from "@/components/verse/sections";
import {
  BookmarkButton,
  NoteBox,
  ReadingProgress,
  SwitchMode,
  UnderstoodButton,
  VerseModes,
  VisitTracker,
} from "@/components/verse/verse-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return getChapterIndex().flatMap((c) => c.verses.map((v) => ({ c: String(c.chapter), v: String(v.n) })));
}

export async function generateMetadata({ params }: PageProps<"/verse/[c]/[v]">): Promise<Metadata> {
  const { c, v } = await params;
  const cv = getCuratedVerse(`${c}.${v}`);
  const s = getSourceVerse(+c, +v);
  return {
    title: `Gita ${c}.${v}${cv ? ` — ${cv.headline.en}` : ""}`,
    description: cv?.essence.en ?? s?.english ?? s?.hindi ?? undefined,
  };
}

export default async function VersePage({ params }: PageProps<"/verse/[c]/[v]">) {
  const { c: cs, v: vs } = await params;
  const c = Number(cs);
  const n = Number(vs);
  const v = getSourceVerse(c, n);
  if (!v) notFound();
  const chapter = getSourceChapter(c)!;
  const meta = getChapterMeta(c);
  const cv = getCuratedVerse(v.id);
  const concepts = (cv?.concepts ?? []).map(getConcept).filter((x): x is Concept => !!x);
  const related = verseCards((cv?.related ?? []).filter((r) => r !== v.id)).slice(0, 6);
  const count = chapter.verses.length;
  const index = getChapterIndex();
  const prev = n > 1 ? `${c}.${n - 1}` : c > 1 ? `${c - 1}.${index[c - 2].verseCount}` : null;
  const next = n < count ? `${c}.${n + 1}` : c < 18 ? `${c + 1}.1` : null;
  const section = meta.sections.find((s) => n >= s.from && n <= s.to);
  const sequences = sequencesFor(v.id);
  const groupNote =
    v.group.length > 1
      ? `Swamiji comments on verses ${c}.${v.group[0]}–${v.group[v.group.length - 1]} together.`
      : null;

  const read = (
    <div className="space-y-14">
      <ContextLink v={v} />
      <WordByWord v={v} terms={cv?.terms} />
      {!cv && (
        <p className="max-w-2xl rounded-2xl border border-dashed border-line-strong px-5 py-4 text-sm leading-relaxed text-ink-3">
          A simplified explanation for this verse hasn’t been written yet. Everything here is the text of Sadhak
          Sanjivani itself — the full commentary is one tap away in{" "}
          <SwitchMode to="deep">Deep dive</SwitchMode>.
        </p>
      )}
      <section aria-labelledby="preview">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 id="preview" className="font-display text-2xl text-ink">
            <L en="From the commentary" hi="व्याख्यासे" />
          </h2>
          <LayerTag kind="source" />
        </div>
        <Commentary id={`r${v.id}`} commentary={v.commentary} appendix={v.appendix} notes={v.notes} preview={2} />
      </section>
    </div>
  );

  const deep = (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-3xl text-ink">
          <L en="Sadhak Sanjivani commentary" hi="साधक-संजीवनी व्याख्या" />
        </h2>
        <LayerTag kind="source" />
      </div>
      {groupNote && <p className="text-sm text-ink-3">{groupNote}</p>}
      <Commentary id={`d${v.id}`} commentary={v.commentary} appendix={v.appendix} notes={v.notes} preview={40} />
      <SourceNote v={v} />
    </div>
  );

  return (
    <article className="lamp">
      <ReadingProgress />
      <VisitTracker id={v.id} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 pt-6 text-sm text-ink-3">
          <Link href="/chapters" className="hover:text-ink">
            <L en="Chapters" hi="अध्याय" />
          </Link>
          <span>/</span>
          <Link href={`/chapter/${c}`} className="truncate hover:text-ink">
            {c} · <span className="sanskrit">{meta.nameSa}</span>
          </Link>
          {section && (
            <span className="hidden truncate md:inline">
              / <Bi t={section.title} />
            </span>
          )}
        </nav>

        {/* verse header */}
        <header className="pb-10 pt-12 text-center sm:pt-16">
          <p className="eyebrow mb-5">
            Chapter {c} · Verse {n}
            {v.group.length > 1 && <span className="ml-2 normal-case tracking-normal text-ink-3">(with {v.group.filter((x) => x !== n).map((x) => `${c}.${x}`).join(", ")})</span>}
          </p>
          {cv && (
            <h1 className="rise mx-auto max-w-3xl font-display text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.12] text-ink">
              <Bi t={cv.headline} hiClassName="!font-[family-name:var(--font-hindi)] !leading-[1.45]" />
            </h1>
          )}
          {!cv && <h1 className="sr-only">Bhagavad Gita {v.id}</h1>}
        </header>

        <div className="py-6 sm:py-10">
          <SanskritVerse v={v} />
        </div>

        <div className="mt-10">
          <Translations v={v} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <BookmarkButton kind="verse" id={v.id} label={cv?.headline.en} />
          <UnderstoodButton id={v.id} />
          <NoteBox id={v.id} />
        </div>

        <div id="modes" className="mt-16">
          <VerseModes
            hasLearn={!!cv}
            learn={cv ? <LearnLayer v={v} cv={cv} concepts={concepts} /> : null}
            read={read}
            deep={deep}
          />
        </div>

        {!cv && concepts.length > 0 && (
          <div className="mt-16">
            <ConceptChips concepts={concepts} />
          </div>
        )}

        {related.length > 0 && (
          <section aria-labelledby="connected" className="mt-20">
            <h2 id="connected" className="eyebrow mb-5">
              <L en="Verses Swamiji connects to this one" hi="जुड़े हुए श्लोक" />
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <VerseCardView key={r.id} card={r} />
              ))}
            </div>
          </section>
        )}

        {/* prev / next */}
        <nav aria-label="Verse navigation" className="mt-20 grid grid-cols-2 gap-3 border-t border-line pt-8">
          {prev ? (
            <Link href={`/verse/${prev.replace(".", "/")}`} className="group flex items-center gap-3 rounded-2xl p-3 hover:bg-surface-2">
              <IconChevronLeft className="text-ink-3 transition-transform group-hover:-translate-x-1" />
              <span>
                <span className="eyebrow block">Previous</span>
                <span className="font-display text-lg">{prev}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/verse/${next.replace(".", "/")}`} className="group flex items-center justify-end gap-3 rounded-2xl p-3 text-right hover:bg-surface-2">
              <span>
                <span className="eyebrow block">Next</span>
                <span className="font-display text-lg">{next}</span>
              </span>
              <IconChevronRight className="text-ink-3 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
        <p className="mt-4 text-center text-xs text-ink-3">
          Verse {n} of {count} in chapter {c}
        </p>
      </div>
      <Suspense fallback={null}>
        <JourneyBar id={v.id} sequences={sequences} />
      </Suspense>
    </article>
  );
}
