"use client";

import { usePathname } from "next/navigation";
import { folio } from "@/lib/plate";

export function Folio() {
  const path = usePathname();
  return (
    <p className="folio" data-folio aria-hidden="true">
      {folio(path)}
    </p>
  );
}
