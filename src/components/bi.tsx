import type { ElementType, ReactNode } from "react";
import type { Bi as BiText } from "@/lib/types";

/**
 * Bilingual text. Both languages are rendered; CSS on <html data-explain>
 * shows the reader's chosen explanation language. Works in server components.
 */
export function Bi({
  t,
  as: Tag = "span",
  className = "",
  hiClassName = "",
}: {
  t: BiText | null | undefined;
  as?: ElementType;
  className?: string;
  hiClassName?: string;
}) {
  if (!t) return null;
  if (!t.hi || t.hi === t.en) return <Tag className={className}>{t.en}</Tag>;
  return (
    <>
      <Tag className={`lang-en ${className}`}>{t.en}</Tag>
      <Tag lang="hi" className={`lang-hi hindi ${className} ${hiClassName}`}>
        {t.hi}
      </Tag>
    </>
  );
}

/** Static UI label in both languages. */
export function L({ en, hi, className = "" }: { en: ReactNode; hi: ReactNode; className?: string }) {
  return (
    <>
      <span className={`lang-en ${className}`}>{en}</span>
      <span lang="hi" className={`lang-hi hindi ${className}`}>
        {hi}
      </span>
    </>
  );
}
