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
}: {
  index: string;
  label: string;
  title: ReactNode;
}) {
  const heading = typeof title === "string" ? hangLast(title) : title;

  return (
    <header className="page-head relative px-[var(--gutter)] lg:px-[var(--space-8)]">
      <PlateCoords />
      <p className="type-kicker flex items-center gap-4">
        <span>
          {index} / {label}
        </span>
        <span className="page-kicker-rule" aria-hidden="true" />
      </p>
      <h1 className="type-h1 mt-[var(--space-4)] max-w-[18ch]">{heading}</h1>
    </header>
  );
}
