"use client";

import { useState } from "react";
import { CLASS_LABEL, GROUPS, GUNAS, TATTVAS, type Tattva, type TattvaClass } from "@/data/os/tools/tattvas";

const STAGES = [
  { upto: ["purusha", "prakriti"], title: "Two realities", text: "Sankhya begins with two utterly different principles: consciousness (purusha), which only witnesses, and nature (prakriti), which does everything but is unconscious." },
  { upto: ["mahat"], title: "The first stir: intellect", text: "When the balance of the three gunas is disturbed in the proximity of purusha, prakriti evolves. Its first product is mahat, or buddhi: discernment." },
  { upto: ["ahankara"], title: "The sense of “I”", text: "From buddhi comes ahankara, the I-maker, which appropriates experience as “mine”. Everything personal follows from here." },
  { upto: ["manas", "jnanendriya", "karmendriya"], title: "Mind and the ten faculties", text: "From the sattvic side of ahankara come manas and the ten faculties: five for knowing and five for acting." },
  { upto: ["tanmatra"], title: "Subtle elements", text: "From its tamasic side come the five tanmatras, the subtle essences of sound, touch, form, taste and smell." },
  { upto: ["mahabhuta"], title: "The gross world", text: "The subtle elements give rise to the five gross elements: space, air, fire, water and earth. That makes 25 tattvas in all. Liberation (kaivalya) is the discriminating knowledge that purusha is none of the other 24." },
];

const CLS_COLOR: Record<TattvaClass, string> = {
  neither: "var(--indigo)",
  root: "var(--gold)",
  both: "var(--saffron)",
  evolute: "var(--leaf)",
};

export function TattvaExplorer() {
  const [stage, setStage] = useState(STAGES.length - 1);
  const [sel, setSel] = useState<Tattva>(TATTVAS[0]);
  const [cls, setCls] = useState<TattvaClass | null>(null);
  const visibleGroups = new Set(STAGES.slice(0, stage + 1).flatMap((s) => s.upto.map((u) => TATTVAS.find((t) => t.id === u)?.group ?? u)));
  const g = (id: Tattva["group"]) => TATTVAS.filter((t) => t.group === id);
  const show = (group: string) => visibleGroups.has(group);

  const nodeProps = (t: Tattva) => ({ t, active: sel.id === t.id, dim: !!cls && t.cls !== cls, onSelect: setSel });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="card overflow-hidden p-4 sm:p-8">
        {/* stage controls */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {STAGES.map((s, i) => (
            <button
              key={i}
              onClick={() => setStage(i)}
              aria-pressed={stage === i}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${i <= stage ? "border-saffron/50 text-ink" : "border-line text-ink-3"} ${stage === i ? "bg-saffron-soft" : ""}`}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
            <div className="flex justify-center">{show("purusha") && <TattvaNode {...nodeProps(g("purusha")[0])} size="lg" />}</div>
            <div className="self-center text-xs text-ink-3">{show("purusha") && "distinct from"}</div>
            <div className="flex justify-center">{show("prakriti") && <TattvaNode {...nodeProps(g("prakriti")[0])} size="lg" />}</div>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr]">
            <div />
            <div />
            <div>
              <Connector on={show("mahat")} />
              <div className="flex justify-center">{show("mahat") && <TattvaNode {...nodeProps(g("mahat")[0])} />}</div>
              <Connector on={show("ahankara")} />
              <div className="flex justify-center">{show("ahankara") && <TattvaNode {...nodeProps(g("ahankara")[0])} />}</div>
            </div>
          </div>

          <div className="mt-2 grid gap-4 md:grid-cols-2">
            <div className={`rounded-3xl border border-dashed p-4 transition-opacity duration-700 ${show("manas") ? "border-line-strong opacity-100" : "border-transparent opacity-0"}`}>
              <p className="eyebrow mb-3 text-center">From sattvic ahankara</p>
              <div className="mb-3 flex justify-center">{show("manas") && <TattvaNode {...nodeProps(g("manas")[0])} />}</div>
              <p className="mb-2 text-center text-xs text-ink-3">Senses of knowing</p>
              <div className="mb-3 grid grid-cols-5 gap-1.5">{show("jnanendriya") && g("jnanendriya").map((t) => <TattvaNode key={t.id} {...nodeProps(t)} size="sm" />)}</div>
              <p className="mb-2 text-center text-xs text-ink-3">Faculties of action</p>
              <div className="grid grid-cols-5 gap-1.5">{show("karmendriya") && g("karmendriya").map((t) => <TattvaNode key={t.id} {...nodeProps(t)} size="sm" />)}</div>
            </div>
            <div className={`rounded-3xl border border-dashed p-4 transition-opacity duration-700 ${show("tanmatra") ? "border-line-strong opacity-100" : "border-transparent opacity-0"}`}>
              <p className="eyebrow mb-3 text-center">From tamasic ahankara</p>
              <p className="mb-2 text-center text-xs text-ink-3">Subtle elements</p>
              <div className="grid grid-cols-5 gap-1.5">{show("tanmatra") && g("tanmatra").map((t) => <TattvaNode key={t.id} {...nodeProps(t)} size="sm" />)}</div>
              <div className="grid grid-cols-5">
                {g("tanmatra").map((t) => (
                  <Connector key={t.id} on={show("mahabhuta")} />
                ))}
              </div>
              <p className="mb-2 text-center text-xs text-ink-3">{show("mahabhuta") ? "Gross elements" : " "}</p>
              <div className="grid grid-cols-5 gap-1.5">{show("mahabhuta") && g("mahabhuta").map((t) => <TattvaNode key={t.id} {...nodeProps(t)} size="sm" />)}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-surface-2 p-5">
          <p className="font-display text-xl text-ink">{STAGES[stage].title}</p>
          <p className="mt-1 leading-relaxed text-ink-2">{STAGES[stage].text}</p>
          <div className="mt-4 flex gap-2">
            <button disabled={stage === 0} onClick={() => setStage(stage - 1)} className="rounded-full border border-line px-4 py-1.5 text-sm disabled:opacity-40">
              ← Back
            </button>
            <button disabled={stage === STAGES.length - 1} onClick={() => setStage(stage + 1)} className="rounded-full bg-ink px-4 py-1.5 text-sm text-bg disabled:opacity-40">
              Unfold next →
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card rise p-6" key={sel.id} aria-live="polite">
          <p className="eyebrow mb-2">
            Tattva {sel.n} of 25 · {GROUPS.find((x) => x.id === sel.group)?.en}
          </p>
          <p lang="sa" className="sanskrit text-3xl text-ink">
            {sel.sa}
          </p>
          <p className="iast">{sel.iast}</p>
          <p className="font-display mt-1 text-xl text-ink-2">{sel.en}</p>
          <p className="mt-4 leading-relaxed text-ink-2">{sel.note}</p>
          {sel.from && (
            <p className="mt-3 text-sm text-ink-3">
              Evolves from: <button className="text-saffron hover:underline" onClick={() => setSel(TATTVAS.find((t) => t.id === sel.from)!)}>{TATTVAS.find((t) => t.id === sel.from)?.en}</button>
            </p>
          )}
          <p className="mt-3 text-sm" style={{ color: CLS_COLOR[sel.cls] }}>
            {CLASS_LABEL[sel.cls].en}
          </p>
        </div>
        <div className="card p-6">
          <p className="eyebrow mb-3">Four kinds of tattva</p>
          <ul className="space-y-2">
            {(Object.keys(CLASS_LABEL) as TattvaClass[]).map((c) => (
              <li key={c}>
                <button onClick={() => setCls(cls === c ? null : c)} aria-pressed={cls === c} className={`flex w-full items-start gap-3 rounded-xl p-2 text-left ${cls === c ? "bg-surface-2" : ""}`}>
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CLS_COLOR[c] }} />
                  <span>
                    <span className="block text-sm text-ink">
                      {CLASS_LABEL[c].en} <span className="sanskrit text-ink-3">{CLASS_LABEL[c].sa}</span>
                    </span>
                    <span className="block text-xs text-ink-3">{CLASS_LABEL[c].note}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <p className="eyebrow mb-3">The three gunas</p>
          <ul className="space-y-2 text-sm">
            {GUNAS.map((x) => (
              <li key={x.id}>
                <span className="sanskrit mr-2 text-lg text-ink">{x.sa}</span>
                <span className="text-ink-3">{x.en}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-ink-3">Every tattva except purusha is made of the three gunas in varying proportion.</p>
        </div>
      </aside>
    </div>
  );
}

function TattvaNode({
  t,
  size = "md",
  active,
  dim,
  onSelect,
}: {
  t: Tattva;
  size?: "lg" | "md" | "sm";
  active: boolean;
  dim: boolean;
  onSelect: (t: Tattva) => void;
}) {
  return (
    <button
      onClick={() => onSelect(t)}
      aria-pressed={active}
      className={`rise flex flex-col items-center rounded-2xl border px-2 py-2.5 text-center transition-[opacity,border-color,background] duration-500 ${
        active ? "border-saffron bg-saffron-soft" : "border-line bg-surface hover:border-line-strong"
      } ${size === "lg" ? "min-w-36 px-5 py-4" : size === "sm" ? "min-w-0" : "min-w-28 px-4"}`}
      style={{ opacity: dim ? 0.25 : 1, boxShadow: `inset 0 -2px 0 ${CLS_COLOR[t.cls]}` }}
    >
      <span lang="sa" className={`sanskrit leading-tight text-ink ${size === "lg" ? "text-2xl" : size === "sm" ? "text-[0.95rem]" : "text-lg"}`}>
        {t.sa.split(" / ")[0]}
      </span>
      <span className={`leading-tight text-ink-3 ${size === "sm" ? "text-[0.62rem]" : "text-xs"}`}>{t.en}</span>
    </button>
  );
}

function Connector({ on = true }: { on?: boolean }) {
  return <div className={`mx-auto h-6 w-px ${on ? "bg-line-strong" : "bg-transparent"}`} />;
}
