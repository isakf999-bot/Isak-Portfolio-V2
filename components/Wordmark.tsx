"use client";

import { useRef } from "react";
import { useFitText } from "@/lib/useFitText";

export function Wordmark() {
  const ref = useRef<HTMLHeadingElement>(null);
  useFitText(ref);

  return (
    <h1 ref={ref} className="hero-name-ink type-wordmark mt-[var(--space-3)]">
      Isak
    </h1>
  );
}
