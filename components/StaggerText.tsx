"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { wind } from "@/lib/wind";

export function StaggerText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((glyph, index) => (
        <span
          key={`${glyph}-${index}`}
          aria-hidden="true"
          className="stagger-glyph inline-block whitespace-pre"
          style={{ animationDelay: `${index * 18}ms` }}
          ref={(node) => {
            if (!node) return;
            const x = index * 12;
            const n = wind.sample(x, 40);
            node.style.setProperty("--glyph-n", n.toFixed(3));
          }}
        >
          {glyph}
        </span>
      ))}
    </span>
  );
}
