import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type {
  Comparison,
  EntityKind,
  GraphEdge,
  GraphNode,
  OsConcept,
  OsPath,
  OsQuestion,
  Step,
  TextEntity,
  Thinker,
  Tradition,
} from "./types";

const OS = path.join(process.cwd(), "src", "data", "os");

function readDir<T>(dir: string): T[] {
  try {
    return fs
      .readdirSync(path.join(OS, dir))
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) => {
        try {
          return JSON.parse(fs.readFileSync(path.join(OS, dir, f), "utf8")) as T;
        } catch {
          return null;
        }
      })
      .filter((x): x is Awaited<T> => !!x) as T[];
  } catch {
    return [];
  }
}

export const getTraditions = cache(() => readDir<Tradition>("traditions"));
export const getTexts = cache(() => readDir<TextEntity>("texts"));
export const getThinkers = cache(() => readDir<Thinker>("thinkers"));
export const getOsConcepts = cache(() => readDir<OsConcept>("concepts"));
export const getOsQuestions = cache(() => readDir<OsQuestion>("questions"));
export const getComparisons = cache(() => readDir<Comparison>("comparisons"));
export const getOsPaths = cache(() => readDir<OsPath>("paths"));

const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));
export const traditionMap = cache(() => byId(getTraditions()));
export const textMap = cache(() => byId(getTexts()));
export const thinkerMap = cache(() => byId(getThinkers()));
export const conceptMap = cache(() => byId(getOsConcepts()));
export const questionMap = cache(() => byId(getOsQuestions()));

export const getTradition = (id: string) => traditionMap().get(id) ?? null;
export const getText = (id: string) => textMap().get(id) ?? null;
export const getThinker = (id: string) => thinkerMap().get(id) ?? null;
export const getOsConcept = (id: string) => conceptMap().get(id) ?? null;
export const getOsQuestion = (id: string) => questionMap().get(id) ?? null;

// ---------- display helpers ----------

export interface Ref {
  kind: Step["kind"];
  id: string;
  label: string;
  sa?: string;
  href: string;
  sub?: string;
}

const TOOLS: Record<string, { label: string; href: string }> = {
  tattvas: { label: "25 Tattvas Explorer", href: "/tools/tattvas" },
  anekanta: { label: "Many-Sided Reality", href: "/tools/anekanta" },
  pramana: { label: "How do we know something is true?", href: "/tools/pramana" },
};

export function resolve(kind: Step["kind"], id: string): Ref | null {
  switch (kind) {
    case "tradition": {
      const t = getTradition(id);
      return t ? { kind, id, label: t.name.en, sa: t.name.sa, href: `/traditions/${id}`, sub: t.tagline } : null;
    }
    case "text": {
      const t = getText(id);
      return t ? { kind, id, label: t.title.en, sa: t.title.sa, href: `/texts/${id}`, sub: t.summary } : null;
    }
    case "thinker": {
      const t = getThinker(id);
      return t ? { kind, id, label: t.name.en, sa: t.name.sa, href: `/thinkers/${id}`, sub: t.period } : null;
    }
    case "concept": {
      const c = getOsConcept(id);
      return c ? { kind, id, label: c.name.en, sa: c.name.sa, href: `/concepts/${id}`, sub: c.short } : null;
    }
    case "question": {
      const q = getOsQuestion(id);
      return q ? { kind, id, label: q.q, href: `/questions/${id}` } : null;
    }
    case "gita": {
      const [c, v] = id.split(".");
      return { kind, id, label: `Bhagavad Gita ${id}`, href: `/verse/${c}/${v}` };
    }
    case "tool": {
      const t = TOOLS[id];
      return t ? { kind, id, label: t.label, href: t.href } : null;
    }
  }
  return null;
}

export function resolveMany(kind: Step["kind"], ids: string[] | undefined): Ref[] {
  return (ids ?? []).map((i) => resolve(kind, i)).filter((x): x is Ref => !!x);
}

export function childrenOf(id: string) {
  return getTraditions().filter((t) => t.parent === id);
}

/** Texts that list a tradition, plus those the tradition lists. */
export function textsForTradition(id: string) {
  const t = getTradition(id);
  const ids = new Set([...(t?.texts ?? []), ...getTexts().filter((x) => x.traditions.includes(id)).map((x) => x.id)]);
  return [...ids].map((i) => getText(i)).filter((x): x is TextEntity => !!x);
}

export function thinkersForTradition(id: string) {
  const t = getTradition(id);
  const ids = new Set([...(t?.thinkers ?? []), ...getThinkers().filter((x) => x.traditions.includes(id)).map((x) => x.id)]);
  return [...ids].map((i) => getThinker(i)).filter((x): x is Thinker => !!x);
}

export function conceptsForText(id: string) {
  const t = getText(id);
  const ids = new Set([...(t?.concepts ?? []), ...getOsConcepts().filter((c) => c.texts?.includes(id)).map((c) => c.id)]);
  return [...ids].map((i) => getOsConcept(i)).filter((x): x is OsConcept => !!x);
}

export function questionsFor(kind: "concept" | "tradition", id: string) {
  return getOsQuestions().filter((q) => (kind === "concept" ? q.concepts.includes(id) : q.traditions.includes(id)));
}

export function textsByThinker(id: string) {
  const th = getThinker(id);
  const ids = new Set([...(th?.works ?? []), ...getTexts().filter((t) => t.author === id || t.thinkers?.includes(id)).map((t) => t.id)]);
  return [...ids].map((i) => getText(i)).filter((x): x is TextEntity => !!x);
}

export function pathsIncluding(kind: Step["kind"], id: string) {
  return getOsPaths().filter((p) => p.steps.some((s) => s.kind === kind && s.id === id));
}

// ---------- the relationship graph (the backbone) ----------

export const getGraph = cache((): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge>();
  const add = (kind: EntityKind, id: string, label: string, href: string, sa?: string) =>
    nodes.set(`${kind}:${id}`, { key: `${kind}:${id}`, kind, id, label, sa, href });
  const link = (a: string, b: string) => {
    if (a === b) return;
    const k = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (!edges.has(k)) edges.set(k, { a, b });
  };
  for (const t of getTraditions()) add("tradition", t.id, t.name.en, `/traditions/${t.id}`, t.name.sa);
  for (const t of getTexts()) add("text", t.id, t.title.en, `/texts/${t.id}`, t.title.sa);
  for (const t of getThinkers()) add("thinker", t.id, t.name.en, `/thinkers/${t.id}`, t.name.sa);
  for (const c of getOsConcepts()) add("concept", c.id, c.name.en.split(" — ")[0], `/concepts/${c.id}`, c.name.sa);

  for (const t of getTraditions()) {
    const k = `tradition:${t.id}`;
    if (t.parent) link(k, `tradition:${t.parent}`);
    t.coreConcepts.forEach((c) => link(k, `concept:${c}`));
    t.texts?.forEach((x) => link(k, `text:${x}`));
    t.thinkers?.forEach((x) => link(k, `thinker:${x}`));
    t.relatedTraditions?.forEach((r) => link(k, `tradition:${r.id}`));
  }
  for (const t of getTexts()) {
    const k = `text:${t.id}`;
    t.traditions.forEach((x) => link(k, `tradition:${x}`));
    t.concepts.forEach((x) => link(k, `concept:${x}`));
    t.relatedTexts?.forEach((r) => link(k, `text:${r.id}`));
    if (t.author) link(k, `thinker:${t.author}`);
  }
  for (const t of getThinkers()) {
    const k = `thinker:${t.id}`;
    t.traditions.forEach((x) => link(k, `tradition:${x}`));
    t.works?.forEach((x) => link(k, `text:${x}`));
    t.concepts?.forEach((x) => link(k, `concept:${x}`));
  }
  for (const c of getOsConcepts()) {
    const k = `concept:${c.id}`;
    c.relatedConcepts.forEach((x) => link(k, `concept:${x}`));
    c.traditions.forEach((x) => link(k, `tradition:${x}`));
    c.texts?.forEach((x) => link(k, `text:${x}`));
  }
  const valid = [...edges.values()].filter((e) => nodes.has(e.a) && nodes.has(e.b));
  return { nodes: [...nodes.values()], edges: valid };
});

/** Deterministic force layout, computed at build time so the browser only draws. */
export function layoutGraph(nodes: { key: string }[], edges: GraphEdge[], opts: { w: number; h: number; iterations?: number; rest?: number; charge?: number }) {
  const { w, h, iterations = 350, rest = 90, charge = 9000 } = opts;
  const idx = new Map(nodes.map((n, i) => [n.key, i]));
  const E = edges.map((e) => [idx.get(e.a)!, idx.get(e.b)!]).filter(([a, b]) => a !== undefined && b !== undefined);
  // seeded placement on a golden spiral
  const pos = nodes.map((_, i) => {
    const r = Math.sqrt(i + 0.5) / Math.sqrt(nodes.length);
    const a = i * 2.39996;
    return { x: w / 2 + Math.cos(a) * r * w * 0.45, y: h / 2 + Math.sin(a) * r * h * 0.45 };
  });
  const deg = new Array(nodes.length).fill(0);
  E.forEach(([a, b]) => {
    deg[a]++;
    deg[b]++;
  });
  for (let it = 0; it < iterations; it++) {
    const t = 1 - it / iterations;
    const f = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < pos.length; i++)
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const d2 = Math.max(dx * dx + dy * dy, 64);
        const d = Math.sqrt(d2);
        const rep = charge / d2;
        f[i].x += (dx / d) * rep;
        f[i].y += (dy / d) * rep;
        f[j].x -= (dx / d) * rep;
        f[j].y -= (dy / d) * rep;
      }
    for (const [a, b] of E) {
      const dx = pos[b].x - pos[a].x;
      const dy = pos[b].y - pos[a].y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const s = ((d - rest) * 0.03) / Math.max(1, Math.sqrt(Math.min(deg[a], deg[b])));
      f[a].x += (dx / d) * s;
      f[a].y += (dy / d) * s;
      f[b].x -= (dx / d) * s;
      f[b].y -= (dy / d) * s;
    }
    pos.forEach((p, i) => {
      f[i].x += (w / 2 - p.x) * 0.012;
      f[i].y += (h / 2 - p.y) * 0.016;
      p.x = Math.min(w - 30, Math.max(30, p.x + Math.max(-15, Math.min(15, f[i].x)) * t * 2));
      p.y = Math.min(h - 30, Math.max(30, p.y + Math.max(-15, Math.min(15, f[i].y)) * t * 2));
    });
  }
  return nodes.map((n, i) => ({ key: n.key, x: Math.round(pos[i].x), y: Math.round(pos[i].y) }));
}

export const FAMILY_LABEL: Record<string, string> = {
  vedic: "Vedic foundations",
  darshana: "The Six Darshanas",
  "vedanta-school": "Schools of Vedanta",
  shramana: "Shramana traditions",
  "buddhist-school": "Buddhist schools",
  shaiva: "Shaiva traditions",
  shakta: "Shakta traditions",
  tantric: "Tantra",
  bhakti: "Bhakti",
  "epic-puranic": "Epics & Puranas",
  sikh: "Sikh philosophy",
  tamil: "Tamil ethical literature",
  materialist: "Materialism",
  modern: "Modern expositions",
};

export const SOURCE_TYPE_LABEL: Record<string, string> = {
  "primary-text": "Primary source",
  "traditional-commentary": "Traditional commentary",
  "modern-commentary": "Modern commentary",
  "modern-exposition": "Modern exposition",
  "modern-analogy": "Modern analogy",
  editorial: "Editorial overview",
};
