"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __toggleGrid?: () => void;
  }
}

export function GridOverlay() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const toggle = () => setOn((value) => !value);
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key !== "g") return;
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.repeat) return;
      event.preventDefault();
      toggle();
    };
    window.__toggleGrid = toggle;
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      delete window.__toggleGrid;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.grid = on ? "on" : "off";
  }, [on]);

  if (!on) return null;

  return <div className="grid-overlay" data-grid-overlay aria-hidden="true" />;
}
