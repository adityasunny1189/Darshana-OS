import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  conceptsForText,
  getText,
  getTexts,
  getThinker,
  pathsIncluding,
  resolve,
  resolveMany,
  SOURCE_TYPE_LABEL,
} from "@/lib/os/data";
import { getAllChapterMeta, getChapterIndex } from "@/lib/data";
import { ContinueExploring, NotIngested, PageHeader, RefCard, Section, SourceTag } from "@/components/os/parts";
import { Seen } from "@/components/os/seen";
import { BookmarkButton } from "@/components/verse/verse-client";
import { Motif } from "@/components/motif";

export const dynamicParams = false;
export function generateStaticParams() {
  return getTexts().map((t) => ({ id: t.id }));
}
export async function generateMetadata({ params }: PageProps<"/texts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const t = getText(id);
  return { title: t?.title.en ?? "Text", description: t?.summary };
}

const GITA_CONNECTIONS = [
  ["vedanta", "Vedanta", "One of the three foundations (prasthāna-traya) of Vedanta, with the Upanishads and Brahma Sutras"],
  ["sankhya", "Sankhya", "Uses Sankhya’s vocabulary — prakriti, purusha, the gunas — especially in chapters 2, 13 and 14"],
  ["yoga", "Yoga", "Karma-, jnana-, dhyana- and bhakti-yoga; chapter 6 on meditation"],
  ["bhakti", "Bhakti", "Surrender and devotion culminate in 9.34, 12 and 18.66"],
] as const;

export default async function TextPage({ params }: PageProps<"/texts/[id]">) {
  const { id } = await params;
  const t = getText(id);
  if (!t) notFound();
  const author = t.author ? getThinker(t.author) : null;
  const traditions = resolveMany("tradition", t.traditions);
  const concepts = conceptsForText(t.id).map((c) => resolve("concept", c.id)!);
  const related = (t.relatedTexts ?? []).map((r) => ({ r: resolve("text", r.id), note: r.note })).filter((x) => x.r);
  const thinkers = resolveMany("thinker", t.thinkers);
  const paths = pathsIncluding("text", t.id);
  const isGita = t.id === "bhagavad-gita";
  const isSS = t.id === "sadhak-sanjivani";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Seen k={`text:${t.id}`} />
      <nav className="pt-6 text-sm text-ink-3">
        <Link href="/texts" className="hover:text-ink">
          Texts
        </Link>
      </nav>
      <PageHeader
        eyebrow={t.category.replace(/-/g, " ")}
        sa={t.title.sa}
        title={t.title.en}
        iast={t.title.iast}
        lead={t.summary}
        tags={
          <>
            <SourceTag type={t.sourceType} />
            <SourceTag type={t.ingested ? "ingested" : "not-ingested"} />
            {t.advanced && <SourceTag type="advanced">Advanced contemplative text</SourceTag>}
            <BookmarkButton kind="text" id={t.id} label={t.title.en} />
          </>
        }
      />

      <dl className="mb-6 grid gap-x-8 gap-y-4 rounded-3xl border border-line bg-surface p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Meta label="Tradition">
          {traditions.map((r, i) => (
            <span key={r.id}>
              <Link href={r.href} className="hover:text-saffron">
                {r.label}
              </Link>
              {i < traditions.length - 1 ? " · " : ""}
            </span>
          ))}
        </Meta>
        <Meta label="Difficulty">
          <span className="capitalize">{t.difficulty.replace("-", " → ")}</span>
        </Meta>
        <Meta label="Attribution">
          {author ? (
            <Link href={`/thinkers/${author.id}`} className="hover:text-saffron">
              {author.name.en}
            </Link>
          ) : null}
          {t.attribution && <span className="block text-sm text-ink-3">{t.attribution}</span>}
        </Meta>
        <Meta label="Period · language">
          <span className="text-sm">
            {t.period}
            {t.language ? ` · ${t.language}` : ""}
          </span>
        </Meta>
        <div className="sm:col-span-2 lg:col-span-4">
          <dt className="eyebrow mb-2">Themes</dt>
          <dd className="font-display text-lg text-ink">{t.themes.join(" · ")}</dd>
        </div>
      </dl>

      {(isGita || isSS) && <GitaModule />}

      <Section title="Why read this?" id="why">
        <p className="reader text-ink-2">{t.whyRead}</p>
        {t.story && (
          <div className="mt-6 rounded-2xl bg-surface-2 p-6">
            <p className="eyebrow mb-2">The frame story</p>
            <p className="leading-relaxed text-ink-2">{t.story}</p>
          </div>
        )}
      </Section>

      {(t.questions?.length ?? 0) > 0 && (
        <Section title="Questions it answers" id="questions">
          <ul className="space-y-3">
            {t.questions!.map((q) => (
              <li key={q} className="flex gap-3">
                <span className="font-display text-xl text-saffron">?</span>
                <span className="font-display text-xl leading-snug">{q}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Key teachings" id="teachings" tag={<SourceTag type="editorial" />}>
        <div className="space-y-5">
          {t.keyTeachings.map((k, i) => (
            <div key={i} className="flex gap-4">
              <span className="font-display mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-sm text-ink-3">{i + 1}</span>
              <div>
                <p className="font-display text-xl leading-snug text-ink">{k.title}</p>
                <p className="mt-1 leading-relaxed text-ink-2">{k.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {(t.structure?.length ?? 0) > 0 && (
        <Section title="Structure" id="structure">
          <ol className="grid gap-2 sm:grid-cols-2">
            {t.structure!.map((s, i) => (
              <li key={i} className="rounded-xl border border-line px-4 py-3">
                <span className="font-display text-lg text-ink">{s.label}</span>
                {s.note && <span className="block text-sm text-ink-3">{s.note}</span>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {(t.passages?.length ?? 0) > 0 && (
        <Section
          title="Important passages"
          id="passages"
          tag={<SourceTag type={t.ingested ? "primary-text" : "not-ingested"} />}
          aside={t.ingested ? undefined : "References only — the passages themselves are not reproduced until the source text is ingested."}
        >
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
            {t.passages!.map((p, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4">
                <span className="font-display w-20 shrink-0 text-saffron">{p.ref}</span>
                <span className="min-w-0 flex-1 text-ink-2">{p.about}</span>
                {p.gita && p.gita.length > 0 && (
                  <span className="flex flex-wrap gap-1.5 text-sm">
                    <span className="text-ink-3">cf. Gita</span>
                    {p.gita.map((g) => (
                      <Link key={g} href={`/verse/${g.replace(".", "/")}`} className="rounded-full border border-line px-2 py-0.5 text-ink-2 hover:border-saffron hover:text-saffron">
                        {g}
                      </Link>
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {!t.ingested && (
        <div className="mb-12">
          <NotIngested what={`The text of the ${t.title.en}`} />
        </div>
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

      {isGita && (
        <Section title="Where the Gita connects" id="connections">
          <div className="grid gap-3 sm:grid-cols-2">
            {GITA_CONNECTIONS.map(([tid, label, note]) => (
              <Link key={tid} href={`/traditions/${tid}`} className="card p-5 transition-colors hover:border-line-strong">
                <span className="eyebrow !text-saffron">Gita → {label}</span>
                <span className="mt-1 block leading-relaxed text-ink-2">{note}</span>
              </Link>
            ))}
            <Link href="/concepts/dharma" className="card p-5 transition-colors hover:border-line-strong">
              <span className="eyebrow !text-saffron">Gita → Dharma</span>
              <span className="mt-1 block leading-relaxed text-ink-2">Svadharma and duty — from Arjuna’s dilemma to 18.47</span>
            </Link>
            <Link href="/concepts/karma" className="card p-5 transition-colors hover:border-line-strong">
              <span className="eyebrow !text-saffron">Gita → Karma</span>
              <span className="mt-1 block leading-relaxed text-ink-2">Action without attachment to its fruit — 2.47, 3.19, 5.10</span>
            </Link>
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section title="Related texts" id="related">
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((x) => (
              <RefCard key={x.r!.id} r={x.r!} note={x.note} />
            ))}
          </div>
        </Section>
      )}

      {thinkers.length > 0 && (
        <Section title="Thinkers" id="thinkers">
          <div className="grid gap-3 sm:grid-cols-2">
            {thinkers.map((r) => (
              <RefCard key={r.id} r={r} />
            ))}
          </div>
        </Section>
      )}

      <ContinueExploring
        groups={[
          { label: "Traditions", refs: traditions },
          { label: "Learning paths", refs: paths.map((p) => ({ kind: "tool" as const, id: p.id, label: p.title, href: `/paths/${p.id}` })) },
        ]}
      />
      <p className="mt-6 text-xs text-ink-3">Source type: {SOURCE_TYPE_LABEL[t.sourceType] ?? t.sourceType}. Overview text on this page is editorial.</p>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="eyebrow mb-1">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

function GitaModule() {
  const chapters = getAllChapterMeta();
  const index = getChapterIndex();
  return (
    <section className="mb-12 overflow-hidden rounded-3xl border border-leaf/40 bg-surface">
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="eyebrow mb-2 !text-leaf">Full text available</p>
          <p className="font-display text-2xl leading-snug">Read all 700 verses with Sadhak Sanjivani</p>
          <p className="mt-2 leading-relaxed text-ink-2">
            Sanskrit, Hindi & English, word-by-word meanings, Swami Ramsukhdas’s complete commentary, and a learning
            layer — Learn, Read and Deep-dive modes.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/gita" className="rounded-full bg-ink px-5 py-2.5 text-sm text-bg">
              Open the Gita
            </Link>
            <Link href="/verse/2/47" className="rounded-full border border-line-strong px-5 py-2.5 text-sm">
              Start at 2.47
            </Link>
          </div>
        </div>
        <ol className="grid grid-cols-6 gap-1.5">
          {chapters.map((c) => (
            <li key={c.chapter}>
              <Link
                href={`/chapter/${c.chapter}`}
                title={`${c.chapter}. ${c.nameIast} · ${index[c.chapter - 1]?.verseCount} verses`}
                className="grid aspect-square place-items-center rounded-xl border border-line text-ink-3 transition-colors hover:border-saffron hover:text-saffron"
              >
                <Motif name={c.motif} size={22} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
