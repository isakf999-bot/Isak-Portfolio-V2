"use client";

import {
  getAtlasSnapshot,
  setAtlasFocus,
  setAtlasHover,
  subscribeAtlas,
} from "@/lib/atlas-store";
import { beginDiveIn } from "@/lib/dive";
import { webglAvailable } from "@/lib/globe";
import { formatCoords, territories } from "@/lib/territories";
import { wind } from "@/lib/wind";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AtlasRail() {
  const [atlas, setAtlas] = useState(getAtlasSnapshot);

  useEffect(() => subscribeAtlas(() => setAtlas(getAtlasSnapshot())), []);

  const list = territories.filter(
    (item) => atlas.filter === "all" || item.atlas === atlas.filter,
  );

  return (
    <ul
      className="border-t border-ink"
      data-atlas-rail
      aria-label="Territories"
    >
      {list.map((item, index) => {
        const active = atlas.hover === item.slug || atlas.focus === item.slug;
        return (
          <li
            key={item.slug}
            className="border-b border-ink"
            style={{ ["--i" as string]: index }}
          >
            <Link
              href={`/work/${item.slug}`}
              data-cursor="OPEN ↗"
              data-territory={item.slug}
              className={`block py-3 ${active ? "bg-ink text-paper" : ""}`}
              onMouseEnter={() => setAtlasHover(item.slug)}
              onMouseLeave={() => {
                if (getAtlasSnapshot().focus !== item.slug) setAtlasHover(null);
              }}
              onFocus={() => setAtlasFocus(item.slug)}
              onBlur={() => setAtlasFocus(null)}
              onClick={(event) => {
                if (
                  getAtlasSnapshot().view !== "globe" ||
                  !webglAvailable() ||
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
                  wind.reducedMotion()
                ) {
                  return;
                }
                event.preventDefault();
                beginDiveIn(item.slug);
              }}
            >
              <span className="font-mono-legend">
                {String(index + 1).padStart(2, "0")} {item.title}
              </span>
              <span className="mt-1 block font-mono-legend opacity-80">
                {item.year} · {formatCoords(item.lat, item.lon)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
