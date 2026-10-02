import type { Metadata } from "next";
import Link from "next/link";
import { curatedVerseIds, getAllChapterMeta, getCuratedVerse, getSourceVerse } from "@/lib/data";
import { Bi, L } from "@/components/bi";
import { LayerTag } from "@/components/verse/sections";

export const metadata: Metadata = { title: "Quick read" };

/** Quick Read mode: important verses, one line each. */
export default function QuickPage() {
  const chapters = getAllChapterMeta();
  const ids = new Set(curatedVerseIds());
  // chapter 2 is fully curated — keep only its key verses here; elsewhere show every curated verse
  const ch2Key = new Set([...(chapters[1].keyVerses ?? []), "2.7", "2.13", "2.14", "2.20", "2.22", "2.38", "2.47", "2.48", "2.50", "2.55", "2.62", "2.63", "2.70", "2.71"]);
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <header className="pb-12 pt-16 sm:pt-24">
        <p className="eyebrow mb-4">
          <L en="Quick read" hi="संक्षेपमें" />
        </p>
        <h1 className="font-display text-[clamp(2.3rem,6vw,4rem)] leading-[1.05]">
          <L en="The Gita in its key verses." hi="मुख्य श्लोकोंमें गीता।" />
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-2">
          <L
            en="One line for each important verse, chapter by chapter. Tap any verse to go deeper."
            hi="हर मुख्य श्लोकका एक वाक्यमें सार, अध्यायके क्रमसे।"
          />
        </p>
        <div className="mt-5">
          <LayerTag kind="summary" />
        </div>
      </header>
      {chapters.map((ch) => {
        const list = [...ids].filter((id) => id.startsWith(`${ch.chapter}.`) && (ch.chapter !== 2 || ch2Key.has(id)));
        if (!list.length) return null;
        return (
          <section key={ch.chapter} className="mb-14">
            <Link href={`/chapter/${ch.chapter}`} className="mb-5 flex items-baseline gap-3 border-b border-line pb-3">
              <span className="font-display text-ink-3">{ch.chapter}</span>
              <span lang="sa" className="sanskrit text-xl">{ch.nameSa}</span>
              <Bi t={ch.subtitle} className="text-sm text-ink-3" />
            </Link>
            <ul className="space-y-1">
              {list.map((id) => {
                const cv = getCuratedVerse(id)!;
                const sv = getSourceVerse(ch.chapter, Number(id.split(".")[1]));
                return (
                  <li key={id}>
                    <Link href={`/verse/${id.replace(".", "/")}`} className="group grid grid-cols-[3.2rem_1fr] gap-3 rounded-xl px-3 py-3 hover:bg-surface-2">
                      <span className="font-display pt-0.5 text-saffron">{id}</span>
                      <span>
                        <Bi t={cv.essence} as="span" className="font-display block text-lg leading-snug text-ink" />
                        <span lang="sa" className="sanskrit block truncate text-sm text-ink-3">{sv?.sanskrit[0]}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
