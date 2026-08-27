"use client";

import { useEffect, useRef } from "react";

export function Grain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      el.dataset.paused = document.visibilityState === "hidden" ? "true" : "false";
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return <div ref={ref} className="grain" aria-hidden="true" />;
}
