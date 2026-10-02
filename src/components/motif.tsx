/** Quiet line-art motifs, one per chapter theme. Stroke only, inherits colour. */

const paths: Record<string, React.ReactNode> = {
  conch: (
    <>
      <path d="M14 34c-4-6-3-15 4-20 7-5 17-4 21 3 3 5 1 11-4 13-4 2-8 0-9-4-1-3 1-6 4-6" />
      <path d="M14 34l-4 6 9-2" />
      <path d="M22 37c5 1 10 0 14-3" />
    </>
  ),
  lamp: (
    <>
      <path d="M24 8c3 4 4 7 3 9-1 2-5 2-6 0-1-2 0-5 3-9Z" />
      <path d="M8 26c5 7 10 10 16 10s11-3 16-10c-6 2-11 2.6-16 2.6S14 28 8 26Z" />
      <path d="M18 41h12" />
      <circle cx="24" cy="20" r="11" opacity=".35" />
    </>
  ),
  wheel: (
    <>
      <circle cx="24" cy="24" r="15" />
      <circle cx="24" cy="24" r="3.5" />
      <path d="M24 9v11.5M24 27.5V39M9 24h11.5M27.5 24H39M13.4 13.4l8.1 8.1M26.5 26.5l8.1 8.1M13.4 34.6l8.1-8.1M26.5 21.5l8.1-8.1" />
    </>
  ),
  flame: (
    <>
      <path d="M24 7c6 7 10 12 10 19a10 10 0 0 1-20 0c0-4 2-7 4-9 0 4 2 6 4 6-1-6 0-11 2-16Z" />
      <path d="M24 38c-3 0-5-2-5-5 0-3 3-5 5-8 2 3 5 5 5 8 0 3-2 5-5 5Z" />
    </>
  ),
  lotus: (
    <>
      <path d="M24 36c-5-5-6-13 0-22 6 9 5 17 0 22Z" />
      <path d="M24 36c-8 0-13-6-14-15 7 1 12 6 14 15Z" />
      <path d="M24 36c8 0 13-6 14-15-7 1-12 6-14 15Z" />
      <path d="M8 40h32" />
    </>
  ),
  seed: (
    <>
      <path d="M24 40V22" />
      <path d="M24 26c-7 0-11-4-11-11 7 0 11 4 11 11Z" />
      <path d="M24 22c0-6 4-10 10-10 0 6-4 10-10 10Z" />
      <path d="M14 40h20" />
    </>
  ),
  sun: (
    <>
      <circle cx="24" cy="24" r="8" />
      <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2" />
    </>
  ),
  cosmos: (
    <>
      <circle cx="24" cy="24" r="4" />
      <ellipse cx="24" cy="24" rx="17" ry="7" />
      <ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(120 24 24)" />
    </>
  ),
  eye: (
    <>
      <path d="M6 24c5-8 11-12 18-12s13 4 18 12c-5 8-11 12-18 12S11 32 6 24Z" />
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" />
    </>
  ),
  scales: (
    <>
      <path d="M24 8v32M16 40h16M10 14h28" />
      <path d="M10 14 5 26h10zM38 14l-5 12h10z" />
      <path d="M5 26a5 3 0 0 0 10 0M33 26a5 3 0 0 0 10 0" />
    </>
  ),
  tree: (
    <>
      {/* the aśvattha with roots above (Gita 15.1) */}
      <path d="M24 8v32" />
      <path d="M24 12c-4-3-9-3-13 0M24 12c4-3 9-3 13 0M24 18c-5-2-10-1-14 3M24 18c5-2 10-1 14 3" />
      <path d="M24 26c-4 0-8 2-10 6M24 26c4 0 8 2 10 6M24 33c-3 0-5 2-6 5M24 33c3 0 5 2 6 5" />
    </>
  ),
  crown: (
    <>
      <path d="M9 34 7 16l9 8 8-12 8 12 9-8-2 18Z" />
      <path d="M9 39h30" />
      <circle cx="24" cy="12" r="1.6" fill="currentColor" />
    </>
  ),
  chariot: (
    <>
      <circle cx="17" cy="33" r="7" />
      <circle cx="17" cy="33" r="1.8" />
      <path d="M12 21h22l-3 7H12zM34 21l6-8M22 21v-9l8 4-8 4" />
    </>
  ),
  mountain: (
    <>
      <path d="M5 38 18 16l7 10 5-6 13 18Z" />
      <path d="M15 21l3 3 3-3" />
    </>
  ),
  ocean: (
    <>
      <path d="M5 20c4-3 8-3 12 0s8 3 12 0 8-3 12 0" />
      <path d="M5 28c4-3 8-3 12 0s8 3 12 0 8-3 12 0" />
      <path d="M5 36c4-3 8-3 12 0s8 3 12 0 8-3 12 0" />
    </>
  ),
  moon: (
    <>
      <path d="M31 9a15 15 0 1 0 8 26A12 12 0 0 1 31 9Z" />
    </>
  ),
  path: (
    <>
      <path d="M14 42c0-8 20-8 20-16S14 18 14 10" />
      <circle cx="14" cy="8" r="2" />
    </>
  ),
  river: (
    <>
      <path d="M10 6c10 6-6 12 4 18s-6 12 4 18" />
      <path d="M24 6c10 6-6 12 4 18s-6 12 4 18" opacity=".6" />
    </>
  ),
  bow: (
    <>
      <path d="M14 6c14 6 14 30 0 36" />
      <path d="M14 6v36M8 24h30M34 20l4 4-4 4" />
    </>
  ),
};

export function Motif({ name, size = 48, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[name] ?? paths.lamp}
    </svg>
  );
}
