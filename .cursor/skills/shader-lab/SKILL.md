---
name: shader-lab
description: Conventions for GLSL in the Atlas repo — chunk registry, wind uniforms, and failing the build on shader compile errors. Use when writing or editing globe, strata, waveform, dither, contour, FBM, or Voronoi shaders.
---

# Shader Lab

Shaders are source, not decoration. One chunk per idea. Wind uniforms are injected, never reinvented.

## Chunks (write once)

`shaders/chunks/` — `noise.glsl`, `fbm.glsl`, `dither.glsl`, `contour.glsl`, `voronoiSphere.glsl`.

Import into R3F materials. Do not paste FBM into a second file.

## Uniform contract

- Prefix `u`
- Always present on Atlas materials: `uWindTime`, `uWindDir`, `uWindStrength`, `uGustPhase`
- Values come from `lib/wind.ts`. Never `Date.now()` in a shader wrapper.

## Rules

- `fwidth` on every isoline
- Bayer + blue-noise for tone. No grey `vec3(0.5)` fills
- No allocations of `THREE.Vector3` in `useFrame`
- A failed compile must fail the build / show a hard overlay — never a black canvas with a console warning
