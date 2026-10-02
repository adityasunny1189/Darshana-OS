import type { Metadata } from "next";
import { Suspense } from "react";
import { getComparisons, getText, getTradition } from "@/lib/os/data";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { CompareTool, type CmpData } from "@/components/os/compare-tool";

export const metadata: Metadata = { title: "Compare perspectives" };

export default function ComparePage() {
  const data: CmpData[] = getComparisons().map((c) => ({
    id: c.id,
    topic: c.topic,
    intro: c.intro,
    note: c.note ?? "",
    concept: c.concept ?? null,
    rows: c.rows.map((r) => ({
      tradition: r.tradition,
      name: getTradition(r.tradition)?.name.en ?? r.tradition,
      sa: getTradition(r.tradition)?.name.sa ?? "",
      claim: r.claim,
      detail: r.detail,
      sources: (r.sources ?? []).map((s) => ({ id: s.text, label: getText(s.text)?.title.en ?? s.text, ref: s.ref })),
    })),
  }));
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Comparative philosophy"
        title="Compare perspectives"
        lead="Choose a question and the traditions you want to hear from. Each answer is stated in that tradition’s own terms, with the texts it rests on. Nothing is ranked; the aim is understanding — then your own reflection."
        tags={<SourceTag type="editorial" />}
      />
      <Suspense fallback={<div className="h-96" />}>
        <CompareTool data={data} />
      </Suspense>
    </div>
  );
}
