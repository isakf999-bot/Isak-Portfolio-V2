import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { listNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Write — Isak Forsberg",
  description: "Notes on craft, finishing, and maps instead of lists.",
};

export default async function WritePage() {
  const notes = await listNotes();
  const [lead, ...rest] = notes;

  return (
    <main id="top">
      <PageHead
        index="06"
        label="WRITE"
        title={
          lead ? <Link href={`/write/${lead.slug}`}>{lead.title}</Link> : "Notes."
        }
      />
      <div className="px-[var(--gutter)] pb-24 lg:px-[var(--space-8)]">
        {lead ? (
          <article className="border-b border-ink pb-12">
            <p className="font-mono-legend">
              {lead.date} · {lead.minutes} min
            </p>
            <p className="type-lead measure mt-5">{lead.lede}</p>
          </article>
        ) : null}
        <ul>
          {rest.map((note) => (
            <li key={note.slug} className="border-b border-ink">
              <Link
                href={`/write/${note.slug}`}
                className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr]"
              >
                <span className="font-mono-legend">
                  {note.date} · {note.minutes}m
                </span>
                <span>
                  <span className="block font-medium">{note.title}</span>
                  <span className="mt-1 block text-ink-60" style={{ fontSize: "var(--text-sm)" }}>
                    {note.lede}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
