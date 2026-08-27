---
name: perf-budget
description: Fail-loud performance gate for the Atlas site — Lighthouse, R3F frame times, and bundle size. Use at every phase gate and when adding WebGL, video, or large client chunks.
---

# Perf Budget

A gate that warns is not a gate.

## Budgets

- `/` first-load JS ≤ 180KB gzipped excluding the globe chunk
- Globe chunk lazy, `ssr: false`, designed SVG skeleton
- `/` total weight ≤ 3.5MB including video; other routes ≤ 900KB
- LCP < 2.5s, CLS < 0.02, INP < 200ms on Moto G Power / Slow 4G
- p95 frame time < 16.7ms desktop, < 33ms throttled mobile
- Texture memory ≤ 24MB; one globe draw call

## How to fail

Print the number and the budget: `globe chunk 412KB, budget 280KB`. Exit non-zero.

## Phase 0

No WebGL yet. Gate is: specimen paints, grain tile ≤ 6KB (current ~1.8KB), fonts preloaded with `display: swap`.
