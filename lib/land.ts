import {
  clamp,
  domainWarp,
  dot3,
  fbm,
  mix,
  normalize3,
  smoothstep,
  type Vec3,
} from "@/lib/field-math";
import { SITE_COUNT, territories, type Territory } from "@/lib/territories";

function nearestTwo(p: Vec3): { idx: number; site: Vec3; site2: Vec3 } {
  let idx = 0;
  let site = territories[0].site;
  let site2 = territories[Math.min(1, SITE_COUNT - 1)].site;
  let d1 = -2;
  let d2 = -2;
  for (const item of territories) {
    const d = dot3(p, item.site);
    if (d > d1) {
      d2 = d1;
      site2 = site;
      d1 = d;
      idx = item.index;
      site = item.site;
    } else if (d > d2) {
      d2 = d;
      site2 = item.site;
    }
  }
  return { idx, site, site2 };
}

/** Same land function as `territoryMask` in shaders/chunks/voronoiSphere.ts. */
export function landAt(
  point: Vec3,
  vis?: Float32Array,
): { territory: Territory; mask: number } {
  const p = normalize3(point);
  const warped = normalize3(domainWarp(p));
  const { idx, site, site2 } = nearestTwo(warped);
  const item = territories[idx];
  const scale = item.scale;
  const seed = item.seed;
  const visAmt = vis ? vis[idx] : 1;
  const dist = Math.acos(clamp(dot3(warped, site), -1, 1));
  const cellR = Math.max(0.1, Math.acos(clamp(dot3(site, site2), -1, 1)) * 0.46);
  const n = fbm(
    warped[0] * (4.4 + seed * 2) + seed * 9,
    warped[1] * (4.4 + seed * 2) + seed * 9,
    warped[2] * (4.4 + seed * 2) + seed * 9,
  );
  let landR = cellR * mix(0.4, 0.92, clamp(scale * 0.58, 0, 1));
  landR *= 0.82 + 0.22 * n;
  landR *= Math.max(0.02, visAmt);
  let mask = 1 - smoothstep(landR * 0.7, landR, dist);
  if (item.terrain === "archipelago") {
    mask *= smoothstep(
      0.42,
      0.6,
      fbm(p[0] * 5.1 + seed * 8, p[1] * 5.1 + seed * 8, p[2] * 5.1 + seed * 8),
    );
  }
  return { territory: item, mask };
}

export function cellUnderPoint(
  point: Vec3,
  vis?: Float32Array,
): Territory | null {
  const { territory, mask } = landAt(point, vis);
  if (mask < 0.5) return null;
  if (vis && vis[territory.index] < 0.35) return null;
  return territory;
}
