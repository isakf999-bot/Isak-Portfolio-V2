"use client";

import { getDive, subscribeDive } from "@/lib/dive";
import { useEffect, useState, type ReactNode } from "react";

export function SurveyPlate({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [fromDive, setFromDive] = useState(() => {
    const dive = getDive();
    return (dive.mode === "in" || dive.mode === "adjacent") && dive.slug === slug;
  });
  const [live, setLive] = useState(() => {
    const dive = getDive();
    if ((dive.mode === "in" || dive.mode === "adjacent") && dive.slug === slug) {
      return dive.progress >= 0.95;
    }
    return true;
  });

  useEffect(() => {
    const sync = () => {
      const dive = getDive();
      const incoming =
        (dive.mode === "in" || dive.mode === "adjacent") && dive.slug === slug;
      if (incoming) {
        setFromDive(true);
        setLive(dive.progress >= 0.95 || dive.mode === "idle");
      } else if (dive.mode === "idle") {
        setLive(true);
      }
    };
    sync();
    return subscribeDive(sync);
  }, [slug]);

  return (
    <div
      data-survey-plate
      data-survey-from-dive={fromDive ? "" : undefined}
      data-survey-live={live ? "" : undefined}
    >
      {children}
    </div>
  );
}
