#!/usr/bin/env python3
"""Create responsive 3:2 poster pairs from reviewed light/dark renders."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


WIDTHS = (480, 960, 1600)


def crop_three_two(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    target = 3 / 2
    ratio = image.width / image.height
    if abs(ratio - target) < 0.001:
        return image
    if ratio > target:
        width = round(image.height * target)
        left = (image.width - width) // 2
        return image.crop((left, 0, left + width, image.height))
    height = round(image.width / target)
    top = (image.height - height) // 2
    return image.crop((0, top, image.width, top + height))


def write_family(source: Path, prefix: Path) -> None:
    image = crop_three_two(Image.open(source))
    prefix.parent.mkdir(parents=True, exist_ok=True)
    for width in WIDTHS:
        height = round(width * 2 / 3)
        output = image.resize((width, height), Image.Resampling.LANCZOS)
        output.save(prefix.with_name(f"{prefix.name}-r01-w{width}.webp"), "WEBP", quality=92, method=6)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--light", required=True, type=Path)
    parser.add_argument("--dark", required=True, type=Path)
    parser.add_argument("--light-prefix", required=True, type=Path)
    parser.add_argument("--dark-prefix", required=True, type=Path)
    args = parser.parse_args()
    write_family(args.light, args.light_prefix)
    write_family(args.dark, args.dark_prefix)
    print(f"Wrote responsive pair for {args.light_prefix.name}")


if __name__ == "__main__":
    main()
