"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/lib/store";
import { IconMoon, IconSun } from "./icons";

export function ReaderSettings({ onClose }: { onClose: () => void }) {
  const [s, set] = useSettings();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => window.addEventListener("click", onClick), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      clearTimeout(t);
    };
  }, [onClose]);

  const layer = (k: keyof typeof s.show, label: string, lang?: string) => (
    <button
      key={k}
      onClick={() => set({ show: { ...s.show, [k]: !s.show[k] } })}
      aria-pressed={s.show[k]}
      lang={lang}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        s.show[k] ? "border-ink/20 bg-ink text-bg" : "border-line text-ink-2 hover:border-line-strong"
      } ${lang === "sa" || lang === "hi" ? "hindi" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Reading preferences"
      className="card rise absolute right-0 top-11 z-50 w-[min(20rem,calc(100vw-2rem))] p-5 shadow-[var(--shadow)]"
    >
      <p className="eyebrow mb-3">Theme</p>
      <div className="mb-5 grid grid-cols-3 gap-1 rounded-full bg-surface-2 p-1 text-sm">
        {(["light", "system", "dark"] as const).map((t) => (
          <button
            key={t}
            onClick={() => set({ theme: t })}
            aria-pressed={s.theme === t}
            className={`flex items-center justify-center gap-1.5 rounded-full py-1.5 capitalize transition-colors ${
              s.theme === t ? "bg-surface text-ink shadow-sm" : "text-ink-3"
            }`}
          >
            {t === "light" && <IconSun size={14} />}
            {t === "dark" && <IconMoon size={14} />}
            {t === "system" ? "Auto" : t}
          </button>
        ))}
      </div>

      <p className="eyebrow mb-3">Reading level</p>
      <div className="mb-2 grid grid-cols-3 gap-1 rounded-full bg-surface-2 p-1 text-sm">
        {(
          [
            ["beginner", "Beginner"],
            ["standard", "Standard"],
            ["scholar", "Scholar"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => set({ level: k })}
            aria-pressed={s.level === k}
            className={`rounded-full py-1.5 transition-colors ${s.level === k ? "bg-surface text-ink shadow-sm" : "text-ink-3"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mb-5 text-xs leading-relaxed text-ink-3">
        {s.level === "beginner"
          ? "Plain explanations first; technical terms explained; advanced material folded away."
          : s.level === "scholar"
            ? "Shows Sanskrit, transliteration, technical notes, disagreements and citations."
            : "A balance of explanation and detail."}
      </p>

      <p className="eyebrow mb-3">Text size</p>
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => set({ scale: Math.max(0.9, +(s.scale - 0.05).toFixed(2)) })}
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-sm hover:border-line-strong"
          aria-label="Smaller text"
        >
          A
        </button>
        <div className="h-1 flex-1 rounded-full bg-surface-2">
          <div
            className="h-1 rounded-full bg-saffron transition-all"
            style={{ width: `${((s.scale - 0.9) / 0.4) * 100}%` }}
          />
        </div>
        <button
          onClick={() => set({ scale: Math.min(1.3, +(s.scale + 0.05).toFixed(2)) })}
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-lg hover:border-line-strong"
          aria-label="Larger text"
        >
          A
        </button>
      </div>

      <p className="eyebrow mb-3">Show with every verse</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {layer("sa", "संस्कृत", "sa")}
        {layer("iast", "IAST")}
        {layer("hi", "हिन्दी", "hi")}
        {layer("en", "English")}
      </div>

      <p className="eyebrow mb-3">Explanations in</p>
      <div className="grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1 text-sm">
        {(
          [
            ["en", "English"],
            ["hi", "हिन्दी"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => set({ explain: k })}
            aria-pressed={s.explain === k}
            className={`rounded-full py-1.5 transition-colors ${
              s.explain === k ? "bg-surface text-ink shadow-sm" : "text-ink-3"
            } ${k === "hi" ? "hindi" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
