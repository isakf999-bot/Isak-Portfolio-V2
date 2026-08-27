"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  Vector3,
  type Camera,
  type Mesh,
} from "three";
import {
  LABEL_DETAIL_RADIUS,
  CAPITAL_DOT_RADIUS,
  globeInstrument,
} from "@/lib/globe-instrument";
import { atlasLabel } from "@/lib/atlas";
import { territories } from "@/lib/territories";
import { clamp, smoothstep } from "@/lib/field-math";

const INK = "#0a0a0a";
const tmpA = new Vector3();
const tmpB = new Vector3();
const tmpC = new Vector3();
const projected = territories.map(() => ({ x: 0, y: 0, z: 0, depth: 0 }));

function project(
  camera: Camera,
  world: Vector3,
  out: { x: number; y: number; z: number; depth: number },
) {
  tmpC.copy(world).project(camera);
  out.x = tmpC.x;
  out.y = tmpC.y;
  out.z = tmpC.z;
  out.depth = world.distanceTo(camera.position);
}

function overlap(
  a: { x: number; y: number },
  b: { x: number; y: number },
): boolean {
  return Math.abs(a.x - b.x) < 0.16 && Math.abs(a.y - b.y) < 0.08;
}

function CapMark({
  index,
  opacity,
}: {
  index: number;
  opacity: { current: Float32Array };
}) {
  const item = territories[index];
  const group = useRef<Group>(null);
  const dot = useRef<Mesh>(null);
  const capital = useMemo(
    () => new Vector3(item.site[0], item.site[1], item.site[2]),
    [item],
  );
  const tip = useMemo(() => capital.clone().multiplyScalar(1.08), [capital]);
  const geom = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new Float32BufferAttribute(
        [capital.x, capital.y, capital.z, tip.x, tip.y, tip.z],
        3,
      ),
    );
    return g;
  }, [capital, tip]);

  useFrame(({ camera }) => {
    const node = group.current;
    if (!node) return;
    tmpA.copy(capital).applyQuaternion(globeInstrument.orientation);
    tmpC.copy(tmpA).multiplyScalar(1.08);
    tmpB.copy(camera.position).sub(tmpC).normalize();
    const facing = smoothstep(0.05, 0.45, tmpA.normalize().dot(tmpB));
    const next = facing * opacity.current[index];
    node.visible = next > 0.04;
    node.traverse((child) => {
      const mat = (
        child as { material?: { opacity: number; transparent: boolean } }
      ).material;
      if (mat) {
        mat.transparent = true;
        mat.opacity = next;
      }
    });
    const dots = clamp(
      (CAPITAL_DOT_RADIUS - globeInstrument.radius) / 0.4,
      0,
      1,
    );
    if (dot.current) {
      const mat = dot.current.material as {
        opacity: number;
        transparent: boolean;
      };
      mat.opacity = next * dots;
      dot.current.visible = next > 0.04 && dots > 0.04;
    }
  });

  return (
    <group ref={group} raycast={() => {}}>
      <mesh ref={dot} position={capital} raycast={() => {}}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial color={INK} transparent />
      </mesh>
      <lineSegments geometry={geom} raycast={() => {}}>
        <lineBasicMaterial color={INK} transparent />
      </lineSegments>
    </group>
  );
}

/** One DOM layer for all captions — no Troika WebGL, no drei Html portals. */
function LabelLayer({
  opacity,
}: {
  opacity: { current: Float32Array };
}) {
  const { camera, gl, size } = useThree();
  const nodes = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const wrap = gl.domElement.closest(
      "[data-globe-canvas]",
    ) as HTMLElement | null;
    if (!wrap) return;
    const root = document.createElement("div");
    root.className = "globe-label-layer";
    root.setAttribute("aria-hidden", "true");
    wrap.appendChild(root);
    nodes.current = territories.map((item) => {
      const el = document.createElement("div");
      el.className = "globe-sdf-label";
      el.innerHTML = `<p>${item.title.toUpperCase()}</p><p>${item.year} · ${atlasLabel[item.atlas].toUpperCase()}</p>`;
      root.appendChild(el);
      return el;
    });
    return () => {
      root.remove();
      nodes.current = [];
    };
  }, [gl]);

  useFrame(() => {
    const list = nodes.current;
    if (!list.length) return;
    const w = size.width;
    const h = size.height;
    const q = globeInstrument.orientation;
    const detail = clamp(
      (LABEL_DETAIL_RADIUS + 0.15 - globeInstrument.radius) / 0.45,
      0,
      1,
    );

    for (let i = 0; i < territories.length; i += 1) {
      const site = territories[i].site;
      tmpA
        .set(site[0], site[1], site[2])
        .multiplyScalar(1.08)
        .applyQuaternion(q);
      project(camera, tmpA, projected[i]);
    }

    for (let i = 0; i < territories.length; i += 1) {
      let win = 1;
      for (let j = 0; j < territories.length; j += 1) {
        if (i === j) continue;
        if (!overlap(projected[i], projected[j])) continue;
        if (projected[j].depth < projected[i].depth) win = 0.25;
      }
      opacity.current[i] = win;

      const el = list[i];
      const p = projected[i];
      const behind = p.z > 1 || p.z < -1;
      const site = territories[i].site;
      tmpA.set(site[0], site[1], site[2]).applyQuaternion(q);
      tmpB.copy(camera.position).sub(tmpA).normalize();
      const facing = smoothstep(0.05, 0.45, tmpA.normalize().dot(tmpB));
      const alpha = facing * win * Math.max(detail, 0.35);
      if (behind || alpha < 0.04) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        continue;
      }
      const x = (p.x * 0.5 + 0.5) * w + 6;
      const y = (-p.y * 0.5 + 0.5) * h;
      el.style.visibility = "visible";
      el.style.opacity = alpha.toFixed(3);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  });

  return null;
}

export function GlobeLabels() {
  const opacity = useRef(new Float32Array(territories.length).fill(1));

  return (
    <group>
      {territories.map((item) => (
        <CapMark key={item.slug} index={item.index} opacity={opacity} />
      ))}
      <LabelLayer opacity={opacity} />
    </group>
  );
}
