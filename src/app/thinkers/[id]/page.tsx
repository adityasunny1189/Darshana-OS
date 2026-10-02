import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getThinker, getThinkers, pathsIncluding, resolve, resolveMany, textsByThinker } from "@/lib/os/data";
import { ContinueExploring, PageHeader, RefCard, Section, SourceTag } from "@/components/os/parts";
import { Seen } from "@/components/os/seen";
import { BookmarkButton } from "@/components/verse/verse-client";

export const dynamicParams = false;
export function generateStaticParams() {
  return getThinkers().map((t) => ({ id: t.id }));
}
export async function generateMetadata({ params }: PageProps<"/thinkers/[id]">): Promise<Metadata> {
  const { id } = await params;
  const t = getThinker(id);
  return { title: t?.name.en ?? "Thinker", description: t?.context };
}

export default async function ThinkerPage({ params }: PageProps<"/thinkers/[id]">) {
  const { id } = await params;
  const t = getThinker(id);
  if (!t) notFound();
  const traditions = resolveMany("tradition", t.traditions);
  const works = textsByThinker(t.id);
  const concepts = resolveMany("concept", t.concepts);
  const influences = resolveMany("thinker", t.influences);
  const influenced = resolveMany("thinker", t.influenced);
  const related = resolveMany("thinker", t.relatedThinkers);
  const paths = pathsIncluding("thinker", t.id);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Seen k={`thinker:${t.id}`} />
      <nav className="pt-6 text-sm text-ink-3">
        <Link href="/thinkers" className="hover:text-ink">
          Thinkers
        </Link>
      </nav>
      <PageHeader
        eyebrow={traditions.map((r) => r.label).join(" · ")}
        sa={t.name.sa}
        title={t.name.en}
        lead={t.period}
        tags={
          <>
            <SourceTag type="editorial" />
            <BookmarkButton kind="thinker" id={t.id} label={t.name.en} />
          </>
        }
      />

      <Section title="Historical context" id="context">
        <p className="reader text-ink-2">{t.context}</p>
        {t.attributionNote && (
          <p className="mt-5 rounded-2xl border border-dashed border-line-strong px-5 py-4 text-sm leading-relaxed text-ink-3">
            <span className="font-medium text-ink-2">On attribution: </span>
            {t.attributionNote}
          </p>
        )}
      </Section>

      <Section title="Core ideas" id="ideas">
        <ul className="space-y-4">
          {t.coreIdeas.map((x, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
              <span className="reader text-ink">{x}</span>
            </li>
          ))}
        </ul>
      </Section>

      {(works.length > 0 || (t.otherWorks?.length ?? 0) > 0) && (
        <Section title="Major works" id="works">
          {works.length > 0 && (
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              {works.map((w) => (
                <RefCard key={w.id} r={resolve("text", w.id)!} />
              ))}
            </div>
          )}
          {(t.otherWorks?.length ?? 0) > 0 && (
            <p className="text-ink-2">
              <span className="text-ink-3">Also: </span>
              {t.otherWorks!.join(" · ")}
            </p>
          )}
        </Section>
      )}

      {concepts.length > 0 && (
        <Section title="Concepts" id="concepts">
          <div className="grid gap-3 sm:grid-cols-2">
            {concepts.map((c) => (
              <RefCard key={c.id} r={c} />
            ))}
          </div>
        </Section>
      )}

      {(t.disagreements?.length ?? 0) > 0 && (
        <Section title="Philosophical disagreements" id="disagreements" aside="Presented so you can understand each side — not to declare a winner.">
          <ul className="space-y-4">
            {t.disagreements!.map((d, i) => {
              const o = resolve("thinker", d.with) ?? resolve("tradition", d.with);
              return (
                <li key={i} className="rounded-2xl border border-line p-5">
                  <p className="mb-1 text-sm text-ink-3">
                    With{" "}
                    {o ? (
                      <Link href={o.href} className="text-ink hover:text-saffron">
                        {o.label}
                      </Link>
                    ) : (
                      d.with
                    )}
                  </p>
                  <p className="leading-relaxed text-ink-2">{d.note}</p>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {(influences.length > 0 || influenced.length > 0) && (
        <Section title="Lineage of ideas" id="lineage">
          <div className="grid gap-6 sm:grid-cols-2">
            {influences.length > 0 && (
              <div>
                <p className="eyebrow mb-3">Influenced by</p>
                <div className="space-y-2">
                  {influences.map((r) => (
                    <RefCard key={r.id} r={r} />
                  ))}
                </div>
              </div>
            )}
            {influenced.length > 0 && (
              <div>
                <p className="eyebrow mb-3">Influenced</p>
                <div className="space-y-2">
                  {influenced.map((r) => (
                    <RefCard key={r.id} r={r} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      <ContinueExploring
        groups={[
          { label: "Related thinkers", refs: related },
          { label: "Traditions", refs: traditions },
          { label: "Learning paths", refs: paths.map((p) => ({ kind: "tool" as const, id: p.id, label: p.title, href: `/paths/${p.id}` })) },
        ]}
      />
    </div>
  );
}
