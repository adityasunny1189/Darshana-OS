import type { Metadata } from "next";
import { resolveMany } from "@/lib/os/data";
import { ContinueExploring, PageHeader, SourceTag } from "@/components/os/parts";
import { Seen } from "@/components/os/seen";
import { AnekantaExplorer } from "@/components/os/tools/anekanta-explorer";

export const metadata: Metadata = { title: "Many-Sided Reality" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Seen k="tool:anekanta" />
      <PageHeader eyebrow="Jain philosophy · interactive" title="Many-Sided Reality" lead="Anekantavada, the Jain teaching that reality has many aspects, and syadvada, the discipline of qualifying every claim with a standpoint." tags={<SourceTag type="editorial" />} />
      <AnekantaExplorer />
      <ContinueExploring
        groups={[
          { label: "Concepts", refs: resolveMany("concept", ["anekantavada", "ahimsa", "jiva"]) },
          { label: "Traditions & texts", refs: [...resolveMany("tradition", ["jainism"]), ...resolveMany("text", ["tattvartha-sutra"])] },
        ]}
      />
    </div>
  );
}
