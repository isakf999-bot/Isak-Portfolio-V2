"use client";

import { webglAvailable } from "@/lib/globe";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(
  () => import("@/components/signal/WaveformScene").then((mod) => mod.WaveformScene),
  { ssr: false },
);

export function Waveform({ text }: { text: string }) {
  const [ok, setOk] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setOk(webglAvailable());
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  if (!ok) return null;

  return (
    <div
      data-waveform
      className="mb-8 h-36 overflow-hidden border border-ink bg-paper"
      aria-hidden="true"
    >
      <Scene
        text={text}
        reduce={reduce}
        onFail={() => setOk(false)}
      />
    </div>
  );
}
