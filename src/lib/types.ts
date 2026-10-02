// ---------- Source layer (generated from the Sadhak Sanjivani PDFs) ----------

export type Block =
  | { type: "para"; text: string }
  | { type: "heading"; text: string }
  | { type: "verse"; text: string };

export interface SourceVerse {
  id: string; // "2.47"
  chapter: number;
  verse: number;
  group: number[]; // verses the source comments on together
  speaker: { sa: string; en: string | null } | null;
  sanskrit: string[];
  iast: string[];
  words: { sa: string; hi: string }[];
  hindi: string;
  english: string | null;
  link: { hi: string | null; en: string | null };
  commentary: { hi: Block[]; en: Block[] };
  appendix: { hi: Block[]; en: Block[] };
  notes: { hi: string[]; en: string[] };
  source: {
    book: string;
    author: string;
    hiPage: number;
    enPage: number | null;
    enVerses: [number, number] | null;
  };
}

export interface SourceChapter {
  chapter: number;
  titleSa: string;
  yogaSa: string;
  colophon: string;
  intro: { hi: Block[] };
  closing: { hi: Block[] };
  sourcePage: number;
  verses: SourceVerse[];
}

export interface ChapterIndexEntry {
  chapter: number;
  yogaSa: string;
  verseCount: number;
  sourcePage: number;
  verses: { n: number; first: string; hasEnglish: boolean }[];
}

// ---------- Curated learning layer ----------

export interface Bi {
  en: string;
  hi: string;
}

export interface CuratedExample {
  title: Bi;
  text: Bi;
  quote: { hi: string };
  from?: "commentary" | "appendix";
}

export interface CuratedVerse {
  id: string;
  headline: Bi;
  essence: Bi;
  idea: Bi;
  points?: Bi[];
  contrast?: {
    left: { label: Bi; items: Bi[] };
    right: { label: Bi; items: Bi[] };
  };
  examples?: CuratedExample[];
  modern?: { context: string; text: Bi }[];
  whyItMatters?: Bi;
  terms?: { sa: string; meaning: Bi }[];
  concepts?: string[];
  related?: string[];
}

export interface ChapterSection {
  from: number;
  to: number;
  title: Bi;
  summary: Bi;
}

export interface CuratedChapter {
  chapter: number;
  nameSa: string;
  nameIast: string;
  nameEn: string;
  subtitle: Bi;
  tagline: Bi;
  overview: Bi;
  whyHere: Bi;
  theme: Bi;
  keyConcepts: string[];
  questions: Bi[];
  sections: ChapterSection[];
  keyVerses: string[];
  motif: string;
}

export interface Concept {
  id: string;
  sa: string;
  iast: string;
  en: string;
  hi: string;
  short: Bi;
  what: Bi;
  source: Bi;
  quote?: { hi: string; from: string };
  verses: string[];
  related: string[];
  chapters: number[];
}

export interface Question {
  id: string;
  q: Bi;
  answer: Bi;
  verses: string[];
  concepts: string[];
  tags?: string[];
}

export interface Journey {
  id: string;
  label: Bi;
  intro: Bi;
  steps: { verse: string; why: Bi }[];
}

export interface LearningPath {
  id: string;
  title: Bi;
  description: Bi;
  steps: { title: Bi; summary: Bi; verses: string[]; concepts: string[] }[];
}

export type Lang = "en" | "hi";
