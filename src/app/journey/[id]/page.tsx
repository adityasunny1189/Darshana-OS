import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJourneys, verseCards } from "@/lib/data";
import { Bi, L } from "@/components/bi";
import { SeenMark } from "@/components/progress";
import { LayerTag } from "@/components/verse/sections";

export const dynamicParams = false;
export function generateStaticParams() {
  return getJourneys().map((j) => ({ id: j.id }));
}
export async function generateMetadata({ params }: PageProps<"/journey/[id]">): Promise<Metadata> {
  const { id } = await params;
  const j = getJourneys().find((x) => x.id === id);
  return { title: j?.label.en ?? "Journey" };
}

export default async function JourneyPage({ params }: PageProps<"/journey/[id]">) {
  const { id } = await params;
  const j = getJourneys().find((x) => x.id === id);
  if (!j) notFound();
  const cards = verseCards(j.steps.map((s) => s.verse));
  const seq = `j-${j.id}`;
  const others = getJourneys().filter((x) => x.id !== j.id);

  return (
    <div className="lamp">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="pb-12 pt-16 text-center sm:pt-24">
          <p className="eyebrow mb-4">
            <L en="Your starting point" hi="आपका आरम्भ" />
          </p>
          <h1 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[1.08]">
            “<Bi t={j.label} />”
          </h1>
          <Bi t={j.intro} as="p" className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-2" />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {cards[0] && (
              <Link href={`/verse/${cards[0].chapter}/${cards[0].verse}?seq=${seq}`} className="rounded-full bg-ink px-6 py-3 text-bg">
                Begin with {cards[0].id} →
              </Link>
            )}
            <span className="text-sm text-ink-3">{cards.length} verses · about {cards.length * 3} minutes</span>
          </div>
        </header>

        <ol className="space-y-3">
          {j.steps.map((s, i) => {
            const v = cards.find((c) => c.id === s.verse);
            if (!v) return null;
            return (
              <li key={i}>
                <Link
                  href={`/verse/${v.chapter}/${v.verse}?seq=${seq}`}
                  className="card rise group flex gap-5 p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong sm:p-6"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span className="font-display w-7 shrink-0 text-2xl text-ink-3 group-hover:text-saffron">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow mb-1 block !text-saffron">{v.id}</span>
                    {v.headline && <Bi t={v.headline} as="span" className="font-display mb-1 block text-xl leading-snug text-ink" />}
                    <span lang="sa" className="sanskrit mb-2 block truncate text-ink-2">{v.sanskrit[0]}</span>
                    <Bi t={s.why} as="span" className="block text-sm leading-relaxed text-ink-3" />
                  </span>
                  <SeenMark id={v.id} />
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 text-center">
          <LayerTag kind="summary" />
        </div>

        <section className="mt-20 text-center">
          <p className="eyebrow mb-4">
            <L en="Or start somewhere else" hi="या कहींसे और" />
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {others.map((o) => (
              <Link key={o.id} href={`/journey/${o.id}`} className="rounded-full border border-line px-4 py-2 text-ink-2 hover:border-saffron hover:text-saffron">
                <Bi t={o.label} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
