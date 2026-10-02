import Link from "next/link";
import type { CuratedChapter } from "@/lib/types";
import { Bi } from "./bi";
import { Motif } from "./motif";
import { ChapterProgress } from "./progress";

export function ChapterCard({ ch, count, index = 0 }: { ch: CuratedChapter; count: number; index?: number }) {
  return (
    <Link
      href={`/chapter/${ch.chapter}`}
      className="card rise group relative flex h-full flex-col overflow-hidden p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow)]"
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
    >
      <div className="mb-6 flex items-start justify-between">
        <span className="font-display text-[2.6rem] leading-none text-ink-3/70 transition-colors group-hover:text-saffron">
          {String(ch.chapter).padStart(2, "0")}
        </span>
        <Motif name={ch.motif} size={44} className="text-gold/70 transition-transform duration-700 group-hover:scale-105" />
      </div>
      <p lang="sa" className="sanskrit mb-1 text-[1.35rem] leading-snug text-ink">
        {ch.nameSa}
      </p>
      <p className="mb-3 text-sm text-ink-3">{ch.nameIast}</p>
      <Bi t={ch.subtitle} as="p" className="font-display mb-2 text-xl leading-snug text-ink" />
      <Bi t={ch.tagline} as="p" className="mb-6 line-clamp-3 text-sm leading-relaxed text-ink-2" />
      <div className="mt-auto flex items-center gap-3">
        <div className="flex-1">
          <ChapterProgress chapter={ch.chapter} total={count} />
        </div>
        <ChapterProgress chapter={ch.chapter} total={count} variant="text" />
      </div>
    </Link>
  );
}
