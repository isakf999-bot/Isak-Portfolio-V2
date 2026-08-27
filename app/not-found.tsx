import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="top"
      className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden px-[var(--space-4)] lg:px-[var(--space-8)]"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-ink"
        aria-hidden="true"
        data-uncharted-plate
      >
        {Array.from({ length: 13 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            x2="100%"
            y1={`${((i + 1) / 14) * 100}%`}
            y2={`${((i + 1) / 14) * 100}%`}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.18"
          />
        ))}
        {Array.from({ length: 17 }, (_, i) => (
          <line
            key={`v-${i}`}
            y1="0"
            y2="100%"
            x1={`${((i + 1) / 18) * 100}%`}
            x2={`${((i + 1) / 18) * 100}%`}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.18"
          />
        ))}
      </svg>
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="font-mono-legend">404 · Blank plate</p>
        <h1 className="type-h1 mt-4 max-w-[16ch]">UNCHARTED</h1>
        <p className="mt-3 font-mono-legend text-ink-60">— ° — · — ° —</p>
        <p className="measure mt-4 text-ink-60">
          This page is empty. Head home or browse the work list.
        </p>
        <div className="mt-8 flex gap-6">
          <Link href="/" className="font-mono-legend">
            Home
          </Link>
          <Link href="/work" className="font-mono-legend">
            Work
          </Link>
        </div>
      </div>
    </main>
  );
}
