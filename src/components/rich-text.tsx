import Link from "next/link";
import type { ReactNode } from "react";

const VERSE_COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 34, 27, 20, 24, 28, 78];
const DEVA = "०१२३४५६७८९";
const n = (s: string) => Number(s.replace(/[०-९]/g, (d) => String(DEVA.indexOf(d))));
const valid = (c: number, v: number) => c >= 1 && c <= 18 && v >= 1 && v <= VERSE_COUNTS[c - 1];

// Gita citations inside the commentary:
//   Hindi:   (गीता ५। १२)  (२। ४७)  (गीता—५। २०)  — only when nothing but “गीता” precedes the numbers
//   English: (Gita 5/12)   (5/20)   (Gita 5/12, 18/66)
const REF_HI = /(\((?:गीता\s*[—-]?\s*)?|;\s*|,\s*)([०-९]{1,2})\s*।\s*([०-९]{1,2})(?=[\s)\-—,;])/g;
const REF_EN = /(\((?:Gita\s*)?|;\s*|,\s*)(\d{1,2})\s*\/\s*(\d{1,2})(?=[\s)\-—,;])/g;

function linkRefs(text: string, lang: "hi" | "en", keyBase: string): ReactNode[] {
  const re = lang === "hi" ? REF_HI : REF_EN;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  let k = 0;
  while ((m = re.exec(text))) {
    // for , and ; continuations, only link if we're inside a citation that started with (
    if (!m[1].startsWith("(")) {
      const open = text.lastIndexOf("(", m.index);
      const close = text.lastIndexOf(")", m.index);
      if (open < 0 || close > open) continue;
    }
    const c = n(m[2]);
    const v = n(m[3]);
    if (!valid(c, v)) continue;
    const start = m.index + m[1].length;
    out.push(text.slice(last, start));
    const label = text.slice(start, m.index + m[0].length);
    out.push(
      <Link
        key={`${keyBase}-r${k++}`}
        href={`/verse/${c}/${v}`}
        className="underline decoration-saffron/40 decoration-1 underline-offset-[3px] transition-colors hover:text-saffron hover:decoration-saffron"
        title={`Bhagavad Gita ${c}.${v}`}
      >
        {label}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
}

/** Renders **bold** spans (Swamiji's quoted verse phrases) and verse citations as links. */
export function RichText({ text, lang }: { text: string; lang: "hi" | "en" }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-brown">
              {linkRefs(p.slice(2, -2), lang, `b${i}`)}
            </strong>
          );
        }
        return <span key={i}>{linkRefs(p, lang, `t${i}`)}</span>;
      })}
    </>
  );
}

/** First bold phrase at the start of a paragraph — the verse phrase being explained. */
export function leadPhrase(text: string): string | null {
  const m = text.match(/^\*\*([^*]{2,80})\*\*/);
  if (!m) return null;
  const phrase = m[1].replace(/[‘’'—-]+$/g, "").replace(/^[‘']/, "").trim();
  return phrase.length > 1 ? phrase : null;
}
