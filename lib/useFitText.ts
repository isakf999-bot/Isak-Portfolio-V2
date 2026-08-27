"use client";

import { useEffect, type RefObject } from "react";

export function useFitText(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      el.style.setProperty("--fit", "1");
      const width = el.clientWidth;
      if (width < 8) return;
      const overflow = el.scrollWidth / width;
      if (overflow > 1.01) {
        el.style.setProperty("--fit", (1 / overflow).toFixed(4));
      }
    };

    let cancelled = false;
    const run = () => {
      if (!cancelled) fit();
    };
    void document.fonts.ready.then(run);
    window.addEventListener("resize", run);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", run);
    };
  }, [ref]);
}
