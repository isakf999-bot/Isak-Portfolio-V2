"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function RouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const first = useRef(true);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setAnim(true);
    const heading = document.querySelector("main h1");
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    const id = window.setTimeout(() => setAnim(false), 700);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <div className={anim ? "route-enter" : undefined}>{children}</div>;
}
