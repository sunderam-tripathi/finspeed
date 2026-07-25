#!/usr/bin/env python3
"""Extract a clean alpha cutout from a near-white studio render.

The extractor is intentionally colour-distance based: neutral near-white
background pixels become transparent while dark, coloured, and metallic bike
pixels remain opaque.  It is intended for governed configurator pilot renders,
not for arbitrary photography.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--transparent-distance", type=float, default=3.0)
    parser.add_argument("--opaque-distance", type=float, default=42.0)
    args = parser.parse_args()

    image = Image.open(args.input).convert("RGB")
    transparent = args.transparent_distance
    opaque = max(args.opaque_distance, transparent + 1.0)
    span = opaque - transparent

    output: list[tuple[int, int, int, int]] = []
    for red, green, blue in image.get_flattened_data():
        # Euclidean distance from neutral white.  Soft studio shadows retain a
        # partial alpha, while the clean white sweep disappears completely.
        distance = ((255 - red) ** 2 + (255 - green) ** 2 + (255 - blue) ** 2) ** 0.5
        alpha = round(max(0.0, min(1.0, (distance - transparent) / span)) * 255)
        if alpha == 0:
            output.append((0, 0, 0, 0))
            continue

        # Undo the white matte for partially transparent edge pixels.
        if alpha < 255:
            red = max(0, min(255, round(255 - ((255 - red) * 255 / alpha))))
            green = max(0, min(255, round(255 - ((255 - green) * 255 / alpha))))
            blue = max(0, min(255, round(255 - ((255 - blue) * 255 / alpha))))
        output.append((red, green, blue, alpha))

    cutout = Image.new("RGBA", image.size)
    cutout.putdata(output)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    cutout.save(args.out, "PNG", optimize=True)
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
