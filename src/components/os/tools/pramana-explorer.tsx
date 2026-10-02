"use client";

import { useState } from "react";
import { EXTRA_PRAMANAS, FALLACIES, PRAMANAS, SCENARIOS, SCHOOL_PRAMANAS, SYLLOGISM } from "@/data/os/tools/pramana";

export function PramanaExplorer() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const label = (id: string) => PRAMANAS.find((p) => p.id === id)?.en ?? EXTRA_PRAMANAS[id]?.en ?? id;
  const allIds = ["pratyaksha", "anumana", "upamana", "shabda", "arthapatti", "anupalabdhi"];

  return (
    <div className="space-y-20">
      <section aria-labelledby="four">
        <h2 id="four" className="font-display mb-6 text-2xl">
          Nyaya’s four means of valid knowledge
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PRAMANAS.map((p, i) => (
            <div key={p.id} className="card p-6">
              <p className="eyebrow mb-2">{i + 1}</p>
              <p lang="sa" className="sanskrit text-2xl text-ink">
                {p.sa} <span className="iast text-base">{p.iast}</span>
              </p>
              <p className="font-display mb-2 text-xl text-ink-2">{p.en}</p>
              <p className="leading-relaxed text-ink-2">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="try" className="card p-6 sm:p-8">
        <h2 id="try" className="font-display mb-2 text-2xl">
          Which pramana is at work?
        </h2>
        <p className="mb-6 text-ink-3">Choose the means of knowledge in each situation.</p>
        <ol className="space-y-4">
          {SCENARIOS.map((s, i) => {
            const a = answers[i];
            return (
              <li key={i} className="rounded-2xl border border-line p-4">
                <p className="mb-3 text-ink">{s.text}</p>
                <div className="flex flex-wrap gap-2">
                  {PRAMANAS.map((p) => {
                    const picked = a === p.id;
                    const right = p.id === s.answer;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setAnswers({ ...answers, [i]: p.id })}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          a ? (right ? "border-leaf bg-leaf/10 text-leaf" : picked ? "border-saffron text-saffron" : "border-line text-ink-3") : "border-line text-ink-2 hover:border-line-strong"
                        }`}
                      >
                        {p.en}
                      </button>
                    );
                  })}
                </div>
                {a && <p className="rise mt-2 text-sm text-ink-3">{a === s.answer ? "Yes." : `Nyaya would call this ${label(s.answer).toLowerCase()}.`}</p>}
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="syll">
        <h2 id="syll" className="font-display mb-2 text-2xl">
          The five-membered argument
        </h2>
        <p className="mb-8 max-w-2xl text-ink-3">
          Inference presented for others (parārthānumāna) proceeds in five steps. The stock example is the smoky hill.
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <ol className="space-y-2">
            {SYLLOGISM.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => setStep(i)}
                  className={`flex w-full items-baseline gap-4 rounded-2xl border px-4 py-3 text-left transition-[border-color,opacity] ${i <= step ? "opacity-100" : "opacity-40"} ${i === step ? "border-saffron bg-saffron-soft" : "border-line"}`}
                >
                  <span className="font-display w-5 text-ink-3">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block">
                      <span lang="sa" className="sanskrit mr-2 text-lg text-ink">
                        {s.sa}
                      </span>
                      <span className="text-sm text-ink-3">{s.en}</span>
                    </span>
                    <span className="font-display block text-lg text-ink">{s.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="card flex flex-col justify-between p-8">
            <div key={step} className="rise">
              <p className="eyebrow mb-2">
                Step {step + 1} · {SYLLOGISM[step].en}
              </p>
              <p className="font-display mb-3 text-2xl leading-snug text-ink">{SYLLOGISM[step].text}</p>
              <p className="leading-relaxed text-ink-2">{SYLLOGISM[step].note}</p>
            </div>
            <div className="mt-8 flex gap-2">
              <button disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-full border border-line px-4 py-1.5 text-sm disabled:opacity-40">
                ←
              </button>
              <button disabled={step === SYLLOGISM.length - 1} onClick={() => setStep(step + 1)} className="rounded-full bg-ink px-4 py-1.5 text-sm text-bg disabled:opacity-40">
                Next step →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="fall">
        <h2 id="fall" className="font-display mb-6 text-2xl">
          When a reason fails: the fallacies (hetvābhāsa)
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {FALLACIES.map((f) => (
            <div key={f.id} className="rounded-2xl border border-line p-5">
              <p lang="sa" className="sanskrit text-xl text-ink">
                {f.sa}
              </p>
              <p className="font-display mb-2 text-lg text-ink-2">{f.en}</p>
              <p className="text-sm leading-relaxed text-ink-3">{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="schools">
        <h2 id="schools" className="font-display mb-2 text-2xl">
          How many ways of knowing?
        </h2>
        <p className="mb-6 max-w-2xl text-ink-3">The schools disagree on which pramanas are independent. This is a standard summary; each school has its own detailed arguments.</p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="p-3 font-normal text-ink-3">School</th>
                {allIds.map((id) => (
                  <th key={id} className="p-3 font-normal text-ink-3">
                    {label(id)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCHOOL_PRAMANAS.map((s) => (
                <tr key={s.label} className="border-t border-line">
                  <td className="p-3">
                    <a href={`/traditions/${s.tradition}`} className="text-ink hover:text-saffron">
                      {s.label}
                    </a>
                    {s.note && <span className="block text-xs text-ink-3">{s.note}</span>}
                  </td>
                  {allIds.map((id) => (
                    <td key={id} className="p-3 text-center">
                      {s.accepts.includes(id) ? <span className="text-saffron">●</span> : <span className="text-line-strong">·</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="mt-6 grid gap-3 md:grid-cols-3">
          {Object.entries(EXTRA_PRAMANAS).map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-surface-2 p-4">
              <dt className="text-ink">
                <span className="sanskrit mr-2">{v.sa}</span>
                {v.en}
              </dt>
              <dd className="mt-1 text-sm text-ink-3">{v.note}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
