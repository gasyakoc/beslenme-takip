#!/usr/bin/env python3
"""Generate BurnBite PWA icons with iOS safe-zone padding."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / "public"
COLOR_TOP = (52, 211, 153)
COLOR_BOTTOM = (5, 150, 105)


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def make_gradient(size: int) -> Image.Image:
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            px[x, y] = (
                lerp(COLOR_TOP[0], COLOR_BOTTOM[0], t),
                lerp(COLOR_TOP[1], COLOR_BOTTOM[1], t),
                lerp(COLOR_TOP[2], COLOR_BOTTOM[2], t),
            )
    return img


def draw_logo(draw: ImageDraw.ImageDraw, size: int, content_scale: float) -> None:
    cx, cy = size / 2, size / 2
    s = size * content_scale

    def tx(x: float) -> float:
        return cx + (x - 256) * (s / 512)

    def ty(y: float) -> float:
        return cy + (y - 256) * (s / 512)

    def ts(v: float) -> float:
        return v * (s / 512)

    # Soft glow
    draw.ellipse(
        (tx(256 - 108), ty(248 - 108), tx(256 + 108), ty(248 + 108)),
        fill=(255, 255, 255, 46),
    )

    # Macro bars
    bars = [
        (188, 168, 28, 72, 242),
        (242, 148, 28, 92, 255),
        (296, 184, 28, 56, 217),
    ]
    for x, y, w, h, alpha in bars:
        draw.rounded_rectangle(
            (tx(x), ty(y), tx(x + w), ty(y + h)),
            radius=max(2, int(ts(8))),
            fill=(255, 255, 255, alpha),
        )

    # Bowl arc
    draw.arc(
        (tx(176), ty(212), tx(336), ty(372)),
        start=200,
        end=-20,
        fill=(255, 255, 255, 255),
        width=max(2, int(ts(22))),
    )

    # Bowl base
    draw.ellipse(
        (tx(164), ty(278), tx(348), ty(334)),
        fill=(255, 255, 255, 242),
    )

    # Subtle smile curve
    draw.arc(
        (tx(192), ty(322), tx(320), ty(390)),
        start=200,
        end=-20,
        fill=(255, 255, 255, 140),
        width=max(1, int(ts(14))),
    )


def render_icon(size: int, content_scale: float) -> Image.Image:
    base = make_gradient(size).convert("RGBA")
    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw_logo(draw, size, content_scale)
    return Image.alpha_composite(base, overlay).convert("RGB")


def save_png(img: Image.Image, path: Path) -> None:
    img.save(path, "PNG", optimize=True, compress_level=9)
    print(f"  {path.name}: {path.stat().st_size // 1024} KB")


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)

    print("Generating icons...")
    master = render_icon(512, content_scale=0.58)
    save_png(master, PUBLIC / "icon-512.png")

    maskable = render_icon(512, content_scale=0.48)
    save_png(maskable, PUBLIC / "icon-maskable-512.png")

    save_png(master.resize((192, 192), Image.Resampling.LANCZOS), PUBLIC / "icon-192.png")
    save_png(master.resize((180, 180), Image.Resampling.LANCZOS), PUBLIC / "apple-touch-icon.png")
    save_png(master.resize((32, 32), Image.Resampling.LANCZOS), PUBLIC / "favicon.png")
    print("Done.")


if __name__ == "__main__":
    main()
