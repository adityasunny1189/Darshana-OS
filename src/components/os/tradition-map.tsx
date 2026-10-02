"use client";

import Link from "next/link";
import { useState } from "react";
import type { MapNode } from "@/lib/os/graph-props";

const FAMILY_TINT: Record<string, string> = {
  vedic: "var(--gold)",
  darshana: "var(--indigo)",
  "vedanta-school": "var(--indigo)",
  "epic-puranic": "var(--brown)",
  bhakti: "var(--saffron)",
  shaiva: "var(--brown)",
  shakta: "var(--saffron)",
  tantric: "var(--brown)",
  sikh: "var(--leaf)",
  tamil: "var(--leaf)",
  modern: "var(--ink-3)",
  shramana: "var(--leaf)",
  "buddhist-school": "var(--leaf)",
  materialist: "var(--ink-3)",
};

export function TraditionMap({
  nodes,
  related,
  width,
  height,
  familyLabels,
}: {
  nodes: MapNode[];
  related: [string, string][];
  width: number;
  height: number;
  familyLabels: Record<string, string>;
}) {
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const by = new Map(nodes.map((n) => [n.id, n]));
  const active = hover ?? sel;
  const linked = new Set<string>();
  if (active) {
    const n = by.get(active);
    if (n?.parent) linked.add(n.parent);
    nodes.forEach((m) => m.parent === active && linked.add(m.id));
    related.forEach(([a, b]) => (a === active ? linked.add(b) : b === active ? linked.add(a) : null));
  }
  const s = sel ? by.get(sel) : null;
  const cx = width / 2;
  const cy = height / 2;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div className="card overflow-hidden">
        <svg viewBox={`-150 -40 ${width + 300} ${height + 80}`} className="block h-auto w-full" role="img" aria-label="Map of Indian philosophical traditions">
          <defs>
            <radialGradient id="tm-glow">
              <stop offset="0%" stopColor="var(--saffron)" stopOpacity=".22" />
              <stop offset="100%" stopColor="var(--saffron)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={170} fill="url(#tm-glow)" className="breathe" />
          {[300, 440].map((r) => (
            <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeDasharray="2 6" />
          ))}
          {/* related traditions */}
          {related.map(([a, b], i) => {
            const A = by.get(a)!;
            const B = by.get(b)!;
            const on = active && (a === active || b === active);
            // curve through the centre region for readability
            const mx = (A.x + B.x) / 2 * 0.6 + cx * 0.4;
            const my = (A.y + B.y) / 2 * 0.6 + cy * 0.4;
            return (
              <path
                key={i}
                d={`M${A.x},${A.y} Q${mx},${my} ${B.x},${B.y}`}
                fill="none"
                stroke={on ? "var(--saffron)" : "var(--line-strong)"}
                strokeOpacity={active ? (on ? 0.85 : 0.07) : 0.28}
                strokeWidth={on ? 1.6 : 1}
                style={{ transition: "stroke-opacity .4s" }}
              />
            );
          })}
          {/* spokes and parent links */}
          {nodes.map((n) => {
            const p = n.parent ? by.get(n.parent) : null;
            return (
              <line
                key={"l" + n.id}
                x1={p ? p.x : cx}
                y1={p ? p.y : cy}
                x2={n.x}
                y2={n.y}
                stroke="var(--line-strong)"
                strokeOpacity={p ? 0.8 : 0.35}
                strokeWidth={p ? 1.2 : 0.8}
              />
            );
          })}
          <g>
            <circle cx={cx} cy={cy} r={46} fill="var(--surface)" stroke="var(--gold)" />
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fill="var(--ink)" style={{ fontFamily: "var(--font-serif)" }}>
              Indian
            </text>
            <text x={cx} y={cy + 15} textAnchor="middle" fontSize="15" fill="var(--ink)" style={{ fontFamily: "var(--font-serif)" }}>
              Philosophy
            </text>
          </g>
          {nodes.map((n) => {
            const isA = n.id === active;
            const dim = active && !isA && !linked.has(n.id);
            const right = n.x >= cx;
            const tint = FAMILY_TINT[n.family] ?? "var(--gold)";
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setSel(n.id === sel ? null : n.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSel(n.id))}
                tabIndex={0}
                role="button"
                aria-label={n.label}
                aria-pressed={sel === n.id}
                style={{ cursor: "pointer", opacity: dim ? 0.25 : 1, transition: "opacity .4s" }}
              >
                {isA && <circle r={n.r + 16} fill={tint} opacity=".15" />}
                <circle r={n.r} fill={isA ? tint : "var(--surface)"} stroke={tint} strokeWidth={1.6} />
                <text
                  x={right ? n.r + 8 : -n.r - 8}
                  y={4}
                  textAnchor={right ? "start" : "end"}
                  fontSize={n.parent ? 13 : 15}
                  fill="var(--ink)"
                  style={{ fontFamily: "var(--font-sans)", fontWeight: n.parent ? 400 : 600 }}
                >
                  {n.label.replace(/ \(.+\)$/, "")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <aside className="card p-6" aria-live="polite">
        {s ? (
          <div className="rise" key={s.id}>
            <p className="eyebrow mb-2">{familyLabels[s.family] ?? s.family}</p>
            {s.sa && (
              <p lang="sa" className="sanskrit text-2xl text-ink-2">
                {s.sa}
              </p>
            )}
            <p className="font-display mb-3 text-2xl leading-snug">{s.label}</p>
            <p className="mb-5 leading-relaxed text-ink-2">{s.tagline}</p>
            {s.questions.length > 0 && (
              <>
                <p className="eyebrow mb-2">Asks</p>
                <ul className="mb-6 space-y-2">
                  {s.questions.map((q) => (
                    <li key={q} className="font-display text-lg leading-snug text-ink">
                      {q}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Link href={`/traditions/${s.id}`} className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-bg">
              Open {s.label.replace(/ \(.+\)$/, "")} →
            </Link>
          </div>
        ) : (
          <div>
            <p className="font-display mb-3 text-2xl">The philosophical universe</p>
            <p className="leading-relaxed text-ink-2">
              Each point is a tradition. Schools orbit the tradition they grew within; curved lines are relationships:
              shared ideas, debates, influence. Select one to see its questions.
            </p>
            <p className="mt-4 text-sm text-ink-3">
              Positions show family resemblance only — not chronology, and not a ranking.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
