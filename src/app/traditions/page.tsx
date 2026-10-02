import type { Metadata } from "next";
import Link from "next/link";
import { FAMILY_LABEL, getTraditions } from "@/lib/os/data";
import { FAMILY_ORDER } from "@/lib/os/graph-props";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { SeenDot } from "@/components/os/seen";

export const metadata: Metadata = { title: "Traditions" };

export default function TraditionsPage() {
  const all = getTraditions();
  const families = [...new Set(all.map((t) => t.family))].sort((a, b) => {
    const r = (f: string) => (FAMILY_ORDER.indexOf(f) < 0 ? 99 : FAMILY_ORDER.indexOf(f));
    return r(a) - r(b);
  });
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Traditions & schools"
        title="Many ways of seeing."
        lead="Darśana means “a way of seeing”. These are the traditions that asked India’s great questions — and answered them differently. Explore each on its own terms; compare them when you are ready."
        tags={
          <>
            <SourceTag type="editorial" />
            <Link href="/explore" className="text-sm text-ink-2 underline-offset-4 hover:underline">
              See them as a map →
            </Link>
          </>
        }
      />
      {families.map((f) => (
        <section key={f} className="mb-14" aria-labelledby={`f-${f}`}>
          <h2 id={`f-${f}`} className="eyebrow mb-5 border-b border-line pb-3">
            {FAMILY_LABEL[f] ?? f}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {all
              .filter((t) => t.family === f)
              .map((t) => {
                const parent = t.parent ? all.find((p) => p.id === t.parent) : null;
                return (
                  <Link
                    key={t.id}
                    href={`/traditions/${t.id}`}
                    className="card group flex flex-col p-6 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      {t.name.sa ? (
                        <span lang="sa" className="sanskrit text-2xl text-ink-2">
                          {t.name.sa}
                        </span>
                      ) : (
                        <span />
                      )}
                      <SeenDot k={`tradition:${t.id}`} />
                    </div>
                    <span className="font-display text-xl text-ink group-hover:text-saffron">{t.name.en}</span>
                    {parent && <span className="text-xs text-ink-3">within {parent.name.en}</span>}
                    <span className="mt-2 text-sm leading-relaxed text-ink-3">{t.tagline}</span>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
