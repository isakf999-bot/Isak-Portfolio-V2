"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { atlasLabel, getAtlas, type AtlasClass } from "@/lib/atlas";
import { projects } from "@/lib/content";

type Filter = "all" | AtlasClass;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commerce", label: "Commerce" },
  { id: "systems", label: "Systems" },
  { id: "landing", label: "Landing" },
];

export function WorkIndex() {
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter(
      (project) => getAtlas(project.slug).atlas === filter,
    );
  }, [filter]);

  return (
    <div data-atlas-desk>
      <p className="font-mono-legend" data-atlas-legend>
        {FILTERS.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? " · " : null}
            <button
              type="button"
              className={`font-mono-legend ${
                filter === item.id ? "underline" : ""
              }`}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          </span>
        ))}
      </p>
      <ul className="mt-12 border-y border-ink" data-work-index>
        {list.map((project, index) => {
          const meta = getAtlas(project.slug);
          return (
            <li
              key={project.slug}
              className="border-b border-ink last:border-b-0"
            >
              <Link
                href={`/work/${project.slug}`}
                className="group grid gap-3 py-7 sm:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1.4fr)_auto] sm:items-baseline"
              >
                <span className="font-mono-legend">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2
                  className="font-medium tracking-tight"
                  style={{ fontSize: "var(--text-h3)" }}
                >
                  {project.title}
                </h2>
                <p className="text-ink-60" style={{ fontSize: "var(--text-sm)" }}>
                  {project.summary}
                </p>
                <span className="font-mono-legend">
                  {atlasLabel[meta.atlas]} · {project.year}{" "}
                  <span className="inline-block transition-transform duration-[280ms] ease-[var(--ease-wind)] group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
