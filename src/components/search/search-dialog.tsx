"use client";

import { useEffect, useRef } from "react";
import { IconClose, IconSearch } from "../icons";
import { SearchResults, useSearchQuery } from "./search-results";

const SUGGEST = ["karma", "आत्मा", "emptiness", "Upanishad", "Shankara", "Yoga Sutras", "anekantavada", "2.47", "कर्म", "suffering"];

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const { q, setQ, hits, loading } = useSearchQuery();

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-3 sm:p-6 sm:pt-[12vh]" role="dialog" aria-modal aria-label="Search">
      <div className="fade-in absolute inset-0 bg-bg-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className="card rise relative flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden shadow-[var(--shadow)]">
        <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
          <IconSearch size={18} className="shrink-0 text-ink-3" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search concepts, texts, traditions, thinkers, verses… karma, आत्मा, 2.47"
            className="h-14 w-full bg-transparent text-[1.02rem] outline-none placeholder:text-ink-3"
            aria-label="Search query"
          />
          <button onClick={onClose} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-3 hover:bg-surface-2" aria-label="Close search">
            <IconClose size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-2 py-2 sm:px-3">
          {!q.trim() ? (
            <div className="px-3 py-5">
              <p className="eyebrow mb-3">Try</p>
              <div className="flex flex-wrap gap-2">
                {SUGGEST.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-2 hover:border-line-strong hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-sm text-ink-3">
                Search in Sanskrit, Hindi or English. You can find concepts, texts, traditions, thinkers, questions, words from the Gita’s verses, or a verse number.
              </p>
            </div>
          ) : (
            <SearchResults q={q} hits={hits} loading={loading} onNavigate={onClose} limit={40} />
          )}
        </div>
      </div>
    </div>
  );
}
