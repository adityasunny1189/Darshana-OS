import type { Metadata } from "next";
import Link from "next/link";
import { getOsConcept, getOsConcepts, getOsQuestions } from "@/lib/os/data";
import { getQuestions as getGitaQuestions } from "@/lib/data";
import { Motif } from "@/components/motif";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { QuestionFinder } from "@/components/os/question-finder";
import { GitaQuestions } from "@/components/gita/gita-questions";

export const metadata: Metadata = { title: "Questions" };

export default function QuestionsPage() {
  const qs = getOsQuestions();
  const finderQuestions = [
    ...qs.map((q) => ({
      id: q.id,
      q: q.q,
      href: `/questions/${q.id}`,
      kind: "os" as const,
      words: [q.q, q.quickAnswer, ...q.concepts.map((c) => getOsConcept(c)?.name.en ?? c)].join(" "),
    })),
    ...getGitaQuestions().map((q) => ({ id: q.id, q: q.q.en, href: `/questions#${q.id}`, kind: "gita" as const, words: [q.q.en, q.answer.en, ...q.concepts].join(" ") })),
  ];
  const concepts = getOsConcepts().map((c) => ({ id: c.id, label: c.name.en, sa: c.name.sa ?? "", words: [c.name.en, c.name.iast ?? "", c.short].join(" ") }));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Explore a question"
        title="Start with what you’re asking."
        lead="You don’t need to know which tradition holds the answer. Ask in your own words — you’ll be taken to the concepts, traditions and sources that address it. Nothing here is generated; every route is mapped in advance."
        tags={<SourceTag type="editorial" />}
      />

      <QuestionFinder questions={finderQuestions} concepts={concepts} />

      <section className="mt-16" aria-labelledby="big">
        <h2 id="big" className="eyebrow mb-5">
          The big questions · {qs.length}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {qs.map((q) => (
            <Link key={q.id} href={`/questions/${q.id}`} className="card group flex gap-5 p-6 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong">
              <Motif name={q.motif} size={36} className="shrink-0 text-gold/70 group-hover:text-saffron" />
              <span>
                <span className="font-display block text-xl leading-snug text-ink">{q.q}</span>
                <span className="mt-2 line-clamp-2 block text-sm text-ink-3">{q.quickAnswer}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-4xl border-t border-line pt-14">
        <GitaQuestions />
      </section>
    </div>
  );
}
