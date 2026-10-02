"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconLamp, IconSearch, IconType } from "./icons";
import { useSearch } from "./search/search-provider";
import { ReaderSettings } from "./reader-settings";

const NAV = [
  { href: "/explore", en: "Explore", hi: "अन्वेषण", also: [] as string[] },
  { href: "/questions", en: "Questions", hi: "प्रश्न", also: [] },
  { href: "/concepts", en: "Concepts", hi: "विषय", also: ["/compare"] },
  { href: "/traditions", en: "Traditions", hi: "परम्पराएँ", also: ["/darshanas", "/thinkers"] },
  { href: "/texts", en: "Texts", hi: "ग्रन्थ", also: [] },
  { href: "/gita", en: "Gita", hi: "गीता", also: ["/verse", "/chapter", "/chapters", "/journey", "/quick"] },
  { href: "/paths", en: "Paths", hi: "मार्ग", also: ["/tools"] },
  { href: "/my", en: "Library", hi: "पुस्तकालय", also: [] },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { open } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Indian Philosophy OS — home">
          <span className="text-saffron transition-transform duration-700 group-hover:-translate-y-0.5">
            <IconLamp size={22} />
          </span>
          <span className="font-display text-[1.12rem] font-medium tracking-tight">Indian Philosophy</span>
          <span className="rounded border border-line px-1 text-[0.6rem] font-semibold tracking-[0.14em] text-ink-3">OS</span>
        </Link>

        <nav aria-label="Primary" className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => {
            const active = [n.href, ...n.also].some((h) => pathname === h || pathname.startsWith(h + "/"));
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-2.5 py-1.5 text-[0.84rem] transition-colors ${
                  active ? "bg-surface-2 text-ink" : "text-ink-2 hover:text-ink"
                }`}
              >
                <span className="lang-en">{n.en}</span>
                <span className="lang-hi hindi">{n.hi}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={open}
            className="flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-sm text-ink-3 transition-colors hover:border-line-strong hover:text-ink-2"
            aria-label="Search the Gita"
          >
            <IconSearch size={16} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-line px-1.5 text-[0.65rem] text-ink-3 lg:inline">⌘K</kbd>
          </button>
          <div className="relative">
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Reading preferences"
              aria-expanded={settingsOpen}
            >
              <IconType size={19} />
            </button>
            {settingsOpen && <ReaderSettings onClose={() => setSettingsOpen(false)} />}
          </div>
        </div>
      </div>
    </header>
  );
}
