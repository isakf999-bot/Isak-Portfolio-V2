"use client";

import { bindScrollScrub } from "@/lib/scroll-scrub";
import { STRATA_MONTHS, strata } from "@/lib/strata";
import { webglAvailable } from "@/lib/globe";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Scene = dynamic(
  () => import("@/components/strata/StrataScene").then((mod) => mod.StrataScene),
  { ssr: false },
);

function Details({ index }: { index: number }) {
  const item = strata[index] ?? strata[strata.length - 1];
  return (
    <div data-strata-details>
      <p className="font-mono-legend">
        {item.dates} · {item.months} mo · {item.kind}
      </p>
      <h2
        className="mt-3 font-medium tracking-tight"
        style={{ fontSize: "var(--text-h3)" }}
      >
        {item.org}
      </h2>
      <p className="mt-1" style={{ fontSize: "var(--text-sm)" }}>
        {item.title}
      </p>
      <p className="measure mt-4 text-ink-60 leading-relaxed">{item.body}</p>
      {item.notes ? (
        <ul className="mt-5 space-y-2">
          {item.notes.map((note) => (
            <li key={note} className="flex gap-3" style={{ fontSize: "var(--text-sm)" }}>
              <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-ink" />
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function StrataDesk() {
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(strata.length - 1);
  const [ok, setOk] = useState(true);
  const [fail, setFail] = useState("");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setOk(webglAvailable());
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    const el = track.current;
    const off = el
      ? bindScrollScrub(el, (t) => {
          progress.current = t;
        })
      : undefined;
    return () => {
      motion.removeEventListener("change", sync);
      off?.();
    };
  }, []);

  const ticks = [
    { label: "Jan 2026", t: 0 },
    { label: "Jun 2026", t: 6 / STRATA_MONTHS },
    { label: "Aug 2026", t: 8 / STRATA_MONTHS },
    { label: "Dec 2026", t: 1 },
  ];

  if (!ok) {
    return (
      <div className="px-[var(--gutter)] pb-24 pt-10 lg:px-[var(--space-8)]">
        {fail ? (
          <p className="font-mono-legend border border-ink px-4 py-3">
            Shader failed. {fail}
          </p>
        ) : null}
        <ol className="mt-8 border-t border-ink">
          {[...strata].reverse().map((item) => (
            <li key={item.id} className="border-b border-ink py-8">
              <p className="font-mono-legend">
                {item.dates} · {item.months} mo
              </p>
              <h2 className="mt-3 font-medium" style={{ fontSize: "var(--text-h3)" }}>
                {item.org}
              </h2>
              <p className="mt-1" style={{ fontSize: "var(--text-sm)" }}>
                {item.title}
              </p>
              <p className="measure mt-4 text-ink-60 leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div
      ref={track}
      data-strata-track
      className="relative mt-8 pl-20 lg:mt-10 lg:pl-24"
      style={{ height: `${120 + STRATA_MONTHS * 12}vh` }}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-ink"
        aria-hidden="true"
      />
      {ticks.map((tick) => (
        <p
          key={tick.label}
          className="absolute left-3 font-mono-legend"
          style={{ bottom: `${tick.t * 100}%` }}
        >
          {tick.label}
        </p>
      ))}

      <div className="sticky top-[3.25rem] grid h-[calc(100svh-3.25rem)] items-stretch gap-6 px-[var(--gutter)] py-6 lg:top-[4.25rem] lg:h-[calc(100svh-4.25rem)] lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-[var(--space-8)]">
        <div
          data-strata-column
          className="relative min-h-0 overflow-hidden border border-ink bg-paper"
          aria-hidden="true"
        >
          <Scene
            progress={progress}
            reduce={reduce}
            onActive={setActive}
            onFail={(log) => {
              setFail(log);
              setOk(false);
            }}
          />
        </div>
        <div className="min-h-0 overflow-auto">
          <Details index={active} />
        </div>
      </div>

      <ol className="sr-only">
        {[...strata].reverse().map((item) => (
          <li key={item.id}>
            {item.org} — {item.title}. {item.dates}. {item.body}
          </li>
        ))}
      </ol>
    </div>
  );
}
