// Builds public/data/search-index.json from generated source data + curated layer.
// Runs before `dev` and `build` (see package.json).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DATA = path.join(root, "src", "data");
const read = (f, fb) => {
  try {
    return JSON.parse(fs.readFileSync(f, "utf8"));
  } catch {
    return fb;
  }
};
const list = (d) => {
  try {
    return fs.readdirSync(d).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(d, f));
  } catch {
    return [];
  }
};

const curated = new Map();
const chapters = new Map();
for (const f of list(path.join(DATA, "curated", "chapters"))) {
  const j = read(f, {});
  for (const v of j.verses ?? []) curated.set(v.id, v);
  for (const c of j.chapters ?? []) chapters.set(c.chapter, c);
}
for (const f of list(path.join(DATA, "curated", "verses"))) for (const v of read(f, [])) curated.set(v.id, v);

const verses = [];
for (let c = 1; c <= 18; c++) {
  const ch = read(path.join(DATA, "generated", "chapters", `chapter-${String(c).padStart(2, "0")}.json`), null);
  if (!ch) continue;
  for (const v of ch.verses) {
    const cu = curated.get(v.id);
    verses.push({
      id: v.id,
      c: v.chapter,
      v: v.verse,
      sa: v.sanskrit.join(" "),
      tr: v.iast.join(" "),
      hi: v.hindi,
      en: v.english ?? "",
      h: cu ? [cu.headline?.en, cu.headline?.hi].filter(Boolean).join(" | ") : "",
      e: cu ? [cu.essence?.en, cu.essence?.hi].filter(Boolean).join(" | ") : "",
      k: cu ? (cu.concepts ?? []).join(" ") : "",
      w: v.words.map((w) => w.sa).join(" "),
    });
  }
}

const osDir = (d) => list(path.join(DATA, "os", d)).map((f) => read(f, null)).filter(Boolean);
const gitaConcepts = new Map(read(path.join(DATA, "curated", "concepts.json"), []).map((c) => [c.id, c]));
const concepts = osDir("concepts").map((c) => ({
  id: c.id,
  sa: c.name.sa ?? "",
  iast: c.name.iast ?? "",
  en: c.name.en,
  hi: gitaConcepts.get(c.id)?.hi ?? "",
  s: c.short ?? "",
  sh: gitaConcepts.get(c.id)?.short?.hi ?? "",
  t: (c.traditions ?? []).join(" "),
}));
const traditions = osDir("traditions").map((t) => ({ id: t.id, sa: t.name.sa ?? "", en: t.name.en, iast: t.name.iast ?? "", s: t.tagline, k: (t.coreConcepts ?? []).join(" ") }));
const texts = osDir("texts").map((t) => ({ id: t.id, sa: t.title.sa ?? "", en: t.title.en, iast: t.title.iast ?? "", s: t.summary, k: [...(t.concepts ?? []), ...(t.themes ?? []), ...(t.traditions ?? [])].join(" "), ing: !!t.ingested }));
const thinkers = osDir("thinkers").map((t) => ({ id: t.id, sa: t.name.sa ?? "", en: t.name.en, s: t.period, k: [...(t.traditions ?? []), ...(t.concepts ?? [])].join(" ") }));
const osQuestions = osDir("questions").map((q) => ({ id: q.id, en: q.q, k: [...q.concepts, ...q.traditions].join(" "), os: true }));

const questions = [
  ...osQuestions,
  ...read(path.join(DATA, "curated", "questions.json"), []).map((q) => ({ id: q.id, en: q.q.en, hi: q.q.hi, k: (q.concepts ?? []).join(" "), os: false })),
];

const fallbackNames = [
  "Arjuna Vishada Yoga", "Sankhya Yoga", "Karma Yoga", "Jnana Karma Sannyasa Yoga", "Karma Sannyasa Yoga",
  "Atma Samyama Yoga", "Jnana Vijnana Yoga", "Akshara Brahma Yoga", "Raja Vidya Raja Guhya Yoga", "Vibhuti Yoga",
  "Vishvarupa Darshana Yoga", "Bhakti Yoga", "Kshetra Kshetrajna Vibhaga Yoga", "Gunatraya Vibhaga Yoga",
  "Purushottama Yoga", "Daivasura Sampad Vibhaga Yoga", "Shraddhatraya Vibhaga Yoga", "Moksha Sannyasa Yoga",
];
const index = read(path.join(DATA, "generated", "chapters-index.json"), []);
const chapterEntries = index.map((c) => {
  const cu = chapters.get(c.chapter);
  return {
    c: c.chapter,
    sa: cu?.nameSa ?? c.yogaSa,
    iast: cu?.nameIast ?? fallbackNames[c.chapter - 1],
    en: cu ? `${cu.nameEn} — ${cu.subtitle?.en ?? ""}` : fallbackNames[c.chapter - 1],
    hi: cu?.subtitle?.hi ?? "",
  };
});

fs.mkdirSync(path.join(root, "public", "data"), { recursive: true });
fs.writeFileSync(
  path.join(root, "public", "data", "search-index.json"),
  JSON.stringify({ verses, concepts, questions, chapters: chapterEntries, traditions, texts, thinkers }),
);
console.log(
  `search index: ${verses.length} verses (${[...curated.keys()].length} curated), ${concepts.length} concepts, ${traditions.length} traditions, ${texts.length} texts, ${thinkers.length} thinkers, ${questions.length} questions`,
);
