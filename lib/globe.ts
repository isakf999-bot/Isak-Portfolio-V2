let cached: boolean | undefined;

export function globeDetail(width: number, coarse: boolean): 5 | 6 | 7 {
  if (coarse || width < 900) return 5;
  return 6;
}

export function webglAvailable(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== undefined) return cached;
  cached =
    typeof WebGL2RenderingContext !== "undefined" ||
    typeof WebGLRenderingContext !== "undefined";
  return cached;
}
