import { atlasMeta } from "@/lib/atlas";
import { getProject } from "@/lib/content";
import { territories, type Vec3 } from "@/lib/territories";

function sharedTags(a: string, b: string): number {
  const left = getProject(a)?.tags ?? [];
  const right = new Set(getProject(b)?.tags ?? []);
  return left.reduce((n, tag) => n + (right.has(tag) ? 1 : 0), 0);
}

function sameClient(a: string, b: string): boolean {
  const left = atlasMeta[a]?.client;
  const right = atlasMeta[b]?.client;
  if (!left || !right) return false;
  if (left === "Studio" || right === "Studio") return false;
  return left === right;
}

function ang(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function relatedSlugs(slug: string, limit = 3): string[] {
  const self = territories.find((item) => item.slug === slug);
  if (!self) return [];
  return territories
    .filter((item) => item.slug !== slug)
    .map((item) => {
      const tags = sharedTags(slug, item.slug);
      const client = sameClient(slug, item.slug) ? 2 : 0;
      return {
        slug: item.slug,
        score: tags + client,
        near: ang(self.site, item.site),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.near - a.near)
    .slice(0, limit)
    .map((item) => item.slug);
}

export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const d = Math.min(1, Math.max(-1, ang(a, b)));
  const omega = Math.acos(d);
  if (omega < 1e-4) return a;
  const s = Math.sin(omega);
  const w0 = Math.sin((1 - t) * omega) / s;
  const w1 = Math.sin(t * omega) / s;
  const x = a[0] * w0 + b[0] * w1;
  const y = a[1] * w0 + b[1] * w1;
  const z = a[2] * w0 + b[2] * w1;
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
}

export function greatCircle(a: Vec3, b: Vec3, steps = 48): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const p = slerp(a, b, i / steps);
    pts.push([p[0] * 1.012, p[1] * 1.012, p[2] * 1.012]);
  }
  return pts;
}
