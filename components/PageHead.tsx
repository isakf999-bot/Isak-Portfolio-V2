import type { ReactNode } from "react";
import { PlateCoords } from "@/components/PlateCoords";

function hangLast(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return title;
  return `${words.slice(0, -1).join(" ")}\u00A0${words[words.length - 1]}`;
}

export function PageHead({
  index,
  label,
  title,
  align = "start",
}: {
  index: string;
  label: string;
  title: ReactNode;
  align?: "start" | "center";
}) {
  const heading = typeof title === "string" ? hangLast(title) : title;
  const centered = align === "center";

  return (
    <header
      className={`page-head relative px-[var(--gutter)] lg:px-[var(--space-8)] ${
        centered ? "text-center" : ""
      }`}
    >
      <PlateCoords />
      <p
        className={`type-kicker flex items-center gap-4 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span>
          {index} / {label}
        </span>
        {!centered ? (
          <span className="page-kicker-rule" aria-hidden="true" />
        ) : null}
      </p>
      <h1
        className={`type-h1 mt-[var(--space-4)] max-w-[18ch] ${
          centered ? "mx-auto" : ""
        }`}
      >
        {heading}
      </h1>
    </header>
  );
}
