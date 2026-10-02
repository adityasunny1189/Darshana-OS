import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConcept as getGitaConcept, getQuestions as getGitaQuestions, verseCards } from "@/lib/data";
import { getComparisons, getOsConcept, getOsConcepts, questionsFor, resolve, resolveMany } from "@/lib/os/data";
import { localGraphProps } from "@/lib/os/graph-props";
import { Bi } from "@/components/bi";
import { IconQuote } from "@/components/icons";
import { KnowledgeGraph } from "@/components/os/knowledge-graph";
import { ContinueExploring, FollowIdea, PageHeader, Section, SourceTag } from "@/components/os/parts";
import { Seen } from "@/components/os/seen";
import { LayerTag, VerseCardView } from "@/components/verse/sections";
import { BookmarkButton } from "@/components/verse/verse-client";

export const dynamicParams = false;
export function generateStaticParams() {
  return getOsConcepts().map((c) => ({ id: c.id }));
}
export async function generateMetadata({ params }: PageProps<"/concepts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const c = getOsConcept(id);
  return { title: c ? `${c.name.en.split(" — ")[0]} · ${c.name.sa ?? ""}` : "Concept", description: c?.short };
}

export default async function ConceptPage({ params }: PageProps<"/concepts/[id]">) {
  const { id } = await params;
  const c = getOsConcept(id);
  if (!c) notFound();
  const gita = getGitaConcept(id); // Sadhak Sanjivani-grounded Gita layer, if this concept has one
  const gitaVerseIds = [...new Set([...(gita?.verses ?? []), ...(c.gitaVerses ?? [])])];
  const gitaVerses = verseCards(gitaVerseIds).slice(0, 9);
  const gitaQs = getGitaQuestions().filter((q) => q.concepts.includes(id));
  const traditions = resolveMany("tradition", c.traditions);
  const texts = resolveMany("text", c.texts);
  const related = resolveMany("concept", c.relatedConcepts);
  const questions = [...new Set([...(c.questions ?? []), ...questionsFor("concept", id).map((q) => q.id)])];
  const follow = (c.follow ?? []).map((s) => ({ r: resolve(s.kind, s.id), note: s.note })).filter((x) => x.r) as { r: NonNullable<ReturnType<typeof resolve>>; note?: string }[];
  const comparison = getComparisons().find((x) => x.concept === id);
  const graph = localGraphProps(`concept:${id}`, 34);
  const [qc, qv] = (gita?.quote?.from ?? "").split(".");
  const title = c.name.en.split(" — ")[0];
  const gloss = c.name.en.split(" — ")[1];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Seen k={`concept:${id}`} />
      <nav className="pt-6 text-sm text-ink-3">
        <Link href="/concepts" className="hover:text-ink">
          Concepts
        </Link>
      </nav>
      <PageHeader
        center
        sa={c.name.sa}
        title={title}
        iast={c.name.iast}
        lead={
          <>
            {gloss && <span className="font-display block text-2xl italic text-ink-2">{gloss}</span>}
            <span className="mt-3 block">{c.short}</span>
          </>
        }
        tags={
          <>
            <SourceTag type="editorial" />
            {gita && <SourceTag type="ingested">Gita layer: Sadhak Sanjivani</SourceTag>}
            <BookmarkButton kind="concept" id={id} label={title} />
          </>
        }
      />

      <div className="beginner-only mb-10 rounded-3xl bg-surface-2 p-6 sm:p-8">
        <p className="eyebrow mb-2">In simple words</p>
        <p className="reader text-ink">{c.beginner}</p>
      </div>

      <Section title="What is it?" id="what">
        <p className="reader text-ink">{c.what}</p>
        {c.scholar && (
          <div className="scholar-only mt-6 rounded-2xl border border-line p-5 text-[0.97rem] leading-relaxed text-ink-2">
            <p className="eyebrow mb-2">Scholar’s note</p>
            {c.scholar}
          </div>
        )}
      </Section>

      {(c.perspectives?.length ?? 0) > 0 && (
        <Section
          title="How its meaning differs"
          id="perspectives"
          tag={<SourceTag type="editorial" />}
          aside="Each tradition in its own terms. None is ranked."
        >
          <div className="space-y-3">
            {c.perspectives!.map((p) => {
              const t = resolve("tradition", p.tradition);
              return (
                <div key={p.tradition} className="grid gap-2 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <Link href={t?.href ?? "#"} className="font-display text-lg leading-snug text-ink hover:text-saffron">
                    {t?.label ?? p.tradition}
                  </Link>
                  <p className="leading-relaxed text-ink-2">{p.view}</p>
                </div>
              );
            })}
          </div>
          {comparison && (
            <Link href={`/compare?topic=${comparison.id}`} className="mt-5 inline-flex text-saffron underline-offset-4 hover:underline">
              Compare side by side: {comparison.topic} →
            </Link>
          )}
        </Section>
      )}

      {gita && (
        <section className="border-t border-line py-12" aria-labelledby="in-gita">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <h2 id="in-gita" className="font-display text-2xl">
              In the Bhagavad Gita — as Sadhak Sanjivani explains it
            </h2>
            <LayerTag kind="summary" />
          </div>
          <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
            <Bi t={gita.source} as="p" className="reader text-ink-2" />
            {gita.quote && (
              <figure className="h-fit rounded-2xl bg-surface-2 p-6">
                <IconQuote className="mb-2 text-gold" />
                <blockquote lang="hi" className="hindi reader text-ink">
                  {gita.quote.hi}
                </blockquote>
                <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-3">
                  <SourceTag type="modern-commentary">Sadhak Sanjivani</SourceTag>
                  <Link href={`/verse/${qc}/${qv}`} className="text-saffron hover:underline">
                    on Gita {gita.quote.from}
                  </Link>
                </figcaption>
              </figure>
            )}
          </div>
          {gitaQs.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {gitaQs.map((q) => (
                <Link key={q.id} href={`/questions#${q.id}`} className="rounded-full border border-line px-4 py-2 text-sm text-ink-2 hover:border-saffron hover:text-saffron">
                  {q.q.en}
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {gitaVerses.length > 0 && (
        <Section title="Where it appears in the Gita" id="gita-verses" tag={<SourceTag type="ingested" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {gitaVerses.map((v) => (
              <VerseCardView key={v.id} card={v} />
            ))}
          </div>
        </Section>
      )}

      {(texts.length > 0 || traditions.length > 0) && (
        <Section title="Where else it appears" id="appears">
          {texts.length > 0 && (
            <>
              <p className="eyebrow mb-3">Texts</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {texts.map((r) => (
                  <Link key={r.id} href={r.href} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm hover:border-saffron hover:text-saffron">
                    {r.label}
                  </Link>
                ))}
              </div>
            </>
          )}
          <p className="eyebrow mb-3">Traditions that use it</p>
          <div className="flex flex-wrap gap-2">
            {traditions.map((r) => (
              <Link key={r.id} href={r.href} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm hover:border-saffron hover:text-saffron">
                {r.label}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {follow.length > 0 && (
        <div className="border-t border-line">
          <FollowIdea steps={follow} />
        </div>
      )}

      <section className="border-t border-line py-12" aria-label="Related concepts graph">
        <h2 className="font-display mb-5 text-2xl">Explore related concepts</h2>
        <KnowledgeGraph {...graph} initialFocus={`concept:${id}`} filters={false} heightClass="h-[520px]" />
      </section>

      <ContinueExploring
        groups={[
          { label: "Related concepts", refs: related },
          { label: "Related texts", refs: texts.slice(0, 8) },
          { label: "Different perspectives", refs: traditions.slice(0, 8) },
          { label: "Questions", refs: questions.map((q) => resolve("question", q)).filter((x) => !!x) as NonNullable<ReturnType<typeof resolve>>[] },
        ]}
      />
    </div>
  );
}
