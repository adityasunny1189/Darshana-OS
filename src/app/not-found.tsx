import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p lang="sa" className="sanskrit mb-4 text-3xl text-ink-2">
        नष्टो मोहः स्मृतिर्लब्धा
      </p>
      <p className="font-display mb-6 text-2xl">This page isn’t here — but the way back is.</p>
      <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-bg">
        Return home
      </Link>
    </div>
  );
}
