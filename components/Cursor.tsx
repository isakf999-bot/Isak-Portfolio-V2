"use client";

import { useEffect, useRef } from "react";
import { wind } from "@/lib/wind";

function affordance(target: EventTarget | null): string {
  if (!(target instanceof Element)) return "";
  const node = target.closest("[data-cursor]");
  if (node instanceof HTMLElement) return node.dataset.cursor ?? "";
  if (target.closest("a[href]")) return "OPEN ↗";
  if (target.closest("button, input, textarea, select")) return "USE";
  return "";
}

export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    document.body.dataset.cursor = "cross";
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let label = "";
    let settled = false;

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      settled = false;
      label = affordance(event.target);
      if (tag.current) tag.current.textContent = label;
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    const off = wind.subscribe((field) => {
      if (settled) return;
      const el = root.current;
      if (!el) return;
      const lerp = 0.22 + field.gustPhase * 0.13;
      cx += (x - cx) * lerp;
      cy += (y - cy) * lerp;
      if (Math.abs(x - cx) < 0.15 && Math.abs(y - cy) < 0.15) {
        cx = x;
        cy = y;
        settled = true;
      }
      const snap = label !== "";
      const px = snap ? Math.round(cx / 4) * 4 : cx;
      const py = snap ? Math.round(cy / 4) * 4 : cy;
      el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
    });

    return () => {
      delete document.body.dataset.cursor;
      window.removeEventListener("pointermove", onMove);
      off();
    };
  }, []);

  return (
    <div
      ref={root}
      className="crosshair pointer-events-none fixed top-0 left-0 z-[10000]"
      aria-hidden="true"
    >
      <span className="absolute top-0 left-0 h-px w-[6px] -translate-x-1/2 bg-ink" />
      <span className="absolute top-0 left-0 h-px w-[6px] -translate-y-1/2 rotate-90 bg-ink" />
      <span
        ref={tag}
        className="font-mono-legend absolute top-3 left-3 whitespace-nowrap text-ink"
      />
    </div>
  );
}
