"use client";

import type { ReactNode } from "react";

/** Native scroll — Lenis was keeping a permanent rAF loop on every route. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return children;
}
