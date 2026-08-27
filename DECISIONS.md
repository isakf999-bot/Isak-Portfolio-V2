# DECISIONS

Atlas v2. Spec wins unless a deviation is recorded here.

## Phase 0

### Type
- **Display + body:** Satoshi (Fontshare), weights 400 / 500 / 700, self-hosted `woff2` via `next/font/local`. PP Neue Montreal and Söhne need licences this repo does not have. Satoshi has the geometric punch at `--text-mega` without looking like Inter.
- **Mono / survey voice:** Geist Mono 400 via `next/font/google`, tracking 0.08em, uppercase at `--text-micro`. Spec allows Geist Mono. JetBrains Mono is the alternate if Geist ever fails to load.
- **Not Syne / Figtree.** Those were v1. They read as a different site.

### Colour
- Tokens match Section 4 exactly: ink `#0A0A0A`, paper `#FFFFFF`.
- `--color-mute` and `--color-steel` are aliases of `--color-ink-60` for TYPE only, so existing routes do not invent grey fills during the Phase 1 rewrite.
- Hairlines are 1px ink, not a grey stroke. Optical grey is dither or grain.

### Motion library
- **GSAP** for timeline choreography. Not Framer Motion. One library, as specified.
- Lenis installed in Phase 0; it is disabled on coarse pointers and when `prefers-reduced-motion: reduce`.

### Stack versions
- Next.js is **16.3** already in the repo. Spec says 15+. No downgrade.
- React 19, Tailwind v4, TypeScript `strict` unchanged.
- R3F is **not** installed in Phase 0. The specimen must stand without WebGL.

### Place
- Spec coordinates are Helsingborg (`56.0465° N · 12.6945° E`). Personal bio on `/about` matches.

### Grain
- CSS overlay at `z-index: 9999`, 8fps `steps(8)` on `background-position`, opacity 0.035, `multiply`.
- Tile is a 128×128 1-bit indexed PNG (~1.8KB), under the 6KB cap. True void-and-cluster 8-bit noise would not compress to 6KB; 1-bit newsprint grain matches Birch better. Frozen entirely under reduced motion.
- No WebGL grain pass until Phase 3 can A/B it.

### Reduced motion
- The v1 “kill every animation with `!important` 0.01ms” rule is gone. It would make the spec’d 120ms route fades illegal.
- Reduced-motion path: grain frozen, Lenis off, wind (Phase 1) strength 0.12 / no gusts.

### Specimen
- Lives at `/specimen`, `noindex`. It is the art-direction board, not a product route.

## Phase 1

- Video and WebGL stay unmounted. Home is a typographic arrival so the skeleton can be judged without spectacle.
- `/write` is typed notes in `lib/notes.ts`, not MDX yet. Real copy, 66ch articles. MDX pipeline is Phase 6.
- No PDF file: `/cv` is a print-ready plate. Footer links ↓ CV there.
- Sound toggle cut until a recorded wind bed exists (spec: if not exquisite, cut).
- Cursor is DOM crosshair, `pointer: fine` only. No globe lat/long until Phase 4.
- Experience strata are typographic thickness, oldest at the base of the page visually after the current (top) layer. 3D column is Phase 6.
- Atlas filters are Commerce / Systems / Landing, not the v1 Client/React tags.

## Phase 2

- **Plate:** Pexels 35918987 birch + wind. Camera original is 1280×720 / 15.0s. Not upscaled to 1440p — extra pixels would be invented and the grass is already the motion budget.
- **Colour master** stays at `public/media/source/hero-forest-colour.mp4` (gitignored, ~28MB). The grade is CSS only: `grayscale(1)` → contrast/brightness lift → shared blue-noise dither. Holding the arrival plate (or C) lerps `--chroma` so the photograph returns. Default is still ink. Reduced motion keeps the grade.
- **Encode:** two-pass H.264 at 1050 kbps → `hero-forest.mp4` (~1.97MB). AV1 `.webm` two-pass at 900 kbps. Spec 2.2MB / 1440p is missed on resolution, not on weight. CRF was not lowered past the point where the grass turns to mush.
- **Loop:** first/last frame MSE ≈ 128 (8-bit). Native `loop` would click. Two stacked `<video>` elements crossfade 400ms on `timeupdate`.
- **Wind:** `playbackRate` lerps 0.92–1.06 from `WindField.strength`; gusts pin 1.06.
- **Fallbacks:** `preload="none"`, 600ms after IntersectionObserver, poster WebP for LCP. `saveData` / `effectiveType` ≤ 3g never requests the video. Reduced motion is poster-only.
- **Dissolve:** sticky 200svh track on Home only. Second 100vh ramps dither threshold then paper. Not used on other routes.
- **Grass matte:** no per-pixel rotoscope and no second decoder. Spec allows an SVG path set — evenodd punches along the baseline of the mega type so the graded film shows through the letters. A still photographic overlay would freeze against moving grass.
- **Arrival type** is paper (white) on the dark graded plate. Ink on that grass is unreadable. After the dither-break the document returns to ink on paper. Spec Section 8 allows white type when the plate stays dark; the living-background skill says the same.

## Phase 3

- **R3F + Three** installed (fiber 9 / three 0.185). Drei is on the lockfile for later orbit/HTML labels; IDLE does not use it.
- **Persistent canvas** lives in Chrome via `dynamic(..., { ssr: false })`. A `[data-globe-slot]` on Home (tease) and `/work` is the only layout. The canvas is `position: fixed` and copies the slot rect each frame so the WebGL context survives `/work` → `/about`.
- **IDLE only.** Rotation 0.04 rad/s from `wind.time`. Camera tilted so the terminator splits the disc. Pulse ring every 6s on a Fibonacci site — not a Voronoi capital. No drag, no hover, no dive.
- **Land** is domain-warped FBM continents, not project territories. Phase 4 replaces the mask with spherical Voronoi.
- **Chunks** are TypeScript string modules (`shaders/chunks/*.ts`), one idea per file. Next 16 Turbopack has no first-class `.glsl` loader; the GLSL is still imported once into `shaders/globe.ts`.
- **CSS grain stays.** A second WebGL grain pass was not cheaper to justify; the overlay already exists.
- **Shader fail** uses Three's `debug.onShaderError` and a hard ink overlay, not a black canvas.
- **LOD** follows the spec: icosahedron detail 7 / 6 / 5. Spec's "163k tris" is the vertex count at detail 7.

## Phase 4

- **Sites:** Fibonacci lattice then 8 Lloyd iterations. 11 capitals, one per project, packed into a 16×1 float data texture. No CPU mesh generation.
- **Land** is spherical Voronoi distance vs scale-weighted radius, coast warped with the existing FBM chunk, elevation by `terrain` (ridge / delta / plateau / archipelago). Hover lift and filter visibility live in a second data texture — geometry is never re-uploaded.
- **ORBIT** is a custom spherical rig (damping 0.94, radius 1.6–4.2). IDLE resumes after the velocity dies. Reduced motion still allows drag.
- **LIST ↗** swaps the globe for the typographic index. WebGL-off forces list. The left rail is the semantic keyboard path: focus hovers, Enter dives by routing. The cinematic unroll stays Phase 5.
- **Filters** ALL · COMMERCE · SYSTEMS · LANDING erode non-matching cells over ~600ms with a Bayer wipe, not a fade.

## Phase 5

- **Persistent WebGL is the transition.** View Transitions API is skipped: the globe canvas already survives client navigation, and a document snapshot would fight the unroll. Recorded so a later VT pass is a choice, not a miss.
- **Clock** lives in `lib/dive.ts`, ticked from `wind.subscribe`. Duration is `--dur-cinema` (1.6s). Ease is `--ease-gust` (0.87, 0, 0.13, 1). `router.push` fires at t=0.95 behind the canvas.
- **`wind.gust()`** is public. Dive in / out / adjacent fire a gust at t=0 so chrome can blow along `--wind-x` / `--wind-y`.
- **Unroll** is a vertex lerp on the existing icosahedron: sphere → tangent plane at the capital (`uUnroll`, `uFocus`). Still one draw call. Other territories drop vis in the meta texture.
- **Camera** is a quadratic bezier in `GlobeRig`. During a dive the spherical orbit is frozen; after a survey the pose is held (unrolled, faded) so reverse and adjacent do not snap back to IDLE.
- **Rail and globe click** call `beginDiveIn` instead of routing. List view stays an instant `Link`. Reduced motion skips cinema and pushes immediately.
- **Reverse** is the same 1.6s in the other direction. `← Atlas` intercepts when the hold pose exists. Browser back onto `/work` starts `beginDiveOut` from the held slug.
- **Adjacent** (“Next survey”) dives A → B with the canvas kept mounted. No blank frame; `router.push` still at t=0.95.

## Phase 6

- **Strata** is a separate canvas on `/experience` only — not the persistent globe. One `InstancedMesh`, three beds, thickness from months, Bayer/isoline lithology (till / granite / shale). Scroll scrub 0.18 toward the track, camera descends. WebGL-off keeps the typographic column.
- **Waveform** is a second isolated canvas on `/contact`. Character codes hash into 64 bins; the mesh is a printed seismograph (ink isoline, no glow). Idle wind still breathes when the field is empty.
- **MDX** lives in `content/write/*.mdx` and is compiled with `next-mdx-remote/rsc`. Next 16 / Turbopack has no first-class MDX route loader in this repo; compiling in the server component is the same pattern as GLSL-in-TS. Code blocks are paper-on-ink with a mono filename bar.
- **ScrollScrub** is `lib/scroll-scrub.ts`: Lenis already ticks from wind, so the scrub reads layout on that clock instead of adding ScrollTrigger.
- **Playwright workers** capped at 2. Six parallel `next dev` RSC compiles (globe + MDX + strata) were dropping client `router.push` mid-dive. The cinema still ran; the URL did not. Serial/2-worker is the gate, not a product change.

## Phase 7

- **Budgets are production gzip**, not `next dev` / Turbopack. `scripts/perf-budget.mjs` reads `.next/server/app/*.html`, skips the `nomodule` polyfill (modern browsers never fetch it), and excludes the lazy globe chunk from `/` first-load. Print the number, exit non-zero.
- **Safari** in this gate is Playwright WebKit, not a physical iPhone. WebGL1 is allowed only with `OES_texture_float` + `OES_standard_derivatives`; WebGL2 is preferred.
- **Lighthouse on Moto G Power / Slow 4G** and a physical Android/iOS pass stay ship-time. The Playwright machine is not that device.
- **Globe stays unmounted** until `/` or `/work` so `/about` does not download Three. Once mounted it persists for the session (dive / reverse). Slot tracking rides the wind clock (no private rAF) and skips `getBoundingClientRect` while idle. Wind cancels rAF when the document is hidden.
- **Strata and waveform** keep `frameloop="always"` while their page is open. The persistent globe is `demand` when the slot is offscreen.
- **Mute type** is `color-mix` at 78% ink so 14px copy clears WCAG 2.2 AA in WebKit. A 60% oklab mix computed to `#969696` (2.95:1) there. Still a type token, never a fill.
- **404** is a blank map plate: `UNCHARTED`, graticule, no illustration.

## V2 Part I — instrument, not scenery

- **Wordmark is `Isak`.** Full name stays in the hero meta line, `<title>` / JSON-LD / OG, and `/about`. Satoshi is static 400/500/700, so optical weights are the nearest files (wordmark 400, page h1 500) rather than 420/460.
- **`--text-mega` deleted.** Arrival uses `--text-wordmark` once. Inner pages use `--text-h1` with a mono kicker. The 100svh heading band was dropped — it left a blank plate under the nav before any copy. Page heads now clear the chrome (`3rem`/`4rem`) plus `--space-6`.
- **`useFitText`** scales the wordmark after `document.fonts.ready`. It should not fire; it exists so a font swap cannot clip the hero.
- **Globe is an instrument.** Custom arcball on a unit-sphere proxy (not the displaced icosahedron). CPU `lib/land.ts` shares the GLSL mask so ocean cannot hover. Clicks are a pointerdown/up state machine (path length, duration, ω, same cell). `onClick` on the mesh is gone. Damping is `ω *= 0.055^dt`.
- **Labels:** troika SDF via drei `<Text>` (not Html). Playwright `[data-globe-caption]` is a visually-hidden list because SDF glyphs are not in the accessibility tree. HUD is viewport-fixed, bottom-left. No project photographs yet — the HUD thumb is a monochrome plate (initials) until Part II halftone assets exist.
- **Idle spin and drag rotate the globe quaternion.** Camera only dollies radius [1.7, 4.0]. Dive still flies the camera to the oriented capital.

## V2 Part II — print grade

- **Optical weight** still uses nearest static files (wordmark 400, page h1 500). Satoshi has no variable axis and no single-storey `a` / flat-top `t` worth enabling; discretionary ligatures stay off. Kickers stay Geist Mono rather than faked small-caps.
- **Halftone** is a Canvas 2D plate on the About portrait (not a second WebGL context — that was stealing the globe's context on Windows/ANGLE). The forest poster is film, not a still, so it keeps the hold-for-colour decoder. HUD thumbs stay monochrome initials until project photographs exist.
- **Paper** is a still 512×512 low-frequency tile under the 8fps grain. Mix-blend multiply is off: a full-viewport multiply layer blanks the globe canvas in Chromium.
- **Letterpress** `#press` sits on the wordmark and page h1s; it turns off under `prefers-contrast: more`.
- **Print** `/about` appends a hidden-on-screen CV (work, school, tools, contact). Chrome, WebGL, and video are `display: none`. Type is 11pt mono, black on white, URLs after links.
- **Grid overlay** is Ctrl+G / Ctrl+Shift+G. Chrome steals Ctrl+G for Find, so Ctrl+Shift+G is the chord that actually reaches the page. The overlay stays in production too — it is off until toggled.
- **Globe quality** is zoom contours 1×–4×, capital dots after ~3.35, second label line at 2.6, survey ticks on hover coasts, dashed great-circles to related tags, and a 1px screen-space limb. Land is evaluated in the fragment shader from `vec4` uniform arrays (no RGBA32F vertex textures). No bloom, DoF, god rays, or stars.
- **Inner headings** no longer eat a viewport. `.page-head` clears the nav (`3rem` / `4rem`) plus one `--space-6`; it does not `min-height: 100svh`.

## Definition of done

- **No Phase 8.** Spec Section 13 ends at hardening, then ship. Remaining Section 12/15 work lives here: viewport baselines, 200% zoom, WebGL-off index, saveData, hover labels, reduced-motion axe.
- **/about** stays quiet on the plate; colour recovers only through the portrait halftone on hover. The column rule still draws on scroll.
- **Colour hold** on the forest remains the Phase 2 decoder. Portrait hover is the still-image colour moment.

