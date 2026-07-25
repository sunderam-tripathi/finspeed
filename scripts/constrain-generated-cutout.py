#!/usr/bin/env python3
"""Constrain an assisted bicycle cutout to an exact-product spatial prior.

Image generation can leave low-opacity coloured streaks outside the bicycle
even after chroma-key removal.  This deterministic cleanup keeps generated
pixels only inside a lightly dilated alpha mask from the governed product
cutout.  The dilation allows a reviewed component edit (for example a rigid
fork) while preventing unrelated background artefacts from reaching the
browser asset.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--prior", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--dilate", type=int, default=25)
    args = parser.parse_args()

    generated = Image.open(args.input).convert("RGBA")
    prior = Image.open(args.prior).convert("RGBA")
    prior_alpha = prior.getchannel("A").resize(generated.size, Image.Resampling.LANCZOS)

    # MaxFilter sizes must be odd.  A small blur avoids hard stair-stepping at
    # the outer limit while the generated alpha still owns the actual edge.
    size = max(3, (args.dilate * 2) + 1)
    if size % 2 == 0:
        size += 1
    spatial_prior = prior_alpha.filter(ImageFilter.MaxFilter(size)).filter(
        ImageFilter.GaussianBlur(radius=0.65)
    )
    constrained_alpha = ImageChops.darker(generated.getchannel("A"), spatial_prior)

    result = generated.copy()
    result.putalpha(constrained_alpha)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    result.save(args.out, "PNG", optimize=True)
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
