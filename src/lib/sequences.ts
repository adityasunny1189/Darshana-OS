import "server-only";
import { getJourneys, getPaths, verseExists } from "./data";
import type { Sequence } from "@/components/verse/journey-bar";

/** Compact list of guided sequences a verse can be opened from (journeys + learning paths). */
export function getSequences(): Record<string, Sequence> {
  const out: Record<string, Sequence> = {};
  for (const j of getJourneys()) {
    out[`j-${j.id}`] = {
      label: j.label,
      href: `/journey/${j.id}`,
      ids: j.steps.map((s) => s.verse).filter(verseExists),
    };
  }
  for (const p of getPaths()) {
    const ids: string[] = [];
    for (const s of p.steps) for (const v of s.verses) if (verseExists(v) && !ids.includes(v)) ids.push(v);
    out[`p-${p.id}`] = { label: p.title, href: `/paths/${p.id}`, ids };
  }
  return out;
}

/** Only the sequences that include a given verse (keeps each page small). */
export function sequencesFor(id: string): Record<string, Sequence> {
  const all = getSequences();
  return Object.fromEntries(Object.entries(all).filter(([, s]) => s.ids.includes(id)));
}
