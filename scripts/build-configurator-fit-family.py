#!/usr/bin/env python3
"""Normalize one reviewed configurator fit visual.

This helper is intentionally conservative.  It accepts an already-reviewed
transparent product cutout, places it on the WEB-035 canonical 3072 x 2048
canvas, and derives both the transparent light poster and an opaque dark-studio
poster from exactly the same registered product pixels.  The script never
generates, redraws, or swaps a bicycle component.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


CANVAS = (3072, 2048)
RESPONSIVE_WIDTHS = (480, 960, 1600)
ALPHA_THRESHOLD = 32


def subject_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= ALPHA_THRESHOLD else 0)
    bounds = mask.getbbox()
    if bounds is None:
        raise ValueError("the supplied cutout has no visible subject")
    return bounds


def normalize_cutout(
    source: Path,
    target_width_percent: float,
    baseline_percent: float,
) -> tuple[Image.Image, dict[str, float | int]]:
    image = Image.open(source).convert("RGBA")
    source_bounds = subject_bounds(image)
    left, top, right, bottom = source_bounds

    target_subject_width = round(CANVAS[0] * target_width_percent / 100.0)
    scale = target_subject_width / (right - left)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )

    scaled_left = round(left * scale)
    scaled_bottom = round(bottom * scale)
    target_left = round((CANVAS[0] - target_subject_width) / 2)
    target_bottom = round(CANVAS[1] * baseline_percent / 100.0)
    paste_x = target_left - scaled_left
    paste_y = target_bottom - scaled_bottom

    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (paste_x, paste_y))
    bounds = subject_bounds(canvas)
    b_left, b_top, b_right, b_bottom = bounds
    metrics: dict[str, float | int] = {
        "sourceWidth": image.width,
        "sourceHeight": image.height,
        "scale": round(scale, 8),
        "pasteX": paste_x,
        "pasteY": paste_y,
        "left": b_left,
        "top": b_top,
        "right": b_right,
        "bottom": b_bottom,
        "leftSafetyPercent": round(b_left / CANVAS[0] * 100.0, 4),
        "rightSafetyPercent": round((CANVAS[0] - b_right) / CANVAS[0] * 100.0, 4),
        "topSafetyPercent": round(b_top / CANVAS[1] * 100.0, 4),
        "baselinePercent": round(b_bottom / CANVAS[1] * 100.0, 4),
        "subjectWidthPercent": round((b_right - b_left) / CANVAS[0] * 100.0, 4),
        "subjectHeightPercent": round((b_bottom - b_top) / CANVAS[1] * 100.0, 4),
    }
    return canvas, metrics


def edge_match_backdrop(source: Path) -> Image.Image:
    backdrop = Image.open(source).convert("RGB").resize(CANVAS, Image.Resampling.LANCZOS)
    rgb = np.asarray(backdrop, dtype=np.float32)
    height, width = rgb.shape[:2]
    x = np.minimum(np.arange(width), np.arange(width)[::-1]) / max(width - 1, 1)
    y = np.minimum(np.arange(height), np.arange(height)[::-1]) / max(height - 1, 1)
    distance = np.minimum(y[:, None], x[None, :])
    reveal = np.clip(distance / 0.065, 0.0, 1.0)
    reveal = reveal * reveal * (3.0 - 2.0 * reveal)
    rgb *= reveal[..., None]
    rgb[[0, -1], :, :] = 0
    rgb[:, [0, -1], :] = 0
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def dark_grade(cutout: Image.Image) -> Image.Image:
    rgba = np.asarray(cutout, dtype=np.uint8).copy()
    rgb = rgba[..., :3].astype(np.float32)
    # The source remains recognisable and mechanically exact.  This restrained
    # exposure/temperature transform only places those governed pixels inside
    # the carbon-night studio treatment.
    rgb = np.power(np.clip(rgb / 255.0, 0.0, 1.0), 0.88) * 255.0
    rgb *= np.array([0.84, 0.86, 0.88], dtype=np.float32)
    # A small neutral lift keeps black spokes, cables and brake hardware
    # legible against the carbon backdrop without the false white halo that a
    # flattened white-sweep source would create.
    rgb += np.array([6.0, 7.0, 9.0], dtype=np.float32)
    rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def compose_dark(cutout: Image.Image, backdrop_source: Path) -> Image.Image:
    backdrop = edge_match_backdrop(backdrop_source).convert("RGBA")
    shadow = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    baseline = round(CANVAS[1] * 0.88)
    draw.ellipse(
        (
            round(CANVAS[0] * 0.13),
            baseline - 18,
            round(CANVAS[0] * 0.87),
            baseline + 82,
        ),
        fill=(0, 0, 0, 168),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=42))
    backdrop.alpha_composite(shadow)
    backdrop.alpha_composite(dark_grade(cutout))
    return backdrop.convert("RGB")


def normalize_dark_poster(
    source: Path,
    scale: float,
    vertical_shift_percent: float,
) -> Image.Image:
    """Normalize an existing exact-product dark-studio poster.

    The dark source is already a flattened, product-accurate studio image, so
    retaining its real highlights is preferable to re-extracting black spokes
    and cables from a white catalogue sweep.  Only uniform scale, registration
    and edge matching are applied.
    """
    poster = edge_match_backdrop(source)
    resized = poster.resize(
        (round(CANVAS[0] * scale), round(CANVAS[1] * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGB", CANVAS, (0, 0, 0))
    x = round((CANVAS[0] - resized.width) / 2)
    y = round((CANVAS[1] - resized.height) / 2)
    y += round(CANVAS[1] * vertical_shift_percent / 100.0)
    canvas.paste(resized, (x, y))
    return canvas


def write_responsive(
    image: Image.Image,
    destination: Path,
    asset_key: str,
    revision: str,
    transparent: bool,
) -> list[Path]:
    outputs: list[Path] = []
    destination.mkdir(parents=True, exist_ok=True)
    for width in RESPONSIVE_WIDTHS:
        height = round(width * 2 / 3)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        path = destination / f"{asset_key}-r{revision}-w{width}.webp"
        if transparent:
            resized.convert("RGBA").save(path, "WEBP", lossless=True, method=6)
        else:
            resized.convert("RGB").save(path, "WEBP", lossless=True, method=6)
        outputs.append(path)
    return outputs


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cutout", type=Path, required=True)
    parser.add_argument("--dark-backdrop", type=Path, required=True)
    parser.add_argument(
        "--dark-source-poster",
        type=Path,
        help="Optional exact-product dark poster used instead of recompositing the light cutout.",
    )
    parser.add_argument("--dark-source-scale", type=float, default=0.955)
    parser.add_argument("--dark-source-vertical-shift-percent", type=float, default=1.8)
    parser.add_argument("--master-dir", type=Path, required=True)
    parser.add_argument("--public-root", type=Path, required=True)
    parser.add_argument("--product-id", required=True)
    parser.add_argument("--asset-key", required=True)
    parser.add_argument("--revision", default="01")
    parser.add_argument("--subject-width-percent", type=float, default=84.0)
    parser.add_argument("--baseline-percent", type=float, default=88.0)
    args = parser.parse_args()

    cutout, metrics = normalize_cutout(
        args.cutout.resolve(),
        args.subject_width_percent,
        args.baseline_percent,
    )
    dark = (
        normalize_dark_poster(
            args.dark_source_poster.resolve(),
            args.dark_source_scale,
            args.dark_source_vertical_shift_percent,
        )
        if args.dark_source_poster
        else compose_dark(cutout, args.dark_backdrop.resolve())
    )

    master_dir = args.master_dir.resolve()
    master_dir.mkdir(parents=True, exist_ok=True)
    light_master = master_dir / "light-cutout-master-3072x2048.webp"
    dark_master = master_dir / "dark-master-3072x2048.png"
    cutout.save(light_master, "WEBP", lossless=True, method=6)
    dark.save(dark_master, "PNG", optimize=True)

    light_root = (
        args.public_root.resolve()
        / "assets/configurator/v1"
        / args.product_id
        / "side-r/light/poster"
    )
    dark_root = (
        args.public_root.resolve()
        / "assets/configurator/v1"
        / args.product_id
        / "side-r/dark/poster"
    )
    light_outputs = write_responsive(
        cutout,
        light_root,
        args.asset_key,
        args.revision,
        transparent=True,
    )
    dark_outputs = write_responsive(
        dark,
        dark_root,
        args.asset_key,
        args.revision,
        transparent=False,
    )

    geometry = {
        "canvas": {"width": CANVAS[0], "height": CANVAS[1]},
        "view": "side-r",
        "assetKey": args.asset_key,
        "subjectBounds": metrics,
        "registration": {
            "targetSubjectWidthPercent": args.subject_width_percent,
            "targetBaselinePercent": args.baseline_percent,
            "alphaSubjectThreshold": ALPHA_THRESHOLD,
        },
    }
    geometry_path = master_dir / "geometry.json"
    if geometry_path.exists():
        # Landmark review is intentionally human-governed and must survive
        # deterministic derivative regeneration.  The raster pipeline owns
        # subject bounds; it preserves, but never fabricates, reviewed points.
        prior_geometry = json.loads(geometry_path.read_text(encoding="utf-8"))
        for key in ("landmarks", "measurementMethod", "masks"):
            if key in prior_geometry:
                geometry[key] = prior_geometry[key]
    geometry_path.write_text(
        json.dumps(geometry, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({
        "lightMaster": str(light_master),
        "darkMaster": str(dark_master),
        "metrics": metrics,
        "lightAssets": [str(path) for path in light_outputs],
        "darkAssets": [str(path) for path in dark_outputs],
    }, indent=2))


if __name__ == "__main__":
    main()
