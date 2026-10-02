"use client";

import { useEffect } from "react";
import { useGita, useHydrated } from "@/lib/store";

/** Mirrors reader settings onto <html> so CSS can react (theme, scale, languages). */
export function SettingsSync() {
  const s = useGita((x) => x.settings);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    const d = document.documentElement;
    if (s.theme === "system") delete d.dataset.theme;
    else d.dataset.theme = s.theme;
    d.style.setProperty("--reader-scale", String(s.scale));
    d.dataset.level = s.level;
    if (s.explain === "hi") d.dataset.explain = "hi";
    else delete d.dataset.explain;
    const toggle = (attr: string, hide: boolean) =>
      hide ? d.setAttribute(attr, "") : d.removeAttribute(attr);
    toggle("data-hide-sa", !s.show.sa);
    toggle("data-hide-iast", !s.show.iast);
    toggle("data-hide-hi", !s.show.hi);
    toggle("data-hide-en", !s.show.en);
  }, [s, hydrated]);

  return null;
}
