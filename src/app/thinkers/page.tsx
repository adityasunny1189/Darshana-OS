import type { Metadata } from "next";
import Link from "next/link";
import { getThinkers, getTradition } from "@/lib/os/data";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { SeenDot } from "@/components/os/seen";

export const metadata: Metadata = { title: "Thinkers" };

export default function ThinkersPage() {
  const all = getThinkers();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="People of the traditions"
        title="Thinkers"
        lead="Sages, systematisers, commentators, poets and modern teachers. Some are historical figures with debated dates; some are known through tradition and legend — each profile says which."
        tags={<SourceTag type="editorial" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((t) => (
          <Link key={t.id} href={`/thinkers/${t.id}`} className="card group flex flex-col p-6 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong">
            <div className="mb-3 flex items-start justify-between gap-3">
              <span className="font-display grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-xl text-gold">
                {t.name.en.replace(/^(Adi |Swami |Guru |Siddhartha )/, "")[0]}
              </span>
              <SeenDot k={`thinker:${t.id}`} />
            </div>
            {t.name.sa && (
              <span lang="sa" className="sanskrit text-lg text-ink-2">
                {t.name.sa}
              </span>
            )}
            <span className="font-display text-xl text-ink group-hover:text-saffron">{t.name.en}</span>
            <span className="mt-1 text-sm text-ink-3">{t.period}</span>
            <span className="mt-3 text-xs text-ink-3">{t.traditions.map((x) => getTradition(x)?.name.en ?? x).join(" · ")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
