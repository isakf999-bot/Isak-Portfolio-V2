export const contourGlsl = /* glsl */ `
float isoline(float field, float widthMul) {
  float c = abs(fract(field) - 0.5);
  return 1.0 - smoothstep(0.0, fwidth(field) * widthMul, c);
}

float contourLines(float elev, float density) {
  return isoline(elev * density, 1.5);
}

float coastLine(float mask) {
  float edge = abs(mask - 0.5);
  return 1.0 - smoothstep(0.0, fwidth(mask) * 2.4, edge);
}

float graticule(vec3 p) {
  float lat = acos(clamp(p.y, -1.0, 1.0));
  float lon = atan(p.x, p.z);
  float step = 0.26179938779;
  float glat = abs(fract(lat / step) - 0.5);
  float glon = abs(fract(lon / step) - 0.5);
  float wlat = fwidth(lat / step) * 1.35;
  float wlon = fwidth(lon / step) * 1.35;
  float line = 1.0 - min(
    smoothstep(0.0, max(wlat, 1e-4), glat),
    smoothstep(0.0, max(wlon, 1e-4), glon)
  );
  float pole = smoothstep(0.18, 0.42, abs(p.y));
  return line * (1.0 - pole);
}
`;
