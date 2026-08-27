"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Quaternion,
  Raycaster,
  ShaderMaterial,
  Spherical,
  Vector2,
  Vector3,
  Vector4,
  type Camera,
  type Group,
  type Mesh,
} from "three";
import {
  currentDivePose,
  diveWeights,
  getDive,
  beginDiveIn,
} from "@/lib/dive";
import {
  getAtlasSnapshot,
  setAtlasHover,
  subscribeAtlas,
} from "@/lib/atlas-store";
import {
  SITE_COUNT,
  SITE_TEXEL,
  territories,
  territoryBySlug,
  terrainId,
} from "@/lib/territories";
import { cellUnderPoint } from "@/lib/land";
import { wind } from "@/lib/wind";
import { globeFragment, globeVertex } from "@/shaders/globe";
import {
  CLICK_CONFIRM_MS,
  CLICK_MAX_DISTANCE,
  CLICK_MAX_DISTANCE_TOUCH,
  CLICK_MAX_DURATION,
  CLICK_MAX_VELOCITY,
  HOVER_FRAMES,
  HOVER_STICKY_MS,
  HOVER_SUPPRESS_AFTER_DRAG_MS,
  IDLE_BLEND,
  IDLE_RESUME_DELAY,
  IDLE_SPIN,
  MAX_ANGULAR_VELOCITY,
  POINTER_SMOOTH,
  RADIUS_MAX,
  RADIUS_MIN,
  SILHOUETTE_GAIN,
  ZOOM_LERP,
  damp,
  bindGlobePointers,
  globeInstrument,
  probeGlobeDom,
  toward,
  wheelPixels,
} from "@/lib/globe-instrument";
import { GlobeLabels } from "@/components/globe/GlobeLabels";
import { GlobeRoutes } from "@/components/globe/GlobeRoutes";

const PULSE_SPAN = 1.2;
const PULSE_GAP = 6;

const raycaster = new Raycaster();
const ndc = new Vector2();
const hitWorld = new Vector3();
const grabPoint = new Vector3();
const currentPoint = new Vector3();
const localHit = new Vector3();
const qDelta = new Quaternion();
const qIdle = new Quaternion();
const axisY = new Vector3(0, 1, 0);
const tmp = new Vector3();
const tmp2 = new Vector3();
const invQ = new Quaternion();
const limbOrigin = new Vector3();
const limbRight = new Vector3();

function writeLimb(
  camera: Camera,
  gl: { domElement: HTMLCanvasElement },
  wrap: HTMLElement | null,
) {
  const el = gl.domElement;
  const w = el.clientWidth;
  const h = el.clientHeight;
  if (w < 2 || h < 2) return;
  limbOrigin.set(0, 0, 0).project(camera);
  const cx = (limbOrigin.x * 0.5 + 0.5) * w;
  const cy = (-limbOrigin.y * 0.5 + 0.5) * h;
  limbRight.copy(camera.position).normalize();
  tmp.set(0, 1, 0).cross(limbRight);
  if (tmp.lengthSq() < 1e-8) tmp.set(1, 0, 0).cross(limbRight);
  tmp.normalize().project(camera);
  const rx = (tmp.x * 0.5 + 0.5) * w;
  const ry = (-tmp.y * 0.5 + 0.5) * h;
  const r = Math.hypot(rx - cx, ry - cy);
  if (!Number.isFinite(r) || r < 2) return;
  globeInstrument.limbX = cx;
  globeInstrument.limbY = cy;
  globeInstrument.limbR = r;
  if (!wrap) return;
  wrap.style.setProperty("--limb-x", `${cx}px`);
  wrap.style.setProperty("--limb-y", `${cy}px`);
  wrap.style.setProperty("--limb-r", `${r}px`);
}

function padVec4(fill: (i: number) => Vector4) {
  return Array.from({ length: SITE_TEXEL }, (_, i) => fill(i));
}

function sphereHit(
  camera: Parameters<typeof raycaster.setFromCamera>[1],
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { point: Vector3; onSphere: boolean } | null {
  if (rect.width < 2 || rect.height < 2) return null;
  ndc.set(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1,
  );
  raycaster.setFromCamera(ndc, camera);
  const origin = raycaster.ray.origin;
  const dir = raycaster.ray.direction;
  const b = origin.dot(dir);
  const c = origin.lengthSq() - 1;
  const disc = b * b - c;
  if (disc >= 0) {
    const s = Math.sqrt(disc);
    let t = -b - s;
    if (t < 0) t = -b + s;
    if (t >= 0) {
      hitWorld.copy(origin).addScaledVector(dir, t);
      return { point: hitWorld, onSphere: true };
    }
  }
  const tClose = Math.max(0, -origin.dot(dir));
  hitWorld.copy(origin).addScaledVector(dir, tClose).normalize();
  return { point: hitWorld, onSphere: false };
}

function localFromWorld(world: Vector3, out: Vector3) {
  invQ.copy(globeInstrument.orientation).invert();
  out.copy(world).normalize().applyQuaternion(invQ);
  return out;
}

export function GlobeRig({
  reduce,
  interactive,
}: {
  reduce: boolean;
  interactive: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const sph = useRef(new Spherical(3.55, 1.18, 0.42));
  const look = useRef(new Vector3());
  const savedSph = useRef(new Spherical(3.55, 1.18, 0.42));
  const savedLook = useRef(new Vector3());
  const startPos = useRef(new Vector3());
  const endPos = useRef(new Vector3());
  const ctrlPos = useRef(new Vector3());
  const lookA = useRef(new Vector3());
  const lookB = useRef(new Vector3());
  const armed = useRef(getDive().mode);
  const vis = useRef(globeInstrumentVis);
  const ptr = useRef({
    id: -1,
    x: 0,
    y: 0,
    sx: 0,
    sy: 0,
    t: 0,
    cell: null as string | null,
    travel: 0,
    count: 0,
    pinch: 0,
  });
  const hoverPend = useRef<string | null>(null);
  const hoverFrames = useRef(0);
  const hoverHold = useRef({ slug: null as string | null, until: 0 });
  const confirmTimer = useRef(0);

  useEffect(() => {
    const el = gl.domElement;
    const wrap = el.closest("[data-globe-canvas]") as HTMLElement | null;

    const cellAt = (x: number, y: number) => {
      const rect = el.getBoundingClientRect();
      const hit = sphereHit(camera, x, y, rect);
      if (!hit) return null;
      localFromWorld(hit.point, localHit);
      const found = cellUnderPoint(
        [localHit.x, localHit.y, localHit.z],
        vis.current,
      );
      return found?.slug ?? null;
    };

    const onDown = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }
      if (globeInstrument.dragging) return;
      ptr.current.count = 1;
      globeInstrument.dragLatched = false;
      globeInstrument.dragging = true;
      globeInstrument.idleAmount = 0;
      globeInstrument.omega = 0;
      ptr.current.id = event.pointerId || 1;
      ptr.current.x = event.clientX;
      ptr.current.y = event.clientY;
      ptr.current.sx = event.clientX;
      ptr.current.sy = event.clientY;
      ptr.current.t = performance.now();
      ptr.current.travel = 0;
      ptr.current.cell = cellAt(event.clientX, event.clientY);
      const hit = sphereHit(camera, event.clientX, event.clientY, rect);
      if (hit) grabPoint.copy(hit.point).normalize();
      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        /* capture optional */
      }
      probeGlobeDom(wrap);
    };

    const onMove = (event: PointerEvent) => {
      ptr.current.x = event.clientX;
      ptr.current.y = event.clientY;
      if (!globeInstrument.dragging) {
        const now = performance.now();
        const suppress =
          globeInstrument.dragLatched ||
          now - globeInstrument.lastDragEnd < HOVER_SUPPRESS_AFTER_DRAG_MS;
        if (!suppress && interactive && getDive().mode === "idle" && !getDive().slug) {
          const cell = cellAt(event.clientX, event.clientY);
          if (cell === hoverPend.current) hoverFrames.current += 1;
          else {
            hoverPend.current = cell;
            hoverFrames.current = 1;
          }
          const fast = Math.hypot(event.movementX, event.movementY) > 6;
          const need = fast ? HOVER_FRAMES : 1;
          if (hoverFrames.current >= need) {
            if (cell) {
              hoverHold.current = { slug: cell, until: now + HOVER_STICKY_MS };
              globeInstrument.hover = cell;
              globeInstrument.cursor = "OPEN ↗";
              setAtlasHover(cell);
            } else if (now < hoverHold.current.until) {
              globeInstrument.hover = hoverHold.current.slug;
              globeInstrument.cursor = hoverHold.current.slug ? "OPEN ↗" : "DRAG";
              setAtlasHover(hoverHold.current.slug);
            } else {
              globeInstrument.hover = null;
              globeInstrument.cursor = "DRAG";
              setAtlasHover(null);
            }
          }
        }
        probeGlobeDom(wrap);
        return;
      }
      ptr.current.sx += (event.clientX - ptr.current.sx) * POINTER_SMOOTH;
      ptr.current.sy += (event.clientY - ptr.current.sy) * POINTER_SMOOTH;
      if (ptr.current.count > 1) {
        const dist = Math.hypot(event.movementX, event.movementY);
        globeInstrument.radiusTarget = Math.max(
          RADIUS_MIN,
          Math.min(RADIUS_MAX, globeInstrument.radiusTarget - dist * 0.01),
        );
        return;
      }
      ptr.current.travel += Math.hypot(event.movementX, event.movementY);
      const touch = event.pointerType === "touch";
      const limit = touch ? CLICK_MAX_DISTANCE_TOUCH : CLICK_MAX_DISTANCE;
      if (ptr.current.travel > limit) globeInstrument.dragLatched = true;

      const rect = el.getBoundingClientRect();
      const hit = sphereHit(camera, event.clientX, event.clientY, rect);
      if (!hit) return;
      currentPoint.copy(hit.point).normalize();
      if (grabPoint.lengthSq() < 1e-8) {
        grabPoint.copy(currentPoint);
        return;
      }
      qDelta.setFromUnitVectors(grabPoint, currentPoint);
      let angle = grabPoint.angleTo(currentPoint);
      if (!hit.onSphere) angle *= SILHOUETTE_GAIN;
      const dt = Math.max(1 / 240, wind.time ? 1 / 60 : 1 / 60);
      const maxAngle = MAX_ANGULAR_VELOCITY * (1 / 60);
      if (angle > maxAngle) {
        globeInstrument.spinAxis.copy(grabPoint).cross(currentPoint).normalize();
        qDelta.setFromAxisAngle(globeInstrument.spinAxis, maxAngle);
        angle = maxAngle;
      } else if (angle > 1e-6) {
        globeInstrument.spinAxis.copy(grabPoint).cross(currentPoint).normalize();
      }
      globeInstrument.orientation.premultiply(qDelta);
      globeInstrument.omega = Math.min(
        MAX_ANGULAR_VELOCITY,
        Math.max(angle / Math.max(dt, 1 / 120), 0),
      );
      grabPoint.copy(currentPoint);
      probeGlobeDom(wrap);
    };

    const onUp = (event: PointerEvent) => {
      ptr.current.count = Math.max(0, ptr.current.count - 1);
      if (event.pointerId !== ptr.current.id && ptr.current.count > 0) return;
      if (!globeInstrument.dragging) return;
      globeInstrument.dragging = false;
      globeInstrument.lastDragEnd = performance.now();
      globeInstrument.idleUntil = wind.time + IDLE_RESUME_DELAY;
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }

      const duration = performance.now() - ptr.current.t;
      const upCell = cellAt(event.clientX, event.clientY);
      const isClick =
        !globeInstrument.dragLatched &&
        duration < CLICK_MAX_DURATION &&
        globeInstrument.omega < CLICK_MAX_VELOCITY &&
        upCell === ptr.current.cell &&
        ptr.current.cell !== null &&
        ptr.current.count === 0;

      if (isClick && ptr.current.cell) {
        const slug = ptr.current.cell;
        globeInstrument.confirmSlug = slug;
        globeInstrument.confirmUntil = performance.now() + CLICK_CONFIRM_MS;
        window.clearTimeout(confirmTimer.current);
        confirmTimer.current = window.setTimeout(() => {
          if (globeInstrument.confirmSlug === slug) {
            globeInstrument.confirmSlug = null;
            beginDiveIn(slug);
          }
        }, CLICK_CONFIRM_MS);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!interactive || getDive().mode !== "idle" || getDive().slug) return;
      event.preventDefault();
      globeInstrument.idleAmount = 0;
      globeInstrument.idleUntil = wind.time + IDLE_RESUME_DELAY;
      const dy = wheelPixels(event);
      globeInstrument.radiusTarget = Math.max(
        RADIUS_MIN,
        Math.min(RADIUS_MAX, globeInstrument.radiusTarget + dy * 0.0022),
      );
    };

    const onKey = (event: KeyboardEvent) => {
      if (!interactive || getDive().mode !== "idle" || getDive().slug) return;
      const step = 0.04;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        qIdle.setFromAxisAngle(axisY, step);
        globeInstrument.orientation.premultiply(qIdle);
        globeInstrument.idleAmount = 0;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        qIdle.setFromAxisAngle(axisY, -step);
        globeInstrument.orientation.premultiply(qIdle);
        globeInstrument.idleAmount = 0;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        globeInstrument.radiusTarget = Math.max(
          RADIUS_MIN,
          globeInstrument.radiusTarget - 0.12,
        );
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        globeInstrument.radiusTarget = Math.min(
          RADIUS_MAX,
          globeInstrument.radiusTarget + 0.12,
        );
      }
    };

    const unbind = bindGlobePointers({ down: onDown, move: onMove, up: onUp });
    (window as unknown as { __globeRig?: boolean }).__globeRig = true;
    window.addEventListener("pointerdown", onDown, true);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      unbind();
      window.clearTimeout(confirmTimer.current);
      window.removeEventListener("pointerdown", onDown, true);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [camera, gl, interactive]);

  useFrame((_, dt) => {
    const wrap = gl.domElement.closest("[data-globe-canvas]") as HTMLElement | null;
    const dive = getDive();
    const clampedDt = Math.min(0.05, Math.max(0.001, dt));

    if (dive.mode !== armed.current) {
      if (dive.mode === "in" || dive.mode === "out" || dive.mode === "adjacent") {
        startPos.current.copy(camera.position);
        if (dive.mode === "in") {
          savedSph.current.copy(sph.current);
          savedLook.current.copy(look.current);
        }
        if (dive.mode === "out") {
          endPos.current.setFromSpherical(savedSph.current);
          lookA.current.copy(look.current);
          lookB.current.copy(savedLook.current);
        } else {
          const target = territoryBySlug(dive.slug ?? "");
          if (target) {
            endPos.current
              .set(target.site[0], target.site[1], target.site[2])
              .applyQuaternion(globeInstrument.orientation)
              .multiplyScalar(1.34);
            lookB.current
              .set(target.site[0], target.site[1], target.site[2])
              .applyQuaternion(globeInstrument.orientation)
              .multiplyScalar(0.12);
          }
          const from = territoryBySlug(dive.fromSlug ?? "");
          if (from) {
            lookA.current
              .set(from.site[0], from.site[1], from.site[2])
              .applyQuaternion(globeInstrument.orientation)
              .multiplyScalar(0.12);
          } else {
            lookA.current.set(0, 0, 0);
          }
        }
        tmp.copy(startPos.current).add(endPos.current).multiplyScalar(0.5);
        tmp2.crossVectors(startPos.current, endPos.current);
        if (tmp2.lengthSq() < 1e-6) tmp2.set(0, 1, 0);
        tmp2
          .normalize()
          .multiplyScalar(startPos.current.distanceTo(endPos.current) * 0.42);
        ctrlPos.current.copy(tmp).add(tmp2);
      }
      armed.current = dive.mode;
    }

    if (dive.mode !== "idle") {
      const t = diveWeights(dive.progress, dive.mode).fly;
      const u = 1 - t;
      tmp
        .set(0, 0, 0)
        .addScaledVector(startPos.current, u * u)
        .addScaledVector(ctrlPos.current, 2 * u * t)
        .addScaledVector(endPos.current, t * t);
      camera.position.copy(tmp);
      look.current.lerpVectors(lookA.current, lookB.current, t);
      camera.lookAt(look.current);
      camera.updateMatrixWorld();
      globeInstrument.cursor = "";
      probeGlobeDom(wrap);
      return;
    }

    if (dive.slug) {
      camera.lookAt(look.current);
      camera.updateMatrixWorld();
      writeLimb(camera, gl, wrap);
      globeInstrument.cursor = "";
      probeGlobeDom(wrap);
      return;
    }

    if (!globeInstrument.dragging) {
      globeInstrument.omega = damp(globeInstrument.omega, clampedDt);
      if (globeInstrument.omega > 1e-5) {
        qDelta.setFromAxisAngle(
          globeInstrument.spinAxis,
          globeInstrument.omega * clampedDt,
        );
        globeInstrument.orientation.premultiply(qDelta);
      }
      if (wind.time > globeInstrument.idleUntil && !reduce) {
        globeInstrument.idleAmount = toward(
          globeInstrument.idleAmount,
          1,
          clampedDt,
          1 - Math.pow(0.5, 1 / ((IDLE_BLEND * 60) / 2)),
        );
      }
      if (!reduce) {
        qIdle.setFromAxisAngle(
          axisY,
          IDLE_SPIN * clampedDt * globeInstrument.idleAmount,
        );
        globeInstrument.orientation.premultiply(qIdle);
      }
    }

    globeInstrument.radius = toward(
      globeInstrument.radius,
      globeInstrument.radiusTarget,
      clampedDt,
      ZOOM_LERP,
    );
    sph.current.radius = globeInstrument.radius;
    sph.current.makeSafe();
    camera.position.setFromSpherical(sph.current);
    camera.lookAt(look.current);
    camera.updateMatrixWorld();
    writeLimb(camera, gl, wrap);

    const now = performance.now();
    const suppress =
      globeInstrument.dragLatched ||
      globeInstrument.dragging ||
      now - globeInstrument.lastDragEnd < HOVER_SUPPRESS_AFTER_DRAG_MS;

    let next: string | null = null;
    if (interactive && !suppress) {
      if (globeInstrument.pointerOn) {
        next =
          cellUnderPoint(
            [
              globeInstrument.pointerLocal.x,
              globeInstrument.pointerLocal.y,
              globeInstrument.pointerLocal.z,
            ],
            vis.current,
          )?.slug ?? null;
      } else if (ptr.current.x || ptr.current.y) {
        const rect = gl.domElement.getBoundingClientRect();
        const hit = sphereHit(camera, ptr.current.x, ptr.current.y, rect);
        if (hit?.onSphere) {
          localFromWorld(hit.point, localHit);
          next =
            cellUnderPoint(
              [localHit.x, localHit.y, localHit.z],
              vis.current,
            )?.slug ?? null;
        }
      }
    }

    if (next === hoverPend.current) {
      hoverFrames.current += 1;
    } else {
      hoverPend.current = next;
      hoverFrames.current = 1;
    }

    let committed = globeInstrument.hover;
    if (!suppress && hoverFrames.current >= HOVER_FRAMES) {
      if (hoverPend.current) {
        committed = hoverPend.current;
        hoverHold.current = { slug: committed, until: now + HOVER_STICKY_MS };
      } else if (now < hoverHold.current.until) {
        committed = hoverHold.current.slug;
      } else {
        committed = null;
      }
    } else if (suppress) {
      committed = null;
    }

    if (committed !== globeInstrument.hover) {
      globeInstrument.hover = committed;
      setAtlasHover(committed);
    }

    if (globeInstrument.dragLatched) {
      globeInstrument.cursor = "";
    } else if (committed) {
      globeInstrument.cursor = "OPEN ↗";
    } else {
      globeInstrument.cursor = "DRAG";
    }

    globeInstrument.omega = Math.min(MAX_ANGULAR_VELOCITY, globeInstrument.omega);
    probeGlobeDom(wrap);
  });

  return null;
}

const globeInstrumentVis = new Float32Array(SITE_COUNT).fill(1);

export function GlobeMesh({
  detail,
  reduce,
}: {
  detail: 5 | 6 | 7;
  reduce: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const pulseOrigin = useRef(new Vector3(0, 1, 0));
  const vis = useRef(globeInstrumentVis);
  const lifts = useRef(new Float32Array(SITE_COUNT).fill(1));
  const hoverAmt = useRef(new Float32Array(SITE_COUNT).fill(0));
  const dimAmt = useRef(new Float32Array(SITE_COUNT).fill(0));
  const selAmt = useRef(new Float32Array(SITE_COUNT).fill(0));
  const pulse = useRef({ start: -10, index: 0 });
  const hoverRef = useRef<string | null>(null);
  const filterRef = useRef(getAtlasSnapshot().filter);
  const focusVec = useRef(new Vector3(0, 1, 0));
  const survey = useRef({ slug: null as string | null, t0: 0 });

  const sites = useMemo(
    () =>
      padVec4((i) => {
        const item = territories[i];
        return item
          ? new Vector4(item.site[0], item.site[1], item.site[2], item.scale)
          : new Vector4(0, 1, 0, 0);
      }),
    [],
  );
  const meta = useMemo(
    () =>
      padVec4((i) => {
        const item = territories[i];
        return item
          ? new Vector4(terrainId(item.terrain), item.seed, 1, 1)
          : new Vector4(0, 0, 1, 0);
      }),
    [],
  );
  const cells = useMemo(
    () => padVec4(() => new Vector4(0, 0, 0, 0)),
    [],
  );

  const uniforms = useMemo(
    () => ({
      uWindTime: { value: 0 },
      uWindDir: { value: new Vector2(1, 0) },
      uWindStrength: { value: 0.35 },
      uGustPhase: { value: 0 },
      uReduce: { value: 0 },
      uContourDensity: { value: 16 },
      uLightDir: { value: new Vector3(0.62, 0.18, 0.58).normalize() },
      uPulseOrigin: { value: pulseOrigin.current },
      uPulseT: { value: 1 },
      uSites: { value: sites },
      uMeta: { value: meta },
      uCell: { value: cells },
      uSiteCount: { value: SITE_COUNT },
      uHoverCell: { value: -1 },
      uUnroll: { value: 0 },
      uFocus: { value: focusVec.current },
      uSurveyT: { value: 1 },
      uCamRadius: { value: 3.55 },
    }),
    [cells, meta, sites],
  );

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: globeVertex,
        fragmentShader: globeFragment,
        uniforms,
        toneMapped: false,
      }),
    [uniforms],
  );

  useEffect(() => {
    hoverRef.current = getAtlasSnapshot().hover;
    filterRef.current = getAtlasSnapshot().filter;
    return subscribeAtlas(() => {
      const snap = getAtlasSnapshot();
      hoverRef.current = snap.hover ?? snap.focus;
      filterRef.current = snap.filter;
    });
  }, []);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((_, dt) => {
    uniforms.uWindTime.value = wind.time;
    uniforms.uWindDir.value.set(wind.direction[0], wind.direction[1]);
    uniforms.uWindStrength.value = wind.strength;
    uniforms.uGustPhase.value = wind.gustPhase;
    uniforms.uReduce.value = reduce ? 1 : 0;

    const dive = getDive();
    const pose = currentDivePose();
    uniforms.uUnroll.value = pose.unroll;
    const span = RADIUS_MAX - RADIUS_MIN;
    const dolly = Math.min(
      1,
      Math.max(0, (RADIUS_MAX - globeInstrument.radius) / span),
    );
    uniforms.uContourDensity.value = 16 * Math.max(pose.contour, 1 + 3 * dolly);
    uniforms.uCamRadius.value = globeInstrument.radius;

    let focusSlug = dive.slug;
    if (dive.mode === "adjacent" && dive.progress < 0.5) {
      focusSlug = dive.fromSlug;
    }
    const focus = territoryBySlug(focusSlug ?? "");
    if (focus) {
      focusVec.current.set(focus.site[0], focus.site[1], focus.site[2]);
    }

    const hover = hoverRef.current;
    const confirm = globeInstrument.confirmSlug;
    if (hover !== survey.current.slug) {
      survey.current = { slug: hover, t0: wind.time };
    }
    uniforms.uSurveyT.value = hover
      ? Math.min(1, (wind.time - survey.current.t0) / 0.6)
      : 1;

    let hoverIndex = -1;
    const kVis = 1 - Math.exp(-dt / 0.18);
    const kLift = 1 - Math.exp(-dt / 0.07);
    const kHover = 1 - Math.exp(-dt / 0.04);
    const kDim = 1 - Math.exp(-dt / 0.04);
    for (const item of territories) {
      const match =
        filterRef.current === "all" || item.atlas === filterRef.current ? 1 : 0;
      let show = match;
      if (pose.isolate > 0.01 && focusSlug) {
        const keep =
          item.slug === focusSlug ||
          (dive.mode === "adjacent" &&
            (item.slug === dive.slug || item.slug === dive.fromSlug));
        show = keep ? match : match * (1 - pose.isolate);
      }
      vis.current[item.index] += (show - vis.current[item.index]) * kVis;
      const wantLift =
        (hover === item.slug || confirm === item.slug) &&
        dive.mode === "idle" &&
        !dive.slug
          ? 1.15
          : 1;
      lifts.current[item.index] += (wantLift - lifts.current[item.index]) * kLift;
      const wantHover =
        hover === item.slug || confirm === item.slug ? 1 : 0;
      hoverAmt.current[item.index] +=
        (wantHover - hoverAmt.current[item.index]) * kHover;
      const wantDim = hover && hover !== item.slug ? 1 : 0;
      dimAmt.current[item.index] += (wantDim - dimAmt.current[item.index]) * kDim;
      const wantSel = confirm === item.slug ? 1 : 0;
      selAmt.current[item.index] += (wantSel - selAmt.current[item.index]) * kHover;
      meta[item.index].set(
        terrainId(item.terrain),
        item.seed,
        lifts.current[item.index],
        vis.current[item.index],
      );
      cells[item.index].set(
        hoverAmt.current[item.index],
        selAmt.current[item.index],
        dimAmt.current[item.index],
        0,
      );
      if (hover === item.slug) hoverIndex = item.index;
      if (focus && item.slug === focus.slug) hoverIndex = item.index;
    }
    uniforms.uHoverCell.value = hoverIndex;

    if (reduce || dive.mode !== "idle" || dive.slug) {
      uniforms.uPulseT.value = 1;
      return;
    }

    if (wind.time - pulse.current.start > PULSE_GAP) {
      pulse.current.start = wind.time;
      let next = (pulse.current.index + 1) % SITE_COUNT;
      for (let n = 0; n < SITE_COUNT; n += 1) {
        const candidate = territories[(pulse.current.index + 1 + n) % SITE_COUNT];
        if (vis.current[candidate.index] > 0.55) {
          next = candidate.index;
          break;
        }
      }
      const pick = territories[next];
      pulse.current.index = pick.index;
      pulseOrigin.current.set(pick.site[0], pick.site[1], pick.site[2]);
    }
    uniforms.uPulseT.value = Math.min(
      1,
      Math.max(0, (wind.time - pulse.current.start) / PULSE_SPAN),
    );
  });

  return (
    <mesh ref={mesh} frustumCulled={false} raycast={() => {}} material={material}>
      <icosahedronGeometry args={[1, detail]} />
    </mesh>
  );
}

export function GlobePlanet({
  detail,
  reduce,
}: {
  detail: 5 | 6 | 7;
  reduce: boolean;
}) {
  const group = useRef<Group>(null);
  useFrame(() => {
    group.current?.quaternion.copy(globeInstrument.orientation);
  });
  return (
    <group ref={group}>
      <GlobeMesh detail={detail} reduce={reduce} />
      <GlobeLabels />
      <GlobeRoutes />
    </group>
  );
}
