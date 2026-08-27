"use client";

import { useEffect, useRef, useState } from "react";
import { AtlasTease, Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";
import { wind } from "@/lib/wind";

export function HomeArrival() {
  const trackRef = useRef<HTMLDivElement>(null);
  const hold = useRef(0);
  const chroma = useRef(0);
  const [dissolve, setDissolve] = useState(0);
  const [grade, setGrade] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = trackRef.current;
    if (!track) return;

    const aim = (event: Event) => {
      if (reduce) return;
      const target = event.target;
      if (target instanceof Element && target.closest("a, button")) return;
      hold.current = 1;
    };
    const release = () => {
      hold.current = 0;
    };

    track.addEventListener("pointerdown", aim);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "KeyC" || event.repeat) return;
      if (reduce) return;
      hold.current = event.type === "keydown" ? 1 : 0;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const off = wind.subscribe(() => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const t = Math.min(1, Math.max(0, -rect.top / travel));
      const next = t <= 0.5 ? 0 : (t - 0.5) / 0.5;
      setDissolve((prev) => (Math.abs(prev - next) < 0.002 ? prev : next));
      chroma.current += (hold.current - chroma.current) * 0.14;
      const shown = reduce ? 0 : chroma.current;
      setGrade((prev) => (Math.abs(prev - shown) < 0.01 ? prev : shown));
    });

    return () => {
      off();
      track.removeEventListener("pointerdown", aim);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  return (
    <>
      <div
        ref={trackRef}
        className="relative h-[200svh]"
        data-home-arrival
        data-chroma={grade > 0.08 ? "live" : "ink"}
        style={{
          ["--dissolve" as string]: dissolve.toFixed(4),
          ["--chroma" as string]: grade.toFixed(4),
        }}
      >
        <div className="sticky top-0 h-svh overflow-hidden bg-paper">
          <HeroVideo dissolve={dissolve} />
          <Hero dissolve={dissolve} />
        </div>
      </div>
      <AtlasTease />
    </>
  );
}
