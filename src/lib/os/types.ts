// Indian Philosophy OS — entity model. Everything connects through ids.

export type SourceType =
  | "primary-text"
  | "traditional-commentary"
  | "modern-commentary"
  | "modern-exposition"
  | "modern-analogy"
  | "editorial";

export type Difficulty = "beginner" | "beginner-intermediate" | "intermediate" | "advanced";

export interface Name {
  en: string;
  sa?: string;
  iast?: string;
}

export interface Darshana {
  problem: string;
  real: string;
  pramanas: string;
  self: string;
  bondage: string;
  liberation: string;
  path: string;
}

export interface Tradition {
  id: string;
  name: Name;
  family: string;
  parent: string | null;
  tagline: string;
  period?: string;
  overview: string;
  beginner: string;
  coreQuestions: string[];
  coreConcepts: string[];
  texts?: string[];
  thinkers?: string[];
  relatedTraditions?: { id: string; note?: string }[];
  darshana?: Darshana;
  disagreements?: { with: string; topic?: string; note: string }[];
  scholar?: string;
  difficulty?: Difficulty;
}

export interface TextEntity {
  id: string;
  title: Name;
  category: string;
  sourceType: SourceType;
  traditions: string[];
  attribution?: string;
  author?: string | null;
  period?: string;
  language?: string;
  difficulty: Difficulty;
  themes: string[];
  summary: string;
  whyRead: string;
  story?: string;
  questions?: string[];
  keyTeachings: { title: string; text: string }[];
  structure?: { label: string; note?: string }[];
  passages?: { ref: string; about: string; gita?: string[] }[];
  concepts: string[];
  relatedTexts?: { id: string; note?: string }[];
  thinkers?: string[];
  advanced?: boolean;
  ingested?: boolean;
}

export interface Thinker {
  id: string;
  name: Name;
  traditions: string[];
  period: string;
  context: string;
  coreIdeas: string[];
  works?: string[];
  otherWorks?: string[];
  attributionNote?: string;
  influences?: string[];
  influenced?: string[];
  disagreements?: { with: string; note: string }[];
  relatedThinkers?: string[];
  concepts?: string[];
}

export type StepKind = "concept" | "text" | "tradition" | "thinker" | "gita" | "question" | "tool";

export interface Step {
  kind: StepKind;
  id: string;
  note?: string;
  title?: string;
}

export interface OsConcept {
  id: string;
  name: Name;
  short: string;
  beginner: string;
  what: string;
  scholar?: string;
  perspectives?: { tradition: string; view: string }[];
  texts?: string[];
  traditions: string[];
  relatedConcepts: string[];
  questions?: string[];
  follow?: Step[];
  gitaVerses?: string[];
}

export interface OsQuestion {
  id: string;
  q: string;
  motif: string;
  quickAnswer: string;
  concepts: string[];
  traditions: string[];
  perspectives: { tradition: string; view: string; sources?: { text: string; ref?: string }[] }[];
  startHere: Step;
  goDeeper?: Step[];
  gitaQuestions?: string[];
  related?: string[];
}

export interface Comparison {
  id: string;
  topic: string;
  concept?: string;
  intro: string;
  rows: { tradition: string; claim: string; detail: string; sources?: { text: string; ref?: string }[]; concepts?: string[] }[];
  note?: string;
}

export interface OsPath {
  id: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  steps: Step[];
}

export type EntityKind = "tradition" | "text" | "thinker" | "concept" | "question";

export interface GraphNode {
  key: string; // "concept:karma"
  kind: EntityKind;
  id: string;
  label: string;
  sa?: string;
  href: string;
}
export interface GraphEdge {
  a: string;
  b: string;
}
