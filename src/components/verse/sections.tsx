import Link from "next/link";
import type { Concept, CuratedVerse, SourceVerse } from "@/lib/types";
import type { VerseCard } from "@/lib/data";
import { Bi, L } from "../bi";
import { IconQuote, IconSource } from "../icons";
import { BookmarkButton, GoDeeper } from "./verse-client";

/* ---------------- labels that make the source layers explicit ---------------- */

export function LayerTag({ kind }: { kind: "source" | "summary" | "analogy" }) {
  const map = {
    source: { en: "Source · Sadhak Sanjivani", hi: "मूल · साधक-संजीवनी", cls: "text-brown border-brown/25" },
    summary: { en: "Summary based on Sadhak Sanjivani", hi: "साधक-संजीवनीपर आधारित सार", cls: "text-indigo border-indigo/25" },
    analogy: { en: "Modern analogy · not from the source", hi: "आधुनिक उदाहरण · मूल ग्रन्थसे नहीं", cls: "text-leaf border-leaf/30" },
  }[kind];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide ${map.cls}`}>
      <L en={map.en} hi={map.hi} />
    </span>
  );
}

/* ---------------- Sanskrit ---------------- */

export function SanskritVerse({ v, size = "lg" }: { v: SourceVerse; size?: "lg" | "md" }) {
  // split each half-verse at the caesura for a calmer line length on phones
  return (
    <figure className="show-sa text-center">
      {v.speaker && (
        <figcaption className="mb-5 text-sm text-ink-3">
          <span className="sanskrit">{v.speaker.sa}</span>
          {v.speaker.en && <span className="ml-2 font-display italic">— {v.speaker.en}</span>}
        </figcaption>
      )}
      <div
        lang="sa"
        className={`sanskrit text-ink ${size === "lg" ? "text-[clamp(1.45rem,4.6vw,2.15rem)] leading-[1.85]" : "text-[1.35rem] leading-[1.8]"}`}
        style={{ fontSize: size === "lg" ? undefined : undefined }}
      >
        {v.sanskrit.map((line, i) => (
          <p key={i} className="rise" style={{ animationDelay: `${150 + i * 260}ms` }}>
            {line}
          </p>
        ))}
      </div>
      <div className="show-iast mt-5 space-y-0.5 text-[1.02rem]">
        {v.iast.map((line, i) => (
          <p key={i} className="iast">
            {line}
          </p>
        ))}
      </div>
    </figure>
  );
}

/* ---------------- Translations (source) ---------------- */

export function Translations({ v }: { v: SourceVerse }) {
  const group = v.group.length > 1 ? `${v.chapter}.${v.group[0]}–${v.group[v.group.length - 1]}` : null;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="show-hi card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="eyebrow hindi !tracking-normal !normal-case !text-[0.8rem]">हिन्दी</h3>
          <span className="text-[0.68rem] text-ink-3">साधक-संजीवनी{group ? ` · ${group}` : ""}</span>
        </div>
        <p lang="hi" className="hindi reader text-ink">
          {v.hindi || "—"}
        </p>
      </section>
      <section className="show-en card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="eyebrow">English</h3>
          <span className="text-[0.68rem] text-ink-3">Sadhaka-Sanjivani{group ? ` · ${group}` : ""}</span>
        </div>
        {v.english ? (
          <p className="reader font-serif text-ink">{v.english}</p>
        ) : (
          <p className="text-sm leading-relaxed text-ink-3">
            The English edition’s translation of this verse could not be recovered reliably from the scan. Please rely
            on the Hindi translation and the word-by-word meanings.
          </p>
        )}
      </section>
    </div>
  );
}

/* ---------------- Learn layer (curated) ---------------- */

export function LearnLayer({
  v,
  cv,
  concepts,
}: {
  v: SourceVerse;
  cv: CuratedVerse;
  concepts: Concept[];
}) {
  return (
    <div className="space-y-16">
      <section aria-labelledby="idea" className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <h2 id="idea" className="eyebrow">
            <L en="The idea" hi="मूल बात" />
          </h2>
          <LayerTag kind="summary" />
        </div>
        <Bi
          t={cv.essence}
          as="p"
          className="font-display text-[clamp(1.5rem,3.6vw,2.1rem)] leading-[1.3] text-ink"
          hiClassName="!font-[family-name:var(--font-hindi)] !leading-[1.6]"
        />
      </section>

      <section aria-labelledby="saying" className="max-w-3xl">
        <h2 id="saying" className="font-display mb-4 text-2xl text-ink">
          <L en="What is Krishna saying?" hi="भगवान् क्या कह रहे हैं?" />
        </h2>
        <Bi t={cv.idea} as="p" className="reader text-ink-2" />
      </section>

      {cv.contrast && <Contrast c={cv.contrast} />}

      {cv.points && cv.points.length > 0 && (
        <section aria-labelledby="points" className="max-w-3xl">
          <h2 id="points" className="eyebrow mb-5">
            <L en="Step by step" hi="क्रमसे" />
          </h2>
          <ol className="relative space-y-5 border-l border-line pl-7">
            {cv.points.map((p, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[2.3rem] top-0.5 grid h-6 w-6 place-items-center rounded-full border border-line bg-bg text-[0.7rem] text-ink-3">
                  {i + 1}
                </span>
                <Bi t={p} as="p" className="reader text-ink" />
              </li>
            ))}
          </ol>
        </section>
      )}

      {cv.examples && cv.examples.length > 0 && (
        <section aria-labelledby="think">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h2 id="think" className="font-display text-2xl text-ink">
              <L en="Think about it" hi="विचार कीजिये" />
            </h2>
            <span className="text-sm text-ink-3">
              <L en="Examples Swamiji gives in the commentary" hi="व्याख्यामें स्वामीजीके दृष्टान्त" />
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {cv.examples.map((ex, i) => (
              <article key={i} className="card group relative flex flex-col p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Bi t={ex.title} as="h3" className="font-display text-xl leading-snug text-ink" />
                  <BookmarkButton kind="example" id={`${cv.id}#${i}`} label={ex.title.en} compact />
                </div>
                <Bi t={ex.text} as="p" className="reader mb-5 text-ink-2" />
                <blockquote lang="hi" className="hindi mt-auto rounded-xl bg-surface-2 p-4 text-[0.95rem] leading-[1.9] text-ink-2">
                  <IconQuote size={16} className="mb-1 text-gold" />
                  {ex.quote.hi}
                  <footer className="mt-2 text-[0.7rem] text-ink-3" lang="en">
                    Sadhak Sanjivani · {ex.from === "appendix" ? "परिशिष्ट भाव" : "व्याख्या"} · {cv.id}
                  </footer>
                </blockquote>
              </article>
            ))}
          </div>
        </section>
      )}

      {cv.modern && cv.modern.length > 0 && (
        <section aria-labelledby="today">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h2 id="today" className="font-display text-2xl text-ink">
              <L en="What could this look like today?" hi="आज यह कैसा दिखेगा?" />
            </h2>
            <LayerTag kind="analogy" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {cv.modern.map((m, i) => (
              <article key={i} className="rounded-2xl border border-dashed border-leaf/35 p-6">
                <p className="eyebrow mb-2 !text-leaf">{m.context}</p>
                <Bi t={m.text} as="p" className="reader text-ink-2" />
              </article>
            ))}
          </div>
        </section>
      )}

      {cv.whyItMatters && (
        <section aria-labelledby="why" className="max-w-3xl rounded-3xl bg-surface-2 px-6 py-7 sm:px-9">
          <h2 id="why" className="eyebrow mb-3">
            <L en="Why it matters" hi="यह क्यों महत्त्वपूर्ण है" />
          </h2>
          <Bi t={cv.whyItMatters} as="p" className="font-display text-xl leading-relaxed text-ink" hiClassName="!font-[family-name:var(--font-hindi)] !text-lg" />
        </section>
      )}

      {cv.terms && cv.terms.length > 0 && (
        <section aria-labelledby="terms">
          <h2 id="terms" className="eyebrow mb-4">
            <L en="Key Sanskrit words" hi="मुख्य शब्द" />
          </h2>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {cv.terms.map((t, i) => (
              <div key={i} className="flex items-baseline gap-4 border-b border-line pb-3">
                <dt lang="sa" className="sanskrit shrink-0 text-xl text-brown">
                  {t.sa}
                </dt>
                <dd className="text-ink-2">
                  <Bi t={t.meaning} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="flex flex-col items-start gap-3 border-t border-line pt-10">
        <p className="text-ink-3">
          <L
            en="Ready for the full explanation? Swamiji explains each phrase of the verse in detail."
            hi="पूरी व्याख्या पढ़ें — स्वामीजी श्लोकके प्रत्येक पदका विस्तारसे अर्थ बताते हैं।"
          />
        </p>
        <GoDeeper />
      </div>

      {concepts.length > 0 && <ConceptChips concepts={concepts} />}
      <p className="sr-only">Verse {v.id}</p>
    </div>
  );
}

function Contrast({ c }: { c: NonNullable<CuratedVerse["contrast"]> }) {
  return (
    <section aria-label="Two sides" className="grid overflow-hidden rounded-3xl border border-line md:grid-cols-2">
      {[c.left, c.right].map((side, i) => (
        <div key={i} className={`p-6 sm:p-8 ${i === 0 ? "bg-surface" : "bg-surface-2 md:border-l md:border-line"}`}>
          <h3 className={`mb-5 font-display text-xl ${i === 0 ? "text-saffron" : "text-indigo"}`}>
            <Bi t={side.label} />
          </h3>
          <ul className="space-y-3">
            {side.items.map((it, j) => (
              <li key={j} className="flex gap-3">
                <span className={`mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? "bg-saffron" : "bg-indigo"}`} />
                <Bi t={it} className="reader text-ink" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function ConceptChips({ concepts }: { concepts: Concept[] }) {
  return (
    <section aria-labelledby="related-ideas">
      <h2 id="related-ideas" className="eyebrow mb-4">
        <L en="Related ideas" hi="सम्बन्धित विषय" />
      </h2>
      <div className="flex flex-wrap gap-2">
        {concepts.map((c) => (
          <Link
            key={c.id}
            href={`/concepts/${c.id}`}
            className="group flex items-baseline gap-2 rounded-full border border-line bg-surface px-4 py-2 transition-colors hover:border-saffron"
          >
            <span className="sanskrit text-[1.05rem] text-ink group-hover:text-saffron">{c.sa}</span>
            <span className="text-sm text-ink-3">{c.en}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Read layer (source, structured) ---------------- */

export function WordByWord({ v, terms }: { v: SourceVerse; terms?: CuratedVerse["terms"] }) {
  if (!v.words.length) return null;
  const en = new Map((terms ?? []).map((t) => [t.sa.replace(/[,:\s]/g, ""), t.meaning.en]));
  return (
    <section aria-labelledby="wbw">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 id="wbw" className="font-display text-2xl text-ink">
          <L en="Word by word" hi="शब्दार्थ" />
        </h2>
        <LayerTag kind="source" />
      </div>
      <p className="mb-5 max-w-2xl text-sm text-ink-3">
        <L
          en="Swamiji’s word meanings, in the order he reads the verse. Read them in sequence and they form the Hindi translation."
          hi="स्वामीजीके अन्वयके क्रमसे शब्दार्थ — क्रमसे पढ़नेपर यही अनुवाद बनता है।"
        />
      </p>
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {v.words.map((w, i) => {
          const e = en.get(w.sa.replace(/[,:\s]/g, ""));
          return (
            <div key={i} className="bg-surface px-4 py-3">
              <dt lang="sa" className="sanskrit text-lg text-brown">
                {w.sa}
              </dt>
              <dd lang="hi" className="hindi text-[0.95rem] text-ink-2">
                {w.hi}
              </dd>
              {e && <dd className="text-xs text-ink-3">{e}</dd>}
            </div>
          );
        })}
      </dl>
    </section>
  );
}

export function ContextLink({ v }: { v: SourceVerse }) {
  if (!v.link.hi && !v.link.en) return null;
  return (
    <section aria-labelledby="ctx" className="max-w-3xl">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 id="ctx" className="eyebrow">
          <L en="How this verse follows from the last" hi="सम्बन्ध" />
        </h2>
        <LayerTag kind="source" />
      </div>
      {v.link.hi && (
        <p lang="hi" className="show-hi hindi reader text-ink-2">
          {v.link.hi}
        </p>
      )}
      {v.link.en && <p className="show-en reader mt-3 font-serif italic text-ink-3">{v.link.en}</p>}
    </section>
  );
}

export function SourceNote({ v }: { v: SourceVerse }) {
  const s = v.source;
  return (
    <aside className="flex gap-4 rounded-2xl border border-line p-5 text-sm text-ink-2">
      <IconSource size={20} className="mt-0.5 shrink-0 text-ink-3" />
      <div>
        <p className="mb-1 font-medium text-ink">Source</p>
        <p>
          Sadhak Sanjivani — Chapter {v.chapter}, Verse {v.group.length > 1 ? `${v.group[0]}–${v.group[v.group.length - 1]}` : v.verse}.{" "}
          <span className="text-ink-3">
            Hindi edition (Gita Press, code 6) p. {s.hiPage}
            {s.enPage ? ` · English edition p. ${s.enPage}` : ""}.
          </span>
        </p>
        <p className="mt-2 text-ink-3">
          Sanskrit, translations, word meanings and commentary on this page are the book’s text. Sections marked
          “Summary” are our simplified reading of that text; “Modern analogy” cards are ours, added only to connect the
          teaching to daily life.
        </p>
      </div>
    </aside>
  );
}

/* ---------------- verse cards ---------------- */

export function VerseCardView({ card, why }: { card: VerseCard; why?: { en: string; hi: string } }) {
  return (
    <Link
      href={`/verse/${card.chapter}/${card.verse}`}
      className="card group flex h-full flex-col p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong"
    >
      <span className="eyebrow mb-3 !text-saffron">
        {card.chapter}.{card.verse}
      </span>
      {card.headline ? (
        <Bi t={card.headline} as="p" className="font-display mb-3 text-lg leading-snug text-ink" />
      ) : null}
      <p lang="sa" className="sanskrit mb-3 line-clamp-2 text-[1.05rem] text-ink-2">
        {card.sanskrit[0]}
      </p>
      {why ? (
        <Bi t={why} as="p" className="mt-auto text-sm leading-relaxed text-ink-3" />
      ) : card.essence ? (
        <Bi t={card.essence} as="p" className="mt-auto text-sm leading-relaxed text-ink-3" />
      ) : (
        <p lang="hi" className="hindi mt-auto line-clamp-3 text-sm text-ink-3">
          {card.hindi}
        </p>
      )}
    </Link>
  );
}
