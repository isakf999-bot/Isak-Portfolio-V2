---
name: motion-choreography
description: Wind-field motion primitives for the Atlas site — useWind, useGust, StaggerText, ScrollScrub, and the duration/ease table. Use when adding animation, route transitions, scroll scrubs, or gust reactions.
---

# Motion Choreography

One field. One clock. No private eases.

## Source

`lib/wind.ts` is the only time. GSAP ticker and Lenis `raf` are driven from it (Phase 1+). R3F `useFrame` reads the field.

## Tokens

| Token | Use |
| --- | --- |
| `--ease-wind` | Gust in, settle out |
| `--ease-gust` | Reveals, dives |
| `--ease-drift` | UI hover |
| `--dur-instant` 120ms | Reduced-motion route fades |
| `--dur-quick` 280ms | Small UI |
| `--dur-base` 520ms | Default |
| `--dur-slow` 900ms | Hero type |
| `--dur-cinema` 1600ms | Globe dive |

## Primitives (Phase 1)

- `useWind()` snapshot subscribe
- `useGust(cb)`
- `<StaggerText>` per-glyph along wind vector, 18ms
- `<ScrollScrub>` Lenis + ScrollTrigger, `scrub: 0.6`

## Reduced motion

Freeze time, strength 0.12, no gusts, 120ms opacity, globe still except drag.
