import Link from "next/link";
import { HomeArrival } from "@/components/HomeArrival";
import { profile } from "@/lib/content";

export default function Home() {
  return (
    <main id="top">
      <HomeArrival />
      <section className="border-t border-ink px-[var(--space-4)] py-[var(--space-12)] lg:px-[var(--space-8)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono-legend">{profile.availability}</p>
            <h2
              className="mt-3 font-medium tracking-tight"
              style={{ fontSize: "var(--text-h3)" }}
            >
              Have a site that needs to feel finished?
            </h2>
          </div>
          <Link
            href="/contact"
            data-cursor="OPEN ↗"
            className="rounded-[4px] bg-ink px-[var(--space-4)] py-[var(--space-2)] text-sm text-paper"
          >
            Write to me →
          </Link>
        </div>
      </section>
    </main>
  );
}
