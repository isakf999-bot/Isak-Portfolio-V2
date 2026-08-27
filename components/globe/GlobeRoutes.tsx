"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Line,
  LineDashedMaterial,
} from "three";
import { getAtlasSnapshot, subscribeAtlas } from "@/lib/atlas-store";
import { greatCircle, relatedSlugs } from "@/lib/trade";
import { territoryBySlug } from "@/lib/territories";

const STEPS = 48;

function routePoints(from: string, to: string) {
  const a = territoryBySlug(from);
  const b = territoryBySlug(to);
  if (!a || !b) return [] as [number, number, number][];
  return greatCircle(a.site, b.site, STEPS).map(
    (p) => [p[0], p[1], p[2]] as [number, number, number],
  );
}

function GrowingRoute({ pts }: { pts: [number, number, number][] }) {
  const line = useRef<Line | null>(null);
  const t = useRef(0);
  const object = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new Float32BufferAttribute(pts.flat(), 3),
    );
    const mat = new LineDashedMaterial({
      color: "#0a0a0a",
      dashSize: 0.035,
      gapSize: 0.028,
      transparent: true,
      opacity: 0,
    });
    const obj = new Line(g, mat);
    obj.computeLineDistances();
    obj.raycast = () => undefined;
    return obj;
  }, [pts]);

  useEffect(() => {
    return () => {
      object.geometry.dispose();
      (object.material as LineDashedMaterial).dispose();
    };
  }, [object]);

  useFrame((_, dt) => {
    t.current = Math.min(1, t.current + dt / 0.5);
    const obj = line.current ?? object;
    const n = Math.max(2, Math.round((pts.length - 1) * t.current) + 1);
    obj.geometry.setDrawRange(0, n);
    const mat = obj.material as LineDashedMaterial;
    mat.opacity = 0.55 * t.current;
    obj.computeLineDistances();
  });

  if (pts.length < 2) return null;

  return (
    <primitive
      object={object}
      ref={(node: Line | null) => {
        line.current = node;
      }}
    />
  );
}

export function GlobeRoutes() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    return subscribeAtlas(() => {
      const next = getAtlasSnapshot().hover ?? getAtlasSnapshot().focus;
      setSlug((prev) => (prev === next ? prev : next));
    });
  }, []);

  const paths = useMemo(() => {
    if (!slug) return [];
    return relatedSlugs(slug).map((other) => routePoints(slug, other));
  }, [slug]);

  if (!slug || paths.length === 0) return null;

  return (
    <group>
      {paths.map((pts, index) => (
        <GrowingRoute key={`${slug}-${index}`} pts={pts} />
      ))}
    </group>
  );
}
