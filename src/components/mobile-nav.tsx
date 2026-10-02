"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBook, IconGraph, IconHome, IconSearch, IconUser } from "./icons";
import { useSearch } from "./search/search-provider";

export function MobileNav() {
  const pathname = usePathname();
  const { open } = useSearch();
  const items = [
    { href: "/", label: "Home", Icon: IconHome, match: (p: string) => p === "/" },
    { href: "/explore", label: "Explore", Icon: IconGraph, match: (p: string) => ["/explore", "/concepts", "/questions", "/traditions", "/texts", "/thinkers", "/compare", "/darshanas", "/paths", "/tools"].some((x) => p.startsWith(x)) },
    { href: "/gita", label: "Gita", Icon: IconBook, match: (p: string) => ["/gita", "/chapter", "/verse", "/journey", "/quick"].some((x) => p.startsWith(x)) },
    { href: "/my", label: "Library", Icon: IconUser, match: (p: string) => p.startsWith("/my") },
  ];
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.slice(0, 2).map((it) => (
          <Tab key={it.href} {...it} active={it.match(pathname)} />
        ))}
        <button onClick={open} className="flex flex-col items-center gap-1 py-2.5 text-[0.68rem] text-ink-3">
          <IconSearch size={21} />
          Search
        </button>
        {items.slice(2).map((it) => (
          <Tab key={it.href} {...it} active={it.match(pathname)} />
        ))}
      </div>
    </nav>
  );
}

function Tab({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: (p: { size?: number }) => React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center gap-1 py-2.5 text-[0.68rem] transition-colors ${
        active ? "text-saffron" : "text-ink-3"
      }`}
    >
      <Icon size={21} />
      {label}
    </Link>
  );
}
