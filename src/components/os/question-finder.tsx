"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconSearch } from "../icons";

interface Q {
  id: string;
  q: string;
  href: string;
  kind: "os" | "gita";
  words: string;
}
interface C {
  id: string;
  label: string;
  sa: string;
  words: string;
}

const STOP = new Set("a an the i me my am is are do does did how what why who when where can could should would will to of in on for and or with about it be been being that this there their them we you your".split(" "));
// everyday words → the concepts they usually point to (routing only, not answers)
const SYNONYMS: Record<string, string[]> = {
  suffer: ["dukkha", "suffering"], suffering: ["dukkha"], pain: ["dukkha"], sad: ["dukkha"], anxiety: ["worry", "samatva"], anxious: ["worry"], stress: ["samatva"], worry: ["future", "worry"],
  fail: ["failure", "phala"], failure: ["failure", "phala"], success: ["samatva", "phala"], result: ["phala"], results: ["phala"], outcome: ["phala"],
  angry: ["krodha", "anger"], anger: ["krodha"], desire: ["kama"], want: ["kama"], craving: ["kama", "dukkha"], attached: ["asakti"], attachment: ["asakti"],
  mind: ["manas", "chitta", "mind"], thoughts: ["chitta", "manas"], overthinking: ["chitta", "mind"], focus: ["dhyana"], meditate: ["dhyana"], meditation: ["dhyana"],
  self: ["atma", "self"], soul: ["atma", "jiva"], me: [], identity: ["atma", "ahankara"], ego: ["ahankara"], who: ["self"],
  god: ["ishvara", "brahman", "god"], divine: ["ishvara"], love: ["bhakti", "prema"], devotion: ["bhakti"], surrender: ["sharanagati", "prapatti"],
  death: ["death", "samsara"], die: ["death"], rebirth: ["samsara"], afterlife: ["death"], free: ["moksha", "freedom"], freedom: ["moksha"], liberation: ["moksha"], enlightenment: ["nirvana", "moksha"],
  real: ["reality", "maya"], reality: ["brahman", "maya"], illusion: ["maya"], duty: ["dharma", "svadharma"], right: ["dharma"], wrong: ["dharma"], ethics: ["dharma", "live"],
  truth: ["pramana", "knowledge"], know: ["pramana", "jnana"], knowledge: ["jnana", "pramana"], action: ["karma"], work: ["karma", "nishkama-karma"], job: ["karma", "svadharma"], career: ["svadharma"],
  peace: ["samatva", "shanti"], calm: ["samatva"], happy: ["sukha"], happiness: ["dukkha", "samatva"], purpose: ["dharma", "svadharma"], service: ["seva"], serve: ["seva"],
};

function tokens(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-zऀ-ॿ-]+/)
    .filter((w) => w && !STOP.has(w));
}

export function QuestionFinder({ questions, concepts }: { questions: Q[]; concepts: C[] }) {
  const [text, setText] = useState("");
  const res = useMemo(() => {
    const t = tokens(text);
    if (!t.length) return null;
    const expanded = new Set(t);
    t.forEach((w) => SYNONYMS[w]?.forEach((x) => expanded.add(x)));
    const score = (hay: string, id: string) => {
      const h = tokens(hay);
      const hs = new Set(h);
      let s = 0;
      for (const w of expanded) {
        if (id === w) s += 6;
        if (hs.has(w)) s += 3;
        else if (w.length > 3 && h.some((x) => x.startsWith(w.slice(0, Math.max(4, w.length - 2))))) s += 1;
      }
      return s;
    };
    const qs = questions
      .map((q) => ({ q, s: score(q.q, q.id) * 2 + score(q.words, q.id) }))
      .filter((x) => x.s > 2)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6);
    const cs = concepts
      .map((c) => ({ c, s: score(c.words, c.id) }))
      .filter((x) => x.s > 2)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8);
    return { qs, cs };
  }, [text, questions, concepts]);

  return (
    <section aria-label="Ask a question" className="card p-5 sm:p-8">
      <label htmlFor="ask" className="font-display mb-4 block text-2xl">
        What are you trying to understand?
      </label>
      <div className="relative">
        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" />
        <input
          id="ask"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Why do I suffer?  ·  How do I deal with failure?  ·  What is maya?"
          className="w-full rounded-full border border-line-strong bg-bg py-4 pl-12 pr-5 text-lg outline-none transition-colors focus:border-saffron"
        />
      </div>
      {res && (
        <div className="rise mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-3">Closest questions</p>
            {res.qs.length ? (
              <ul className="space-y-2">
                {res.qs.map(({ q }) => (
                  <li key={q.kind + q.id}>
                    <Link href={q.href} className="flex items-baseline gap-3 rounded-2xl border border-line px-4 py-3 transition-colors hover:border-saffron">
                      <span className="font-display flex-1 text-lg leading-snug text-ink">{q.q}</span>
                      <span className={`shrink-0 text-xs ${q.kind === "gita" ? "text-leaf" : "text-ink-3"}`}>{q.kind === "gita" ? "Gita answer" : "Across traditions"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-3">No mapped question matches yet. Try one of the concepts, or browse the big questions below.</p>
            )}
          </div>
          <div>
            <p className="eyebrow mb-3">Concepts involved</p>
            <div className="flex flex-wrap gap-2">
              {res.cs.map(({ c }) => (
                <Link key={c.id} href={`/concepts/${c.id}`} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm hover:border-saffron">
                  <span className="sanskrit mr-1.5">{c.sa}</span>
                  <span className="text-ink-3">{c.label.split(" — ")[0]}</span>
                </Link>
              ))}
              {!res.cs.length && <span className="text-sm text-ink-3">—</span>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
