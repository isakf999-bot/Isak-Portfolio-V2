import type { Metadata } from "next";
import Link from "next/link";
import { DrawRule } from "@/components/DrawRule";
import { PageHead } from "@/components/PageHead";
import { PortraitPlate } from "@/components/PortraitPlate";
import { PrintCv } from "@/components/PrintCv";
import { about, skills } from "@/lib/content";

export const metadata: Metadata = {
  title: "About — Isak Forsberg",
  description:
    "Isak Forsberg is a 21-year-old fullstack developer from Helsingborg.",
};

const groups = [
  { label: "Markup", items: skills.markup },
  { label: "Language", items: skills.language },
  { label: "Interface", items: skills.interface },
  { label: "Workflow", items: skills.workflow },
];

export default function AboutPage() {
  return (
    <main id="top">
      <PageHead index="04" label="ABOUT" title="Built by hand. Finished properly." />
      <div className="px-[var(--gutter)] pb-24 lg:px-[var(--space-8)]">
        <p className="type-lead measure">{about.lede}</p>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <PortraitPlate />
          <div>
            {about.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="measure mb-5 leading-relaxed text-pretty"
              >
                {paragraph}
              </p>
            ))}
            <DrawRule />
            <p className="mt-8 font-mono-legend">
              <Link href="/work">Selected work →</Link>
              {" · "}
              <Link href="/contact">Write to me →</Link>
              {" · "}
              <a href="https://www.isakweb.se/" target="_blank" rel="noreferrer">
                isakweb.se ↗
              </a>
            </p>
          </div>
        </div>

        <section className="mt-16 grid gap-12 border-t border-ink pt-10 lg:grid-cols-2">
          <div>
            <h2 className="survey-num">Right now</h2>
            <ul className="mt-6 space-y-4">
              {about.now.map((item) => (
                <li key={item} className="flex gap-3 measure leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-4 shrink-0 bg-ink"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="survey-num">What I take on</h2>
            <ul className="mt-6 space-y-4">
              {about.offer.map((item) => (
                <li key={item} className="flex gap-3 measure leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-4 shrink-0 bg-ink"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16 border-t border-ink pt-10">
          <h2 className="survey-num">Tools on the plate</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="font-mono-legend">{group.label}</p>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} style={{ fontSize: "var(--text-sm)" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <PrintCv />
      </div>
    </main>
  );
}
