export const fbmGlsl = /* glsl */ `
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  v += a * noise3(p); p = p * 2.03 + 1.7; a *= 0.5;
  v += a * noise3(p); p = p * 2.03 + 1.7; a *= 0.5;
  v += a * noise3(p); p = p * 2.03 + 1.7; a *= 0.5;
  v += a * noise3(p); p = p * 2.03 + 1.7; a *= 0.5;
  v += a * noise3(p);
  return v;
}

float fbmRidged(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  v += a * (1.0 - abs(noise3(p) * 2.0 - 1.0)); p = p * 2.07 + 0.9; a *= 0.5;
  v += a * (1.0 - abs(noise3(p) * 2.0 - 1.0)); p = p * 2.07 + 0.9; a *= 0.5;
  v += a * (1.0 - abs(noise3(p) * 2.0 - 1.0)); p = p * 2.07 + 0.9; a *= 0.5;
  v += a * (1.0 - abs(noise3(p) * 2.0 - 1.0)); p = p * 2.07 + 0.9; a *= 0.5;
  v += a * (1.0 - abs(noise3(p) * 2.0 - 1.0)); p = p * 2.07 + 0.9; a *= 0.5;
  v += a * (1.0 - abs(noise3(p) * 2.0 - 1.0));
  return v;
}

vec3 domainWarp(vec3 p) {
  float w1 = fbm(p * 1.15);
  float w2 = fbm(p * 1.15 + 17.13);
  return p + 0.28 * vec3(w1, w2, w1 - w2);
}

float continentField(vec3 p) {
  float blobs = 0.0;
  blobs += exp(-8.0 * (1.0 - dot(p, normalize(vec3(0.52, 0.22, 0.81)))));
  blobs += exp(-10.0 * (1.0 - dot(p, normalize(vec3(-0.62, 0.12, 0.48)))));
  blobs += exp(-9.5 * (1.0 - dot(p, normalize(vec3(0.08, -0.58, -0.72)))));
  blobs += exp(-11.0 * (1.0 - dot(p, normalize(vec3(-0.18, 0.74, -0.38)))));
  blobs += exp(-12.0 * (1.0 - dot(p, normalize(vec3(0.72, -0.18, -0.42)))));
  blobs += exp(-13.0 * (1.0 - dot(p, normalize(vec3(-0.78, -0.42, 0.18)))));
  return blobs;
}

float landMask(vec3 p) {
  vec3 w = domainWarp(p);
  float n = fbm(w * 1.7);
  float blobs = continentField(w);
  return smoothstep(0.32, 0.54, blobs * 0.78 + n * 0.48);
}

float elevation(vec3 p, float mask) {
  float ridged = fbmRidged(p * 3.2);
  float rolling = fbm(p * 2.35);
  return mask * mix(rolling, ridged, 0.62);
}
`;
