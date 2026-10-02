"use client";

import { useState } from "react";
import { ELEPHANT, KEY_IDEAS, SAPTABHANGI } from "@/data/os/tools/anekanta";

export function AnekantaExplorer() {
  const [touched, setTouched] = useState<string[]>([]);
  const [bhanga, setBhanga] = useState(0);
  const all = touched.length === ELEPHANT.length;
  return (
    <div className="space-y-16">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]" aria-labelledby="elephant">
        <div className="card relative overflow-hidden p-4 sm:p-6">
          <svg viewBox="0 0 100 100" className="h-auto w-full" role="img" aria-label="An elephant, touched in six places">
            <g style={{ opacity: all ? 1 : 0.12, transition: "opacity 1.2s" }} fill="none" stroke="var(--ink-2)" strokeWidth=".7" strokeLinecap="round">
              <path d="M20 45 Q22 28 45 27 Q66 26 72 36 Q80 40 82 55 Q84 68 78 76" />
              <path d="M20 45 Q18 60 28 64 L30 86 L36 86 L37 66 L55 66 L56 86 L62 86 L63 64 Q70 62 72 52" />
              <path d="M58 32 Q66 24 70 34 Q70 44 62 44" />
              <path d="M20 46 Q12 48 10 58" />
              <path d="M76 50 Q86 46 90 42" />
              <circle cx="72" cy="40" r=".9" fill="var(--ink-2)" />
            </g>
            {ELEPHANT.map((e) => {
              const on = touched.includes(e.part);
              return (
                <g key={e.part} onClick={() => !on && setTouched([...touched, e.part])} style={{ cursor: "pointer" }} role="button" aria-label={`Touch the ${e.part}`} tabIndex={0} onKeyDown={(k) => k.key === "Enter" && !on && setTouched([...touched, e.part])}>
                  <circle cx={e.x} cy={e.y} r={on ? 2.2 : 3.4} fill={on ? "var(--saffron)" : "var(--surface)"} stroke="var(--saffron)" strokeWidth=".5" className={on ? "" : "breathe"} />
                  {on && (
                    <text x={e.x} y={e.y - 4} textAnchor="middle" fontSize="3.1" fill="var(--ink)" style={{ fontFamily: "var(--font-sans)" }}>
                      “{e.en.replace("It is like ", "")}”
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div>
          <p className="eyebrow mb-3">A traditional illustration</p>
          <h2 id="elephant" className="font-display mb-4 text-3xl leading-tight">
            Six people, one elephant
          </h2>
          <p className="mb-4 leading-relaxed text-ink-2">
            In the darkness, each person touches one part and describes the whole: a snake, a fan, a pillar, a wall, a rope,
            a spear. Tap the six points to hear each description.
          </p>
          <ul className="mb-5 space-y-1.5 text-sm">
            {ELEPHANT.map((e) => (
              <li key={e.part} className={`transition-opacity ${touched.includes(e.part) ? "opacity-100" : "opacity-30"}`}>
                <span className="capitalize text-ink">{e.part}</span> <span className="text-ink-3">— {e.en}</span>
              </li>
            ))}
          </ul>
          {all ? (
            <p className="rise rounded-2xl bg-surface-2 p-4 leading-relaxed text-ink">
              Each person is right about their part and wrong to deny the others. For Jain philosophy, this is how partial
              viewpoints (naya) relate to a reality with many aspects (anekānta).
            </p>
          ) : (
            <p className="text-sm text-ink-3">{ELEPHANT.length - touched.length} places left to touch.</p>
          )}
          <button onClick={() => setTouched([])} className="mt-4 text-sm text-ink-3 underline-offset-4 hover:underline">
            Start again
          </button>
          <p className="mt-6 text-xs text-ink-3">
            The parable is widely used in Jain teaching; versions also appear in Buddhist and other Indian literature.
          </p>
        </div>
      </section>

      <section aria-labelledby="ideas">
        <h2 id="ideas" className="font-display mb-6 text-2xl">
          The core ideas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {KEY_IDEAS.map((k) => (
            <div key={k.title} className="card p-6">
              <p className="font-display mb-2 text-xl text-ink">{k.title}</p>
              <p className="leading-relaxed text-ink-2">{k.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="sapta">
        <h2 id="sapta" className="font-display mb-2 text-2xl">
          Syadvada: seven ways to speak about a pot
        </h2>
        <p className="mb-8 max-w-2xl text-ink-3">
          The seven-fold predication (saptabhaṅgī) applied to the classical example, an ordinary clay pot. Step through
          them.
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <ol className="space-y-1.5">
            {SAPTABHANGI.map((s, i) => (
              <li key={s.n}>
                <button
                  onClick={() => setBhanga(i)}
                  aria-pressed={bhanga === i}
                  className={`flex w-full items-baseline gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${bhanga === i ? "border-saffron bg-saffron-soft" : "border-line hover:border-line-strong"}`}
                >
                  <span className="font-display w-5 text-ink-3">{s.n}</span>
                  <span lang="sa" className="sanskrit text-lg text-ink">
                    {s.sa}
                  </span>
                  <span className="hidden text-sm text-ink-3 sm:inline">{s.en}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="card rise flex flex-col justify-center p-8" key={bhanga} aria-live="polite">
            <svg viewBox="0 0 120 90" className="mx-auto mb-6 h-28 w-auto" aria-hidden>
              <path d="M40 20 h40 M44 20 q-4 8 -12 18 q-10 16 4 34 q24 18 48 0 q14 -18 4 -34 q-8 -10 -12 -18" fill="none" stroke="var(--brown)" strokeWidth="1.6" />
              <path d="M36 50 h48" stroke="var(--gold)" strokeDasharray="2 3" />
            </svg>
            <p className="iast mb-1 text-center">{SAPTABHANGI[bhanga].iast}</p>
            <p className="font-display mb-4 text-center text-2xl leading-snug text-ink">{SAPTABHANGI[bhanga].en}</p>
            <p className="text-center leading-relaxed text-ink-2">{SAPTABHANGI[bhanga].pot}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
