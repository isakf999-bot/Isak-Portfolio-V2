"use client";

import { useEffect } from "react";
import { wind, type GustListener } from "@/lib/wind";

export function useGust(cb: GustListener): void {
  useEffect(() => wind.onGust(cb), [cb]);
}
