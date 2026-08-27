import { Quaternion, Vector3 } from "three";

export const RADIUS_MIN = 1.7;
export const RADIUS_MAX = 4.0;
export const MAX_ANGULAR_VELOCITY = 1.1;
export const DAMPING_PER_SECOND = 0.055;
export const IDLE_SPIN = 0.04;
export const IDLE_RESUME_DELAY = 1.4;
export const IDLE_BLEND = 0.9;
export const CLICK_MAX_DISTANCE = 6;
export const CLICK_MAX_DISTANCE_TOUCH = 10;
export const CLICK_MAX_DURATION = 400;
export const CLICK_MAX_VELOCITY = 0.03;
export const HOVER_STICKY_MS = 120;
export const HOVER_SUPPRESS_AFTER_DRAG_MS = 250;
export const CLICK_CONFIRM_MS = 100;
export const LABEL_DETAIL_RADIUS = 2.6;
export const CAPITAL_DOT_RADIUS = 3.35;
export const SURVEY_TICK_RADIUS = 2.0;
export const POINTER_SMOOTH = 0.35;
export const ZOOM_LERP = 0.12;
export const HOVER_FRAMES = 2;
export const SILHOUETTE_GAIN = 0.6;

export type GlobeCursor = "DRAG" | "OPEN ↗" | "";

let pointerBridge: {
  down: (event: PointerEvent) => void;
  move: (event: PointerEvent) => void;
  up: (event: PointerEvent) => void;
} | null = null;

export function globePointerDown(event: PointerEvent) {
  pointerBridge?.down(event);
}
export function globePointerMove(event: PointerEvent) {
  pointerBridge?.move(event);
}
export function globePointerUp(event: PointerEvent) {
  pointerBridge?.up(event);
}

export function bindGlobePointers(handlers: typeof pointerBridge) {
  pointerBridge = handlers;
  return () => {
    if (pointerBridge === handlers) pointerBridge = null;
  };
}

export const globeInstrument = {
  orientation: new Quaternion(),
  spinAxis: new Vector3(0, 1, 0),
  omega: 0,
  radius: 3.55,
  radiusTarget: 3.55,
  dragLatched: false,
  dragging: false,
  hover: null as string | null,
  selected: null as string | null,
  cursor: "DRAG" as GlobeCursor,
  lastDragEnd: 0,
  idleUntil: 0,
  idleAmount: 1,
  confirmUntil: 0,
  confirmSlug: null as string | null,
  pointerOn: false,
  pointerLocal: new Vector3(0, 1, 0),
  limbX: 0,
  limbY: 0,
  limbR: 0,
};

export function damp(value: number, dt: number): number {
  return value * Math.pow(DAMPING_PER_SECOND, dt);
}

export function toward(current: number, target: number, dt: number, rate: number): number {
  const k = 1 - Math.pow(1 - rate, dt * 60);
  return current + (target - current) * k;
}

export function wheelPixels(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * (typeof window === "undefined" ? 800 : window.innerHeight);
  return event.deltaY;
}

export function probeGlobeDom(el: HTMLElement | null) {
  if (!el) return;
  el.dataset.omega = globeInstrument.omega.toFixed(4);
  el.dataset.hover = globeInstrument.hover ?? "";
  el.dataset.pointer = globeInstrument.pointerOn ? "1" : "0";
  el.dataset.dragging = globeInstrument.dragging ? "1" : "0";
  if (globeInstrument.cursor) {
    el.dataset.cursor = globeInstrument.cursor;
  } else {
    delete el.dataset.cursor;
  }
}
