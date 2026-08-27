import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { WorkIndex } from "@/components/WorkIndex";

export const metadata: Metadata = {
  title: "Work — Isak Forsberg",
  description:
    "Selected client sites, systems, and landings by Isak Forsberg.",
};

export default function WorkPage() {
  return (
    <main id="top">
      <PageHead
        index="02"
        label="WORK"
        title="Selected sites and experiments."
      />
      <div className="px-[var(--gutter)] pb-24 lg:px-[var(--space-8)]">
        <p className="type-lead measure text-ink-60">
          Commerce, systems, landings. Open a project for the brief, the
          decision, and the result.
        </p>
        <div className="mt-12">
          <WorkIndex />
        </div>
      </div>
    </main>
  );
}
