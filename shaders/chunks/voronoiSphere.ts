export const SITE_MAX = 16;

export const voronoiGlsl = /* glsl */ `
uniform vec4 uSites[16];
uniform vec4 uMeta[16];
uniform float uSiteCount;

vec4 siteAt(int i) {
  return uSites[i];
}

vec4 metaAt(int i) {
  return uMeta[i];
}

void nearestTwo(vec3 p, out int idx, out vec3 site, out vec3 site2, out vec4 meta) {
  idx = 0;
  site = siteAt(0).xyz;
  site2 = siteAt(1).xyz;
  meta = metaAt(0);
  float d1 = -2.0;
  float d2 = -2.0;
  for (int i = 0; i < 16; i++) {
    if (float(i) < uSiteCount) {
      vec3 s = siteAt(i).xyz;
      float d = dot(p, s);
      if (d > d1) {
        d2 = d1;
        site2 = site;
        d1 = d;
        idx = i;
        site = s;
        meta = metaAt(i);
      } else if (d > d2) {
        d2 = d;
        site2 = s;
      }
    }
  }
}

float terrainElev(vec3 p, float mask, float kind, float seed) {
  vec3 q = p * 3.2 + vec3(seed * 7.13, seed * 3.91, seed * 5.27);
  float ridged = fbmRidged(q);
  float rolling = fbm(q * 0.74);
  float plateau = smoothstep(0.34, 0.39, rolling) * 0.62 + rolling * 0.1;
  if (kind < 0.5) return mask * ridged;
  if (kind < 1.5) return mask * mix(rolling, ridged * 0.28, 0.22);
  if (kind < 2.5) return mask * plateau;
  float islands = smoothstep(0.46, 0.64, fbm(q * 4.2));
  return mask * islands * rolling;
}

float territoryMask(vec3 p, out int idx, out vec4 meta, out float elev) {
  vec3 w = domainWarp(p);
  vec3 site;
  vec3 site2;
  nearestTwo(normalize(w), idx, site, site2, meta);
  float siteLen = max(length(site), 1e-5);
  float site2Len = max(length(site2), 1e-5);
  vec3 siteN = site / siteLen;
  vec3 site2N = site2 / site2Len;
  float scale = siteAt(idx).w;
  float dist = acos(clamp(dot(normalize(w), siteN), -1.0, 1.0));
  float cellR = max(0.1, acos(clamp(dot(siteN, site2N), -1.0, 1.0)) * 0.46);
  float n = fbm(w * (4.4 + meta.g * 2.0) + meta.g * 9.0);
  float landR = cellR * mix(0.4, 0.92, clamp(scale * 0.58, 0.0, 1.0));
  landR *= 0.82 + 0.22 * n;
  landR *= max(0.02, meta.a);
  float mask = 1.0 - smoothstep(landR * 0.7, landR, dist);
  if (meta.r > 2.5) {
    mask *= smoothstep(0.42, 0.6, fbm(p * 5.1 + meta.g * 8.0));
  }
  elev = terrainElev(p, mask, meta.r, meta.g) * meta.b;
  return mask;
}
`;
