/** CPU port of shaders/chunks/noise.ts + fbm.ts. Keep in lockstep with GLSL. */

export type Vec3 = [number, number, number];

export function fract(v: number): number {
  return v - Math.floor(v);
}

export function mix(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function hash13(px: number, py: number, pz: number): number {
  let x = fract(px * 0.1031);
  let y = fract(py * 0.1031);
  let z = fract(pz * 0.1031);
  const d = x * (z + 31.32) + y * (y + 31.32) + z * (x + 31.32);
  x += d;
  y += d;
  z += d;
  return fract((x + y) * z);
}

export function noise3(px: number, py: number, pz: number): number {
  const ix = Math.floor(px);
  const iy = Math.floor(py);
  const iz = Math.floor(pz);
  let fx = px - ix;
  let fy = py - iy;
  let fz = pz - iz;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  fz = fz * fz * (3 - 2 * fz);
  const n000 = hash13(ix, iy, iz);
  const n100 = hash13(ix + 1, iy, iz);
  const n010 = hash13(ix, iy + 1, iz);
  const n110 = hash13(ix + 1, iy + 1, iz);
  const n001 = hash13(ix, iy, iz + 1);
  const n101 = hash13(ix + 1, iy, iz + 1);
  const n011 = hash13(ix, iy + 1, iz + 1);
  const n111 = hash13(ix + 1, iy + 1, iz + 1);
  const nx00 = mix(n000, n100, fx);
  const nx10 = mix(n010, n110, fx);
  const nx01 = mix(n001, n101, fx);
  const nx11 = mix(n011, n111, fx);
  const nxy0 = mix(nx00, nx10, fy);
  const nxy1 = mix(nx01, nx11, fy);
  return mix(nxy0, nxy1, fz);
}

export function fbm(px: number, py: number, pz: number): number {
  let x = px;
  let y = py;
  let z = pz;
  let v = 0;
  let a = 0.5;
  v += a * noise3(x, y, z);
  x = x * 2.03 + 1.7;
  y = y * 2.03 + 1.7;
  z = z * 2.03 + 1.7;
  a *= 0.5;
  v += a * noise3(x, y, z);
  x = x * 2.03 + 1.7;
  y = y * 2.03 + 1.7;
  z = z * 2.03 + 1.7;
  a *= 0.5;
  v += a * noise3(x, y, z);
  x = x * 2.03 + 1.7;
  y = y * 2.03 + 1.7;
  z = z * 2.03 + 1.7;
  a *= 0.5;
  v += a * noise3(x, y, z);
  x = x * 2.03 + 1.7;
  y = y * 2.03 + 1.7;
  z = z * 2.03 + 1.7;
  a *= 0.5;
  v += a * noise3(x, y, z);
  return v;
}

export function domainWarp(p: Vec3): Vec3 {
  const w1 = fbm(p[0] * 1.15, p[1] * 1.15, p[2] * 1.15);
  const w2 = fbm(p[0] * 1.15 + 17.13, p[1] * 1.15 + 17.13, p[2] * 1.15 + 17.13);
  return [p[0] + 0.28 * w1, p[1] + 0.28 * w2, p[2] + 0.28 * (w1 - w2)];
}

export function normalize3(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

export function dot3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
