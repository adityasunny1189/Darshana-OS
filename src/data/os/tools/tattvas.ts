// Sankhya's 25 tattvas, following the classical scheme of the Sankhya Karika (esp. kārikās 3 and 22–25).
// Editorial explanations; no verse text reproduced.

export type TattvaClass = "neither" | "root" | "both" | "evolute";

export interface Tattva {
  id: string;
  n: number; // traditional count order
  sa: string;
  iast: string;
  en: string;
  group: "purusha" | "prakriti" | "mahat" | "ahankara" | "manas" | "jnanendriya" | "karmendriya" | "tanmatra" | "mahabhuta";
  cls: TattvaClass;
  from?: string; // what it evolves from
  note: string;
}

export const CLASS_LABEL: Record<TattvaClass, { en: string; sa: string; note: string }> = {
  neither: { en: "Neither cause nor effect", sa: "न प्रकृति न विकृति", note: "Purusha neither produces anything nor is produced." },
  root: { en: "Root cause, uncaused", sa: "मूलप्रकृति", note: "Unmanifest prakriti produces everything but is not itself produced." },
  both: { en: "Both produced and producing", sa: "प्रकृति-विकृति", note: "Seven principles are effects of what precedes them and causes of what follows." },
  evolute: { en: "Only produced", sa: "विकृति", note: "Sixteen principles are effects that produce no further tattva." },
};

export const TATTVAS: Tattva[] = [
  { id: "purusha", n: 1, sa: "पुरुष", iast: "puruṣa", en: "Pure consciousness", group: "purusha", cls: "neither", note: "The witnessing consciousness. It is inactive, unchanging and plural: Sankhya holds there are many purushas. It does nothing, yet in its presence prakriti's activity appears conscious." },
  { id: "prakriti", n: 2, sa: "प्रकृति", iast: "prakṛti", en: "Primordial nature (unmanifest)", group: "prakriti", cls: "root", note: "The single, unconscious, ever-changing source of everything that is not consciousness. It is made of the three gunas (sattva, rajas and tamas), which rest in balance until creation." },
  { id: "mahat", n: 3, sa: "महत् / बुद्धि", iast: "mahat / buddhi", en: "The great principle / intellect", group: "mahat", cls: "both", from: "prakriti", note: "The first evolute: the faculty of discernment and decision. It is where consciousness seems to be reflected, and so where the confusion of purusha with prakriti, and finally their discrimination, takes place." },
  { id: "ahankara", n: 4, sa: "अहङ्कार", iast: "ahaṅkāra", en: "The I-maker", group: "ahankara", cls: "both", from: "mahat", note: "The principle of individuation, the sense of 'I' and 'mine'. From its sattvic side come the mind and the senses; from its tamasic side come the subtle elements. Rajas supplies the energy for both." },
  { id: "manas", n: 5, sa: "मनस्", iast: "manas", en: "Mind", group: "manas", cls: "evolute", from: "ahankara", note: "The coordinating inner sense. It organises what the senses bring and directs the organs of action. It is counted among both the sense and the action faculties." },
  { id: "ear", n: 6, sa: "श्रोत्र", iast: "śrotra", en: "Hearing", group: "jnanendriya", cls: "evolute", from: "ahankara", note: "Sense capacity for sound." },
  { id: "skin", n: 7, sa: "त्वक्", iast: "tvak", en: "Touch", group: "jnanendriya", cls: "evolute", from: "ahankara", note: "Sense capacity for touch." },
  { id: "eye", n: 8, sa: "चक्षुस्", iast: "cakṣus", en: "Sight", group: "jnanendriya", cls: "evolute", from: "ahankara", note: "Sense capacity for form and colour." },
  { id: "tongue", n: 9, sa: "रसना", iast: "rasanā", en: "Taste", group: "jnanendriya", cls: "evolute", from: "ahankara", note: "Sense capacity for taste." },
  { id: "nose", n: 10, sa: "घ्राण", iast: "ghrāṇa", en: "Smell", group: "jnanendriya", cls: "evolute", from: "ahankara", note: "Sense capacity for smell." },
  { id: "speech", n: 11, sa: "वाक्", iast: "vāk", en: "Speech", group: "karmendriya", cls: "evolute", from: "ahankara", note: "Capacity of speaking." },
  { id: "hands", n: 12, sa: "पाणि", iast: "pāṇi", en: "Grasping", group: "karmendriya", cls: "evolute", from: "ahankara", note: "Capacity of handling and grasping." },
  { id: "feet", n: 13, sa: "पाद", iast: "pāda", en: "Moving", group: "karmendriya", cls: "evolute", from: "ahankara", note: "Capacity of locomotion." },
  { id: "payu", n: 14, sa: "पायु", iast: "pāyu", en: "Excretion", group: "karmendriya", cls: "evolute", from: "ahankara", note: "Capacity of elimination." },
  { id: "upastha", n: 15, sa: "उपस्थ", iast: "upastha", en: "Generation", group: "karmendriya", cls: "evolute", from: "ahankara", note: "Capacity of procreation and sexual pleasure." },
  { id: "shabda", n: 16, sa: "शब्द", iast: "śabda", en: "Subtle sound", group: "tanmatra", cls: "both", from: "ahankara", note: "Subtle element (tanmatra) of sound. It gives rise to space." },
  { id: "sparsha", n: 17, sa: "स्पर्श", iast: "sparśa", en: "Subtle touch", group: "tanmatra", cls: "both", from: "ahankara", note: "Subtle element of touch. It gives rise to air." },
  { id: "rupa", n: 18, sa: "रूप", iast: "rūpa", en: "Subtle form", group: "tanmatra", cls: "both", from: "ahankara", note: "Subtle element of form and colour. It gives rise to fire." },
  { id: "rasa", n: 19, sa: "रस", iast: "rasa", en: "Subtle taste", group: "tanmatra", cls: "both", from: "ahankara", note: "Subtle element of taste. It gives rise to water." },
  { id: "gandha", n: 20, sa: "गन्ध", iast: "gandha", en: "Subtle smell", group: "tanmatra", cls: "both", from: "ahankara", note: "Subtle element of smell. It gives rise to earth." },
  { id: "akasha", n: 21, sa: "आकाश", iast: "ākāśa", en: "Space", group: "mahabhuta", cls: "evolute", from: "shabda", note: "Gross element that carries sound." },
  { id: "vayu", n: 22, sa: "वायु", iast: "vāyu", en: "Air", group: "mahabhuta", cls: "evolute", from: "sparsha", note: "Gross element of touch (and, in the cumulative account, sound)." },
  { id: "tejas", n: 23, sa: "तेजस्", iast: "tejas", en: "Fire", group: "mahabhuta", cls: "evolute", from: "rupa", note: "Gross element of form and light." },
  { id: "ap", n: 24, sa: "अप्", iast: "ap", en: "Water", group: "mahabhuta", cls: "evolute", from: "rasa", note: "Gross element of taste." },
  { id: "prithvi", n: 25, sa: "पृथ्वी", iast: "pṛthvī", en: "Earth", group: "mahabhuta", cls: "evolute", from: "gandha", note: "Gross element of smell, the most concrete of all." },
];

export const GROUPS: { id: Tattva["group"]; en: string; sa: string; count: string }[] = [
  { id: "purusha", en: "Consciousness", sa: "पुरुष", count: "1" },
  { id: "prakriti", en: "Unmanifest nature", sa: "प्रकृति", count: "1" },
  { id: "mahat", en: "Intellect", sa: "महत्", count: "1" },
  { id: "ahankara", en: "I-maker", sa: "अहङ्कार", count: "1" },
  { id: "manas", en: "Mind", sa: "मनस्", count: "1" },
  { id: "jnanendriya", en: "Senses of knowing", sa: "ज्ञानेन्द्रिय", count: "5" },
  { id: "karmendriya", en: "Faculties of action", sa: "कर्मेन्द्रिय", count: "5" },
  { id: "tanmatra", en: "Subtle elements", sa: "तन्मात्र", count: "5" },
  { id: "mahabhuta", en: "Gross elements", sa: "महाभूत", count: "5" },
];

export const GUNAS = [
  { id: "sattva", sa: "सत्त्व", en: "Clarity, lightness, illumination" },
  { id: "rajas", sa: "रजस्", en: "Activity, passion, motion" },
  { id: "tamas", sa: "तमस्", en: "Inertia, heaviness, obscuring" },
];
