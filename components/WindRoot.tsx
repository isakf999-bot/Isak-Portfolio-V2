"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { bindWindEnvironment, wind } from "@/lib/wind";

function writeStatic() {
  const root = document.documentElement;
  root.style.setProperty("--wind-strength", "0.35");
  root.style.setProperty("--wind-gust", "0");
  root.style.setProperty("--wind-x", "1");
  root.style.setProperty("--wind-y", "0");
  root.style.setProperty("--wind-time", "0");
}

export function WindRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const setDpr = () => {
      root.style.setProperty("--dpr", String(window.devicePixelRatio || 1));
    };
    setDpr();
    window.addEventListener("resize", setDpr);
    const unbind = bindWindEnvironment();

    // Keep the wind clock only on the home arrival scrub — elsewhere it's free CPU.
    if (pathname !== "/") {
      writeStatic();
      return () => {
        unbind();
        window.removeEventListener("resize", setDpr);
      };
    }

    let s = -1;
    let g = -1;
    let x = -1;
    let y = -1;
    let t = -1;
    const off = wind.subscribe((field) => {
      if (
        Math.abs(field.strength - s) < 0.004 &&
        Math.abs(field.gustPhase - g) < 0.004 &&
        Math.abs(field.direction[0] - x) < 0.01 &&
        Math.abs(field.direction[1] - y) < 0.01 &&
        Math.abs(field.time - t) < 0.05
      ) {
        return;
      }
      s = field.strength;
      g = field.gustPhase;
      x = field.direction[0];
      y = field.direction[1];
      t = field.time;
      root.style.setProperty("--wind-strength", s.toFixed(3));
      root.style.setProperty("--wind-gust", g.toFixed(3));
      root.style.setProperty("--wind-x", x.toFixed(3));
      root.style.setProperty("--wind-y", y.toFixed(3));
      root.style.setProperty("--wind-time", t.toFixed(2));
    });

    return () => {
      off();
      unbind();
      window.removeEventListener("resize", setDpr);
    };
  }, [pathname]);

  return null;
}
