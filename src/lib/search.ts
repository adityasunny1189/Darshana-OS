// Client-side search over a static JSON index. No backend.

export interface SVerse {
  id: string;
  c: number;
  v: number;
  sa: string;
  tr: string;
  hi: string;
  en: string;
  h: string;
  e: string;
  k: string;
  w: string;
}
export interface SConcept {
  id: string;
  sa: string;
  iast: string;
  en: string;
  hi: string;
  s: string;
  sh: string;
  t?: string;
}
export interface SQuestion {
  id: string;
  en: string;
  hi?: string;
  k?: string;
  os?: boolean;
}
export interface SEntity {
  id: string;
  sa: string;
  en: string;
  iast?: string;
  s: string;
  k: string;
  ing?: boolean;
}
export interface SChapter {
  c: number;
  sa: string;
  iast: string;
  en: string;
  hi: string;
}
export interface SearchIndex {
  verses: SVerse[];
  concepts: SConcept[];
  questions: SQuestion[];
  chapters: SChapter[];
  traditions?: SEntity[];
  texts?: SEntity[];
  thinkers?: SEntity[];
}

export type Hit =
  | { kind: "verse"; score: number; item: SVerse; field: string; snippet: string }
  | { kind: "concept"; score: number; item: SConcept }
  | { kind: "question"; score: number; item: SQuestion }
  | { kind: "chapter"; score: number; item: SChapter }
  | { kind: "tradition" | "text" | "thinker"; score: number; item: SEntity };

let cached: Promise<SearchIndex> | null = null;
export function loadIndex(): Promise<SearchIndex> {
  if (!cached) {
    cached = fetch("/data/search-index.json")
      .then((r) => r.json())
      .catch((e) => {
        cached = null;
        throw e;
      });
  }
  return cached;
}

/** lower-case, strip Latin diacritics, unify Devanagari visarga ':' / 'ः' and nukta */
export function fold(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/़/g, "")
    .replace(/ः/g, ":")
    .toLowerCase();
}

const DEVA_DIGITS = "०१२३४५६७८९";
const toAscii = (s: string) => s.replace(/[०-९]/g, (d) => String(DEVA_DIGITS.indexOf(d)));

function snippet(text: string, q: string, len = 120): string {
  const f = fold(text);
  const i = f.indexOf(q);
  if (i < 0) return text.slice(0, len);
  const start = Math.max(0, i - 40);
  return (start > 0 ? "…" : "") + text.slice(start, start + len) + (start + len < text.length ? "…" : "");
}

export function search(ix: SearchIndex, raw: string): Hit[] {
  const qRaw = toAscii(raw.trim());
  if (!qRaw) return [];
  const hits: Hit[] = [];

  // verse reference: "2.47", "2 47", "2:47", "bg 2.47", "ch 2"
  const ref = qRaw.match(/^(?:bg|gita|गीता)?\s*(\d{1,2})\s*[.:\s/।]\s*(\d{1,2})$/i);
  if (ref) {
    const v = ix.verses.find((x) => x.c === +ref[1] && x.v === +ref[2]);
    if (v) hits.push({ kind: "verse", score: 1000, item: v, field: "ref", snippet: v.en || v.hi });
  }
  const chRef = qRaw.match(/^(?:ch|chapter|अध्याय)?\s*(\d{1,2})$/i);
  if (chRef) {
    const c = ix.chapters.find((x) => x.c === +chRef[1]);
    if (c) hits.push({ kind: "chapter", score: 900, item: c });
  }

  const q = fold(qRaw);
  const terms = q.split(/\s+/).filter(Boolean);
  if (!terms.length) return hits;
  const all = (s: string) => terms.every((t) => s.includes(t));

  for (const c of ix.concepts) {
    const hay = fold([c.id, c.sa, c.iast, c.en, c.hi, c.s, c.sh, c.t ?? ""].join(" "));
    if (!all(hay)) continue;
    let score = 60;
    if ([c.en, c.hi, c.sa, c.iast, c.id].some((x) => fold(x) === q)) score += 200;
    else if ([c.en, c.hi, c.sa, c.iast].some((x) => fold(x).startsWith(q))) score += 120;
    hits.push({ kind: "concept", score, item: c });
  }

  for (const kind of ["tradition", "text", "thinker"] as const) {
    const list = ix[`${kind}s` as const] ?? [];
    for (const e of list) {
      const name = fold([e.en, e.sa, e.iast ?? "", e.id].join(" "));
      const hay = fold([e.en, e.sa, e.iast ?? "", e.id, e.s, e.k].join(" "));
      if (!all(hay)) continue;
      let score = kind === "tradition" ? 70 : kind === "text" ? 66 : 60;
      if (all(name)) score += 60;
      if ([e.en, e.sa, e.id].some((x) => fold(x) === q)) score += 120;
      hits.push({ kind, score, item: e });
    }
  }

  for (const c of ix.chapters) {
    const hay = fold([c.sa, c.iast, c.en, c.hi].join(" "));
    if (all(hay)) hits.push({ kind: "chapter", score: 80, item: c });
  }

  for (const qq of ix.questions) {
    const hay = fold(qq.en + " " + (qq.hi ?? "") + " " + (qq.k ?? ""));
    if (all(hay)) hits.push({ kind: "question", score: fold(qq.en + " " + (qq.hi ?? "")).includes(q) ? 90 : 55, item: qq });
  }

  const fields: [keyof SVerse, number][] = [
    ["h", 40],
    ["e", 30],
    ["k", 25],
    ["sa", 22],
    ["w", 20],
    ["tr", 18],
    ["en", 14],
    ["hi", 14],
  ];
  for (const v of ix.verses) {
    let best = 0;
    let field = "";
    for (const [f, w] of fields) {
      const val = v[f] as string;
      if (!val) continue;
      const hay = fold(val);
      if (!all(hay)) continue;
      let s = w;
      // prefer whole-word matches
      if (terms.every((t) => new RegExp(`(^|[\\s,.;'"‘’(—-])${escape(t)}`).test(hay))) s += 6;
      if (s > best) {
        best = s;
        field = f;
      }
    }
    if (best) {
      const src = field === "k" || field === "w" ? v.en || v.hi : (v[field as keyof SVerse] as string);
      hits.push({
        kind: "verse",
        score: best + (v.h ? 8 : 0),
        item: v,
        field,
        snippet: snippet(src.split(" | ")[0], terms[0]),
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score);
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
