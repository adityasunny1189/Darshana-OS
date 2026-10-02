"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Lang } from "./types";

/**
 * Everything the reader does is kept in this browser only (localStorage).
 * A tiny external store so every component sees the same state and updates together.
 */

export interface Bookmark {
  kind: "verse" | "concept" | "example" | "question" | "tradition" | "text" | "thinker" | "path" | "os-question";
  id: string; // verse id, concept id, "2.47#0" for an example
  label?: string;
  at: number;
}

export interface Settings {
  theme: "system" | "light" | "dark";
  scale: number; // reader font scale, 0.9 – 1.3
  explain: Lang; // language of explanations
  show: { sa: boolean; iast: boolean; hi: boolean; en: boolean };
  mode: "learn" | "read" | "deep";
  commentaryLang: Lang;
  level: "beginner" | "standard" | "scholar";
}

export interface GitaState {
  visited: Record<string, number>; // verse id -> first visit
  understood: Record<string, number>; // verse id -> marked as read
  bookmarks: Bookmark[];
  notes: Record<string, { text: string; at: number }>;
  last: { id: string; at: number } | null;
  recent: string[]; // most recent first
  days: string[]; // yyyy-mm-dd on which something was read
  seen: Record<string, number>; // "concept:karma" -> first visit (any OS entity)
  recentEntities: string[]; // most recent first, "text:katha-upanishad"
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  scale: 1,
  explain: "en",
  show: { sa: true, iast: false, hi: true, en: true },
  mode: "learn",
  commentaryLang: "hi",
  level: "standard",
};

const EMPTY: GitaState = {
  visited: {},
  understood: {},
  bookmarks: [],
  notes: {},
  last: null,
  recent: [],
  days: [],
  seen: {},
  recentEntities: [],
  settings: DEFAULT_SETTINGS,
};

const KEY = "gita.v1";
let state: GitaState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GitaState>;
      state = {
        ...EMPTY,
        ...parsed,
        settings: {
          ...DEFAULT_SETTINGS,
          ...(parsed.settings ?? {}),
          show: { ...DEFAULT_SETTINGS.show, ...(parsed.settings?.show ?? {}) },
        },
      };
    }
  } catch {
    state = EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) — keep in memory */
  }
}

function set(updater: (s: GitaState) => GitaState) {
  load();
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      loaded = false;
      load();
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}
function getServerSnapshot() {
  return EMPTY;
}

export function useGita<T>(select: (s: GitaState) => T): T {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return select(s);
}

/** true once we are on the client and localStorage has been read */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

const today = () => new Date().toISOString().slice(0, 10);

export const actions = {
  visit(id: string) {
    set((s) => ({
      ...s,
      visited: s.visited[id] ? s.visited : { ...s.visited, [id]: Date.now() },
      last: { id, at: Date.now() },
      recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 30),
      days: s.days.includes(today()) ? s.days : [...s.days, today()].slice(-400),
    }));
  },
  see(key: string) {
    set((s) => ({
      ...s,
      seen: s.seen[key] ? s.seen : { ...s.seen, [key]: Date.now() },
      recentEntities: [key, ...s.recentEntities.filter((x) => x !== key)].slice(0, 40),
      days: s.days.includes(today()) ? s.days : [...s.days, today()].slice(-400),
    }));
  },
  toggleUnderstood(id: string) {
    set((s) => {
      const u = { ...s.understood };
      if (u[id]) delete u[id];
      else u[id] = Date.now();
      return { ...s, understood: u };
    });
  },
  toggleBookmark(b: Omit<Bookmark, "at">) {
    set((s) => {
      const exists = s.bookmarks.some((x) => x.kind === b.kind && x.id === b.id);
      return {
        ...s,
        bookmarks: exists
          ? s.bookmarks.filter((x) => !(x.kind === b.kind && x.id === b.id))
          : [{ ...b, at: Date.now() }, ...s.bookmarks],
      };
    });
  },
  setNote(id: string, text: string) {
    set((s) => {
      const notes = { ...s.notes };
      if (text.trim()) notes[id] = { text, at: Date.now() };
      else delete notes[id];
      return { ...s, notes };
    });
  },
  settings(patch: Partial<Settings>) {
    set((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  },
  resetAll() {
    set(() => ({ ...EMPTY, settings: state.settings }));
  },
};

export function useIsBookmarked(kind: Bookmark["kind"], id: string) {
  return useGita((s) => s.bookmarks.some((b) => b.kind === kind && b.id === id));
}

export function useSettings() {
  const settings = useGita((s) => s.settings);
  const update = useCallback((p: Partial<Settings>) => actions.settings(p), []);
  return [settings, update] as const;
}
