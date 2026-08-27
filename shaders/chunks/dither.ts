export const ditherGlsl = /* glsl */ `
float bayer4(vec2 frag) {
  int x = int(mod(floor(frag.x), 4.0));
  int y = int(mod(floor(frag.y), 4.0));
  vec4 r0 = vec4(0.0, 8.0, 2.0, 10.0);
  vec4 r1 = vec4(12.0, 4.0, 14.0, 6.0);
  vec4 r2 = vec4(3.0, 11.0, 1.0, 9.0);
  vec4 r3 = vec4(15.0, 7.0, 13.0, 5.0);
  vec4 row = y == 0 ? r0 : y == 1 ? r1 : y == 2 ? r2 : r3;
  float v = x == 0 ? row.x : x == 1 ? row.y : x == 2 ? row.z : row.w;
  return (v + 0.5) / 16.0;
}

float hatch(float density, vec2 frag) {
  return step(bayer4(frag), clamp(density, 0.0, 1.0));
}
`;
