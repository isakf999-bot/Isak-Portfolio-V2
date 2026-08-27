"use client";

import { formatCoords, territories } from "@/lib/territories";

export function GlobeLabel({ slug }: { slug: string }) {
  const item = territories.find((entry) => entry.slug === slug);
  if (!item) return null;

  return (
    <div
      className="pointer-events-none absolute top-3 right-3 max-w-[18rem] border border-ink bg-paper px-3 py-2"
      data-globe-label
    >
      <p className="font-mono-legend">
        {item.title} · {item.year}
      </p>
      <p className="font-mono-legend mt-1">{formatCoords(item.lat, item.lon)}</p>
    </div>
  );
}
