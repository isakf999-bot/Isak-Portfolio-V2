"""Alpha mask: opaque type, short grass punches only at the baseline."""

from __future__ import annotations

import random
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "media" / "hero-name-mask.svg"


def main() -> None:
    rng = random.Random(2026)
    width, height = 1200, 420
    holes: list[str] = []
    x = -20.0
    while x < width + 20:
        blade_w = rng.uniform(5, 14)
        blade_h = rng.uniform(height * 0.06, height * 0.2)
        lean = rng.uniform(-10, 10)
        top = height - blade_h
        cx = x + blade_w / 2 + lean
        holes.append(
            f"M{x:.1f} {height} L{x + blade_w:.1f} {height} L{cx:.1f} {top:.1f} Z"
        )
        x += rng.uniform(6, 13)

    d = f"M0 0h{width}v{height}H0Z {' '.join(holes)}"
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'preserveAspectRatio="none">\n'
        f'  <path fill="#fff" fill-rule="evenodd" d="{d}"/>\n'
        f"</svg>\n"
    )
    OUT.write_text(svg, encoding="utf-8")
    print(f"wrote {OUT} holes={len(holes)} bytes={OUT.stat().st_size}")


if __name__ == "__main__":
    main()
