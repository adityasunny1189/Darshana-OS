import type { Metadata } from "next";
import { resolveMany } from "@/lib/os/data";
import { ContinueExploring, PageHeader, SourceTag } from "@/components/os/parts";
import { Seen } from "@/components/os/seen";
import { TattvaExplorer } from "@/components/os/tools/tattva-explorer";

export const metadata: Metadata = { title: "The 25 Tattvas" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Seen k="tool:tattvas" />
      <PageHeader eyebrow="Sankhya · interactive" title="The 25 Tattvas" lead="Sankhya describes everything that exists as 25 principles (tattvas): one consciousness that only witnesses, and 24 unfoldings of nature. Step through the unfolding, or tap any tattva." tags={<SourceTag type="editorial" />} />
      <TattvaExplorer />
      <ContinueExploring
        groups={[
          { label: "Concepts", refs: resolveMany("concept", ["purusha", "prakriti", "guna", "buddhi", "ahankara", "manas", "tattva"]) },
          { label: "Traditions & texts", refs: [...resolveMany("tradition", ["sankhya", "yoga"]), ...resolveMany("text", ["sankhya-karika", "yoga-sutras", "bhagavad-gita"])] },
        ]}
      />
    </div>
  );
}
