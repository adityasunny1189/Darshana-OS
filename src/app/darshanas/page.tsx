import type { Metadata } from "next";
import Link from "next/link";
import { getTradition, textsForTradition, thinkersForTradition } from "@/lib/os/data";
import { DARSHANA_FIELDS } from "@/components/os/darshana";
import { PageHeader, SourceTag } from "@/components/os/parts";

export const metadata: Metadata = { title: "The six darshanas" };

const SIX = ["nyaya", "vaisheshika", "sankhya", "yoga", "mimamsa", "vedanta"];
const PAIRS = [
  ["nyaya", "vaisheshika", "Logic and categories of reality — later merged as Nyaya-Vaisheshika"],
  ["sankhya", "yoga", "A map of consciousness and matter, and a discipline to realise it"],
  ["mimamsa", "vedanta", "Interpretation of the Veda: its ritual part (Purva) and its knowledge part (Uttara)"],
];

export default function DarshanasPage() {
  const six = SIX.map(getTradition).filter((t) => !!t);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="षड्दर्शन · ṣaḍ-darśana"
          title="The six darshanas"
          lead="Six classical systems that accept the authority of the Veda, each asking the same questions — what is real, how do we know, what is the self, what binds us, what frees us — and answering them in its own way."
          tags={<SourceTag type="editorial" />}
        />
      </div>

      <section className="mx-auto mb-16 grid max-w-5xl gap-3 md:grid-cols-3" aria-label="Paired systems">
        {PAIRS.map(([a, b, note]) => (
          <div key={a} className="card p-5">
            <p className="font-display text-xl">
              <Link href={`/traditions/${a}`} className="hover:text-saffron">
                {getTradition(a)?.name.en}
              </Link>
              <span className="text-ink-3"> + </span>
              <Link href={`/traditions/${b}`} className="hover:text-saffron">
                {getTradition(b)?.name.en.replace(/ \(.+\)$/, "")}
              </Link>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-3">{note}</p>
          </div>
        ))}
      </section>

      {/* desktop matrix */}
      <div className="hidden overflow-x-auto rounded-3xl border border-line lg:block">
        <table className="w-full min-w-[1100px] table-fixed border-collapse text-left">
          <thead>
            <tr className="bg-surface">
              <th className="w-48 p-4" />
              {six.map((t) => (
                <th key={t!.id} className="border-l border-line p-4 align-bottom">
                  <Link href={`/traditions/${t!.id}`} className="group block">
                    <span lang="sa" className="sanskrit block text-2xl text-ink-2 group-hover:text-saffron">
                      {t!.name.sa}
                    </span>
                    <span className="font-display text-lg text-ink">{t!.name.en.replace(/ \(.+\)$/, "")}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DARSHANA_FIELDS.map((f, i) => (
              <tr key={f.key} className={i % 2 ? "bg-surface/50" : ""}>
                <th scope="row" className="border-t border-line p-4 align-top font-display text-base font-normal leading-snug text-ink">
                  {f.q}
                </th>
                {six.map((t) => (
                  <td key={t!.id} className="border-l border-t border-line p-4 align-top text-[0.9rem] leading-relaxed text-ink-2">
                    {t!.darshana?.[f.key] ?? <span className="text-ink-3">—</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="border-t border-line p-4 align-top font-display text-base font-normal text-ink">
                Important texts
              </th>
              {six.map((t) => (
                <td key={t!.id} className="border-l border-t border-line p-4 align-top text-sm">
                  {textsForTradition(t!.id)
                    .slice(0, 4)
                    .map((x) => (
                      <Link key={x.id} href={`/texts/${x.id}`} className="block text-ink-2 hover:text-saffron">
                        {x.title.en}
                      </Link>
                    ))}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="border-t border-line p-4 align-top font-display text-base font-normal text-ink">
                Important thinkers
              </th>
              {six.map((t) => (
                <td key={t!.id} className="border-l border-t border-line p-4 align-top text-sm">
                  {thinkersForTradition(t!.id)
                    .slice(0, 4)
                    .map((x) => (
                      <Link key={x.id} href={`/thinkers/${x.id}`} className="block text-ink-2 hover:text-saffron">
                        {x.name.en}
                      </Link>
                    ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* mobile: one question at a time */}
      <div className="space-y-10 lg:hidden">
        {DARSHANA_FIELDS.map((f) => (
          <section key={f.key}>
            <h2 className="font-display mb-4 text-2xl">{f.q}</h2>
            <div className="space-y-3">
              {six.map((t) => (
                <div key={t!.id} className="card p-4">
                  <Link href={`/traditions/${t!.id}`} className="eyebrow !text-saffron">
                    {t!.name.en.replace(/ \(.+\)$/, "")}
                  </Link>
                  <p className="mt-1 leading-relaxed text-ink-2">{t!.darshana?.[f.key] ?? "—"}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-ink-3">
        These are editorial summaries of each system’s classical positions; every system has internal debates and later
        developments. Open a darshana for its schools, texts and thinkers.
      </p>
    </div>
  );
}
