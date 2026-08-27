---
name: template-imagery
description: Source and place high-quality images for Premium Template Library previews and client sites. Use when adding hero images, product photos, team shots, or lookbook assets to templates; when placeholders look weak; or when the user asks for better imagery, Unsplash/Pexels sourcing, next/image setup, or public asset folders.
---

# Template Imagery

Upgrade template visuals with real (or carefully chosen stock) photography instead of flat CSS-only placeholders — without slowing the site or breaking the design system.

## When to use

- A template preview feels unfinished because product/hero areas are only gradients
- Building fashion, e-commerce, business, or landing templates that need atmosphere
- User asks for better images, photos, or visual assets

## Asset layout

Store images per template:

```
public/templates/<template-id>/
  hero.jpg
  product-01.jpg
  product-02.jpg
  ...
  og.jpg
```

Reference in config as `/templates/<template-id>/hero.jpg`.

## Sourcing rules

1. Prefer **subject-true** photos (fabric for fashion, beans for coffee, office for B2B) — not random abstract stock.
2. Allowed free sources (check license per download):
   - Unsplash
   - Pexels
   - Lummi / other CC0 when needed
3. Prefer landscape heroes (~2400×1600) and square/portrait products (~1200×1500).
4. Avoid watermarks, busy text overlays, and faces unless the brief needs people.
5. Match **color temperature** to the template palette (cool cobalt Bazaar ≠ warm Kiln roast).

## Implementation checklist

1. Add or update image paths on the template config / product objects (`image?: string`).
2. Use `next/image` with explicit `width`/`height` or `fill` + sized parent.
3. Always set meaningful `alt` (product name or empty `alt=""` if decorative).
4. Use `sizes` for responsive grids, e.g. `(max-width: 768px) 100vw, 33vw`.
5. Keep CSS tone/gradient as **fallback** behind the image (never leave a broken img empty).
6. Compress before commit when possible (WebP/AVIF via Next is fine; avoid 5MB+ originals).

## Prompting GenerateImage (when stock is wrong)

If the environment supports image generation and stock will not fit:

- Describe material, lighting, camera angle, and palette hexes from the theme
- No logos or fake brand marks in the frame
- One subject, shallow depth of field, premium commercial look
- Save under `public/templates/<id>/` with a clear filename

## Do not

- Hotlink remote Unsplash URLs in production templates (download into `public/`)
- Use the same stock photo across unrelated templates
- Cover hero text with busy imagery — keep contrast (overlay gradient if needed)
- Skip `alt` text on content images

## Quick workflow

```
1. Identify weak visual slots in the template
2. Pick 1 hero + N section/product images aligned to subject + palette
3. Download into public/templates/<id>/
4. Wire paths in config
5. Render with next/image + fallback tone
6. Check mobile crop and LCP (priority on hero only)
```
