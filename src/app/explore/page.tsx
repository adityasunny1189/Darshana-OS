import type { Metadata } from "next";
import Link from "next/link";
import { FAMILY_LABEL } from "@/lib/os/data";
import { fullGraphProps, traditionMapProps } from "@/lib/os/graph-props";
import { KnowledgeGraph } from "@/components/os/knowledge-graph";
import { TraditionMap } from "@/components/os/tradition-map";
import { PageHeader, SourceTag } from "@/components/os/parts";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  const map = traditionMapProps();
  const graph = fullGraphProps();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="The philosophy explorer"
        title="Navigate the philosophical universe."
        lead="Start from a tradition, or zoom into the web of concepts, texts and thinkers that connects them. Every line here comes from a recorded relationship in the data."
        tags={<SourceTag type="editorial">Relationships: editorial</SourceTag>}
      />

      <section aria-labelledby="traditions-map" className="pb-20">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 id="traditions-map" className="font-display text-2xl">
            Traditions
          </h2>
          <div className="flex gap-4 text-sm">
            <Link href="/traditions" className="text-ink-2 hover:text-ink">
              List view →
            </Link>
            <Link href="/darshanas" className="text-ink-2 hover:text-ink">
              The six darshanas →
            </Link>
          </div>
        </div>
        <TraditionMap {...map} familyLabels={FAMILY_LABEL} />
      </section>

      <section aria-labelledby="graph" className="pb-10">
        <div className="mb-5">
          <h2 id="graph" className="font-display text-2xl">
            The knowledge graph
          </h2>
          <p className="mt-2 max-w-2xl text-ink-3">
            {graph.nodes.length} nodes and {graph.edges.length} relationships. Filter by kind, narrow to a single tradition
            or text, search, zoom, and focus on one idea at a time.
          </p>
        </div>
        <KnowledgeGraph {...graph} />
      </section>
    </div>
  );
}
