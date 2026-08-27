---
name: 3d-asset-generator
description: Build interactive 3D asset generators and signature 3D scenes in React (React Three Fiber). Use whenever the user asks for a 3D generator, 3D preview, R3F/Three.js scene, Spline-like configurator, product viewer, craft studio, or a layout with controls on the left and live 3D on the right — even if they only say "3D", "generator", "preview panel", or want a wow hero object. Prefer this skill over flat CSS mockups when depth or interactivity is the point.
---

# 3D Asset Generator

Build memorable 3D experiences in React sites — especially the **controls-left / preview-right** pattern common in modern generator UIs.

## Default stack

Prefer **React Three Fiber + Drei + Three.js** for React/Next apps. It matches how most of this codebase is built and stays portable across client projects.

```bash
npm install three @react-three/fiber @react-three/drei
```

For Next.js App Router: keep the Canvas in a `"use client"` component. Dynamic-import with `ssr: false` when the parent is a Server Component.

## Signature layout: generator on the left

Unless the brief says otherwise, use this shell:

```
┌─────────────────┬──────────────────────────┐
│  CONTROLS        │  LIVE 3D PREVIEW         │
│  (left, ~36%)   │  (right, ~64%)           │
│  prompt/options │  Canvas + orbit/drag     │
│  materials      │  loading + empty states  │
│  generate CTA   │                          │
└─────────────────┴──────────────────────────┘
```

- **Left**: inputs, presets, material toggles, generate button — never overlay controls on the 3D canvas
- **Right**: full-bleed Canvas, clear subject, room to orbit
- **Mobile**: stack — preview first (so the wow lands), controls below

Why left/right: the YouTube-era generator pattern trains users to tweak on the left and watch results on the right. Don't invent a novel chrome unless the brand needs it.

## What "generate" means here

Two valid modes — pick based on the brief:

1. **Procedural / parametric** (default for portfolios & demos): changing left-panel options updates meshes, materials, colors, lighting in real time. No external API.
2. **Asset pipeline**: left panel collects a prompt / refs; right panel shows result mesh/GLB when ready. Document loading, failure, and retry states.

Never fake a generated GLB with a static PNG if the brief promised live 3D.

## Implementation checklist

1. One Canvas, one subject, restrained lighting (ambient + 1–2 directional/point lights).
2. `OrbitControls` with gentle damping; disable zoom on marketing heroes if it fights scroll.
3. Respect `prefers-reduced-motion`: freeze rotation, show a still frame or simplified mesh.
4. Size the Canvas with a real parent height (`min-h-[320px]` / `aspect-square`) — never a collapsed 0-height div.
5. Keep UI copy in the site's language; control labels are short verbs ("Material", "Ljussättning", "Generera").
6. Pair with `frontend-design` for palette/type around the generator chrome — the 3D scene should inherit brand colors via props, not hard-coded neon defaults.

## Hero / marketing use

On marketing sites, a full "AI generator" can confuse. Prefer a **craft studio** framing:

- Left: 2–4 brand-relevant presets (e.g. "Landning", "E-handel", "Företag")
- Right: abstract 3D site-frame / glass panel that morphs with the preset
- Same page copy and section structure stay untouched — the 3D block is visual proof of craft

## Do not

- Drop heavy GLBs without compression / lazy load
- Cover the preview with floating badge clutter
- Use purple glow + dark void as the default look (AI-slop trap)
- Block the main thread on generate — show a progress state

## Quick Next.js pattern

```tsx
"use client";
import dynamic from "next/dynamic";

const Studio = dynamic(() => import("./CraftStudio"), { ssr: false });

export function HeroCraft() {
  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 min-h-[420px]">
      <aside>{/* controls */}</aside>
      <div className="relative min-h-[360px] rounded-2xl overflow-hidden">
        <Studio />
      </div>
    </div>
  );
}
```

## When to read more

If the task is pure photography/stock images, use `template-imagery` instead.
If the task is overall page aesthetics, use `frontend-design` first, then this skill for the 3D signature.
