---
name: living-background
description: Build a living video hero for marketing and portfolio sites — real camera footage (forest, weather, slow pans) that sits behind a clean white page. Use when the user asks for a moving background, living backdrop, levande bakgrund, or a wow hero like isakweb.se. Prefer filmed video over 3D/R3F unless they explicitly want a canvas scene.
---

# Living Background

A signature backdrop should feel like weather in the room — present, slow, and never louder than the type.

## When this applies

- Portfolio or studio heroes that must feel alive
- White or light pages: motion has to read as atmosphere, not a 3D toy
- The user says "wow", "levande", "rörande bakgrund", or points at isakweb.se

## Default recipe (white pages)

Prefer a **full-bleed muted looping video** in the first viewport only — then fade into paper white. Do not put a 3D canvas behind the whole site.

1. **Subject**: one real place with camera motion or wind. Misty birch, overcast woods, snow, fog. Not neon cities, not particles.
2. **Asset**: download into `public/media/` (never hotlink). Poster image for LCP. Delay the `<video>` ~600ms. `muted` `loop` `playsInline`. Freeze when `prefers-reduced-motion: reduce`.
3. **Grade for white**: desaturate and lift (`saturate ~0.6`, slight brightness). Wash with `bg-white/30` and a bottom gradient into the page paper color so the hero belongs to a white site, not a dark film.
4. **Type**: ink on the washed footage, or white type only if the plate stays dark. Interior pages stay paper — video is the home door, not wallpaper on every route.
5. **Size**: keep the mp4 lean (720p is enough for a background). Poster wins LCP.

## Layout

```
home viewport
  HeroVideo (absolute inset-0)
  hero copy (relative)
  rest of site (paper / white)
```

Other routes: no video. Navigation goes to real pages.

## Pairing

Use `frontend-design` for type and spacing. Use `template-imagery` to source the plate. Use `3d-asset-generator` only if the 3D is the product, not the background.
