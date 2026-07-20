#!/usr/bin/env python3
"""Build a canonical light/dark configurator poster pair from reviewed AI sources.

The light source must use a flat magenta chroma backdrop. The dark source must
already contain the approved night-studio lighting. This script performs only
deterministic matte extraction, edge despill, canonical registration, and
lossless responsive WebP export; it does not synthesize product pixels.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


CANVAS = (3072, 2048)
TARGET_WIDTH_PERCENT = 0.84
TARGET_BASELINE_PERCENT = 0.88
RESPONSIVE_WIDTHS = (480, 960, 1600)
SUBJECT_ALPHA_THRESHOLD = 32


def smoothstep(low: float, high: float, values: np.ndarray) -> np.ndarray:
    values = np.clip((values - low) / (high - low), 0.0, 1.0)
    return values * values * (3.0 - (2.0 * values))


def alpha_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = np.asarray(image.getchannel("A"))
    ys, xs = np.where(alpha >= SUBJECT_ALPHA_THRESHOLD)
    if not len(xs):
        raise ValueError("light source has no visible subject pixels")
    return int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)


def extract_magenta_chroma(source: Image.Image) -> Image.Image:
    """Remove uneven magenta key pixels while retaining black spokes/cables."""
    rgb = np.asarray(source.convert("RGB"), dtype=np.float32)
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    key_strength = np.minimum(red, blue)
    dominance = key_strength - green

    key_likelihood = (
        smoothstep(14.0, 52.0, dominance)
        * smoothstep(45.0, 115.0, key_strength)
    )
    alpha = 1.0 - key_likelihood
    alpha[(dominance >= 54.0) & (key_strength >= 115.0)] = 0.0
    alpha[(dominance <= 10.0) | (key_strength <= 42.0)] = 1.0

    alpha_u8 = np.array(
        Image.fromarray(np.clip(alpha * 255.0, 0, 255).astype(np.uint8), "L").filter(
            ImageFilter.GaussianBlur(radius=0.28)
        ),
        copy=True,
    )
    alpha_u8[alpha <= 0.005] = 0
    alpha_u8[alpha >= 0.995] = 255

    # Magenta contamination on an antialiased black cable or spoke becomes a
    # colored fringe on warm paper. Cap only pixels that still exhibit key
    # dominance; genuine turquoise and red product pixels do not meet it.
    output_rgb = rgb.copy()
    spill = (dominance > 8.0) & (key_strength > 38.0) & (alpha_u8 > 0)
    anchor = np.maximum(green, np.minimum(red, blue) * 0.18)
    output_rgb[..., 0][spill] = np.minimum(output_rgb[..., 0][spill], anchor[spill])
    output_rgb[..., 2][spill] = np.minimum(output_rgb[..., 2][spill], anchor[spill] * 1.08)

    return Image.fromarray(
        np.dstack((np.clip(output_rgb, 0, 255).astype(np.uint8), alpha_u8)),
        "RGBA",
    )


def normalize_light(source: Image.Image) -> Image.Image:
    width, height = CANVAS
    target_width = round(width * TARGET_WIDTH_PERCENT)
    target_bottom = round(height * TARGET_BASELINE_PERCENT)
    bounds = alpha_bounds(source)
    scale = target_width / (bounds[2] - bounds[0])
    resized = source.resize(
        (round(source.width * scale), round(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    resized_bounds = alpha_bounds(resized)
    offset_x = ((width - target_width) // 2) - resized_bounds[0]
    offset_y = target_bottom - resized_bounds[3]
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (offset_x, offset_y))
    return canvas


def dark_subject_bounds(
    rgb: np.ndarray,
    background: np.ndarray,
) -> tuple[int, int, int, int]:
    distance = np.linalg.norm(rgb - background, axis=2)
    ys, xs = np.where(distance > 50.0)
    if not len(xs):
        raise ValueError("dark source has no detectable subject pixels")
    return int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)


def normalize_dark(source: Image.Image) -> Image.Image:
    width, height = CANVAS
    target_width = round(width * TARGET_WIDTH_PERCENT)
    target_bottom = round(height * TARGET_BASELINE_PERCENT)
    rgb = np.asarray(source.convert("RGB"), dtype=np.float32)
    border = np.concatenate(
        (
            rgb[:6].reshape(-1, 3),
            rgb[-6:].reshape(-1, 3),
            rgb[:, :6].reshape(-1, 3),
            rgb[:, -6:].reshape(-1, 3),
        ),
        axis=0,
    )
    background = np.median(border, axis=0)
    bounds = dark_subject_bounds(rgb, background)
    scale = target_width / (bounds[2] - bounds[0])

    # Fade only the outer 18 source pixels to the measured studio edge tone.
    # The bicycle starts farther inboard, so no product pixel is attenuated.
    y = np.minimum(np.arange(source.height), np.arange(source.height)[::-1])[:, None]
    x = np.minimum(np.arange(source.width), np.arange(source.width)[::-1])[None, :]
    reveal = smoothstep(0.0, 18.0, np.minimum(y, x))[..., None]
    matched = background + ((rgb - background) * reveal)
    matched[[0, -1], :, :] = background
    matched[:, [0, -1], :] = background
    prepared = Image.fromarray(np.clip(matched, 0, 255).astype(np.uint8), "RGB")
    resized = prepared.resize(
        (round(source.width * scale), round(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    resized_rgb = np.asarray(resized, dtype=np.float32)
    resized_bounds = dark_subject_bounds(resized_rgb, background)
    offset_x = ((width - target_width) // 2) - resized_bounds[0]
    offset_y = target_bottom - resized_bounds[3]
    fill = tuple(int(round(channel)) for channel in background)
    canvas = Image.new("RGB", CANVAS, fill)
    canvas.paste(resized, (offset_x, offset_y))
    return canvas


def export_responsive(image: Image.Image, destination: Path, asset_key: str) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    for width in RESPONSIVE_WIDTHS:
        height = round(width * 2 / 3)
        output = destination / f"{asset_key}-r01-w{width}.webp"
        image.resize((width, height), Image.Resampling.LANCZOS).save(
            output,
            "WEBP",
            lossless=True,
            method=6,
        )
        print(f"wrote {output} ({width}x{height})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--light-chroma", required=True, type=Path)
    parser.add_argument("--dark-source", required=True, type=Path)
    parser.add_argument("--proof-dir", required=True, type=Path)
    parser.add_argument("--public-root", required=True, type=Path)
    parser.add_argument("--product-id", required=True)
    parser.add_argument("--asset-key", required=True)
    args = parser.parse_args()

    proof = args.proof_dir.resolve()
    proof.mkdir(parents=True, exist_ok=True)
    cutout = extract_magenta_chroma(Image.open(args.light_chroma).convert("RGB"))
    cutout.save(proof / "light-cutout-source.png", "PNG", optimize=True)
    light_master = normalize_light(cutout)
    light_master.save(proof / "light-master-3072x2048.png", "PNG", optimize=True)
    light_master.save(
        proof / "light-cutout-master-3072x2048.webp",
        "WEBP",
        lossless=True,
        method=6,
    )

    dark_master = normalize_dark(Image.open(args.dark_source).convert("RGB"))
    dark_master.save(proof / "dark-master-3072x2048.png", "PNG", optimize=True)

    public = args.public_root.resolve() / args.product_id / "side-r"
    export_responsive(light_master, public / "light" / "poster", args.asset_key)
    export_responsive(dark_master, public / "dark" / "poster", args.asset_key)


if __name__ == "__main__":
    main()
