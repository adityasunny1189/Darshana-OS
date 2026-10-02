import type { Metadata } from "next";
import Link from "next/link";
import { getJourneys, getPaths as getGitaPaths } from "@/lib/data";
import { getOsPaths, resolve } from "@/lib/os/data";
import { Bi } from "@/components/bi";
import { Motif } from "@/components/motif";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { PathProgress } from "@/components/os/path-progress";

export const metadata: Metadata = { title: "Learning paths" };

const MOTIF: Record<string, string> = { foundations: "seed", "self-inquiry": "eye", mind: "lotus", god: "sun" };
const TOOLS = [
  { href: "/tools/tattvas", title: "25 Tattvas Explorer", note: "See the Sankhya model of reality unfold, from purusha and prakriti to the elements.", motif: "tree" },
  { href: "/tools/anekanta", title: "Many-Sided Reality", note: "The Jain teaching of anekantavada and syadvada, one viewpoint at a time.", motif: "eye" },
  { href: "/tools/pramana", title: "How do we know something is true?", note: "Nyaya’s means of valid knowledge — perception, inference, comparison, testimony.", motif: "scales" },
];

export default function PathsPage() {
  const os = getOsPaths();
  const gita = getGitaPaths();
  const journeys = getJourneys();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Learning paths"
        title="From beginner to serious study."
        lead="Curated journeys that move across texts, traditions and thinkers in a meaningful order — so each idea prepares you for the next."
        tags={<SourceTag type="editorial" />}
      />

      <section className="mb-20 grid gap-4 md:grid-cols-2" aria-label="Paths across traditions">
        {os.map((p, i) => (
          <Link
            key={p.id}
            href={`/paths/${p.id}`}
            className={`card group flex flex-col p-7 transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-line-strong ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <div className="mb-5 flex items-start justify-between">
              <Motif name={MOTIF[p.id] ?? "path"} size={42} className="text-gold/70 group-hover:text-saffron" />
              <span className="eyebrow">{p.level}</span>
            </div>
            <p className="font-display mb-2 text-2xl text-ink">{p.title}</p>
            <p className="mb-5 max-w-2xl leading-relaxed text-ink-2">{p.description}</p>
            <p className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-3">
              {p.steps.map((s, j) => (
                <span key={j} className="flex items-center gap-2">
                  {resolve(s.kind, s.id)?.label.replace("Bhagavad Gita ", "Gita ") ?? s.title}
                  {j < p.steps.length - 1 && <span className="text-line-strong">→</span>}
                </span>
              ))}
            </p>
            <div className="mt-auto">
              <PathProgress keys={p.steps.map((s) => `${s.kind}:${s.id}`)} />
            </div>
          </Link>
        ))}
      </section>

      <section className="mb-20" aria-labelledby="tools">
        <h2 id="tools" className="font-display mb-6 text-2xl">
          Interactive explainers
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="card group p-6 transition-colors hover:border-line-strong">
              <Motif name={t.motif} size={36} className="mb-5 text-gold/70 group-hover:text-saffron" />
              <p className="font-display mb-2 text-xl text-ink">{t.title}</p>
              <p className="text-sm leading-relaxed text-ink-3">{t.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line pt-14" aria-labelledby="gita-paths">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h2 id="gita-paths" className="font-display text-2xl">
            Within the Bhagavad Gita
          </h2>
          <SourceTag type="ingested">Sadhak Sanjivani</SourceTag>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {gita.map((p) => (
            <Link key={p.id} href={`/paths/${p.id}`} className="card p-6 transition-colors hover:border-line-strong">
              <Bi t={p.title} as="p" className="font-display mb-2 text-xl text-ink" />
              <Bi t={p.description} as="p" className="line-clamp-3 text-sm leading-relaxed text-ink-3" />
              <p className="mt-3 text-xs text-ink-3">{p.steps.length} steps</p>
            </Link>
          ))}
        </div>
        {journeys.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {journeys.map((j) => (
              <Link key={j.id} href={`/journey/${j.id}`} className="rounded-full border border-line px-4 py-2 text-sm text-ink-2 hover:border-saffron hover:text-saffron">
                <Bi t={j.label} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
