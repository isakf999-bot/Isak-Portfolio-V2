"use client";

import { atlasLabel } from "@/lib/atlas";
import { getAtlasSnapshot, subscribeAtlas } from "@/lib/atlas-store";
import { getProject } from "@/lib/content";
import { globeInstrument } from "@/lib/globe-instrument";
import { territories } from "@/lib/territories";
import { useEffect, useState } from "react";

export function GlobeHud() {
  const [slug, setSlug] = useState<string | null>(getAtlasSnapshot().hover);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const sync = () => {
      const snap = getAtlasSnapshot();
      const next = snap.hover ?? snap.focus;
      setSlug(next);
      setConfirm(Boolean(next && globeInstrument.confirmSlug === next));
    };
    const off = subscribeAtlas(sync);
    const id = window.setInterval(sync, 32);
    return () => {
      off();
      window.clearInterval(id);
    };
  }, []);

  const item = territories.find((entry) => entry.slug === slug);
  if (!item) return null;
  const project = getProject(item.slug);
  if (!project) return null;
  const index = String(item.index + 1).padStart(2, "0");
  const line = project.summary.replace(/\s+/g, " ").trim();
  const one = line.length > 72 ? `${line.slice(0, 69)}…` : line;

  return (
    <aside data-globe-hud className="globe-hud pointer-events-none" aria-live="polite">
      <div className="globe-hud-thumb" aria-hidden="true">
        <span>{item.title.slice(0, 2).toUpperCase()}</span>
      </div>
      <p className="type-kicker">
        {index} / {item.title}
      </p>
      <p className="type-h3 mt-1">{item.title}</p>
      <p className="font-mono-legend mt-2 text-ink-60">
        {item.year} · {atlasLabel[item.atlas]} · {project.tags.slice(0, 2).join(", ")}
      </p>
      <p className="mt-2" style={{ fontSize: "var(--text-sm)" }}>
        {one}
      </p>
      <p className={`type-kicker mt-3 inline-block ${confirm ? "bg-ink px-2 py-1 text-paper" : ""}`}>
        ENTER ↗
      </p>
    </aside>
  );
}
