"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface Sequence {
  label: { en: string; hi: string };
  href: string;
  ids: string[];
}

/** When a verse is opened from a guided journey/path, show where you are and what's next. */
export function JourneyBar({ id, sequences }: { id: string; sequences: Record<string, Sequence> }) {
  const params = useSearchParams();
  const key = params.get("seq");
  const seq = key ? sequences[key] : null;
  if (!seq) return null;
  const i = seq.ids.indexOf(id);
  if (i < 0) return null;
  const next = seq.ids[i + 1];
  const prev = seq.ids[i - 1];
  const href = (vid: string) => {
    const [c, v] = vid.split(".");
    return `/verse/${c}/${v}?seq=${encodeURIComponent(key!)}`;
  };
  return (
    <div className="fixed inset-x-0 bottom-[calc(4.2rem+env(safe-area-inset-bottom))] z-40 px-3 lg:bottom-5">
      <div className="rise mx-auto flex max-w-xl items-center gap-3 rounded-full border border-line bg-surface/95 py-2 pl-5 pr-2 shadow-[var(--shadow)] backdrop-blur">
        <div className="min-w-0 flex-1">
          <Link href={seq.href} className="block truncate text-xs text-ink-3 hover:text-ink">
            <span className="lang-en">{seq.label.en}</span>
            <span className="lang-hi hindi">{seq.label.hi}</span>
          </Link>
          <div className="mt-1 flex items-center gap-1" aria-label={`Step ${i + 1} of ${seq.ids.length}`}>
            {seq.ids.map((x, j) => (
              <span key={x + j} className={`h-1 flex-1 rounded-full ${j <= i ? "bg-saffron" : "bg-line"}`} />
            ))}
          </div>
        </div>
        {prev && (
          <Link href={href(prev)} className="rounded-full px-3 py-2 text-sm text-ink-2 hover:bg-surface-2" aria-label="Previous step">
            ←
          </Link>
        )}
        {next ? (
          <Link href={href(next)} className="rounded-full bg-ink px-4 py-2 text-sm text-bg">
            Next · {next}
          </Link>
        ) : (
          <Link href={seq.href} className="rounded-full bg-saffron px-4 py-2 text-sm text-bg">
            Finish
          </Link>
        )}
      </div>
    </div>
  );
}
