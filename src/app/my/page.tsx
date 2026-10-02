import type { Metadata } from "next";
import { getChapterIndex, getConcepts, getCuratedVerses } from "@/lib/data";
import { L } from "@/components/bi";
import { MyGita, type Entity, type MiniConcept, type MiniPath, type MiniVerse } from "./my-gita";
import { getOsConcepts, getOsPaths, getOsQuestions, getTexts, getThinkers, getTraditions } from "@/lib/os/data";

export const metadata: Metadata = { title: "My Library" };

export default function MyPage() {
  const index = getChapterIndex();
  const verses: Record<string, MiniVerse> = {};
  const curated = getCuratedVerses();
  for (const ch of index)
    for (const v of ch.verses) {
      const id = `${ch.chapter}.${v.n}`;
      verses[id] = { id, headline: curated.get(id)?.headline.en ?? null, sa: v.first };
    }
  const concepts: Record<string, MiniConcept> = Object.fromEntries(getConcepts().map((c) => [c.id, { id: c.id, sa: c.sa, en: c.en }]));
  for (const c of getOsConcepts()) concepts[c.id] = { id: c.id, sa: c.name.sa ?? "", en: c.name.en };
  const entities: Record<string, Entity> = {};
  for (const t of getTraditions()) entities[`tradition:${t.id}`] = { label: t.name.en, href: `/traditions/${t.id}`, kind: "Tradition" };
  for (const t of getTexts()) entities[`text:${t.id}`] = { label: t.title.en, href: `/texts/${t.id}`, kind: "Text" };
  for (const t of getThinkers()) entities[`thinker:${t.id}`] = { label: t.name.en, href: `/thinkers/${t.id}`, kind: "Thinker" };
  for (const c of getOsConcepts()) entities[`concept:${c.id}`] = { label: c.name.en.split(" — ")[0], href: `/concepts/${c.id}`, kind: "Concept" };
  for (const q of getOsQuestions()) entities[`question:${q.id}`] = { label: q.q, href: `/questions/${q.id}`, kind: "Question" };
  entities["tool:tattvas"] = { label: "25 Tattvas Explorer", href: "/tools/tattvas", kind: "Interactive" };
  entities["tool:anekanta"] = { label: "Many-Sided Reality", href: "/tools/anekanta", kind: "Interactive" };
  entities["tool:pramana"] = { label: "How do we know?", href: "/tools/pramana", kind: "Interactive" };
  const paths: MiniPath[] = getOsPaths().map((p) => ({ id: p.id, title: p.title, keys: p.steps.map((s) => `${s.kind}:${s.id}`) }));
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="pb-12 pt-16 sm:pt-24">
        <p className="eyebrow mb-4">
          <L en="Kept only in this browser" hi="केवल इसी ब्राउज़रमें" />
        </p>
        <h1 className="font-display text-[clamp(2.3rem,6vw,4rem)] leading-[1.05]">
          <L en="My Library" hi="मेरा पुस्तकालय" />
        </h1>
      </header>
      <MyGita verses={verses} concepts={concepts} chapterCounts={index.map((c) => c.verseCount)} entities={entities} paths={paths} />
    </div>
  );
}
