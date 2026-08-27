"use client";

import { Folio } from "@/components/Folio";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { RouteShell } from "@/components/RouteShell";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/specimen") {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <Folio />
      <RouteShell>{children}</RouteShell>
      <Footer />
    </>
  );
}
