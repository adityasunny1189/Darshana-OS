// Nyaya epistemology — editorial summaries of the classical positions.

export const PRAMANAS = [
  { id: "pratyaksha", sa: "प्रत्यक्ष", iast: "pratyakṣa", en: "Perception", note: "Knowledge produced by contact of a sense with its object, such as seeing a pot in front of you. Nyaya distinguishes indeterminate perception (bare awareness) from determinate perception (awareness of it as a pot)." },
  { id: "anumana", sa: "अनुमान", iast: "anumāna", en: "Inference", note: "Knowledge of something unperceived through a sign invariably connected with it. The classic case is fire on the hill, known from smoke. The whole weight rests on that invariable concomitance (vyāpti)." },
  { id: "upamana", sa: "उपमान", iast: "upamāna", en: "Comparison", note: "Knowing what a word refers to through similarity. You are told a gavaya (wild ox) looks like a cow, and on meeting one in the forest you know 'this is a gavaya'." },
  { id: "shabda", sa: "शब्द", iast: "śabda", en: "Testimony", note: "Knowledge from the words of a reliable person (āpta), someone who knows the matter and speaks truthfully. For Nyaya this includes the Veda, which it takes to be authored by a trustworthy speaker, God." },
];

export const SYLLOGISM = [
  { id: "pratijna", sa: "प्रतिज्ञा", en: "Thesis", text: "The hill has fire.", note: "What is to be proved." },
  { id: "hetu", sa: "हेतु", en: "Reason", text: "Because it has smoke.", note: "The sign or mark observed in the subject." },
  { id: "udaharana", sa: "उदाहरण", en: "Example", text: "Wherever there is smoke there is fire — as in a kitchen.", note: "The general rule (vyāpti) with a familiar instance." },
  { id: "upanaya", sa: "उपनय", en: "Application", text: "This hill has smoke, which goes with fire.", note: "Applying the rule to this case." },
  { id: "nigamana", sa: "निगमन", en: "Conclusion", text: "Therefore, the hill has fire.", note: "The thesis, now established." },
];

export const FALLACIES = [
  { id: "savyabhichara", sa: "सव्यभिचार", en: "Inconclusive reason", note: "The reason occurs both with and without what is to be proved. 'The hill has fire because it is knowable' fails, since lakes are knowable too." },
  { id: "viruddha", sa: "विरुद्ध", en: "Contradictory reason", note: "The reason actually proves the opposite of the thesis." },
  { id: "satpratipaksha", sa: "सत्प्रतिपक्ष", en: "Counterbalanced reason", note: "An equally strong reason supports the contrary conclusion." },
  { id: "asiddha", sa: "असिद्ध", en: "Unproven reason", note: "The reason itself is not established, for instance because the 'smoke' is really mist." },
  { id: "badhita", sa: "बाधित", en: "Contradicted reason", note: "The conclusion is contradicted by a stronger pramana, such as perception." },
];

// How many pramanas each school accepts — the standard textbook summary.
export const SCHOOL_PRAMANAS: { tradition: string; label: string; accepts: string[]; note?: string }[] = [
  { tradition: "charvaka", label: "Charvaka", accepts: ["pratyaksha"], note: "Perception alone; inference is treated as uncertain." },
  { tradition: "buddhism", label: "Buddhist logicians (Dignaga, Dharmakirti)", accepts: ["pratyaksha", "anumana"] },
  { tradition: "vaisheshika", label: "Vaisheshika", accepts: ["pratyaksha", "anumana"] },
  { tradition: "sankhya", label: "Sankhya & Yoga", accepts: ["pratyaksha", "anumana", "shabda"] },
  { tradition: "nyaya", label: "Nyaya", accepts: ["pratyaksha", "anumana", "upamana", "shabda"] },
  { tradition: "mimamsa", label: "Prabhakara Mimamsa", accepts: ["pratyaksha", "anumana", "upamana", "shabda", "arthapatti"] },
  { tradition: "advaita", label: "Bhatta Mimamsa & Advaita", accepts: ["pratyaksha", "anumana", "upamana", "shabda", "arthapatti", "anupalabdhi"] },
  { tradition: "jainism", label: "Jainism", accepts: ["pratyaksha", "paroksha"], note: "Classifies knowledge as direct (pratyaksha) or indirect (paroksha), and counts sensory perception as indirect in the strict sense." },
];

export const EXTRA_PRAMANAS: Record<string, { en: string; sa: string; note: string }> = {
  arthapatti: { en: "Postulation", sa: "अर्थापत्ति", note: "Assuming what must be true to explain a fact. Devadatta is fat but never eats by day, so he must eat at night." },
  anupalabdhi: { en: "Non-apprehension", sa: "अनुपलब्धि", note: "Knowing an absence from its non-perception, as in 'there is no pot on this floor'." },
  paroksha: { en: "Indirect knowledge", sa: "परोक्ष", note: "In Jain epistemology, all knowledge mediated by the senses or by signs." },
};

export const SCENARIOS = [
  { text: "You touch the stove and feel that it is hot.", answer: "pratyaksha" },
  { text: "You hear thunder and conclude that rain clouds are overhead.", answer: "anumana" },
  { text: "A friend who has been there tells you the café has closed down, and you believe it.", answer: "shabda" },
  { text: "Told that a zebra looks like a striped horse, you recognise one at the zoo.", answer: "upamana" },
  { text: "You see smoke rising behind the hill and know there is a fire.", answer: "anumana" },
];
