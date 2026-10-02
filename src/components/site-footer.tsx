import Link from "next/link";
import { IconLamp } from "./icons";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2 text-saffron">
            <IconLamp size={20} />
            <span className="font-display text-lg text-ink">Indian Philosophy OS</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink-2">
            A way to explore Indian philosophical thought: questions, concepts, traditions, texts and thinkers, all
            connected. Every page says what it is. You’ll see primary source, commentary, editorial overview or modern
            analogy, and texts not yet ingested are never invented.
          </p>
          <p className="mt-3 text-sm text-ink-3">
            Everything you save stays in this browser. No accounts, no tracking.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2 text-ink-2">
            <li><Link className="hover:text-ink" href="/explore">The philosophy explorer</Link></li>
            <li><Link className="hover:text-ink" href="/questions">Start with a question</Link></li>
            <li><Link className="hover:text-ink" href="/compare">Compare perspectives</Link></li>
            <li><Link className="hover:text-ink" href="/darshanas">The six darshanas</Link></li>
            <li><Link className="hover:text-ink" href="/thinkers">Thinkers</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Read</p>
          <ul className="space-y-2 text-ink-2">
            <li><Link className="hover:text-ink" href="/gita">Bhagavad Gita · Sadhak Sanjivani</Link></li>
            <li><Link className="hover:text-ink" href="/texts">The library</Link></li>
            <li><Link className="hover:text-ink" href="/paths">Learning paths</Link></li>
            <li><Link className="hover:text-ink" href="/my">My Library</Link></li>
            <li><Link className="hover:text-ink" href="/about">Sources & method</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
