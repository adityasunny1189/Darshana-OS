import type { Metadata } from "next";
import { getTexts, getTraditions } from "@/lib/os/data";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { TextLibrary } from "@/components/os/text-library";

export const metadata: Metadata = { title: "Texts" };

export default function TextsPage() {
  const texts = getTexts().map((t) => ({
    id: t.id,
    title: t.title.en,
    sa: t.title.sa,
    category: t.category,
    sourceType: t.sourceType,
    difficulty: t.difficulty,
    traditions: t.traditions,
    summary: t.summary,
    ingested: !!t.ingested,
    advanced: !!t.advanced,
  }));
  const traditions = getTraditions().map((t) => ({ id: t.id, name: t.name.en }));
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="The library"
        title="Texts"
        lead="Primary scriptures and sutras, traditional commentaries, and modern expositions — each labelled for what it is. The Bhagavad Gita with Sadhak Sanjivani is fully available; the others have structured overviews while their source texts await ingestion."
        tags={
          <>
            <SourceTag type="ingested" />
            <SourceTag type="not-ingested" />
          </>
        }
      />
      <TextLibrary texts={texts} traditions={traditions} />
    </div>
  );
}
