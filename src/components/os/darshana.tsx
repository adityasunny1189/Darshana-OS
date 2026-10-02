import type { Darshana } from "@/lib/os/types";

export const DARSHANA_FIELDS: { key: keyof Darshana; q: string }[] = [
  { key: "problem", q: "What problem is it trying to solve?" },
  { key: "real", q: "What does it consider real?" },
  { key: "pramanas", q: "What is valid knowledge?" },
  { key: "self", q: "What is the Self?" },
  { key: "bondage", q: "What causes bondage?" },
  { key: "liberation", q: "What is liberation?" },
  { key: "path", q: "What is the path?" },
];

export function DarshanaCard({ d }: { d: Darshana }) {
  return (
    <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {DARSHANA_FIELDS.map((f) => (
        <div key={f.key} className="grid gap-1 p-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
          <dt className="font-display text-lg leading-snug text-ink">{f.q}</dt>
          <dd className="leading-relaxed text-ink-2">{d[f.key]}</dd>
        </div>
      ))}
    </dl>
  );
}
