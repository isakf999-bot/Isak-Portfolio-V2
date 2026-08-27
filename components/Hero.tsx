import Link from "next/link";
import { PlateCoords } from "@/components/PlateCoords";
import { Wordmark } from "@/components/Wordmark";
import { featuredProjects, profile, projects } from "@/lib/content";
import { atlasLabel, getAtlas } from "@/lib/atlas";

export function Hero({ dissolve = 0 }: { dissolve?: number }) {
  return (
    <section
      className="hero-copy relative z-10 flex h-full min-h-[88svh] flex-col justify-end px-[var(--space-4)] pb-[var(--space-16)] pt-28 text-paper lg:px-[var(--space-8)]"
      style={{
        opacity: Math.max(0, 1 - dissolve * 1.2),
      }}
    >
      <PlateCoords className="text-paper" />
      <div className="mx-auto w-full max-w-6xl">
        <p className="type-kicker wind-reactive">
          {profile.city}, {profile.country} · {profile.lat} · {profile.name} ·{" "}
          {profile.role} · {profile.availability}
        </p>
        <div className="overflow-hidden">
          <Wordmark />
        </div>
        <p className="type-lead mt-[var(--space-4)] max-w-[40ch] text-paper">
          Fullstack developer. I design and build websites and the APIs behind
          them — from landing pages to full shopping flows.
        </p>
        <div className="mt-[var(--space-6)] flex flex-wrap items-center gap-3">
          <Link
            href="/work"
            className="rounded-[4px] border border-paper bg-ink px-[var(--space-4)] py-[var(--space-2)] text-sm text-paper"
          >
            View work →
          </Link>
          <a
            href="https://www.isakweb.se/"
            target="_blank"
            rel="noreferrer"
            className="rounded-[4px] border border-ink bg-paper px-[var(--space-4)] py-[var(--space-2)] text-sm text-ink"
          >
            Freelance studio ↗
          </a>
          <Link
            href="/about"
            className="rounded-[4px] border border-paper/40 px-[var(--space-4)] py-[var(--space-2)] text-sm text-paper"
          >
            About
          </Link>
          <p className="hero-chroma-hint font-mono-legend">
            Hold the plate · C · colour
          </p>
        </div>
      </div>
    </section>
  );
}

export function AtlasTease() {
  return (
    <section className="border-t border-ink bg-paper px-[var(--space-4)] py-[var(--space-16)] lg:px-[var(--space-8)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono-legend">
            {String(projects.length).padStart(2, "0")} projects
          </p>
          <h2 className="type-h2 mt-3">Selected work</h2>
        </div>
        <Link href="/work" className="font-mono-legend">
          View all →
        </Link>
      </div>
      <ol className="mx-auto mt-[var(--space-8)] max-w-6xl border-t border-ink">
        {featuredProjects.map((project, index) => {
          const meta = getAtlas(project.slug);
          return (
            <li key={project.slug} className="border-b border-ink">
              <Link
                href={`/work/${project.slug}`}
                className="grid gap-2 py-6 sm:grid-cols-[4rem_1fr_auto] sm:items-baseline"
              >
                <span className="font-mono-legend">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="type-h3 block">{project.title}</span>
                  <span
                    className="mt-2 block max-w-[52ch] text-ink-60"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {project.summary}
                  </span>
                </span>
                <span className="font-mono-legend">
                  {atlasLabel[meta.atlas]} · {project.year}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
