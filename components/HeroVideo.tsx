"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mapWindToRate, shouldSkipHeroVideo } from "@/lib/hero-video";
import { wind } from "@/lib/wind";

const CROSSFADE_MS = 400;
const POSTER_DELAY_MS = 600;

function ForestSources() {
  return (
    <>
      <source
        src="/media/hero-forest.webm"
        type='video/webm; codecs="av01.0.05M.08"'
      />
      <source src="/media/hero-forest.mp4" type="video/mp4" />
    </>
  );
}

export function HeroVideo({ dissolve }: { dissolve: number }) {
  const plateRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const rateRef = useRef(1);
  const swapping = useRef(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [blend, setBlend] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || shouldSkipHeroVideo()) return;

    const plate = plateRef.current;
    if (!plate) return;

    let cancelled = false;
    let delay: number | undefined;
    let idle: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || cancelled) return;
        observer.disconnect();
        const start = () => {
          if (!cancelled) setLoadVideo(true);
        };
        delay = window.setTimeout(start, POSTER_DELAY_MS);
        idle =
          "requestIdleCallback" in window
            ? window.requestIdleCallback(start, { timeout: 1000 })
            : undefined;
      },
      { threshold: 0.2 },
    );

    observer.observe(plate);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (delay != null) window.clearTimeout(delay);
      if (idle != null) window.cancelIdleCallback(idle);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !loadVideo || reduceMotion) return;

    const arm = (video: HTMLVideoElement) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
    };

    arm(a);
    if (b) arm(b);

    const tryPlay = (video: HTMLVideoElement) => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setShowVideo(true)).catch(() => undefined);
      }
    };

    const onPlaying = () => setShowVideo(true);
    const onInteract = () => tryPlay(a);
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay(a);
    };

    a.addEventListener("playing", onPlaying);
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });
    window.addEventListener("click", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });
    document.addEventListener("visibilitychange", onVisible);

    a.load();
    if (b) b.load();
    tryPlay(a);

    const retry = window.setTimeout(() => tryPlay(a), 2000);

    return () => {
      window.clearTimeout(retry);
      a.removeEventListener("playing", onPlaying);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("click", onInteract);
      window.removeEventListener("keydown", onInteract);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadVideo, reduceMotion]);

  useEffect(() => {
    if (!loadVideo || reduceMotion) return;

    const off = wind.subscribe((field) => {
      const target = mapWindToRate(field.strength, field.gustPhase);
      rateRef.current += (target - rateRef.current) * 0.12;
      const rate = rateRef.current;
      if (aRef.current) aRef.current.playbackRate = rate;
      if (bRef.current) bRef.current.playbackRate = rate;
    });

    return off;
  }, [loadVideo, reduceMotion]);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b || !loadVideo || reduceMotion) return;

    const swapFrom = (from: HTMLVideoElement, to: HTMLVideoElement, towardB: boolean) => {
      if (swapping.current || !from.duration) return;
      if (from.duration - from.currentTime > CROSSFADE_MS / 1000 + 0.05) return;

      swapping.current = true;
      to.currentTime = 0;
      to.playbackRate = rateRef.current;
      const playNext = to.play();
      if (playNext !== undefined) {
        playNext.catch(() => {
          from.loop = true;
          swapping.current = false;
          void from.play();
        });
      }

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / CROSSFADE_MS);
        setBlend(towardB ? t : 1 - t);
        if (t < 1) {
          window.requestAnimationFrame(tick);
          return;
        }
        from.pause();
        from.currentTime = 0;
        swapping.current = false;
      };
      window.requestAnimationFrame(tick);
    };

    const onA = () => swapFrom(a, b, true);
    const onB = () => swapFrom(b, a, false);
    a.addEventListener("timeupdate", onA);
    b.addEventListener("timeupdate", onB);

    return () => {
      a.removeEventListener("timeupdate", onA);
      b.removeEventListener("timeupdate", onB);
    };
  }, [loadVideo, reduceMotion]);

  const videoClass = "hero-grade absolute inset-0 h-full w-full object-cover";

  return (
    <div
      ref={plateRef}
      className="hero-plate pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-hero-video
      style={{ ["--dissolve" as string]: dissolve.toFixed(4) }}
    >
      <Image
        src="/media/hero-forest-poster.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-grade object-cover"
      />

      {loadVideo && !reduceMotion ? (
        <>
          <video
            ref={aRef}
            className={videoClass}
            style={{ opacity: showVideo ? 1 - blend : 0 }}
            autoPlay
            muted
            playsInline
            preload="none"
            poster="/media/hero-forest-poster.jpg"
            data-hero-loop="a"
          >
            <ForestSources />
          </video>
          <video
            ref={bRef}
            className={videoClass}
            style={{ opacity: showVideo ? blend : 0 }}
            muted
            playsInline
            preload="none"
            data-hero-loop="b"
          >
            <ForestSources />
          </video>
        </>
      ) : null}

      <div className="hero-wash" />
      <div className="hero-dither-break" />
      <div className="hero-paper-wipe" />
    </div>
  );
}
