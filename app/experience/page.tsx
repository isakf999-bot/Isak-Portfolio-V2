import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { StrataDesk } from "@/components/strata/StrataDesk";
import { STRATA_MONTHS } from "@/lib/strata";

export const metadata: Metadata = {
  title: "Experience — Isak Forsberg",
  description:
    "Front-end and back-end studies at Sundsgården, plus a summer at Strafe.com.",
};

export default function ExperiencePage() {
  return (
    <main id="top">
      <PageHead index="03" label="EXPERIENCE" title="School, then a live product." />
      <div className="px-[var(--gutter)] lg:px-[var(--space-8)]">
        <p className="type-lead measure text-ink-60">
          Thickness maps to months. Oldest stratum at the base. Scroll descends
          the column. {STRATA_MONTHS} months logged.
        </p>
      </div>
      <StrataDesk />
    </main>
  );
}
