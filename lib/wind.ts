export type WindListener = (field: WindField) => void;
export type GustListener = (intensity: number) => void;

export interface WindField {
  time: number;
  direction: [number, number];
  strength: number;
  gustPhase: number;
  sample(x: number, y: number, scale?: number): number;
  onGust(cb: GustListener): () => void;
  subscribe(cb: WindListener): () => void;
  gust(): void;
  reducedMotion(): boolean;
}

const TAU = Math.PI * 2;

function hash2(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

function noise2(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  const u = fade(xf);
  const v = fade(yf);
  const x1 = a + u * (b - a);
  const x2 = c + u * (d - c);
  return x1 + v * (x2 - x1);
}

function fbm2(x: number, y: number): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 5; i += 1) {
    value += amp * (noise2(x * freq, y * freq) * 2 - 1);
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Wind implements WindField {
  time = 0;
  direction: [number, number] = [1, 0];
  strength = 0.35;
  gustPhase = 0;

  private angle = 0;
  private running = false;
  private last = 0;
  private hidden = false;
  private reduce = false;
  private raf = 0;
  private nextGustAt = 11;
  private gusting = false;
  private gustT = 0;
  private rand = mulberry32(2026);
  private listeners = new Set<WindListener>();
  private gustListeners = new Set<GustListener>();

  sample(x: number, y: number, scale = 1): number {
    return fbm2(x * scale * 0.02 + this.time * 0.04, y * scale * 0.02);
  }

  onGust(cb: GustListener): () => void {
    this.gustListeners.add(cb);
    return () => {
      this.gustListeners.delete(cb);
    };
  }

  subscribe(cb: WindListener): () => void {
    this.listeners.add(cb);
    this.ensure();
    cb(this);
    return () => {
      this.listeners.delete(cb);
      if (this.listeners.size === 0) this.stop();
    };
  }

  setReducedMotion(value: boolean): void {
    this.reduce = value;
    if (value) {
      this.gusting = false;
      this.gustPhase = 0;
      this.strength = 0.12;
    }
  }

  setHidden(value: boolean): void {
    this.hidden = value;
    if (value) this.stop();
    else this.ensure();
  }

  gust(): void {
    if (this.reduce) return;
    this.gusting = true;
    this.gustT = 0;
    this.gustListeners.forEach((cb) => cb(1));
  }

  reducedMotion(): boolean {
    return this.reduce;
  }

  private ensure(): void {
    if (this.running || this.hidden || typeof window === "undefined") return;
    this.running = true;
    this.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.step(dt);
      this.listeners.forEach((listener) => listener(this));
      this.raf = window.requestAnimationFrame(tick);
    };
    this.raf = window.requestAnimationFrame(tick);
  }

  private stop(): void {
    this.running = false;
    if (this.raf) window.cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private step(dt: number): void {
    if (this.reduce) {
      this.strength = 0.12;
      this.gustPhase = 0;
      return;
    }

    this.time += dt;
    this.angle += 0.02 * dt;
    this.direction = [Math.cos(this.angle), Math.sin(this.angle)];

    const breathe =
      0.35 +
      0.08 * Math.sin((this.time / 12) * TAU) +
      0.05 * Math.sin((this.time / 31) * TAU);

    if (!this.gusting && this.time >= this.nextGustAt) {
      this.gusting = true;
      this.gustT = 0;
      this.gustListeners.forEach((cb) => cb(0.9));
    }

    if (this.gusting) {
      this.gustT += dt;
      const attack = 0.7;
      const decay = 2.4;
      if (this.gustT < attack) {
        this.gustPhase = this.gustT / attack;
      } else if (this.gustT < attack + decay) {
        this.gustPhase = 1 - (this.gustT - attack) / decay;
      } else {
        this.gusting = false;
        this.gustPhase = 0;
        this.nextGustAt = this.time + 9 + this.rand() * 8;
      }
    }

    const gust = this.gustPhase * this.gustPhase * (3 - 2 * this.gustPhase);
    this.strength = Math.min(1, breathe + gust * 0.55);
  }
}

export const wind: WindField = new Wind();

export function bindWindEnvironment(): () => void {
  if (typeof window === "undefined") return () => undefined;

  const impl = wind as Wind;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const applyMotion = () => impl.setReducedMotion(motion.matches);
  applyMotion();
  motion.addEventListener("change", applyMotion);

  const onVis = () => impl.setHidden(document.visibilityState === "hidden");
  document.addEventListener("visibilitychange", onVis);

  return () => {
    motion.removeEventListener("change", applyMotion);
    document.removeEventListener("visibilitychange", onVis);
  };
}
