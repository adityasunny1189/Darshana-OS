import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  childrenOf,
  FAMILY_LABEL,
  getTradition,
  getTraditions,
  pathsIncluding,
  questionsFor,
  resolve,
  resolveMany,
  textsForTradition,
  thinkersForTradition,
} from "@/lib/os/data";
import { localGraphProps } from "@/lib/os/graph-props";
import { ContinueExploring, PageHeader, RefCard, Section, SourceTag } from "@/components/os/parts";
import { KnowledgeGraph } from "@/components/os/knowledge-graph";
import { Seen } from "@/components/os/seen";
import { BookmarkButton } from "@/components/verse/verse-client";
import { DarshanaCard } from "@/components/os/darshana";

export const dynamicParams = false;
export function generateStaticParams() {
  return getTraditions().map((t) => ({ id: t.id }));
}
export async function generateMetadata({ params }: PageProps<"/traditions/[id]">): Promise<Metadata> {
  const { id } = await params;
  const t = getTradition(id);
  return { title: t?.name.en ?? "Tradition", description: t?.tagline };
}

export default async function TraditionPage({ params }: PageProps<"/traditions/[id]">) {
  const { id } = await params;
  const t = getTradition(id);
  if (!t) notFound();
  const parent = t.parent ? getTradition(t.parent) : null;
  const kids = childrenOf(t.id);
  const texts = textsForTradition(t.id);
  const thinkers = thinkersForTradition(t.id);
  const concepts = resolveMany("concept", t.coreConcepts);
  const related = (t.relatedTraditions ?? []).map((r) => ({ r: resolve("tradition", r.id), note: r.note })).filter((x) => x.r);
  const questions = questionsFor("tradition", t.id);
  const paths = pathsIncluding("tradition", t.id);
  const graph = localGraphProps(`tradition:${t.id}`, 40);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Seen k={`tradition:${t.id}`} />
      <nav className="pt-6 text-sm text-ink-3">
        <Link href="/traditions" className="hover:text-ink">
          Traditions
        </Link>
        {parent && (
          <>
            {" / "}
            <Link href={`/traditions/${parent.id}`} className="hover:text-ink">
              {parent.name.en}
            </Link>
          </>
        )}
      </nav>
      <PageHeader
        eyebrow={FAMILY_LABEL[t.family] ?? t.family}
        sa={t.name.sa}
        title={t.name.en}
        iast={t.name.iast}
        lead={t.tagline}
        tags={
          <>
            <SourceTag type="editorial" />
            {t.period && <span className="text-sm text-ink-3">{t.period}</span>}
            <BookmarkButton kind="tradition" id={t.id} label={t.name.en} />
          </>
        }
      />

      <div className="beginner-only mb-10 rounded-3xl bg-surface-2 p-6 sm:p-8">
        <p className="eyebrow mb-2">In simple words</p>
        <p className="reader text-ink">{t.beginner}</p>
      </div>

      <Section title="Overview" id="overview">
        <p className="reader text-ink-2">{t.overview}</p>
        {t.scholar && (
          <div className="scholar-only mt-6 rounded-2xl border border-line p-5 text-[0.97rem] leading-relaxed text-ink-2">
            <p className="eyebrow mb-2">Scholar’s note</p>
            {t.scholar}
          </div>
        )}
      </Section>

      <Section title="Core questions" id="questions">
        <ul className="space-y-3">
          {t.coreQuestions.map((q) => (
            <li key={q} className="flex gap-3">
              <span className="font-display text-xl text-saffron">?</span>
              <span className="font-display text-xl leading-snug text-ink">{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      {t.darshana && (
        <Section title="How it sees" id="darshana" tag={<SourceTag type="editorial" />}>
          <DarshanaCard d={t.darshana} />
        </Section>
      )}

      {concepts.length > 0 && (
        <Section title="Core concepts" id="concepts">
          <div className="grid gap-3 sm:grid-cols-2">
            {concepts.map((c) => (
              <RefCard key={c.id} r={c} />
            ))}
          </div>
        </Section>
      )}

      {kids.length > 0 && (
        <Section title="Schools within" id="schools">
          <div className="grid gap-3 sm:grid-cols-2">
            {kids.map((k) => (
              <RefCard key={k.id} r={resolve("tradition", k.id)!} />
            ))}
          </div>
        </Section>
      )}

      {texts.length > 0 && (
        <Section title="Primary texts" id="texts">
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {texts.map((x) => (
              <li key={x.id}>
                <Link href={`/texts/${x.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-surface-2">
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-lg text-ink">{x.title.en}</span>
                    <span className="block text-sm text-ink-3">{x.summary}</span>
                  </span>
                  <SourceTag type={x.ingested ? "ingested" : "not-ingested"} />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {thinkers.length > 0 && (
        <Section title="Major thinkers" id="thinkers">
          <div className="grid gap-3 sm:grid-cols-2">
            {thinkers.map((x) => (
              <RefCard key={x.id} r={resolve("thinker", x.id)!} />
            ))}
          </div>
        </Section>
      )}

      {(t.disagreements?.length ?? 0) > 0 && (
        <Section title="Where it disagrees" id="disagreements" aside="Stated neutrally. The purpose is understanding, not a verdict.">
          <ul className="space-y-4">
            {t.disagreements!.map((d, i) => {
              const other = resolve("tradition", d.with) ?? resolve("thinker", d.with);
              return (
                <li key={i} className="rounded-2xl border border-line p-5">
                  <p className="mb-1 text-sm text-ink-3">
                    With{" "}
                    {other ? (
                      <Link href={other.href} className="text-ink hover:text-saffron">
                        {other.label}
                      </Link>
                    ) : (
                      d.with
                    )}
                    {d.topic && <> · {d.topic}</>}
                  </p>
                  <p className="leading-relaxed text-ink-2">{d.note}</p>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {related.length > 0 && (
        <Section title="Related traditions" id="related">
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((x) => (
              <RefCard key={x.r!.id} r={x.r!} note={x.note} />
            ))}
          </div>
        </Section>
      )}

      <section className="border-t border-line py-12" aria-label="Connections">
        <h2 className="font-display mb-5 text-2xl">Connections</h2>
        <KnowledgeGraph {...graph} initialFocus={`tradition:${t.id}`} filters={false} heightClass="h-[520px]" />
      </section>

      <ContinueExploring
        groups={[
          { label: "Questions", refs: questions.map((q) => resolve("question", q.id)!).filter(Boolean) },
          { label: "Learning paths", refs: paths.map((p) => ({ kind: "tool" as const, id: p.id, label: p.title, href: `/paths/${p.id}` })) },
          { label: "Compare", refs: [{ kind: "tool" as const, id: "compare", label: "Compare perspectives", href: `/compare?traditions=${t.id}` }] },
        ]}
      />
    </div>
  );
}
