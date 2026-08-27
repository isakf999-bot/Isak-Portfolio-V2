import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SurveyNav } from "@/components/survey/SurveyNav";
import { SurveyPlate } from "@/components/survey/SurveyPlate";
import { atlasLabel, getAtlas } from "@/lib/atlas";
import {
  adjacentProjects,
  getProject,
  projects,
} from "@/lib/content";

type Params = { slug: string };

const SECTIONS = [
  ["00", "Coordinates"],
  ["01", "The brief"],
  ["02", "The problem"],
  ["03", "The decision"],
  ["04", "The build"],
  ["05", "The result"],
] as const;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Survey — Isak Forsberg" };
  return {
    title: `${project.title} — Isak Forsberg`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const meta = getAtlas(project.slug);
  const { next } = adjacentProjects(project.slug);

  return (
    <main id="top" className="px-[var(--space-4)] pt-28 pb-24 lg:px-[var(--space-8)]">
      <SurveyPlate slug={project.slug}>
        <article className="mx-auto max-w-6xl">
          <p className="font-mono-legend" data-survey-rise style={{ ["--rise" as string]: 0 }}>
            <Link href="/work">Work</Link>
            {" / "}
            {atlasLabel[meta.atlas]} · {meta.terrain}
          </p>
          <h1
            className="type-h1 mt-5 max-w-[16ch]"
            style={{ ["--rise" as string]: 1 }}
            data-survey-rise
          >
            {project.title}
          </h1>
          <div data-survey-rule className="survey-rule" />
          <p
            className="measure mt-6 text-ink-60"
            style={{ fontSize: "var(--text-lead)", ["--rise" as string]: 2 }}
            data-survey-rise
          >
            {project.summary}
          </p>

          <section
            className="mt-16 border-t border-ink pt-8"
            data-survey-rise
            style={{ ["--rise" as string]: 3 }}
          >
            <h2 className="survey-num">00 Coordinates</h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <Item label="Client" value={meta.client} />
              <Item label="Role" value={project.role} />
              <Item label="Year" value={project.year} />
              <Item label="Stack" value={project.tags.join(" · ")} />
              <div>
                <dt className="font-mono-legend text-ink-60">Live</dt>
                <dd className="mt-2">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="OPEN ↗"
                    className="underline-offset-4 hover:underline"
                  >
                    Open site ↗
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <Survey kicker="01 The brief" body={meta.brief} rise={4} />
          <Survey kicker="02 The problem" body={project.problem} rise={5} />
          <Survey kicker="03 The decision" body={meta.decision} rise={6} />
          <section
            className="mt-14 border-t border-ink pt-8"
            data-survey-rise
            style={{ ["--rise" as string]: 7 }}
          >
            <h2 className="survey-num">04 The build</h2>
            <p className="measure mt-5 text-pretty leading-relaxed">{project.approach}</p>
            <ul className="mt-8 grid gap-px bg-ink sm:grid-cols-3">
              {project.highlights.map((item) => (
                <li key={item} className="bg-paper px-5 py-4" style={{ fontSize: "var(--text-sm)" }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <Survey kicker="05 The result" body={project.outcome} rise={8} />

          <p className="mt-16 font-mono-legend text-ink-60">
            {SECTIONS.map(([n, label]) => `${n} ${label}`).join(" · ")}
          </p>

          <SurveyNav slug={project.slug} next={next} />
        </article>
      </SurveyPlate>
    </main>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono-legend text-ink-60">{label}</dt>
      <dd className="mt-2" style={{ fontSize: "var(--text-sm)" }}>
        {value}
      </dd>
    </div>
  );
}

function Survey({
  kicker,
  body,
  rise,
}: {
  kicker: string;
  body: string;
  rise: number;
}) {
  return (
    <section
      className="mt-14 border-t border-ink pt-8"
      data-survey-rise
      style={{ ["--rise" as string]: rise }}
    >
      <h2 className="survey-num">{kicker}</h2>
      <p className="measure mt-5 text-pretty leading-relaxed">{body}</p>
    </section>
  );
}
