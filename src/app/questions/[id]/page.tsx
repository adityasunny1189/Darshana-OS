import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOsQuestion, getOsQuestions, getText, resolve, resolveMany } from "@/lib/os/data";
import { getQuestions as getGitaQuestions, verseCard } from "@/lib/data";
import { Motif } from "@/components/motif";
import { ContinueExploring, PageHeader, RefCard, Section, SourceTag } from "@/components/os/parts";
import { Seen } from "@/components/os/seen";
import { VerseCardView } from "@/components/verse/sections";
import { BookmarkButton } from "@/components/verse/verse-client";

export const dynamicParams = false;
export function generateStaticParams() {
  return getOsQuestions().map((q) => ({ id: q.id }));
}
export async function generateMetadata({ params }: PageProps<"/questions/[id]">): Promise<Metadata> {
  const { id } = await params;
  const q = getOsQuestion(id);
  return { title: q?.q ?? "Question", description: q?.quickAnswer };
}

export default async function QuestionPage({ params }: PageProps<"/questions/[id]">) {
  const { id } = await params;
  const q = getOsQuestion(id);
  if (!q) notFound();
  const concepts = resolveMany("concept", q.concepts);
  const traditions = resolveMany("tradition", q.traditions);
  const start = resolve(q.startHere.kind, q.startHere.id);
  const startVerse = q.startHere.kind === "gita" ? verseCard(q.startHere.id) : null;
  const deeper = (q.goDeeper ?? []).map((s) => ({ r: resolve(s.kind, s.id), note: s.note })).filter((x) => x.r);
  const gitaQs = getGitaQuestions().filter((g) => q.gitaQuestions?.includes(g.id));
  const related = resolveMany("question", q.related);
  // primary sources = every text cited by a perspective (references only unless ingested)
  const sources = new Map<string, { id: string; refs: string[]; traditions: string[] }>();
  for (const p of q.perspectives)
    for (const s of p.sources ?? []) {
      const e = sources.get(s.text) ?? { id: s.text, refs: [], traditions: [] };
      if (s.ref && !e.refs.includes(s.ref)) e.refs.push(s.ref);
      if (!e.traditions.includes(p.tradition)) e.traditions.push(p.tradition);
      sources.set(s.text, e);
    }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Seen k={`question:${q.id}`} />
      <nav className="pt-6 text-sm text-ink-3">
        <Link href="/questions" className="hover:text-ink">
          Questions
        </Link>
      </nav>
      <PageHeader
        center
        eyebrow="A question"
        title={q.q}
        tags={
          <>
            <SourceTag type="editorial" />
            <BookmarkButton kind="os-question" id={q.id} label={q.q} />
          </>
        }
      >
        <Motif name={q.motif} size={64} className="breathe mx-auto mt-8 text-gold/60" />
      </PageHeader>

      <Section title="Quick answer" id="quick" tag={<SourceTag type="editorial" />}>
        <p className="reader-lg font-display leading-relaxed text-ink">{q.quickAnswer}</p>
      </Section>

      <Section title="Concepts involved" id="concepts">
        <div className="flex flex-wrap gap-2">
          {concepts.map((c) => (
            <Link key={c.id} href={c.href} className="rounded-full border border-line bg-surface px-4 py-2 hover:border-saffron">
              <span className="sanskrit mr-2">{c.sa}</span>
              <span className="text-ink-2">{c.label.split(" — ")[0]}</span>
            </Link>
          ))}
        </div>
        <p className="eyebrow mb-3 mt-8">Traditions that address it</p>
        <div className="flex flex-wrap gap-2">
          {traditions.map((t) => (
            <Link key={t.id} href={t.href} className="rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-2 hover:border-saffron hover:text-saffron">
              {t.label}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Philosophical perspectives" id="perspectives" aside="Different answers, each in its own terms. None is ranked.">
        <div className="space-y-3">
          {q.perspectives.map((p) => {
            const t = resolve("tradition", p.tradition);
            return (
              <article key={p.tradition} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <Link href={t?.href ?? "#"} className="font-display text-xl text-ink hover:text-saffron">
                  {t?.label ?? p.tradition}
                </Link>
                <p className="mt-2 leading-relaxed text-ink-2">{p.view}</p>
                {(p.sources?.length ?? 0) > 0 && (
                  <p className="mt-3 flex flex-wrap gap-1.5 text-xs">
                    {p.sources!.map((s, i) => (
                      <Link key={i} href={`/texts/${s.text}`} className="rounded-full border border-line px-2.5 py-1 text-ink-3 hover:border-saffron hover:text-saffron">
                        {getText(s.text)?.title.en ?? s.text}
                        {s.ref ? ` ${s.ref}` : ""}
                      </Link>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </Section>

      <Section title="Start here" id="start">
        {startVerse ? (
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
            <VerseCardView card={startVerse} />
            {q.startHere.note && <p className="reader self-center text-ink-2">{q.startHere.note}</p>}
          </div>
        ) : start ? (
          <RefCard r={start} note={q.startHere.note} />
        ) : null}
        {deeper.length > 0 && (
          <>
            <p className="eyebrow mb-3 mt-10">Go deeper</p>
            <ol className="grid gap-3 sm:grid-cols-2">
              {deeper.map((d, i) => (
                <li key={i}>
                  <RefCard r={d.r!} note={d.note} index={i} />
                </li>
              ))}
            </ol>
          </>
        )}
      </Section>

      {sources.size > 0 && (
        <Section title="Primary sources" id="sources" aside="References to the texts behind each perspective.">
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {[...sources.values()].map((s) => {
              const t = getText(s.id);
              return (
                <li key={s.id}>
                  <Link href={`/texts/${s.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-surface-2">
                    <span className="font-display min-w-0 flex-1 text-lg text-ink">
                      {t?.title.en ?? s.id}
                      {s.refs.length > 0 && <span className="text-ink-3"> · {s.refs.join(", ")}</span>}
                    </span>
                    <SourceTag type={t?.ingested ? "ingested" : "not-ingested"} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {gitaQs.length > 0 && (
        <Section title="The Gita’s answer" id="gita" aside="Grounded in Sadhak Sanjivani.">
          <ul className="space-y-3">
            {gitaQs.map((g) => (
              <li key={g.id}>
                <Link href={`/questions#${g.id}`} className="block rounded-2xl border border-leaf/30 bg-surface p-5 transition-colors hover:border-leaf">
                  <span className="font-display block text-xl text-ink">{g.q.en}</span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-3">{g.answer.en}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <ContinueExploring
        groups={[
          { label: "Related questions", refs: related },
          { label: "Concepts", refs: concepts },
          { label: "Traditions", refs: traditions },
        ]}
      />
    </div>
  );
}
