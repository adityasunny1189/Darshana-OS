import type { Metadata } from "next";
import { getAllChapterMeta, getChapterIndex } from "@/lib/data";
import { ChapterCard } from "@/components/chapter-card";
import { L } from "@/components/bi";

export const metadata: Metadata = { title: "The 18 chapters" };

// The Gita's traditional three movements (ṣaṭka) — used only as a visual grouping.
const MOVEMENTS = [
  { from: 1, to: 6, en: "Chapters 1–6", hi: "अध्याय १–६", t: "Action and the self", th: "कर्म और स्वरूप" },
  { from: 7, to: 12, en: "Chapters 7–12", hi: "अध्याय ७–१२", t: "Knowing and loving God", th: "भगवान्‌का ज्ञान और भक्ति" },
  { from: 13, to: 18, en: "Chapters 13–18", hi: "अध्याय १३–१८", t: "Discernment and surrender", th: "विवेक और शरणागति" },
];

export default function ChaptersPage() {
  const chapters = getAllChapterMeta();
  const index = getChapterIndex();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <header className="pb-14 pt-16 sm:pt-24">
        <p className="eyebrow mb-4">
          <L en="Explore the Gita" hi="गीता-दर्शन" />
        </p>
        <h1 className="font-display max-w-3xl text-[clamp(2.3rem,6vw,4rem)] leading-[1.05]">
          <L en="Eighteen chapters, one conversation." hi="अठारह अध्याय, एक संवाद।" />
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
          <L
            en="700 verses spoken on a battlefield — from Arjuna’s collapse to his words “my delusion is gone.” Each chapter is a place to arrive at; you don’t have to go in order."
            hi="रणभूमिमें कहे गये ७०० श्लोक — अर्जुनके विषादसे लेकर ‘नष्टो मोहः’ तक। हर अध्याय एक पड़ाव है; क्रमसे पढ़ना आवश्यक नहीं।"
          />
        </p>
      </header>

      {MOVEMENTS.map((m) => (
        <section key={m.from} className="mb-16" aria-labelledby={`mv-${m.from}`}>
          <div className="mb-6 flex items-baseline gap-4 border-b border-line pb-3">
            <h2 id={`mv-${m.from}`} className="eyebrow">
              <L en={m.en} hi={m.hi} />
            </h2>
            <p className="font-display text-lg italic text-ink-3">
              <L en={m.t} hi={m.th} />
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapters
              .filter((c) => c.chapter >= m.from && c.chapter <= m.to)
              .map((c, i) => (
                <ChapterCard key={c.chapter} ch={c} count={index[c.chapter - 1]?.verseCount ?? 0} index={i} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
