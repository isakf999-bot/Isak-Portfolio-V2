"use client";

import { usePathname } from "next/navigation";
import { runningHead } from "@/lib/plate";

export function RunningHead() {
  const path = usePathname();
  return (
    <p className="running-head" data-running-head>
      {runningHead(path)}
    </p>
  );
}
