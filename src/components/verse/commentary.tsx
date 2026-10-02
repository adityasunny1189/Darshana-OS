"use client";

import { useMemo, useState } from "react";
import type { Block, Lang } from "@/lib/types";
import { useSettings } from "@/lib/store";
import { leadPhrase, RichText } from "../rich-text";
import { IconChevronDown } from "../icons";

interface Props {
  id: string;
  commentary: { hi: Block[]; en: Block[] };
  appendix: { hi: Block[]; en: Block[] };
  notes: { hi: string[]; en: string[] };
  /** paragraphs shown before "continue reading" */
  preview?: number;
}

export function Commentary({ id, commentary, appendix, notes, preview = 4 }: Props) {
  const [settings, set] = useSettings();
  const hasEn = commentary.en.length > 0;
  const lang: Lang = settings.commentaryLang === "en" && hasEn ? "en" : "hi";
  const [expanded, setExpanded] = useState(false);

  const blocks = commentary[lang];
  const appx = appendix[lang];
  const outline = useMemo(
    () =>
      blocks
        .map((b, i) => ({ i, phrase: b.type === "para" ? leadPhrase(b.text) : null, heading: b.type === "heading" ? b.text : null }))
        .filter((x) => x.phrase || x.heading),
    [blocks],
  );
  const words = blocks.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
  const minutes = Math.max(1, Math.round(words / (lang === "hi" ? 180 : 220)));
  const shown = expanded ? blocks : blocks.slice(0, preview);
  const hidden = blocks.length - shown.length;

  if (!blocks.length && !appx.length)
    return (
      <p className="text-ink-3">
        This verse is explained together with a neighbouring verse in the source — see the verse group above.
      </p>
    );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full bg-surface-2 p-1 text-sm" role="tablist" aria-label="Commentary language">
          <Tab active={lang === "hi"} onClick={() => set({ commentaryLang: "hi" })}>
            <span className="hindi">हिन्दी · मूल</span>
          </Tab>
          <Tab active={lang === "en"} disabled={!hasEn} onClick={() => set({ commentaryLang: "en" })}>
            English edition
          </Tab>
        </div>
        <span className="text-xs text-ink-3">
          ~{minutes} min read · {blocks.length} paragraphs
        </span>
      </div>

      {lang === "en" && (
        <p className="mb-6 rounded-xl border border-dashed border-line-strong px-4 py-3 text-xs leading-relaxed text-ink-3">
          The English edition text was recognised from a scanned book and may contain small errors in
          transliterated Sanskrit words. The Hindi original is the authoritative text.
        </p>
      )}

      {outline.length > 2 && (
        <nav aria-label="Phrases explained" className="mb-8">
          <p className="eyebrow mb-3">In this commentary</p>
          <div className="flex flex-wrap gap-2">
            {outline.slice(0, 12).map((o) => (
              <a
                key={o.i}
                href={`#c-${id}-${o.i}`}
                onClick={() => o.i >= preview && setExpanded(true)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors hover:border-saffron hover:text-saffron ${
                  o.heading ? "border-saffron/40 text-saffron" : "border-line text-ink-2"
                } ${lang === "hi" ? "hindi" : "iast"}`}
              >
                {o.heading ?? o.phrase}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className={`prose-source reader max-w-[68ch] text-ink ${lang === "hi" ? "hindi" : "font-serif"}`} lang={lang}>
        {shown.map((b, i) => (
          <BlockView key={i} b={b} lang={lang} anchor={`c-${id}-${i}`} />
        ))}
      </div>

      {hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="group mt-6 flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-2 transition-colors hover:border-saffron hover:text-saffron"
        >
          Continue reading · {hidden} more paragraphs
          <IconChevronDown size={16} className="transition-transform group-hover:translate-y-0.5" />
        </button>
      )}

      {expanded && appx.length > 0 && (
        <section className="mt-12 rounded-2xl border border-gold/30 bg-surface p-5 sm:p-7">
          <p className="eyebrow mb-1 text-gold">
            <span className="hindi normal-case tracking-normal">परिशिष्ट भाव</span> · Appendix
          </p>
          <p className="mb-5 text-xs text-ink-3">Later reflections added by Swamiji to the commentary.</p>
          <div className={`prose-source reader text-ink ${lang === "hi" ? "hindi" : "font-serif"}`} lang={lang}>
            {appx.map((b, i) => (
              <BlockView key={i} b={b} lang={lang} />
            ))}
          </div>
        </section>
      )}
      {!expanded && appx.length > 0 && hidden === 0 && (
        <button onClick={() => setExpanded(true)} className="mt-6 text-sm text-gold underline-offset-4 hover:underline">
          Read the परिशिष्ट भाव (appendix)
        </button>
      )}

      {expanded && notes[lang].length > 0 && (
        <aside className="mt-10 border-t border-line pt-5 text-sm text-ink-3">
          <p className="eyebrow mb-2">Footnotes</p>
          {notes[lang].map((x, i) => (
            <p key={i} className={`mb-2 ${lang === "hi" ? "hindi" : ""}`}>
              {x.replace(/\*\*/g, "")}
            </p>
          ))}
        </aside>
      )}
    </div>
  );
}

function BlockView({ b, lang, anchor }: { b: Block; lang: Lang; anchor?: string }) {
  if (b.type === "heading")
    return (
      <h4 id={anchor} className="!mt-10 mb-3 scroll-mt-24 font-display text-xl text-saffron">
        {b.text}
      </h4>
    );
  if (b.type === "verse")
    return (
      <blockquote id={anchor} className="sanskrit my-6 scroll-mt-24 whitespace-pre-line border-l-2 border-gold/50 pl-5 text-[1.1em] text-ink-2">
        {b.text}
      </blockquote>
    );
  return (
    <p id={anchor} className="scroll-mt-24">
      <RichText text={b.text} lang={lang} />
    </p>
  );
}

function Tab({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 transition-colors disabled:opacity-40 ${
        active ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink-2"
      }`}
    >
      {children}
    </button>
  );
}
