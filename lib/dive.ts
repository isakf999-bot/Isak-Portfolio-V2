import { wind } from "@/lib/wind";

export const DIVE_DURATION = 1.6;
const PUSH_AT = 0.95 / DIVE_DURATION;

export type DiveMode = "idle" | "in" | "out" | "adjacent";

export type DiveSnapshot = {
  mode: DiveMode;
  slug: string | null;
  fromSlug: string | null;
  progress: number;
  pushed: boolean;
};

export type DivePose = {
  fly: number;
  unroll: number;
  handoff: number;
  contour: number;
  isolate: number;
  hold: boolean;
};

type DiveInternal = DiveSnapshot & { t0: number };

const listeners = new Set<() => void>();

let state: DiveInternal = {
  mode: "idle",
  slug: null,
  fromSlug: null,
  progress: 0,
  pushed: false,
  t0: 0,
};

function emit() {
  listeners.forEach((listener) => listener());
}

export function getDive(): DiveSnapshot {
  return state;
}

export function subscribeDive(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function reduced(): boolean {
  return wind.reducedMotion();
}

function start(next: Omit<DiveInternal, "t0">) {
  state = { ...next, t0: wind.time };
  emit();
}

export function beginDiveIn(slug: string) {
  if (state.mode !== "idle") return;
  if (reduced()) {
    start({
      mode: "in",
      slug,
      fromSlug: null,
      progress: 1,
      pushed: false,
    });
    return;
  }
  wind.gust();
  start({
    mode: "in",
    slug,
    fromSlug: null,
    progress: 0,
    pushed: false,
  });
}

export function beginDiveOut(slug: string) {
  if (state.mode !== "idle") return;
  if (reduced()) {
    start({
      mode: "out",
      slug,
      fromSlug: slug,
      progress: 1,
      pushed: false,
    });
    return;
  }
  wind.gust();
  start({
    mode: "out",
    slug,
    fromSlug: slug,
    progress: 0,
    pushed: false,
  });
}

export function beginAdjacent(fromSlug: string, toSlug: string) {
  if (state.mode !== "idle") return;
  if (reduced()) {
    start({
      mode: "adjacent",
      slug: toSlug,
      fromSlug,
      progress: 1,
      pushed: false,
    });
    return;
  }
  wind.gust();
  start({
    mode: "adjacent",
    slug: toSlug,
    fromSlug,
    progress: 0,
    pushed: false,
  });
}

export function markDivePushed() {
  if (state.pushed) return;
  state = { ...state, pushed: true };
  emit();
}

export function endDive() {
  if (state.mode === "idle") return;
  const holdSlug =
    state.mode === "in" || state.mode === "adjacent" ? state.slug : null;
  state = {
    mode: "idle",
    slug: holdSlug,
    fromSlug: null,
    progress: 1,
    pushed: true,
    t0: wind.time,
  };
  emit();
}

export function clearDiveHold() {
  if (state.mode !== "idle" || !state.slug) return;
  state = {
    mode: "idle",
    slug: null,
    fromSlug: null,
    progress: 0,
    pushed: true,
    t0: wind.time,
  };
  emit();
}

export function cubicBezierEase(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 8; i += 1) {
    const xt =
      3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
    const dx =
      3 * (1 - t) * (1 - t) * x1 +
      6 * (1 - t) * t * (x2 - x1) +
      3 * t * t * (1 - x2);
    if (Math.abs(dx) < 1e-6) break;
    t = Math.min(1, Math.max(0, t - (xt - x) / dx));
  }
  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
}

export function easeGust(t: number): number {
  return cubicBezierEase(0.87, 0, 0.13, 1, t);
}

export function diveWeights(progress: number, mode: DiveMode) {
  const p = Math.min(1, Math.max(0, progress));
  if (mode === "out") {
    return {
      fly: easeGust(p),
      unroll: 1 - smooth(p, 0.4 / DIVE_DURATION, 1.05 / DIVE_DURATION),
      handoff: 1 - smooth(p, 0.0, 0.35 / DIVE_DURATION),
      contour: mix(4, 1, easeGust(p)),
      isolate: 1 - p,
    };
  }
  if (mode === "adjacent") {
    return {
      fly: easeGust(p),
      unroll: 1 - 0.72 * Math.sin(p * Math.PI),
      handoff: p > 0.58 ? smooth(p, 0.58, 1) : 0,
      contour: mix(4, 2.2, Math.abs(p - 0.5) * 2),
      isolate: 1,
    };
  }
  return {
    fly: smooth(p, 0.1 / DIVE_DURATION, 0.9 / DIVE_DURATION),
    unroll: smooth(p, 0.55 / DIVE_DURATION, 1.2 / DIVE_DURATION),
    handoff: smooth(p, 0.95 / DIVE_DURATION, 1),
    contour: mix(1, 4, smooth(p, 0.1 / DIVE_DURATION, 0.9 / DIVE_DURATION)),
    isolate: 1,
  };
}

export function currentDivePose(): DivePose {
  const dive = state;
  if (dive.mode === "idle" && dive.slug) {
    return {
      fly: 1,
      unroll: 1,
      handoff: 1,
      contour: 4,
      isolate: 1,
      hold: true,
    };
  }
  if (dive.mode === "idle") {
    return {
      fly: 0,
      unroll: 0,
      handoff: 0,
      contour: 1,
      isolate: 0,
      hold: false,
    };
  }
  return { ...diveWeights(dive.progress, dive.mode), hold: false };
}

function smooth(t: number, a: number, b: number): number {
  if (t <= a) return 0;
  if (t >= b) return 1;
  const u = (t - a) / (b - a);
  return u * u * (3 - 2 * u);
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function shouldPush(progress: number, pushed: boolean): boolean {
  return !pushed && progress >= PUSH_AT;
}

let clockRefs = 0;
let unsubClock: (() => void) | null = null;

export function bindDiveClock(): () => void {
  clockRefs += 1;
  if (!unsubClock) {
    unsubClock = wind.subscribe(() => {
      if (state.mode === "idle") return;
      const elapsed = Math.min(
        1,
        Math.max(0, (wind.time - state.t0) / DIVE_DURATION),
      );
      const progress = Math.max(state.progress, elapsed);
      if (progress !== state.progress) {
        state = { ...state, progress };
        emit();
      }
      if (progress >= 1) endDive();
    });
  }
  return () => {
    clockRefs -= 1;
    if (clockRefs <= 0 && unsubClock) {
      unsubClock();
      unsubClock = null;
      clockRefs = 0;
    }
  };
}
