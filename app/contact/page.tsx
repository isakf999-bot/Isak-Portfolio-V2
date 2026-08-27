import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { CopyMail } from "@/components/CopyMail";
import { PageHead } from "@/components/PageHead";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — Isak Forsberg",
  description: "Write to Isak Forsberg about a site, UI, or collaboration.",
};

export default function ContactPage() {
  return (
    <main id="top">
      <PageHead
        index="05"
        label="CONTACT"
        title={
          <a href={`mailto:${profile.email}`} data-cursor="COPY">
            {profile.email}
          </a>
        }
      />
      <div className="px-[var(--gutter)] pb-24 lg:px-[var(--space-8)]">
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
          <aside className="flex flex-col gap-8 lg:max-w-sm lg:pt-1">
            <div>
              <CopyMail email={profile.email} />
              <p className="type-lead mt-6 text-ink-60">
                Sites, React UI, APIs, Figma-to-code, polish. If you have a
                project, write — I answer.
              </p>
            </div>

            <div className="border-t border-ink pt-8">
              <p className="font-mono-legend">{profile.availability}</p>
              <p className="mt-5">
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="font-mono-legend"
                >
                  {profile.phone}
                </a>
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                {[
                  ["GitHub", profile.github],
                  ["LinkedIn", profile.linkedin],
                  ["Instagram", profile.instagram],
                  ["X", profile.x],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono-legend"
                    >
                      {label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}
