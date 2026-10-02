"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { EntityKind } from "@/lib/os/types";
import { IconClose, IconSearch } from "../icons";

export interface KGNode {
  key: string;
  kind: EntityKind;
  id: string;
  label: string;
  sa?: string;
  href: string;
  x: number;
  y: number;
  sub?: string;
}

const KIND_COLOR: Record<EntityKind, string> = {
  concept: "var(--saffron)",
  tradition: "var(--indigo)",
  text: "var(--brown)",
  thinker: "var(--leaf)",
  question: "var(--gold)",
};
const KIND_LABEL: Record<EntityKind, string> = {
  concept: "Concepts",
  tradition: "Traditions",
  text: "Texts",
  thinker: "Thinkers",
  question: "Questions",
};

export function KnowledgeGraph({
  nodes,
  edges,
  width,
  height,
  initialFocus,
  filters = true,
  heightClass = "h-[min(72vh,760px)] min-h-[460px]",
}: {
  nodes: KGNode[];
  edges: [string, string][];
  width: number;
  height: number;
  initialFocus?: string;
  filters?: boolean;
  heightClass?: string;
}) {
  const [kinds, setKinds] = useState<Set<EntityKind>>(new Set(["concept", "tradition", "text", "thinker"]));
  const [focus, setFocus] = useState<string | null>(initialFocus ?? null);
  const [hover, setHover] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<string>(""); // tradition/text key to filter around
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const byKey = useMemo(() => new Map(nodes.map((n) => [n.key, n])), [nodes]);
  const adj = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const [a, b] of edges) {
      if (!m.has(a)) m.set(a, new Set());
      if (!m.has(b)) m.set(b, new Set());
      m.get(a)!.add(b);
      m.get(b)!.add(a);
    }
    return m;
  }, [edges]);

  // visible set: kind filter, then optional scope (1-hop neighbourhood of a tradition/text)
  const visible = useMemo(() => {
    let set = new Set(nodes.filter((n) => kinds.has(n.kind)).map((n) => n.key));
    if (scope) {
      const hood = new Set([scope, ...(adj.get(scope) ?? [])]);
      set = new Set([...set].filter((k) => hood.has(k)));
      set.add(scope);
    }
    return set;
  }, [nodes, kinds, scope, adj]);

  const active = hover ?? focus;
  const neighbours = active ? adj.get(active) ?? new Set<string>() : null;
  const match = q.trim().toLowerCase();
  const matches = match
    ? nodes.filter((n) => visible.has(n.key) && (n.label.toLowerCase().includes(match) || n.sa?.includes(q.trim()) || n.id.includes(match)))
    : [];

  const focusNode = focus ? byKey.get(focus) : null;
  const centerOn = (n: KGNode, k = Math.max(view.k, 1.8)) => {
    setView({ k, x: width / 2 - n.x * k, y: height / 2 - n.y * k });
  };

  const onWheel = (e: React.WheelEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * width;
    const my = ((e.clientY - rect.top) / rect.height) * height;
    const k = Math.min(4, Math.max(0.6, view.k * (e.deltaY < 0 ? 1.12 : 0.9)));
    setView({ k, x: mx - ((mx - view.x) * k) / view.k, y: my - ((my - view.y) * k) / view.k });
  };

  const labelFor = (n: KGNode, isActive: boolean, isNb: boolean) =>
    isActive || isNb || view.k > 1.6 || n.kind === "tradition" || (n.kind === "concept" && view.k > 1.1);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_19rem]">
      <div className="card relative overflow-hidden">
        {filters && (
          <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
            <div className="relative min-w-40 flex-1">
              <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Find in graph…"
                aria-label="Find a node"
                className="w-full rounded-full border border-line bg-bg py-1.5 pl-8 pr-3 text-sm outline-none focus:border-line-strong"
              />
              {matches.length > 0 && (
                <ul className="absolute left-0 right-0 top-10 z-10 max-h-64 overflow-auto rounded-2xl border border-line bg-surface p-1 shadow-[var(--shadow)]">
                  {matches.slice(0, 10).map((n) => (
                    <li key={n.key}>
                      <button
                        onClick={() => {
                          setFocus(n.key);
                          centerOn(n);
                          setQ("");
                        }}
                        className="flex w-full items-baseline gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-surface-2"
                      >
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: KIND_COLOR[n.kind] }} />
                        {n.sa && <span className="sanskrit">{n.sa}</span>}
                        <span>{n.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {(Object.keys(KIND_LABEL) as EntityKind[])
              .filter((k) => nodes.some((n) => n.kind === k))
              .map((k) => (
                <button
                  key={k}
                  aria-pressed={kinds.has(k)}
                  onClick={() => {
                    const s = new Set(kinds);
                    if (s.has(k)) s.delete(k);
                    else s.add(k);
                    setKinds(s);
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    kinds.has(k) ? "border-line-strong text-ink" : "border-line text-ink-3 opacity-60"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[k] }} />
                  {KIND_LABEL[k]}
                </button>
              ))}
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value);
                setView({ x: 0, y: 0, k: 1 });
              }}
              aria-label="Filter by tradition or text"
              className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs text-ink-2 outline-none"
            >
              <option value="">All traditions & texts</option>
              <optgroup label="Tradition">
                {nodes
                  .filter((n) => n.kind === "tradition")
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((n) => (
                    <option key={n.key} value={n.key}>
                      {n.label}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Text">
                {nodes
                  .filter((n) => n.kind === "text")
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((n) => (
                    <option key={n.key} value={n.key}>
                      {n.label}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        )}
        <div className={`relative ${heightClass}`}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="h-full w-full touch-none select-none"
            onWheel={onWheel}
            onPointerDown={(e) => {
              if ((e.target as Element).closest("[data-node]")) return;
              drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
              (e.target as Element).setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              const svg = svgRef.current;
              if (!d || !svg) return;
              const s = width / svg.getBoundingClientRect().width;
              setView((v) => ({ ...v, x: d.vx + (e.clientX - d.x) * s, y: d.vy + (e.clientY - d.y) * s }));
            }}
            onPointerUp={() => (drag.current = null)}
            role="img"
            aria-label="Knowledge graph of Indian philosophy"
          >
            <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
              {edges.map(([a, b], i) => {
                if (!visible.has(a) || !visible.has(b)) return null;
                const A = byKey.get(a)!;
                const B = byKey.get(b)!;
                const on = active && (a === active || b === active);
                return (
                  <line
                    key={i}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke={on ? "var(--saffron)" : "var(--line-strong)"}
                    strokeOpacity={active ? (on ? 0.9 : 0.08) : 0.35}
                    strokeWidth={(on ? 1.5 : 0.8) / view.k}
                  />
                );
              })}
              {nodes.map((n) => {
                if (!visible.has(n.key)) return null;
                const isA = n.key === active;
                const isNb = !!neighbours?.has(n.key);
                const dim = active && !isA && !isNb;
                const r = (n.kind === "tradition" ? 7 : n.kind === "concept" ? 5.5 : 4.5) / Math.sqrt(view.k);
                return (
                  <g
                    key={n.key}
                    data-node
                    transform={`translate(${n.x},${n.y})`}
                    style={{ opacity: dim ? 0.18 : 1, transition: "opacity .4s", cursor: "pointer" }}
                    onMouseEnter={() => setHover(n.key)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setFocus(n.key === focus ? null : n.key)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${n.label} (${n.kind})`}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setFocus(n.key))}
                  >
                    <circle r={isA ? r * 1.6 : r} fill={isA ? KIND_COLOR[n.kind] : "var(--surface)"} stroke={KIND_COLOR[n.kind]} strokeWidth={1.5 / Math.sqrt(view.k)} />
                    {labelFor(n, isA, isNb) && (
                      <text
                        y={-r - 5 / view.k}
                        textAnchor="middle"
                        fontSize={(n.kind === "tradition" ? 12.5 : 11) / Math.sqrt(view.k)}
                        fill={n.kind === "tradition" ? "var(--ink)" : "var(--ink-2)"}
                        style={{ fontFamily: "var(--font-sans)", fontWeight: n.kind === "tradition" ? 600 : 400, pointerEvents: "none" }}
                      >
                        {n.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
            {[
              ["+", () => setView((v) => zoomAt(v, 1.25, width, height))],
              ["−", () => setView((v) => zoomAt(v, 0.8, width, height))],
              ["⟲", () => setView({ x: 0, y: 0, k: 1 })],
            ].map(([l, f]) => (
              <button
                key={l as string}
                onClick={f as () => void}
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-2 shadow-sm hover:text-ink"
                aria-label={l === "+" ? "Zoom in" : l === "−" ? "Zoom out" : "Reset view"}
              >
                {l as string}
              </button>
            ))}
          </div>
          <p className="pointer-events-none absolute bottom-3 left-4 hidden text-xs text-ink-3 sm:block">
            Scroll to zoom · drag to pan · tap a node to focus
          </p>
        </div>
      </div>

      <aside className="card p-6" aria-live="polite">
        {focusNode ? (
          <div className="rise" key={focusNode.key}>
            <div className="mb-2 flex items-center justify-between">
              <span className="eyebrow" style={{ color: KIND_COLOR[focusNode.kind] }}>
                {KIND_LABEL[focusNode.kind].replace(/s$/, "")}
              </span>
              <button onClick={() => setFocus(null)} aria-label="Clear focus" className="text-ink-3 hover:text-ink">
                <IconClose size={16} />
              </button>
            </div>
            {focusNode.sa && (
              <p lang="sa" className="sanskrit text-2xl text-ink">
                {focusNode.sa}
              </p>
            )}
            <p className="font-display mb-3 text-2xl leading-snug text-ink">{focusNode.label}</p>
            {focusNode.sub && <p className="mb-5 text-sm leading-relaxed text-ink-2">{focusNode.sub}</p>}
            <p className="eyebrow mb-2">Connected · {adj.get(focusNode.key)?.size ?? 0}</p>
            <div className="mb-6 flex max-h-64 flex-wrap gap-1.5 overflow-auto">
              {[...(adj.get(focusNode.key) ?? [])]
                .map((k) => byKey.get(k)!)
                .filter(Boolean)
                .sort((a, b) => a.kind.localeCompare(b.kind))
                .map((n) => (
                  <button
                    key={n.key}
                    onClick={() => {
                      setFocus(n.key);
                      if (!visible.has(n.key)) setKinds(new Set([...kinds, n.kind]));
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs hover:border-saffron"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: KIND_COLOR[n.kind] }} />
                    {n.label}
                  </button>
                ))}
            </div>
            <Link href={focusNode.href} className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-bg">
              Open {focusNode.label} →
            </Link>
          </div>
        ) : (
          <div>
            <p className="font-display mb-3 text-2xl">Navigate the ideas</p>
            <p className="leading-relaxed text-ink-2">
              Every node is a concept, tradition, text or thinker; every line is a relationship recorded in the data.
              Choose a node to see what it connects to, or narrow the map to a single tradition or text.
            </p>
            <ul className="mt-5 space-y-1.5 text-sm text-ink-3">
              {(Object.keys(KIND_LABEL) as EntityKind[])
                .filter((k) => nodes.some((n) => n.kind === k))
                .map((k) => (
                  <li key={k} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_COLOR[k] }} />
                    {nodes.filter((n) => n.kind === k).length} {KIND_LABEL[k].toLowerCase()}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function zoomAt(v: { x: number; y: number; k: number }, f: number, w: number, h: number) {
  const k = Math.min(4, Math.max(0.6, v.k * f));
  const cx = w / 2;
  const cy = h / 2;
  return { k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k };
}
