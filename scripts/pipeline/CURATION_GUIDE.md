# Curation guide — Sadhak Sanjivani learning layer

You are writing the *learning layer* of a Bhagavad Gita app whose single source of truth is
**Sadhak Sanjivani by Swami Ramsukhdas Ji** (Gita Press). The full extracted source text is in
`app/src/data/generated/chapters/chapter-XX.json`. Use the helper:

```
python3 .work/show.py 2 47          # full verse: Sanskrit, word meanings, Hindi & English translation, commentary, appendix
python3 .work/show.py 2 47 --brief  # without commentary
python3 .work/show.py 2 intro       # chapter's अवतरणिका (intro) + closing notes
python3 .work/show.py grep 'समता'    # which verses' commentary mention a word
```

The Hindi text is clean Unicode and is the **primary** source. The English text is an OCR of the
English edition ("Sadhaka-Sanjivani") and contains OCR noise — use it to help you translate/paraphrase,
never quote OCR garbage.

## Fidelity rules (non-negotiable)

1. Every claim must be traceable to the commentary (व्याख्या), appendix (परिशिष्ट भाव), link (सम्बन्ध)
   or translation of that verse in Sadhak Sanjivani. Do **not** add doctrine, other commentators,
   self-help framing, motivational slogans or Western reinterpretations.
2. `essence`, `idea`, `points`, `whyItMatters` are *faithful paraphrases* of what Swamiji says — simpler words,
   same meaning. If Swamiji stresses a point (e.g. "फलेच्छाका त्याग", "सम्बन्ध-विच्छेद", "शरणागति"), keep his framing.
3. `examples[].quote.hi` must be an **exact, contiguous substring** of that verse's Hindi commentary/appendix
   text (copy-paste; you may drop `**` bold markers; keep ≤ 70 words). Examples must be real
   illustrations/analogies (दृष्टान्त) that Swamiji gives — "जैसे …", "जैसे कोई …", stories, comparisons.
   If a verse has no example in the source, give `examples: []`. Never invent one.
4. `modern` entries are optional, **clearly analogies written by us** (not Swamiji): short, concrete,
   contemporary (career, exams, relationships, social media, failure, comparison, money…). They must
   illustrate the *source* point without stretching it. Max 2 per verse. Only where genuinely helpful.
5. `terms` come from the verse's own word-by-word meanings (पदच्छेद/अन्वय list) and commentary. Do not invent etymologies.
6. `related` = other verses that Swamiji himself cites in this verse's commentary (e.g. "(गीता ५। १२)" → "5.12"),
   or verses in the same प्रकरण he explicitly connects. Format "C.V".
7. English is clear, warm, modern and precise — for a 23-year-old. Hindi is natural, simple Hindi (you may
   reuse Swamiji's phrasing). No emojis. No exclamation-heavy tone. No "unlock", "hack", "journey of self-discovery" clichés.
8. Use these concept ids only (add none):
   `atma, sharira, karma, phala, nishkama-karma, dharma, svadharma, yoga, samatva, jnana, viveka, bhakti,
   sharanagati, vairagya, asakti, kama, krodha, ahankara, prakriti, purusha, guna, maya, shraddha, tyaga,
   sannyasa, sthitaprajna, dhyana, moksha, ishvara, yajna`

## Curated verse schema (JSON)

```jsonc
{
  "id": "2.47",
  "headline": { "en": "Your right is to the action — never to its fruit", "hi": "कर्ममें ही अधिकार है, फलमें नहीं" },
  "essence":  { "en": "one sentence, ≤ 25 words", "hi": "…" },
  "idea":     { "en": "3–5 sentences: what Krishna is saying here, per Swamiji", "hi": "…" },
  "points":   [ { "en": "…", "hi": "…" } ],            // 2–4 key takeaways from the commentary (optional)
  "contrast": {                                         // optional visual two-column idea, only if the source frames it so
    "left":  { "label": { "en": "In your hands", "hi": "आपके हाथमें" }, "items": [ { "en": "…", "hi": "…" } ] },
    "right": { "label": { "en": "Not in your hands", "hi": "…" }, "items": [ { "en": "…", "hi": "…" } ] }
  },
  "examples": [
    { "title": { "en": "The patient and the bitter medicine", "hi": "कड़वी दवा" },
      "text":  { "en": "2–3 sentence retelling in English", "hi": "short retelling" },
      "quote": { "hi": "exact substring from the Hindi commentary" },
      "from":  "commentary" }                           // or "appendix"
  ],
  "modern": [ { "context": "career", "text": { "en": "…", "hi": "…" } } ],
  "whyItMatters": { "en": "1–2 sentences", "hi": "…" },
  "terms":   [ { "sa": "कर्मणि", "meaning": { "en": "in (prescribed) action", "hi": "कर्तव्य-कर्म करनेमें" } } ],
  "concepts": ["karma", "phala", "nishkama-karma"],
  "related":  ["5.12", "3.19"]
}
```

After writing a file, run: `python3 .work/validate_curated.py <file>` and fix every error it reports.
