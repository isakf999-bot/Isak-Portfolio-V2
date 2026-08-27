"use client";

import { bindScrollScrub } from "@/lib/scroll-scrub";
import { useEffect, useRef } from "react";

export function DrawRule() {
  const ref = useRef<HTMLHRElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--rule-t", "1");
      return;
    }
    const track = el.closest("main");
    if (!(track instanceof HTMLElement)) return;
    return bindScrollScrub(track, (t) => {
      el.style.setProperty("--rule-t", t.toFixed(4));
    });
  }, []);

  return (
    <hr
      ref={ref}
      data-draw-rule
      className="draw-rule mt-10 border-0"
      aria-hidden="true"
    />
  );
}
