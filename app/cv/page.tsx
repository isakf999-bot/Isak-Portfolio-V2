import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { education, profile, skillList, work } from "@/lib/content";

export const metadata: Metadata = {
  title: "CV — Isak Forsberg",
  description: "Printable survey of experience for Isak Forsberg.",
};

export default function CvPage() {
  return (
    <main id="top">
      <PageHead index="07" label="CV" title={profile.name} />
      <div className="mx-auto max-w-3xl px-[var(--gutter)] pb-24 lg:px-[var(--space-8)] print:pt-0">
        <p className="font-mono-legend">
          {profile.role} · {profile.city} · {profile.email} · {profile.phone}
        </p>
        <section className="mt-10 border-t border-ink pt-6">
          <h2 className="survey-num">Work</h2>
          {work.map((item) => (
            <div key={item.title} className="mt-4">
              <p className="font-medium">
                {item.org} — {item.title}
              </p>
              <p className="font-mono-legend mt-1">{item.dates}</p>
              <p className="mt-2 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>
        <section className="mt-10 border-t border-ink pt-6">
          <h2 className="survey-num">School</h2>
          {education.map((item) => (
            <div key={item.title} className="mt-4">
              <p className="font-medium">
                {item.org} — {item.title}
              </p>
              <p className="font-mono-legend mt-1">{item.dates}</p>
              <p className="mt-2 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>
        <section className="mt-10 border-t border-ink pt-6">
          <h2 className="survey-num">Tools</h2>
          <p className="mt-3">{skillList.join(" · ")}</p>
        </section>
      </div>
    </main>
  );
}
