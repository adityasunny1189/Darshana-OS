"use client";

import { createContext, Fragment, useContext, useEffect, useState } from "react";
import { actions, useGita, useHydrated, useIsBookmarked, useSettings, type Bookmark, type Settings } from "@/lib/store";
import { IconBookmark, IconCheck, IconLayers, IconNote } from "../icons";

type Mode = Settings["mode"];
const ModeCtx = createContext<{ mode: Mode; setMode: (m: Mode) => void }>({ mode: "learn", setMode: () => {} });

const MODES: { id: Mode; en: string; hi: string; hint: string }[] = [
  { id: "learn", en: "Learn", hi: "समझें", hint: "The idea, an example, why it matters" },
  { id: "read", en: "Read", hi: "पढ़ें", hint: "Word by word and context" },
  { id: "deep", en: "Deep dive", hi: "गहराई", hint: "Full Sadhak Sanjivani commentary" },
];

/** Holds the three reading layers; all are server-rendered, this only switches between them. */
export function VerseModes({
  learn,
  read,
  deep,
  hasLearn,
}: {
  learn: React.ReactNode;
  read: React.ReactNode;
  deep: React.ReactNode;
  hasLearn: boolean;
}) {
  const [settings, set] = useSettings();
  const hydrated = useHydrated();
  const preferred: Mode = hydrated ? settings.mode : "learn";
  const [local, setLocal] = useState<Mode | null>(null);
  let mode = local ?? preferred;
  if (mode === "learn" && !hasLearn) mode = "read";

  const setMode = (m: Mode) => {
    setLocal(m);
    set({ mode: m });
  };

  return (
    <ModeCtx.Provider value={{ mode, setMode }}>
      <div className="sticky top-14 z-30 -mx-4 mb-10 border-b border-line bg-bg/90 px-4 backdrop-blur-md sm:mx-0 sm:rounded-full sm:border sm:px-1.5">
        <div role="tablist" aria-label="Reading mode" className="flex items-center gap-1 py-1.5">
          {MODES.map((m) => {
            const disabled = m.id === "learn" && !hasLearn;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={mode === m.id}
                disabled={disabled}
                title={disabled ? "A simplified explanation for this verse is not written yet" : m.hint}
                onClick={() => setMode(m.id)}
                className={`flex-1 rounded-full px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-35 sm:flex-none sm:px-5 ${
                  mode === m.id ? "bg-ink text-bg" : "text-ink-2 hover:text-ink"
                }`}
              >
                <span className="lang-en">{m.en}</span>
                <span className="lang-hi hindi">{m.hi}</span>
              </button>
            );
          })}
          <span className="ml-auto hidden pr-4 text-xs text-ink-3 lg:inline">{MODES.find((m) => m.id === mode)?.hint}</span>
        </div>
      </div>
      <div key={mode} className="fade-in">
        {mode === "learn" && <Fragment key="learn">{learn}</Fragment>}
        {mode === "read" && <Fragment key="read">{read}</Fragment>}
        {mode === "deep" && <Fragment key="deep">{deep}</Fragment>}
      </div>
    </ModeCtx.Provider>
  );
}

export function GoDeeper({ label = "Go deeper" }: { label?: string }) {
  const { setMode } = useContext(ModeCtx);
  return (
    <button
      onClick={() => {
        setMode("deep");
        window.scrollTo({ top: (document.getElementById("modes")?.offsetTop ?? 0) - 64, behavior: "smooth" });
      }}
      className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-bg transition-transform hover:-translate-y-0.5"
    >
      <IconLayers size={18} />
      <span>{label}</span>
      <span className="text-bg/60 transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

export function SwitchMode({ to, children }: { to: Mode; children: React.ReactNode }) {
  const { setMode } = useContext(ModeCtx);
  return (
    <button
      onClick={() => {
        setMode(to);
        window.scrollTo({ top: (document.getElementById("modes")?.offsetTop ?? 0) - 64, behavior: "smooth" });
      }}
      className="text-saffron underline-offset-4 hover:underline"
    >
      {children}
    </button>
  );
}

export function VisitTracker({ id }: { id: string }) {
  useEffect(() => {
    actions.visit(id);
  }, [id]);
  return null;
}

export function BookmarkButton({
  kind,
  id,
  label,
  compact,
}: {
  kind: Bookmark["kind"];
  id: string;
  label?: string;
  compact?: boolean;
}) {
  const on = useIsBookmarked(kind, id);
  const hydrated = useHydrated();
  return (
    <button
      onClick={() => actions.toggleBookmark({ kind, id, label })}
      aria-pressed={hydrated ? on : false}
      aria-label={on ? "Remove bookmark" : "Bookmark"}
      className={`inline-flex items-center gap-2 rounded-full transition-colors ${
        compact ? "h-9 w-9 justify-center" : "border px-3.5 py-2 text-sm"
      } ${on && hydrated ? "border-saffron/40 text-saffron" : "border-line text-ink-2 hover:text-ink"}`}
    >
      <IconBookmark size={17} filled={on && hydrated} />
      {!compact && <span>{on && hydrated ? "Saved" : "Save"}</span>}
    </button>
  );
}

export function UnderstoodButton({ id }: { id: string }) {
  const on = useGita((s) => !!s.understood[id]);
  const hydrated = useHydrated();
  const active = on && hydrated;
  return (
    <button
      onClick={() => actions.toggleUnderstood(id)}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${
        active ? "border-leaf/40 bg-leaf/10 text-leaf" : "border-line text-ink-2 hover:text-ink"
      }`}
    >
      <IconCheck size={16} />
      {active ? "Understood" : "Mark as understood"}
    </button>
  );
}

export function NoteBox({ id }: { id: string }) {
  const saved = useGita((s) => s.notes[id]?.text ?? "");
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const value = draft ?? saved;
  const has = hydrated && !!saved;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${
          has ? "border-indigo/30 text-indigo" : "border-line text-ink-2 hover:text-ink"
        }`}
      >
        <IconNote size={16} />
        {has ? "Your note" : "Add a note"}
      </button>
      {open && (
        <div className="rise mt-4">
          <textarea
            value={value}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => draft !== null && actions.setNote(id, draft)}
            rows={4}
            placeholder="What does this verse mean to you? (Saved only in this browser.)"
            className="w-full rounded-2xl border border-line bg-surface p-4 text-[0.98rem] leading-relaxed outline-none transition-colors placeholder:text-ink-3 focus:border-line-strong"
          />
          <div className="mt-2 flex justify-end gap-2 text-sm">
            <button
              onClick={() => {
                actions.setNote(id, value);
                setDraft(null);
                setOpen(false);
              }}
              className="rounded-full bg-ink px-4 py-1.5 text-bg"
            >
              Save note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden>
      <div className="h-full origin-left bg-saffron/80 transition-transform duration-150" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
