import "server-only";
import { cache } from "react";
import type { KGNode } from "@/components/os/knowledge-graph";
import { getGraph, getOsConcept, getText, getThinker, getTradition, getTraditions, layoutGraph } from "./data";

function sub(key: string): string | undefined {
  const [kind, id] = key.split(":");
  if (kind === "concept") return getOsConcept(id)?.short;
  if (kind === "tradition") return getTradition(id)?.tagline;
  if (kind === "text") return getText(id)?.summary;
  if (kind === "thinker") return getThinker(id)?.period;
}

/** Full graph with a build-time layout. */
export const fullGraphProps = cache(() => {
  const W = 1400;
  const H = 1000;
  const { nodes, edges } = getGraph();
  const pos = new Map(layoutGraph(nodes, edges, { w: W, h: H, rest: 105, charge: 16000, iterations: 420 }).map((p) => [p.key, p]));
  const kg: KGNode[] = nodes.map((n) => ({ ...n, x: pos.get(n.key)!.x, y: pos.get(n.key)!.y, sub: sub(n.key) }));
  return { nodes: kg, edges: edges.map((e) => [e.a, e.b] as [string, string]), width: W, height: H };
});

/** A local neighbourhood graph around one entity (1 hop, plus links among the neighbours). */
export function localGraphProps(centerKey: string, maxNodes = 36) {
  const { nodes, edges } = getGraph();
  const nb = new Set<string>([centerKey]);
  for (const e of edges) {
    if (e.a === centerKey) nb.add(e.b);
    if (e.b === centerKey) nb.add(e.a);
  }
  const keep = [...nb].slice(0, maxNodes);
  const set = new Set(keep);
  const sel = nodes.filter((n) => set.has(n.key));
  const ed = edges.filter((e) => set.has(e.a) && set.has(e.b));
  const W = 900;
  const H = 620;
  const pos = new Map(layoutGraph(sel, ed, { w: W, h: H, rest: 120, charge: 12000, iterations: 300 }).map((p) => [p.key, p]));
  // pin the centre
  const c = pos.get(centerKey);
  if (c) {
    const dx = W / 2 - c.x;
    const dy = H / 2 - c.y;
    for (const p of pos.values()) {
      p.x = Math.round(Math.min(W - 30, Math.max(30, p.x + dx)));
      p.y = Math.round(Math.min(H - 30, Math.max(30, p.y + dy)));
    }
  }
  return {
    nodes: sel.map((n) => ({ ...n, x: pos.get(n.key)!.x, y: pos.get(n.key)!.y, sub: sub(n.key) })),
    edges: ed.map((e) => [e.a, e.b] as [string, string]),
    width: W,
    height: H,
  };
}

// ---------- the tradition "universe" map ----------

export const FAMILY_ORDER = [
  "vedic",
  "darshana",
  "vedanta-school",
  "epic-puranic",
  "bhakti",
  "shaiva",
  "shakta",
  "tantric",
  "sikh",
  "tamil",
  "modern",
  "shramana",
  "buddhist-school",
  "materialist",
];

export interface MapNode {
  id: string;
  label: string;
  sa?: string;
  family: string;
  parent: string | null;
  x: number;
  y: number;
  r: number;
  tagline: string;
  questions: string[];
}

const SHORT: Record<string, string> = {
  vedic: "Vedic & Upanishadic",
  charvaka: "Charvaka",
  jainism: "Jainism",
  buddhism: "Buddhism",
  sikhism: "Sikh philosophy",
  "tamil-ethics": "Tamil ethics",
  "modern": "Modern expositions",
  "itihasa-purana": "Epics & Puranas",
  bhakti: "Bhakti",
  advaita: "Advaita",
  vishishtadvaita: "Vishishtadvaita",
  dvaita: "Dvaita",
  "kashmir-shaivism": "Kashmir Shaivism",
  mimamsa: "Mimamsa",
  yoga: "Yoga",
};
function shortLabel(id: string, name: string) {
  return SHORT[id] ?? name.replace(/ \(.+\)$/, "");
}

export const traditionMapProps = cache(() => {
  const W = 1000;
  const H = 1000;
  const cx = W / 2;
  const cy = H / 2;
  const all = getTraditions();
  // top level = no parent; children orbit their parent
  const top = all.filter((t) => !t.parent);
  const famRank = (f: string) => {
    const i = FAMILY_ORDER.indexOf(f);
    return i < 0 ? 99 : i;
  };
  top.sort((a, b) => famRank(a.family) - famRank(b.family) || a.name.en.localeCompare(b.name.en));
  const weight = (id: string) => 1 + all.filter((t) => t.parent === id).length * 0.6;
  const total = top.reduce((n, t) => n + weight(t.id), 0);
  const nodes: MapNode[] = [];
  let acc = 0;
  for (const t of top) {
    const w = weight(t.id);
    const a = ((acc + w / 2) / total) * Math.PI * 2 - Math.PI / 2;
    acc += w;
    const R = 300;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R;
    nodes.push({ id: t.id, label: shortLabel(t.id, t.name.en), sa: t.name.sa, family: t.family, parent: null, x: Math.round(x), y: Math.round(y), r: 11, tagline: t.tagline, questions: t.coreQuestions.slice(0, 3) });
    const kids = all.filter((k) => k.parent === t.id);
    kids.forEach((k, i) => {
      const spread = Math.min(0.42, 0.15 * kids.length);
      const ka = a + (kids.length === 1 ? 0 : -spread / 2 + (spread * i) / (kids.length - 1));
      const KR = 440;
      nodes.push({
        id: k.id,
        label: shortLabel(k.id, k.name.en),
        sa: k.name.sa,
        family: k.family,
        parent: t.id,
        x: Math.round(cx + Math.cos(ka) * KR),
        y: Math.round(cy + Math.sin(ka) * KR),
        r: 7,
        tagline: k.tagline,
        questions: k.coreQuestions.slice(0, 3),
      });
    });
  }
  const ids = new Set(nodes.map((n) => n.id));
  const related: [string, string][] = [];
  const seen = new Set<string>();
  for (const t of all)
    for (const r of t.relatedTraditions ?? []) {
      if (!ids.has(r.id) || r.id === t.parent) continue;
      const k = [t.id, r.id].sort().join("|");
      if (!seen.has(k)) {
        seen.add(k);
        related.push([t.id, r.id]);
      }
    }
  return { nodes, related, width: W, height: H };
});
