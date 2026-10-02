# Indian Philosophy OS

A frontend-only, source-first system for exploring Indian philosophical thought:
**Question → Concept → Tradition → Thinker → Text → Passage**, all connected by ids.
The first complete module is the **Bhagavad Gita with Sadhak Sanjivani** (Swami Ramsukhdas Ji), which is fully
ingested: all 700 verses with Sanskrit, Hindi, English and the full commentary.

Next.js (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 · no backend, no accounts, no AI at runtime.
Library data (bookmarks, notes, progress, path progress, preferences) lives in `localStorage`.

## The OS layer

| Route | |
|---|---|
| `/` | Question-first home, explorer teaser, six darshanas, comparison preview, concepts, Gita module, library, paths, thinkers |
| `/explore` | Tradition "universe" map + full knowledge graph (zoom, pan, search, filter by kind / tradition / text, focus) |
| `/questions`, `/questions/[id]` | Free-text question finder (keyword routing, no generation) + 13 big questions: quick answer, perspectives, sources, start here → go deeper. The Gita Q&A stays at `/questions#<id>` |
| `/concepts`, `/concepts/[id]` | 66 concepts: what it is, how its meaning differs by tradition, the Sadhak Sanjivani Gita layer where it exists, "Follow this idea", local graph |
| `/compare` | Choose a question and traditions and see them side by side (`?topic=self&traditions=advaita,buddhism`) — no ranking |
| `/traditions`, `/traditions/[id]`, `/darshanas` | 26 traditions and schools; the six darshanas matrix |
| `/texts`, `/texts/[id]` | 69 texts, labelled by source type and ingestion status |
| `/thinkers`, `/thinkers/[id]` | 28 thinkers with hedged history, works, disagreements |
| `/paths`, `/paths/[id]` | 4 cross-tradition paths + 3 Gita paths, with progress |
| `/tools/tattvas`, `/tools/anekanta`, `/tools/pramana` | Interactive explainers |
| `/my` | My Library |

Reading level (Beginner / Standard / Scholar) and languages are set in the **Aa** menu.

### Content model

```
src/data/os/
  traditions/<id>.json  texts/<id>.json  thinkers/<id>.json  concepts/<id>.json
  questions/<id>.json   comparisons/<id>.json  paths/<id>.json  tools/*.ts
scripts/os/registry.json   ← the only valid ids
scripts/os/AUTHORING.md    ← schemas + fidelity rules (no fabricated passages, hedged history, no ranking)
scripts/os/validate.py     ← checks every cross-reference and blocks quoted source text
```

The relationship graph (`src/lib/os/data.ts#getGraph`) is derived from the entities' references. To add a text,
add its id to the registry, write `texts/<id>.json`, and run `python3 scripts/os/validate.py`. No UI changes are needed.
Texts marked `"ingested": false` show overviews and passage *references* only, labelled "Source not yet ingested".

---

## The Gita module — Sadhak Sanjivani, one verse at a time

A frontend-only reading and learning experience for the Bhagavad Gita, built on
**Sadhak Sanjivani** by Swami Ramsukhdas Ji (Hindi edition with परिशिष्ट + English edition).

Next.js (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 · no backend, no accounts.
Reading progress, bookmarks, notes and preferences live in `localStorage`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000  (builds the search index first)
npm run build      # static site in ./out — host on any static server
npx serve out      # preview the static build
```

## What's inside

| Route | |
|---|---|
| `/gita` | Gita home: hero, continue reading, "What brings you here?", today's verse, 18 chapters, paths, questions |
| `/chapters`, `/chapter/[c]` | Chapter explorer; overview, why-here, questions, key verses, the chapter "journey" in sections, Swamiji's अवतरणिका |
| `/verse/[c]/[v]` | 700 verses. Sanskrit (+IAST), Hindi & English translation, **Learn / Read / Deep dive** modes, word-by-word, source examples, modern analogies (labelled), full commentary + परिशिष्ट भाव with linked cross-references, bookmarks, notes |
| `/concepts`, `/concepts/[id]` | 30 concepts with a knowledge-graph map |
| `/questions` | 16 questions mapped to verses |
| `/paths/[id]`, `/journey/[id]` | Guided sequences; verses opened from them show a step bar |
| `/quick` | Quick read — key verses in one line each |
| `/my` | My Gita — progress, saved items, notes, recent |
| `/about` | Source transparency and known limitations |

Search: ⌘K / `/` anywhere — Sanskrit, Hindi, English, IAST, concepts, verse numbers (`2.47`).

## Content architecture

```
src/data/generated/          ← source layer, extracted from the PDFs (do not hand-edit)
  chapters/chapter-XX.json   Sanskrit, IAST, word meanings, Hindi/English translation,
                             सम्बन्ध, commentary, appendix, footnotes, page refs
  chapters-index.json
src/data/curated/            ← learning layer (paraphrase of the source; examples quote it exactly)
  verses/ch02-*.json         every verse of chapter 2
  chapters/chXX-YY.json      chapter overviews + key verses of every chapter
  concepts.json questions.json journeys.json paths.json
```

UI components never hard-code content. Three layers are always labelled in the UI:
**Source** (the book's text) · **Summary based on Sadhak Sanjivani** (ours) · **Modern analogy — not from the source** (ours).

## Regenerating the source data

`scripts/pipeline/` holds the extraction pipeline (Python 3 + PyMuPDF, Node):

1. Hindi PDF uses the legacy *Chanakya* font → text re-encoded (MacRoman→cp1252) and converted to Unicode
   (`fastconv.js` + `map.json`, `convlines.js`), then segmented by layout into verses (`build_hi.py`).
2. English PDF is an OCR'd scan → verses/commentary parsed and cleaned (`build_en.py`); alignment is validated
   against IAST generated from the Hindi Sanskrit (`translit.py`).
3. `build_data.py` merges both into `src/data/generated/`.
4. `validate_curated.py` checks curated files: verse/concept ids exist and every example quote is an exact
   substring of the source commentary. `CURATION_GUIDE.md` has the fidelity rules for adding content.
