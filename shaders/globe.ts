import { contourGlsl } from "./chunks/contour";
import { ditherGlsl } from "./chunks/dither";
import { fbmGlsl } from "./chunks/fbm";
import { noiseGlsl } from "./chunks/noise";
import { voronoiGlsl } from "./chunks/voronoiSphere";

export const globeVertex = /* glsl */ `
${noiseGlsl}
${fbmGlsl}
${voronoiGlsl}

uniform float uWindTime;
uniform vec2 uWindDir;
uniform float uWindStrength;
uniform float uGustPhase;
uniform float uReduce;
uniform float uUnroll;
uniform vec3 uFocus;

varying vec3 vPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying float vMask;
varying float vElev;
varying float vCell;
varying float vVis;
varying float vHover;

void main() {
  vec3 p = normalize(position);
  int idx;
  vec4 meta;
  float elev;
  float mask = territoryMask(p, idx, meta, elev);
  mask = max(mask, landMask(p));
  elev = max(elev, elevation(p, mask));
  vec3 displaced = p * (1.0 + elev * 0.06);

  float breathe = fbm(p * 2.1 + vec3(uWindDir * uWindTime * 0.04, uWindTime * 0.03));
  displaced += p * breathe * 0.0015 * uWindStrength * (1.0 - uReduce);

  vec3 n = normalize(uFocus);
  vec3 upRef = abs(n.y) > 0.94 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 east = normalize(cross(upRef, n));
  vec3 nrth = normalize(cross(n, east));
  float lx = dot(displaced, east);
  float ly = dot(displaced, nrth);
  float lz = dot(displaced, n);
  float spread = mix(1.0, 2.05, uUnroll);
  vec3 planar = east * (lx * spread) + nrth * (ly * spread) + n * mix(lz, 0.04, uUnroll);
  vec3 finalP = mix(displaced, planar, uUnroll);

  vec4 world = modelMatrix * vec4(finalP, 1.0);
  vPos = p;
  vWorldNormal = normalize(mat3(modelMatrix) * mix(p, n, uUnroll * 0.85));
  vWorldPos = world.xyz;
  vMask = mask;
  vElev = elev;
  vCell = float(idx);
  vVis = meta.a;
  vHover = meta.b;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const globeFragment = /* glsl */ `
${ditherGlsl}
${contourGlsl}

uniform vec3 uLightDir;
uniform float uContourDensity;
uniform vec3 uPulseOrigin;
uniform float uPulseT;
uniform float uWindTime;
uniform vec2 uWindDir;
uniform float uWindStrength;
uniform float uGustPhase;
uniform float uHoverCell;
uniform vec4 uCell[16];
uniform float uSurveyT;
uniform float uCamRadius;

vec4 cellState(float idx) {
  vec4 state = vec4(0.0);
  for (int i = 0; i < 16; i++) {
    if (abs(float(i) - idx) < 0.5) state = uCell[i];
  }
  return state;
}

varying vec3 vPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying float vMask;
varying float vElev;
varying float vCell;
varying float vVis;
varying float vHover;

void main() {
  vec3 paper = vec3(1.0);
  vec3 ink = vec3(0.03921568627);
  vec3 N = normalize(vWorldNormal);
  float ndl = dot(N, normalize(uLightDir));
  float night = smoothstep(0.08, -0.12, ndl);

  vec3 bg = mix(paper, ink, night);
  vec3 fg = mix(ink, paper, night);

  vec4 cell = cellState(vCell);
  float invert = max(cell.r, cell.g);
  float dim = cell.b;
  float cellMatch = 1.0 - step(0.5, abs(vCell - uHoverCell));

  float ditherKill = step(1.0 - vVis, bayer4(gl_FragCoord.xy) * 0.92 + 0.04);
  float land = step(0.5, vMask) * ditherKill;
  float densityMul = mix(1.0, 1.2, invert);
  float contours = contourLines(vElev, uContourDensity * densityMul) * land;
  float edge = abs(vMask * ditherKill - 0.5);
  float coastW = mix(2.4, 0.96, invert);
  float coast = (1.0 - smoothstep(0.0, fwidth(vMask) * coastW, edge)) * ditherKill;
  float dash = step(0.42, fract(atan(vPos.z, vPos.x) * 12.0 - uSurveyT * 6.2831853));
  float tracing = 1.0 - step(0.999, uSurveyT);
  float survey = coast * mix(1.0, dash, tracing) * invert;
  float marks = max(contours, max(coast, survey));

  float density = mix(0.08, 0.72, clamp(vElev * 1.4, 0.0, 1.0));
  float stipple = hatch(density, gl_FragCoord.xy) * land * (1.0 - contours) * mix(1.0, 0.25, dim) * (1.0 - invert);

  float grid = graticule(normalize(vPos)) * mix(1.0 - land, mix(1.0 - land, 0.4, cellMatch), invert) * mix(0.28, 0.55, cellMatch * invert);

  float pulse = 0.0;
  if (uPulseT < 1.0) {
    float ang = acos(clamp(dot(normalize(vPos), normalize(uPulseOrigin)), -1.0, 1.0));
    float ring = abs(ang - uPulseT * 0.55);
    pulse = (1.0 - smoothstep(0.0, fwidth(ang) * 3.0, ring)) * (1.0 - uPulseT);
    pulse *= land;
  }

  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = 1.0 - smoothstep(0.04, 0.16, abs(dot(N, V)));

  float inkAmt = max(max(marks, stipple), max(grid, max(pulse, fres * 0.85)));
  vec3 ground = mix(bg, fg, land * invert);
  vec3 lineCol = mix(fg, bg, invert);
  vec3 color = mix(ground, lineCol, clamp(inkAmt, 0.0, 1.0));
  gl_FragColor = vec4(color, 1.0);
}
`;
