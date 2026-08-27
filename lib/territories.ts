import { atlasMeta, type AtlasClass, type Terrain } from "@/lib/atlas";
import { projects } from "@/lib/content";

export type Vec3 = [number, number, number];

export type Territory = {
  index: number;
  slug: string;
  title: string;
  year: string;
  atlas: AtlasClass;
  terrain: Terrain;
  scale: number;
  seed: number;
  site: Vec3;
  lat: number;
  lon: number;
};

export const SITE_TEXEL = 16;
export const SITE_COUNT = projects.length;

const TERRAIN_ID: Record<Terrain, number> = {
  ridge: 0,
  delta: 1,
  plateau: 2,
  archipelago: 3,
};

export function terrainId(kind: Terrain): number {
  return TERRAIN_ID[kind];
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

function fibonacci(count: number): Vec3[] {
  const out: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    out.push(normalize([Math.cos(theta) * radius, y, Math.sin(theta) * radius]));
  }
  return out;
}

function lloyd(sites: Vec3[], iterations: number): Vec3[] {
  const samples = fibonacci(2048);
  let current = sites.map((s) => [...s] as Vec3);
  for (let n = 0; n < iterations; n += 1) {
    const acc = current.map(() => ({ x: 0, y: 0, z: 0, w: 0 }));
    for (const p of samples) {
      let best = 0;
      let bestDot = -2;
      for (let i = 0; i < current.length; i += 1) {
        const d = dot(p, current[i]);
        if (d > bestDot) {
          bestDot = d;
          best = i;
        }
      }
      acc[best].x += p[0];
      acc[best].y += p[1];
      acc[best].z += p[2];
      acc[best].w += 1;
    }
    current = acc.map((bin, i) => {
      if (!bin.w) return current[i];
      return normalize([bin.x, bin.y, bin.z]);
    });
  }
  return current;
}

function latLon(site: Vec3): { lat: number; lon: number } {
  return {
    lat: (Math.asin(Math.max(-1, Math.min(1, site[1]))) * 180) / Math.PI,
    lon: (Math.atan2(site[0], site[2]) * 180) / Math.PI,
  };
}

export function formatCoords(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns} · ${Math.abs(lon).toFixed(2)}° ${ew}`;
}

const sites = lloyd(fibonacci(SITE_COUNT), 8);

export const territories: Territory[] = projects.map((project, index) => {
  const meta = atlasMeta[project.slug];
  if (!meta) throw new Error(`Missing atlas meta for ${project.slug}`);
  const site = sites[index];
  const { lat, lon } = latLon(site);
  return {
    index,
    slug: project.slug,
    title: project.title,
    year: project.year,
    atlas: meta.atlas,
    terrain: meta.terrain,
    scale: meta.scale,
    seed: hashSeed(meta.seed),
    site,
    lat,
    lon,
  };
});

if (territories.length !== SITE_COUNT) {
  throw new Error("Territory table drifted from projects.");
}

export function territoryBySlug(slug: string): Territory | undefined {
  return territories.find((item) => item.slug === slug);
}

export function nearestTerritory(point: Vec3): Territory {
  let best = territories[0];
  let bestDot = -2;
  for (const item of territories) {
    const d = dot(point, item.site);
    if (d > bestDot) {
      bestDot = d;
      best = item;
    }
  }
  return best;
}

export function packSites(): Float32Array {
  const data = new Float32Array(SITE_TEXEL * 4);
  for (const item of territories) {
    const o = item.index * 4;
    data[o] = item.site[0];
    data[o + 1] = item.site[1];
    data[o + 2] = item.site[2];
    data[o + 3] = item.scale;
  }
  return data;
}
