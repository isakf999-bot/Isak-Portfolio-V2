import { ditherGlsl } from "./chunks/dither";

export const waveformVertex = /* glsl */ `
uniform float uWindTime;
uniform vec2 uWindDir;
uniform float uWindStrength;
uniform float uGustPhase;
uniform sampler2D uBins;
uniform float uReduce;

varying vec2 vUv;
varying float vAmp;

void main() {
  vUv = uv;
  float amp = texture2D(uBins, vec2(uv.x, 0.5)).r;
  float idle = sin(uv.x * 17.0 + uWindTime * 1.35) * 0.045 * uWindStrength;
  idle += sin(uv.x * 5.5 - uWindTime * 0.6) * 0.02 * uWindStrength;
  vAmp = mix(idle, amp + idle * 0.25, 1.0 - uReduce);
  vec3 p = position;
  p.y += vAmp * 0.9;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.0);
}
`;

export const waveformFragment = /* glsl */ `
${ditherGlsl}

uniform float uWindTime;
uniform vec2 uWindDir;
uniform float uWindStrength;
uniform float uGustPhase;

varying vec2 vUv;
varying float vAmp;

void main() {
  vec3 paper = vec3(1.0);
  vec3 ink = vec3(0.03921568627);
  float y = vUv.y - 0.5;
  float d = abs(y - vAmp * 0.42);
  float line = 1.0 - smoothstep(0.0, fwidth(y) * 2.2, d);
  float base = 1.0 - smoothstep(0.0, fwidth(y) * 1.4, abs(y));
  float ticks = 1.0 - smoothstep(0.0, fwidth(vUv.x) * 1.6, abs(fract(vUv.x * 8.0) - 0.5));
  ticks *= step(0.47, vUv.y) * step(vUv.y, 0.53) * 0.35;
  float inkAmt = max(line, max(base * 0.35, ticks));
  vec3 color = mix(paper, ink, clamp(inkAmt, 0.0, 1.0));
  gl_FragColor = vec4(color, 1.0);
}
`;
