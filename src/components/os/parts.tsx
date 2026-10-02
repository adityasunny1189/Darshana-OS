import Link from "next/link";
import type { Ref } from "@/lib/os/data";
import { SOURCE_TYPE_LABEL } from "@/lib/os/data";
import { IconArrowRight } from "../icons";

/* ---------- source hierarchy badge ---------- */

const TAG_STYLE: Record<string, string> = {
  "primary-text": "text-brown border-brown/30",
  "traditional-commentary": "text-gold border-gold/40",
  "modern-commentary": "text-gold border-gold/40",
  "modern-exposition": "text-indigo border-indigo/30",
  "modern-analogy": "text-leaf border-leaf/35",
  editorial: "text-indigo border-indigo/25",
  "not-ingested": "text-ink-3 border-line-strong border-dashed",
  ingested: "text-leaf border-leaf/40",
  advanced: "text-saffron border-saffron/40",
};

export function SourceTag({ type, children }: { type: keyof typeof TAG_STYLE | string; children?: React.ReactNode }) {
  const label =
    children ??
    (type === "not-ingested"
      ? "Source not yet ingested"
      : type === "ingested"
        ? "Full text available"
        : type === "advanced"
          ? "Advanced text"
          : SOURCE_TYPE_LABEL[type] ?? type);
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide ${TAG_STYLE[type] ?? "text-ink-3 border-line"}`}
    >
      {label}
    </span>
  );
}

/* ---------- page header ---------- */

export function PageHeader({
  eyebrow,
  title,
  sa,
  iast,
  lead,
  tags,
  center,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  sa?: string;
  iast?: string;
  lead?: React.ReactNode;
  tags?: React.ReactNode;
  center?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <header className={`pb-12 pt-14 sm:pt-20 ${center ? "text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      {sa && (
        <p lang="sa" className="sanskrit rise mb-1 text-[clamp(1.6rem,4.5vw,2.4rem)] leading-snug text-gold">
          {sa}
        </p>
      )}
      <h1 className="font-display rise text-[clamp(2.3rem,6vw,4rem)] leading-[1.06] text-ink">{title}</h1>
      {iast && <p className="iast scholar-only mt-2 text-lg">{iast}</p>}
      {lead && <div className={`mt-5 max-w-2xl text-lg leading-relaxed text-ink-2 ${center ? "mx-auto" : ""}`}>{lead}</div>}
      {tags && <div className={`mt-5 flex flex-wrap gap-2 ${center ? "justify-center" : ""}`}>{tags}</div>}
      {children}
    </header>
  );
}

/* ---------- entity chips & cards ---------- */

const KIND_LABEL: Record<string, string> = {
  tradition: "Tradition",
  text: "Text",
  thinker: "Thinker",
  concept: "Concept",
  question: "Question",
  gita: "Gita verse",
  tool: "Interactive",
};

export function Chip({ r }: { r: Ref }) {
  return (
    <Link
      href={r.href}
      className="group inline-flex items-baseline gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm transition-colors hover:border-saffron"
    >
      {r.sa && (
        <span lang="sa" className="sanskrit text-[1.02rem] text-ink group-hover:text-saffron">
          {r.sa}
        </span>
      )}
      <span className={r.sa ? "text-ink-3" : "text-ink group-hover:text-saffron"}>{r.label}</span>
    </Link>
  );
}

export function Chips({ refs }: { refs: Ref[] }) {
  if (!refs.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {refs.map((r) => (
        <Chip key={r.kind + r.id} r={r} />
      ))}
    </div>
  );
}

export function RefCard({ r, note, index }: { r: Ref; note?: string; index?: number }) {
  return (
    <Link
      href={r.href}
      className="card group flex h-full flex-col p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong"
    >
      <span className="eyebrow mb-2 !text-saffron">
        {index !== undefined ? `${index + 1} · ` : ""}
        {KIND_LABEL[r.kind]}
      </span>
      {r.sa && (
        <span lang="sa" className="sanskrit text-xl leading-snug text-ink-2">
          {r.sa}
        </span>
      )}
      <span className="font-display text-lg leading-snug text-ink group-hover:text-saffron">{r.label}</span>
      {(note || r.sub) && <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-3">{note ?? r.sub}</span>}
    </Link>
  );
}

/* ---------- Follow this idea ---------- */

export function FollowIdea({ title = "Follow this idea", steps }: { title?: string; steps: { r: Ref; note?: string }[] }) {
  if (!steps.length) return null;
  return (
    <section aria-label={title} className="py-14">
      <h2 className="font-display mb-2 text-2xl">{title}</h2>
      <p className="mb-8 text-ink-3">Trace the idea from one source to the next.</p>
      <ol className="relative grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="relative">
            <Link
              href={s.r.href}
              className="card group flex h-full gap-4 p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong"
            >
              <span className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-3 group-hover:border-saffron group-hover:text-saffron">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="eyebrow block">{KIND_LABEL[s.r.kind]}</span>
                <span className="font-display block text-lg leading-snug text-ink">
                  {s.r.sa && <span className="sanskrit mr-2 text-ink-2">{s.r.sa}</span>}
                  {s.r.label}
                </span>
                {s.note && <span className="mt-1 block text-sm leading-relaxed text-ink-3">{s.note}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- Continue exploring ---------- */

export function ContinueExploring({
  groups,
}: {
  groups: { label: string; refs: Ref[] }[];
}) {
  const g = groups.filter((x) => x.refs.length);
  if (!g.length) return null;
  return (
    <section aria-labelledby="continue" className="mt-10 rounded-3xl border border-line bg-surface/70 p-6 sm:p-9">
      <h2 id="continue" className="font-display mb-6 text-2xl">
        Continue exploring
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {g.map((x) => (
          <div key={x.label}>
            <p className="eyebrow mb-3">{x.label}</p>
            <Chips refs={x.refs} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- section wrapper ---------- */

export function Section({
  title,
  id,
  aside,
  tag,
  children,
  className = "",
}: {
  title: React.ReactNode;
  id?: string;
  aside?: React.ReactNode;
  tag?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`grid gap-8 border-t border-line py-12 md:grid-cols-[15rem_1fr] ${className}`}>
      <div>
        <h2 id={id} className="font-display text-2xl leading-snug">
          {title}
        </h2>
        {tag && <div className="mt-3">{tag}</div>}
        {aside && <div className="mt-3 text-sm text-ink-3">{aside}</div>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-ink-2 underline-offset-4 hover:text-ink hover:underline">
      {children}
      <IconArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function NotIngested({ what = "The full text" }: { what?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong px-5 py-4 text-sm leading-relaxed text-ink-3">
      <p className="mb-1 font-medium text-ink-2">Source not yet ingested</p>
      {what} is not part of this version. What you see here is an editorial overview with passage
      references. No verses have been reproduced or invented. The architecture is ready for the text to be added.
    </div>
  );
}
