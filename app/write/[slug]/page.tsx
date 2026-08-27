import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNote, noteSlugs } from "@/lib/notes";

type Params = { slug: string };

export function generateStaticParams() {
  return noteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) return { title: "Note — Isak Forsberg" };
  return { title: `${note.meta.title} — Isak Forsberg`, description: note.meta.lede };
}

export default async function NotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();

  return (
    <main id="top" className="px-[var(--space-4)] pt-28 pb-24 lg:px-[var(--space-8)]">
      <article className="mx-auto max-w-6xl">
        <p className="font-mono-legend">
          <Link href="/write">Write</Link> / {note.meta.date} · {note.meta.minutes} min read
        </p>
        <h1 className="type-h1 measure mt-5">{note.meta.title}</h1>
        <p className="type-lead measure mt-6 text-ink-60">{note.meta.lede}</p>
        <div className="measure mt-10">{note.content}</div>
      </article>
    </main>
  );
}
