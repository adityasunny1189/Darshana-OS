import type { Metadata } from "next";
import { resolveMany } from "@/lib/os/data";
import { ContinueExploring, PageHeader, SourceTag } from "@/components/os/parts";
import { Seen } from "@/components/os/seen";
import { PramanaExplorer } from "@/components/os/tools/pramana-explorer";

export const metadata: Metadata = { title: "How do we know something is true?" };

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Seen k="tool:pramana" />
      <PageHeader eyebrow="Nyaya · interactive" title="How do we know something is true?" lead="Nyaya built India’s great theory of knowledge and argument. Explore its means of valid knowledge (pramana), the five-step argument and the classic fallacies, then see how the schools disagree." tags={<SourceTag type="editorial" />} />
      <PramanaExplorer />
      <ContinueExploring
        groups={[
          { label: "Concepts", refs: resolveMany("concept", ["pramana", "jnana"]) },
          { label: "Traditions & texts", refs: [...resolveMany("tradition", ["nyaya", "vaisheshika", "mimamsa", "buddhism", "charvaka"]), ...resolveMany("text", ["nyaya-sutras", "vaisheshika-sutras"])] },
        ]}
      />
    </div>
  );
}
