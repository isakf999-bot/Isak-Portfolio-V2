import Link from "next/link";

export function SurveyNav({
  slug,
  next,
}: {
  slug: string;
  next?: { slug: string; title: string };
}) {
  return (
    <div className="mt-10 flex justify-between border-t border-ink pt-8">
      <Link href="/work" className="font-mono-legend">
        ← Work
      </Link>
      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="font-mono-legend"
          data-next-survey
        >
          Next · {next.title} →
        </Link>
      ) : (
        <span className="font-mono-legend text-ink-40">{slug}</span>
      )}
    </div>
  );
}
