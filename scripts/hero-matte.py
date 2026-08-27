"""Build a luminance matte: white = grass window, black = type shows through."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "media" / "source"
POSTER = ROOT / "public" / "media" / "hero-forest-poster.jpg"
FIRST = SRC / "frame-first.png"
LAST = SRC / "frame-last.png"
OUT = ROOT / "public" / "media" / "hero-grass-matte.png"


def mse(a: Image.Image, b: Image.Image) -> float:
    a = a.convert("L").resize((320, 180), Image.Resampling.BILINEAR)
    b = b.convert("L").resize((320, 180), Image.Resampling.BILINEAR)
    pa, pb = a.tobytes(), b.tobytes()
    total = 0
    for x, y in zip(pa, pb, strict=True):
        d = x - y
        total += d * d
    return total / len(pa)


def build_matte(poster: Image.Image) -> Image.Image:
    gray = poster.convert("L")
    w, h = gray.size
    pix = gray.load()
    mask = Image.new("L", (w, h), 0)
    mp = mask.load()

    for x in range(w):
        y0 = int(h * 0.38)
        y1 = int(h * 0.62)
        band = []
        for y in range(y0, y1):
            here = pix[x, y]
            above = pix[x, max(0, y - 6)]
            band.append((abs(here - above), y))
        band.sort(reverse=True)
        horizon = min(y for _, y in band[: max(1, (y1 - y0) // 8)])
        for y in range(horizon, h):
            t = (y - horizon) / max(1, h - horizon)
            mp[x, y] = 255 if t > 0.08 else int(t / 0.08 * 255)

    return mask.filter(ImageFilter.GaussianBlur(1.6))


def main() -> None:
    poster = Image.open(POSTER)
    if FIRST.exists() and LAST.exists():
        print(f"loop_mse={mse(Image.open(FIRST), Image.open(LAST)):.1f}")
    build_matte(poster).save(OUT, "PNG", optimize=True)
    out = Image.open(OUT)
    px = out.tobytes()
    print(
        f"wrote {OUT} ({OUT.stat().st_size} bytes) mode={out.mode} "
        f"white={sum(1 for v in px if v > 200) / len(px):.3f}"
    )


if __name__ == "__main__":
    main()
