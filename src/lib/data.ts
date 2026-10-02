import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type {
  ChapterIndexEntry,
  Concept,
  CuratedChapter,
  CuratedVerse,
  Journey,
  LearningPath,
  Question,
  SourceChapter,
  SourceVerse,
} from "./types";
import { CHAPTER_FALLBACK } from "./chapter-fallback";

const DATA = path.join(process.cwd(), "src", "data");

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

// ---------- source ----------

export const getChapterIndex = cache((): ChapterIndexEntry[] =>
  readJson(path.join(DATA, "generated", "chapters-index.json"), []),
);

export const getSourceChapter = cache((c: number): SourceChapter | null =>
  readJson<SourceChapter | null>(
    path.join(DATA, "generated", "chapters", `chapter-${String(c).padStart(2, "0")}.json`),
    null,
  ),
);

export function getSourceVerse(c: number, v: number): SourceVerse | null {
  return getSourceChapter(c)?.verses.find((x) => x.verse === v) ?? null;
}

export function verseExists(id: string): boolean {
  const [c, v] = id.split(".").map(Number);
  const ch = getChapterIndex().find((x) => x.chapter === c);
  return !!ch && v >= 1 && v <= ch.verseCount;
}

// ---------- curated ----------

interface ChapterFile {
  chapters?: CuratedChapter[];
  verses?: CuratedVerse[];
}

const curatedFiles = cache(() => {
  const dir = (d: string) => {
    try {
      return fs
        .readdirSync(path.join(DATA, "curated", d))
        .filter((f) => f.endsWith(".json"))
        .sort()
        .map((f) => path.join(DATA, "curated", d, f));
    } catch {
      return [];
    }
  };
  return { chapterFiles: dir("chapters"), verseFiles: dir("verses") };
});

export const getCuratedVerses = cache((): Map<string, CuratedVerse> => {
  const map = new Map<string, CuratedVerse>();
  const { chapterFiles, verseFiles } = curatedFiles();
  for (const f of chapterFiles) {
    for (const v of readJson<ChapterFile>(f, {}).verses ?? []) map.set(v.id, v);
  }
  // dedicated verse files take precedence over key-verse entries in chapter files
  for (const f of verseFiles) {
    for (const v of readJson<CuratedVerse[]>(f, [])) map.set(v.id, v);
  }
  return map;
});

export function getCuratedVerse(id: string): CuratedVerse | null {
  return getCuratedVerses().get(id) ?? null;
}

export const getCuratedChapters = cache((): Map<number, CuratedChapter> => {
  const map = new Map<number, CuratedChapter>();
  for (const f of curatedFiles().chapterFiles) {
    for (const c of readJson<ChapterFile>(f, {}).chapters ?? []) map.set(c.chapter, c);
  }
  return map;
});

/** Curated chapter meta, falling back to minimal built-in names. */
export function getChapterMeta(c: number): CuratedChapter {
  const cur = getCuratedChapters().get(c);
  if (cur) return cur;
  const fb = CHAPTER_FALLBACK[c - 1];
  const count = getChapterIndex().find((x) => x.chapter === c)?.verseCount ?? 0;
  return {
    chapter: c,
    nameSa: fb.nameSa,
    nameIast: fb.nameIast,
    nameEn: fb.nameEn,
    subtitle: fb.subtitle,
    tagline: fb.subtitle,
    overview: { en: "", hi: "" },
    whyHere: { en: "", hi: "" },
    theme: fb.subtitle,
    keyConcepts: [],
    questions: [],
    sections: [{ from: 1, to: count, title: fb.subtitle, summary: { en: "", hi: "" } }],
    keyVerses: [],
    motif: fb.motif,
  };
}

export function getAllChapterMeta(): CuratedChapter[] {
  return Array.from({ length: 18 }, (_, i) => getChapterMeta(i + 1));
}

export const getConcepts = cache((): Concept[] =>
  readJson(path.join(DATA, "curated", "concepts.json"), []),
);
export function getConcept(id: string): Concept | null {
  return getConcepts().find((c) => c.id === id) ?? null;
}
export const getQuestions = cache((): Question[] =>
  readJson(path.join(DATA, "curated", "questions.json"), []),
);
export const getJourneys = cache((): Journey[] =>
  readJson(path.join(DATA, "curated", "journeys.json"), []),
);
export const getPaths = cache((): LearningPath[] =>
  readJson(path.join(DATA, "curated", "paths.json"), []),
);

// ---------- light verse cards (safe to pass to client components) ----------

export interface VerseCard {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string[];
  essence: { en: string; hi: string } | null;
  headline: { en: string; hi: string } | null;
  hindi: string;
  english: string | null;
}

export function verseCard(id: string): VerseCard | null {
  const [c, v] = id.split(".").map(Number);
  const s = getSourceVerse(c, v);
  if (!s) return null;
  const cur = getCuratedVerse(id);
  return {
    id,
    chapter: c,
    verse: v,
    sanskrit: s.sanskrit,
    essence: cur?.essence ?? null,
    headline: cur?.headline ?? null,
    hindi: s.hindi,
    english: s.english,
  };
}

export function verseCards(ids: string[]): VerseCard[] {
  return ids.map(verseCard).filter((x): x is VerseCard => !!x);
}

/** All verse ids that have a curated learning layer, in canonical order. */
export function curatedVerseIds(): string[] {
  return [...getCuratedVerses().keys()].sort((a, b) => {
    const [ac, av] = a.split(".").map(Number);
    const [bc, bv] = b.split(".").map(Number);
    return ac - bc || av - bv;
  });
}
