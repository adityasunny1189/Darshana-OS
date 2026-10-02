import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaths as getGitaPaths } from "@/lib/data";
import { getOsPaths, resolve } from "@/lib/os/data";
import { GitaPathView } from "@/components/gita/gita-path";
import { PageHeader, SourceTag } from "@/components/os/parts";
import { PathProgress } from "@/components/os/path-progress";
import { SeenDot } from "@/components/os/seen";
import { BookmarkButton } from "@/components/verse/verse-client";

export const dynamicParams = false;
export function generateStaticParams() {
  return [...getOsPaths().map((p) => ({ id: p.id })), ...getGitaPaths().map((p) => ({ id: p.id }))];
}
export async function generateMetadata({ params }: PageProps<"/paths/[id]">): Promise<Metadata> {
  const { id } = await params;
  const os = getOsPaths().find((p) => p.id === id);
  const g = getGitaPaths().find((p) => p.id === id);
  return { title: os?.title ?? g?.title.en ?? "Path", description: os?.description ?? g?.description.en };
}

const KIND_LABEL: Record<string, string> = {
  concept: "Concept",
  text: "Text",
  tradition: "Tradition",
  thinker: "Thinker",
  gita: "Gita verse",
  question: "Question",
  tool: "Interactive",
};

export default async function PathPage({ params }: PageProps<"/paths/[id]">) {
  const { id } = await params;
  const p = getOsPaths().find((x) => x.id === id);
  if (!p) {
    if (getGitaPaths().some((x) => x.id === id)) return <GitaPathView id={id} />;
    notFound();
  }
  const steps = p.steps.map((s) => ({ s, r: resolve(s.kind, s.id) })).filter((x) => x.r);
  const keys = steps.map(({ s }) => `${s.kind}:${s.id}`);

  return (
    <div className="lamp">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="pt-6 text-sm text-ink-3">
          <Link href="/paths" className="hover:text-ink">
            All paths
          </Link>
        </nav>
        <PageHeader
          eyebrow={`${p.level} · ${steps.length} steps`}
          title={p.title}
          lead={p.description}
          tags={
            <>
              <SourceTag type="editorial" />
              <BookmarkButton kind="path" id={p.id} label={p.title} />
            </>
          }
        >
          <div className="mt-8">
            <PathProgress keys={keys} />
          </div>
        </PageHeader>

        <ol className="relative space-y-4 pb-10 before:absolute before:bottom-8 before:left-[1.15rem] before:top-8 before:w-px before:bg-line">
          {steps.map(({ s, r }, i) => (
            <li key={i} className="relative pl-14">
              <span className="font-display absolute left-0 top-5 grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-ink-2">{i + 1}</span>
              <Link href={r!.href} className="card group flex items-start gap-4 p-5 transition-[transform,border-color] duration-500 hover:-translate-y-0.5 hover:border-line-strong sm:p-6">
                <span className="min-w-0 flex-1">
                  <span className="eyebrow mb-1 block !text-saffron">
                    {KIND_LABEL[s.kind]} · {r!.label}
                  </span>
                  <span className="font-display block text-xl leading-snug text-ink">{s.title ?? r!.label}</span>
                  {s.note && <span className="mt-2 block leading-relaxed text-ink-2">{s.note}</span>}
                </span>
                <SeenDot k={`${s.kind}:${s.id}`} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
