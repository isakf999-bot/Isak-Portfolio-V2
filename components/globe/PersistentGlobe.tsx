"use client";

import { GlobeHud } from "@/components/globe/GlobeHud";
import { GlobeScene } from "@/components/globe/GlobeScene";
import {
  getAtlasSnapshot,
  subscribeAtlas,
  type AtlasSnapshot,
} from "@/lib/atlas-store";
import { currentDivePose, getDive, subscribeDive } from "@/lib/dive";
import { globeDetail, webglAvailable } from "@/lib/globe";
import { probeGlobeDom, globePointerDown, globePointerMove, globePointerUp } from "@/lib/globe-instrument";
import { territories } from "@/lib/territories";
import { wind } from "@/lib/wind";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Box = { left: number; top: number; width: number; height: number };

function sameBox(a: Box | null, b: Box): boolean {
  if (!a) return false;
  return (
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function PersistentGlobe() {
  const pathname = usePathname();
  const [box, setBox] = useState<Box | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [detail, setDetail] = useState<5 | 6 | 7>(6);
  const [ok, setOk] = useState(true);
  const [fail, setFail] = useState("");
  const [atlas, setAtlas] = useState<AtlasSnapshot>(getAtlasSnapshot);
  const [cover, setCover] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [live, setLive] = useState(false);
  const boxRef = useRef<Box | null>(null);
  const okRef = useRef(ok);
  const viewRef = useRef(atlas.view);
  boxRef.current = box;
  okRef.current = ok;
  viewRef.current = atlas.view;

  useEffect(() => {
    setOk(webglAvailable());
    return subscribeAtlas(() => setAtlas(getAtlasSnapshot()));
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const sync = () => {
      setReduce(motion.matches);
      setDetail(globeDetail(window.innerWidth, coarse.matches));
    };
    sync();
    motion.addEventListener("change", sync);
    coarse.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      motion.removeEventListener("change", sync);
      coarse.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    let dirty = true;
    const mark = () => {
      dirty = true;
    };
    window.addEventListener("scroll", mark, { passive: true, capture: true });
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("resize", mark);
    const offDive = subscribeDive(mark);
    const offAtlas = subscribeAtlas(mark);

    const tick = () => {
      const dive = getDive();
      const pose = currentDivePose();
      const diving = dive.mode !== "idle";
      const hold = Boolean(dive.slug) && dive.mode === "idle";
      if (!dirty && !diving) return;
      dirty = diving;

      const slot = document.querySelector("[data-globe-slot]");
      const full = {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let slotBox: Box | null = null;
      let onscreen = false;
      if (slot instanceof HTMLElement) {
        const rect = slot.getBoundingClientRect();
        slotBox = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
        onscreen =
          rect.width > 8 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight &&
          rect.right > 0 &&
          rect.left < window.innerWidth;
      }

      let nextBox = slotBox;
      let expand = 0;
      if (dive.mode === "in") {
        expand = Math.min(1, dive.progress / (0.35 / 1.6));
      } else if (dive.mode === "out") {
        expand = 1 - Math.max(0, (dive.progress - 1.25 / 1.6) / (0.35 / 1.6));
      } else if (dive.mode === "adjacent" || hold) {
        expand = 1;
      }

      if (diving || hold) {
        const from = slotBox ?? boxRef.current ?? full;
        nextBox = {
          left: lerp(from.left, full.left, expand),
          top: lerp(from.top, full.top, expand),
          width: lerp(from.width, full.width, expand),
          height: lerp(from.height, full.height, expand),
        };
      }

      if (nextBox) {
        setBox((prev) => (sameBox(prev, nextBox) ? prev : nextBox));
      }

      const showGlobe = onscreen && okRef.current && viewRef.current === "globe";
      const nextVisible = showGlobe || diving || hold;
      setVisible((prev) => (prev === nextVisible ? prev : nextVisible));
      setCover((prev) => (prev === (diving || hold) ? prev : diving || hold));
      const nextOpacity = diving || hold ? 1 - pose.handoff : showGlobe ? 1 : 0;
      setOpacity((prev) =>
        Math.abs(prev - nextOpacity) < 0.01 ? prev : nextOpacity,
      );
      setLive((prev) => (prev === diving ? prev : diving));

      document.documentElement.dataset.globe =
        nextVisible &&
        okRef.current &&
        (viewRef.current === "globe" || diving || hold)
          ? "live"
          : "idle";
    };

    const offWind = wind.subscribe(() => {
      tick();
      const node = document.querySelector("[data-globe-canvas]");
      if (node instanceof HTMLElement) probeGlobeDom(node);
    });
    return () => {
      offWind();
      offDive();
      offAtlas();
      window.removeEventListener("scroll", mark, { capture: true });
      window.removeEventListener("wheel", mark);
      window.removeEventListener("resize", mark);
      delete document.documentElement.dataset.globe;
    };
  }, [pathname]);

  if (!ok) {
    return fail ? (
      <div className="fixed inset-x-0 top-16 z-[80] border-y border-ink bg-paper px-4 py-3 font-mono-legend">
        Shader failed. {fail}
      </div>
    ) : null;
  }

  if (!box) return null;

  const show = visible && (atlas.view === "globe" || cover);
  const interactive =
    pathname === "/work" && !cover && atlas.view === "globe";
  const hover = atlas.hover ?? atlas.focus;

  return (
    <>
      {fail ? (
        <div className="fixed inset-x-0 top-16 z-[80] border-y border-ink bg-paper px-4 py-3 font-mono-legend">
          Shader failed. {fail}
        </div>
      ) : null}
      <div
        data-globe-canvas
        aria-hidden="true"
        className="fixed overflow-hidden bg-paper"
        style={{
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          opacity,
          zIndex: cover ? 60 : 20,
          pointerEvents: interactive ? "auto" : "none",
        }}
        onPointerDown={(event) => globePointerDown(event.nativeEvent)}
        onPointerMove={(event) => globePointerMove(event.nativeEvent)}
        onPointerUp={(event) => globePointerUp(event.nativeEvent)}
      >
        <GlobeScene
          detail={detail}
          reduce={reduce}
          active={(show && !cover) || live}
          interactive={interactive}
          onFail={(log) => {
            setFail(log);
            setOk(false);
          }}
        />
        <div className="globe-limb" aria-hidden="true" />
        <ul className="sr-only">
          {territories.map((item) => (
            <li key={item.slug} data-globe-caption>
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      {interactive && hover ? <GlobeHud /> : null}
    </>
  );
}
