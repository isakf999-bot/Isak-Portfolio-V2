import { contourGlsl } from "./chunks/contour";
import { ditherGlsl } from "./chunks/dither";
import { fbmGlsl } from "./chunks/fbm";
import { noiseGlsl } from "./chunks/noise";

export const strataVertex = /* glsl */ `
${noiseGlsl}
${fbmGlsl}

uniform float uWindTime;
uniform vec2 uWindDir;
uniform float uWindStrength;
uniform float uGustPhase;
uniform float uReduce;
uniform float uActive;

attribute float aRock;
attribute float aIndex;

varying vec3 vPos;
varying float vRock;
varying float vIndex;
varying float vElev;

void main() {
  vec3 p = position;
  float elev = fbm(p * 2.4 + vec3(aRock * 3.1, aIndex, 0.4));
  p.x += (elev - 0.5) * 0.08;
  p.z += (elev - 0.5) * 0.05;
  p.x += uWindDir.x * 0.012 * uWindStrength * (1.0 - uReduce) * p.y;
  vec4 world = instanceMatrix * vec4(p, 1.0);
  vPos = p;
  vRock = aRock;
  vIndex = aIndex;
  vElev = elev;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const strataFragment = /* glsl */ `
${ditherGlsl}
${contourGlsl}

uniform float uWindTime;
uniform vec2 uWindDir;
uniform float uWindStrength;
uniform float uGustPhase;
uniform float uActive;

varying vec3 vPos;
varying float vRock;
varying float vIndex;
varying float vElev;

void main() {
  vec3 paper = vec3(1.0);
  vec3 ink = vec3(0.03921568627);
  float density = mix(0.18, 0.62, vRock / 2.0);
  density += vElev * 0.22;
  float dim = 0.72 + 0.28 * (1.0 - step(0.5, abs(vIndex - uActive)));
  float stipple = hatch(density * dim, gl_FragCoord.xy + vec2(vRock * 3.0, vIndex * 5.0));
  float beds = isoline(vPos.y * mix(6.0, 14.0, vRock / 2.0), 1.6);
  float marks = max(stipple, beds * 0.85);
  vec3 color = mix(paper, ink, clamp(marks, 0.0, 1.0));
  gl_FragColor = vec4(color, 1.0);
}
`;
