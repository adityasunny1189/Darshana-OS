import type { Metadata } from "next";
import Link from "next/link";
import { getConcepts as getGitaConcepts } from "@/lib/data";
import { getComparisons, getGraph, getOsConcepts, getTraditions, layoutGraph } from "@/lib/os/data";
import { KnowledgeGraph } from "@/components/os/knowledge-graph";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { ConceptIndex } from "@/components/os/concept-index";

export const metadata: Metadata = { title: "Concepts" };

export default function ConceptsPage() {
  const concepts = getOsConcepts();
  const gitaIds = new Set(getGitaConcepts().map((c) => c.id));
  // concept-only graph
  const { nodes, edges } = getGraph();
  const cn = nodes.filter((n) => n.kind === "concept");
  const keys = new Set(cn.map((n) => n.key));
  const ce = edges.filter((e) => keys.has(e.a) && keys.has(e.b));
  const W = 1200;
  const H = 820;
  const pos = new Map(layoutGraph(cn, ce, { w: W, h: H, rest: 120, charge: 26000 }).map((p) => [p.key, p]));
  const graphNodes = cn.map((n) => ({ ...n, x: pos.get(n.key)!.x, y: pos.get(n.key)!.y, sub: concepts.find((c) => c.id === n.id)?.short }));
  const items = concepts.map((c) => ({
    id: c.id,
    sa: c.name.sa ?? "",
    en: c.name.en.split(" — ")[0],
    gloss: c.name.en.split(" — ")[1] ?? "",
    iast: c.name.iast ?? "",
    short: c.short,
    traditions: c.traditions,
    gita: gitaIds.has(c.id),
  }));
  const traditions = getTraditions().map((t) => ({ id: t.id, name: t.name.en }));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Concept explorer"
        title="The ideas, and how they connect."
        lead="The same word can mean different things in different traditions — karma in Mimamsa is not karma in Jainism; the self in Advaita is not the self in Nyaya. Each concept page shows where it appears, who uses it, and how its meaning shifts."
        tags={
          <>
            <SourceTag type="editorial" />
            <Link href="/compare" className="text-sm text-ink-2 underline-offset-4 hover:underline">
              Compare perspectives →
            </Link>
          </>
        }
      />

      <section className="mb-16" aria-label="Comparisons">
        <p className="eyebrow mb-4">Signature comparisons</p>
        <div className="flex flex-wrap gap-2">
          {getComparisons().map((c) => (
            <Link key={c.id} href={`/compare?topic=${c.id}`} className="rounded-full border border-line bg-surface px-4 py-2 font-display text-lg hover:border-saffron hover:text-saffron">
              {c.topic}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-20" aria-label="Concept graph">
        <KnowledgeGraph nodes={graphNodes} edges={ce.map((e) => [e.a, e.b] as [string, string])} width={W} height={H} filters={false} heightClass="h-[min(64vh,680px)] min-h-[440px]" />
      </section>

      <ConceptIndex items={items} traditions={traditions} />
    </div>
  );
}
