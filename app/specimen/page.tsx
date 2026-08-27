import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Specimen — Atlas",
  robots: { index: false, follow: false },
};

const SCALE = [
  ["micro", "var(--text-micro)", "56.0465° N · 12.6945° E"],
  ["sm", "var(--text-sm)", "Fullstack developer"],
  ["body", "var(--text-body)", "Black ink on white paper, moved by wind."],
  ["lead", "var(--text-lead)", "Projects are territory. Navigation is travel."],
  ["h3", "var(--text-h3)", "Selected work"],
  ["h2", "var(--text-h2)", "The Atlas"],
  ["wordmark", "var(--text-wordmark)", "Isak"],
  ["h1", "var(--text-h1)", "Selected work"],
];

export default function SpecimenPage() {
  return (
    <main className="bg-paper text-ink">
      <header className="flex items-baseline justify-between border-b border-ink px-[var(--space-4)] py-[var(--space-3)]">
        <p className="font-mono-legend">Plate 00 · Art direction</p>
        <Link href="/" className="font-mono-legend hover:underline">
          ← Return
        </Link>
      </header>

      <section className="border-b border-ink px-[var(--space-4)] py-[var(--space-8)] lg:px-[var(--space-8)]">
        <p className="font-mono-legend">Helsingborg, Sweden · Birch / Wind / Cartography</p>
        <h1 className="type-wordmark mt-[var(--space-3)]">Isak</h1>
        <p
          className="mt-[var(--space-4)] max-w-[38ch] text-ink-60"
          style={{ fontSize: "var(--text-lead)" }}
        >
          A survey atlas printed on birch bark. Ocean is paper. Land is contour.
          The only grey is dither.
        </p>
      </section>

      <section className="grid border-b border-ink md:grid-cols-2">
        <div className="border-b border-ink px-[var(--space-4)] py-[var(--space-6)] md:border-r md:border-b-0 lg:px-[var(--space-8)]">
          <p className="font-mono-legend">Ink</p>
          <div className="mt-[var(--space-4)] grid grid-cols-2 gap-[var(--space-2)]">
            <Swatch name="Paper" hex="#FFFFFF" paper />
            <Swatch name="Ink" hex="#0A0A0A" />
            <Swatch name="Ink 90" hex="mix 90%" tone="90" />
            <div className="border border-ink">
              <div className="dither-ramp h-16" />
              <p className="font-mono-legend border-t border-ink px-2 py-2">
                Optical grey · dither
              </p>
            </div>
          </div>
          <p className="mt-[var(--space-3)] max-w-[40ch] text-ink-60" style={{ fontSize: "var(--text-sm)" }}>
            Ink-60 and ink-30 exist for type only. No grey fills. No accent.
            Colour returns only on a hovered project plate.
          </p>
        </div>
        <div className="px-[var(--space-4)] py-[var(--space-6)] lg:px-[var(--space-8)]">
          <p className="font-mono-legend">Survey voice</p>
          <p className="mt-[var(--space-4)] font-mono-legend">
            IsaK · 56.0465° N · 12.6945° E · Available 2026
          </p>
          <p className="mt-[var(--space-2)] font-mono-legend">
            01 The brief · 02 The problem · 03 The decision
          </p>
          <p className="mt-[var(--space-2)] font-mono-legend">Drag · Open ↗ · Copy</p>
          <div className="mt-[var(--space-6)] flex flex-wrap gap-[var(--space-2)]">
            <a
              href="#focus-target"
              className="rounded-[4px] bg-ink px-[var(--space-4)] py-[var(--space-2)] text-sm text-paper"
            >
              View work →
            </a>
            <a
              href="#focus-target"
              id="focus-target"
              className="rounded-[4px] border border-ink px-[var(--space-4)] py-[var(--space-2)] text-sm"
            >
              About
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-ink px-[var(--space-4)] py-[var(--space-6)] lg:px-[var(--space-8)]">
        <p className="font-mono-legend">Type scale</p>
        <ul className="mt-[var(--space-4)]">
          {SCALE.map(([name, size, sample]) => (
            <li
              key={name}
              className="flex items-baseline justify-between gap-[var(--space-4)] border-b border-ink py-[var(--space-3)] last:border-b-0"
            >
              <span className="font-mono-legend shrink-0">{name}</span>
              <span
                className="min-w-0 flex-1 truncate font-medium tracking-tight"
                style={{ fontSize: size }}
              >
                {sample}
              </span>
            </li>
          ))}
        </ul>
        <p className="type-wordmark mt-[var(--space-6)]">Isak</p>
      </section>

      <section className="on-ink px-[var(--space-4)] py-[var(--space-8)] lg:px-[var(--space-8)]">
        <p className="font-mono-legend">Terminator polarity · paper on ink</p>
        <h2
          className="mt-[var(--space-3)] font-medium tracking-tight"
          style={{ fontSize: "var(--text-h2)" }}
        >
          Night side of the plate.
        </h2>
        <p className="mt-[var(--space-3)] max-w-[48ch] text-[color:color-mix(in_oklab,#ffffff_70%,#0a0a0a)]" style={{ fontSize: "var(--text-body)" }}>
          Contours invert. Code blocks use this polarity. Focus outline becomes
          paper, 2px offset. No glow.
        </p>
        <a
          href="#focus-target"
          className="mt-[var(--space-4)] inline-block border border-paper px-[var(--space-4)] py-[var(--space-2)] text-sm"
        >
          Continue survey
        </a>
      </section>

      <section className="px-[var(--space-4)] py-[var(--space-8)] lg:px-[var(--space-8)]">
        <p className="font-mono-legend">Wind eases · the field in lib/wind.ts</p>
        <div className="mt-[var(--space-4)] grid gap-[var(--space-3)] md:grid-cols-3">
          <Ease name="wind" value="0.16, 1, 0.3, 1" />
          <Ease name="gust" value="0.87, 0, 0.13, 1" />
          <Ease name="drift" value="0.33, 1, 0.68, 1" />
        </div>
        <p className="mt-[var(--space-6)] max-w-[52ch] text-ink-60" style={{ fontSize: "var(--text-sm)" }}>
          Reduced motion: grain holds still, Lenis is off, gusts do not
          fire. Route changes become 120ms opacity. The plate must still look
          composed.
        </p>
      </section>
    </main>
  );
}

function Swatch({
  name,
  hex,
  paper = false,
  tone,
}: {
  name: string;
  hex: string;
  paper?: boolean;
  tone?: "90";
}) {
  return (
    <div className="border border-ink">
      <div
        className="h-16"
        style={{
          background: tone === "90" ? "var(--color-ink-90)" : hex,
          border: paper ? "0" : undefined,
        }}
      />
      <p className="font-mono-legend border-t border-ink px-2 py-2">
        {name} · {hex}
      </p>
    </div>
  );
}

function Ease({ name, value }: { name: string; value: string }) {
  return (
    <div className="border border-ink p-[var(--space-3)]">
      <p className="font-mono-legend">{name}</p>
      <p className="mt-[var(--space-2)] font-mono-legend text-ink-60">{value}</p>
      <div className="mt-[var(--space-3)] h-px bg-ink" />
    </div>
  );
}
