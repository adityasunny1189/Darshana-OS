# Indian Philosophy OS — content authoring guide

The app is a knowledge system: **Question → Concept → Tradition → Thinker → Text → Passage**.
All entities live as JSON in `app/src/data/os/<kind>/<id>.json` (one file per entity) and connect only through
the ids in `app/scripts/os/registry.json`. **Use only ids from the registry.** Never invent new ids.

The only primary source actually ingested so far is the **Bhagavad Gita with Sadhak Sanjivani**
(all 700 verses; verse ids like `"2.47"`). Everything else is *not yet ingested*.

## Hard rules

1. **No fabricated text.** Never write a quotation, translation or verse text of any work other than
   what is in `app/src/data/generated/` (the Gita). Do not put Sanskrit/Pali/Prakrit/Gurmukhi/Tamil verse text
   in any field. Titles and technical terms in Devanagari are fine.
2. **Citations only when certain.** You may cite a passage *reference* (e.g. `Katha Upanishad 1.2.18`,
   `Yoga Sutra 1.2`, `Chandogya Upanishad 6.8.7`, `Dhammapada 1`) only when you are highly confident the
   reference is correct and the passage is famously about the stated point. If in doubt, omit it.
   Such references render as "Source not yet ingested".
3. **Editorial voice.** Overviews, comparisons and explanations are `editorial`: neutral, accurate summaries of
   mainstream scholarship and of how each tradition describes itself. Write "Advaita holds…",
   "In Ramanuja's view…", "The Buddhist schools differ: …". Never say which view is correct. Never present one
   school as "Hinduism's" view.
4. **History is hedged.** Dates: give ranges and say when they are traditional or debated
   ("traditionally dated…", "scholars place it between…"). Attribution: "traditionally attributed to"
   when authorship is debated (e.g. Vivekachudamani, Yoga Vasistha, Tattva Bodha, Ashtavakra Gita).
5. **Don't flatten traditions.** Buddhism, Tantra, Bhakti etc. are plural — name internal differences.
   Tantra is not "techniques": present its philosophical, contemplative and ritual dimensions.
   Sikh thought is its own tradition, not a Hindu school. Modern expositions (Vivekananda) are labelled modern.
6. **Plain English** for a curious 23-year-old, precise enough for a scholar. No emojis, no hype,
   no "ancient wisdom hack" clichés. Sanskrit terms get a gloss on first use.
7. Gita links: when a teaching is illustrated by the Gita, link real Gita verse ids (`"2.20"`). Check a verse's
   content with `python3 app/scripts/pipeline/show.py 2 20 --brief` from the project root if unsure.

## Schemas

### tradition — `src/data/os/traditions/<id>.json`
```jsonc
{
  "id": "sankhya",
  "name": { "en": "Sankhya", "sa": "साङ्ख्य", "iast": "Sāṅkhya" },
  "family": "darshana",          // darshana | vedanta-school | shramana | buddhist-school | shaiva | shakta | tantric | bhakti | epic-puranic | vedic | sikh | tamil | materialist | modern
  "parent": null,                // tradition id or null (e.g. advaita → vedanta, madhyamaka → buddhism)
  "tagline": "one line",
  "period": "hedged dating",
  "overview": "4–6 sentences",
  "beginner": "2–3 sentences in the simplest words",
  "coreQuestions": ["What is the relation of consciousness to matter?", "..."],
  "coreConcepts": ["purusha", "prakriti", "guna", "tattva"],
  "texts": ["sankhya-karika"],
  "thinkers": ["kapila", "ishvarakrishna"],
  "relatedTraditions": [ { "id": "yoga", "note": "Yoga adopts Sankhya's metaphysics and adds Ishvara as a special purusha" } ],
  "darshana": {                  // REQUIRED for the six darshanas, advaita/vishishtadvaita/dvaita, buddhism, jainism; optional otherwise
    "problem": "What problem is it trying to solve?",
    "real": "What does it consider real?",
    "pramanas": "What is valid knowledge? (list its accepted pramanas)",
    "self": "What is the Self?",
    "bondage": "What causes bondage?",
    "liberation": "What is liberation?",
    "path": "What is the path to liberation?"
  },
  "disagreements": [ { "with": "advaita", "topic": "reality of the world", "note": "…" } ],
  "scholar": "optional technical note: sub-schools, key debates, terminology",
  "difficulty": "beginner"       // beginner | intermediate | advanced
}
```

### text — `src/data/os/texts/<id>.json`
```jsonc
{
  "id": "katha-upanishad",
  "title": { "en": "Katha Upanishad", "sa": "कठोपनिषद्", "iast": "Kaṭha Upaniṣad" },
  "category": "upanishad",       // veda | upanishad | sutra | itihasa | purana | smriti | bhashya | prakarana | agama-tantra | devotional | canonical-scripture | ethical-classic | modern-exposition | commentary
  "sourceType": "primary-text",  // primary-text | traditional-commentary | modern-commentary | modern-exposition
  "traditions": ["vedic", "vedanta"],
  "attribution": "Krishna Yajurveda; author unknown",  // hedged; thinker link optional:
  "author": null,                // thinker id or null
  "period": "hedged",
  "language": "Sanskrit",
  "difficulty": "beginner-intermediate", // beginner | beginner-intermediate | intermediate | advanced
  "themes": ["Self", "Death", "Immortality", "Liberation"],
  "summary": "one line",
  "whyRead": "2–3 sentences",
  "story": "optional: main dialogue/frame story in 2–4 sentences (editorial retelling, no quotes)",
  "questions": ["What happens after death?"],
  "keyTeachings": [ { "title": "The Self is not born and does not die", "text": "2–3 sentences, editorial" } ],
  "structure": [ { "label": "Part 1 (3 vallis)", "note": "optional" } ],   // factual structure only
  "passages": [ { "ref": "1.2.18", "about": "The Self is unborn and undying", "gita": ["2.20"] } ],  // references only; optional Gita parallels
  "concepts": ["atma", "moksha"],
  "relatedTexts": [ { "id": "bhagavad-gita", "note": "Gita 2.19–20 closely parallels Katha 1.2.18–19" } ],
  "thinkers": ["shankara"],      // commentators / associated thinkers
  "advanced": false,             // true for advanced contemplative texts (Ashtavakra, Avadhuta…)
  "ingested": false              // true only for bhagavad-gita and sadhak-sanjivani
}
```

### thinker — `src/data/os/thinkers/<id>.json`
```jsonc
{
  "id": "shankara",
  "name": { "en": "Adi Shankaracharya", "sa": "आदि शङ्कराचार्य" },
  "traditions": ["advaita"],
  "period": "traditionally 8th century CE (dates debated)",
  "context": "3–4 sentences of historical context, hedged",
  "coreIdeas": ["…", "…"],
  "works": ["shankara-brahma-sutra-bhashya", "vivekachudamani"],   // registry text ids
  "otherWorks": ["Upanishad bhashyas"],                               // plain strings for works not in registry
  "attributionNote": "optional: which works' authorship is debated",
  "influences": ["gaudapada"],
  "influenced": [],
  "disagreements": [ { "with": "ramanuja", "note": "…" } ],           // thinker or tradition id
  "relatedThinkers": ["ramanuja", "madhva"],
  "concepts": ["brahman", "maya"]
}
```

### concept — `src/data/os/concepts/<id>.json`
```jsonc
{
  "id": "karma",
  "name": { "en": "Karma", "sa": "कर्म", "iast": "karma" },
  "short": "one line",
  "beginner": "Beginner mode: 2–3 sentences, no jargon",
  "what": "What is it? 3–4 sentences",
  "scholar": "Scholar mode: technical note, terminology, debates (optional)",
  "perspectives": [ { "tradition": "mimamsa", "view": "how this tradition understands it (1–3 sentences)" } ],  // 3–7 where the concept is shared
  "texts": ["bhagavad-gita", "yoga-sutras"],
  "traditions": ["mimamsa", "vedanta", "jainism", "buddhism"],
  "relatedConcepts": ["dharma", "phala", "samsara"],
  "questions": ["karma"],        // registry question ids
  "follow": [ { "kind": "text", "id": "bhagavad-gita", "note": "why this step" } ],   // "Follow this idea": 4–7 ordered steps; kind: concept|text|tradition|thinker|gita
                                  // for kind "gita" use a verse id: { "kind": "gita", "id": "2.47", "note": "…" }
  "gitaVerses": ["2.47", "3.19"]  // optional
}
```

### question — `src/data/os/questions/<id>.json`
```jsonc
{
  "id": "suffering",
  "q": "Why do humans suffer?",
  "motif": "flame",              // conch | lamp | wheel | flame | lotus | seed | sun | cosmos | eye | scales | tree | crown | mountain | ocean | moon | path | river
  "quickAnswer": "Neutral overview in 3–4 sentences — what the traditions broadly share and where they differ",
  "concepts": ["dukkha", "kama", "avidya", "karma"],
  "traditions": ["buddhism", "vedanta", "yoga", "jainism"],
  "perspectives": [ { "tradition": "buddhism", "view": "…", "sources": [ { "text": "dhammapada", "ref": "optional certain ref" } ] } ],
  "startHere": { "kind": "gita", "id": "2.14", "note": "why start here" },    // kind: gita|text|concept|tradition
  "goDeeper": [ { "kind": "concept", "id": "dukkha", "note": "…" } ],
  "gitaQuestions": ["bad-things"],   // ids from app/src/data/curated/questions.json (Gita questions) if relevant
  "related": ["freedom", "mind"]
}
```

### comparison — `src/data/os/comparisons/<id>.json`
```jsonc
{
  "id": "self",
  "topic": "What is the Self?",
  "concept": "atma",
  "intro": "1–2 neutral sentences",
  "rows": [ { "tradition": "advaita", "claim": "short claim (≤ 15 words)", "detail": "2–3 sentences", "sources": [ { "text": "mandukya-upanishad" } ], "concepts": ["brahman"] } ],   // 6–10 rows
  "note": "what the disagreement is really about (neutral)"
}
```

### path — `src/data/os/paths/<id>.json`
```jsonc
{
  "id": "self-inquiry",
  "title": "Who am I?",
  "level": "beginner",           // beginner | intermediate | advanced
  "description": "2 sentences",
  "steps": [ { "kind": "gita", "id": "2.13", "title": "The body changes, you don't", "note": "1–2 sentences" } ]   // kind: concept|text|tradition|thinker|gita|question|tool (tool ids from registry)
}
```

Validate with: `python3 app/scripts/os/validate.py` (from the project root). Fix every error.
