"""Build exact-product transparent cutouts and the shared dark studio stage.

The light catalogue masters already contain the correct product geometry and
colour.  This script removes only their near-white photographic background;
it does not synthesize, reshape, or recolour the bicycles.  Dark mode can then
place those governed pixels over one edge-matched studio backdrop instead of
displaying eleven visibly rectangular photographs.
"""

from __future__ import annotations

import argparse
from pathlib import Path
import sys

import numpy as np
from PIL import Image, ImageFilter

try:
    import cv2
except ModuleNotFoundError:  # Deterministic fallback remains available without OpenCV.
    cv2 = None


PRODUCT_IDS = (
    "bull-shark",
    "great-white-shark",
    "hammerhead",
    "lemon-shark",
    "lightning-marlin",
    "mako-shark",
    "red-snapper",
    "sea-breeze",
    "shark-blue",
    "sunset-marlin",
    "tiger-shark",
)

EDGE_COLOUR = np.array([8.0, 9.0, 11.0], dtype=np.float32)


def smoothstep(low: float, high: float, values: np.ndarray) -> np.ndarray:
    values = np.clip((values - low) / (high - low), 0.0, 1.0)
    return values * values * (3.0 - (2.0 * values))


def estimate_background(rgb: np.ndarray) -> np.ndarray:
    """Estimate the white sweep from all four image borders."""
    strip = max(8, min(rgb.shape[:2]) // 80)
    border = np.concatenate(
        (
            rgb[:strip].reshape(-1, 3),
            rgb[-strip:].reshape(-1, 3),
            rgb[:, :strip].reshape(-1, 3),
            rgb[:, -strip:].reshape(-1, 3),
        ),
        axis=0,
    )
    bright = border[np.min(border, axis=1) > 225]
    return np.median(bright if len(bright) else border, axis=0)


def make_cutout(
    source: Path,
    destination: Path,
    rembg_session: object | None = None,
) -> tuple[float, tuple[int, int, int]]:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image, dtype=np.float32)
    background = estimate_background(rgb)

    if rembg_session is not None:
        if cv2 is None:
            raise RuntimeError("OpenCV is required when --rembg-runtime is used")
        from rembg import remove

        # U2Net provides the semantic foreground silhouette; alpha matting is
        # essential here because bicycle spokes and brake cables are much
        # thinner than a typical ecommerce subject boundary.
        cutout = remove(
            image,
            session=rembg_session,
            alpha_matting=True,
            alpha_matting_foreground_threshold=238,
            alpha_matting_background_threshold=8,
            alpha_matting_erode_size=4,
        ).convert("RGBA")
        rgba = np.asarray(cutout, dtype=np.uint8)
        semantic_alpha = rgba[..., 3].astype(np.float32) / 255.0

        # Semantic segmentation correctly finds the bicycle silhouette, but
        # naturally treats the white spaces inside both wheels as part of one
        # solid object. Intersect it with the known white-sweep matte to open
        # those holes again while retaining every dark spoke and brake cable.
        distance = np.linalg.norm(rgb - background, axis=2)
        sweep_alpha = smoothstep(3.0, 18.0, distance)
        alpha = np.minimum(semantic_alpha, sweep_alpha)

        # Thin structures need a true white-to-alpha recovery or their source
        # anti-aliasing becomes a pale halo on carbon. Keep original RGB on
        # substantial frame/tire regions, and decontaminate only thin spokes,
        # cables, and their immediate matte edge.
        core = (distance > 20.0).astype(np.uint8)
        thickness = cv2.distanceTransform(core, cv2.DIST_L2, 5)
        thick_core = (thickness > 3.0).astype(np.uint8)
        thick_region = cv2.dilate(
            thick_core,
            cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)),
        ).astype(bool)
        thin_region = (~thick_region) & (semantic_alpha > 0.01)

        physical_alpha = np.max(
            np.clip((background - rgb) / np.maximum(background, 1.0), 0.0, 1.0),
            axis=2,
        )
        thin_alpha = np.minimum(semantic_alpha, physical_alpha)
        alpha[thin_region] = thin_alpha[thin_region]

        recovered = (
            rgb - (background * (1.0 - physical_alpha[..., None]))
        ) / np.maximum(physical_alpha[..., None], 0.025)
        recovered = np.clip(recovered, 0.0, 255.0)

        rgba = rgba.copy()
        rgba[..., :3][thin_region] = recovered[thin_region].astype(np.uint8)
        rgba[..., 3] = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    else:
        # Deterministic white-sweep fallback for environments without the
        # optional segmentation runtime.
        distance = np.linalg.norm(rgb - background, axis=2)
        alpha = smoothstep(4.0, 42.0, distance)
        if cv2 is not None:
            alpha = cv2.GaussianBlur(alpha, (0, 0), 0.42)
        else:
            alpha = np.asarray(
                Image.fromarray(np.clip(alpha * 255.0, 0, 255).astype(np.uint8)).filter(
                    ImageFilter.GaussianBlur(radius=0.42)
                ),
                dtype=np.float32,
            ) / 255.0
        alpha[distance >= 50.0] = 1.0
        alpha[distance <= 2.5] = 0.0
        rgba = np.dstack((rgb, alpha[..., None] * 255.0)).astype(np.uint8)

    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(destination, "WEBP", lossless=True, method=6)

    visible = float(np.mean(alpha > 0.02) * 100.0)
    return visible, tuple(int(round(channel)) for channel in background)


def make_backdrop(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image, dtype=np.float32)
    height, width = rgb.shape[:2]

    x = np.minimum(np.arange(width), np.arange(width)[::-1]) / max(width - 1, 1)
    y = np.minimum(np.arange(height), np.arange(height)[::-1]) / max(height - 1, 1)
    edge_distance = np.minimum(y[:, None], x[None, :])
    reveal = smoothstep(0.0, 0.115, edge_distance)[..., None]
    blended = EDGE_COLOUR + ((rgb - EDGE_COLOUR) * reveal)

    # Exact edge pixels make the raster mathematically continuous with the
    # surrounding carbon surface even on high-contrast displays.
    blended[[0, -1], :, :] = EDGE_COLOUR
    blended[:, [0, -1], :] = EDGE_COLOUR

    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8), "RGB").save(
        destination,
        "WEBP",
        lossless=True,
        method=6,
    )


def make_responsive_cutouts(source: Path, output_prefix: Path) -> None:
    """Write the canonical 3:2 responsive widths used by the configurator."""
    image = Image.open(source).convert("RGBA")
    for width in (480, 960, 1600):
        height = round(width * 2 / 3)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        destination = output_prefix.parent / f"{output_prefix.name}-w{width}.webp"
        destination.parent.mkdir(parents=True, exist_ok=True)
        resized.save(destination, "WEBP", lossless=True, method=6)
        print(f"responsive cutout: {destination} ({width}x{height})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--backdrop-source", type=Path)
    parser.add_argument(
        "--rembg-runtime",
        type=Path,
        help="Optional directory containing rembg and its dependencies.",
    )
    parser.add_argument(
        "--backdrop-only",
        action="store_true",
        help="Rebuild only the shared edge-matched studio backdrop.",
    )
    parser.add_argument(
        "--single-source",
        type=Path,
        help="Build one transparent cutout instead of the stock product batch.",
    )
    parser.add_argument(
        "--single-destination",
        type=Path,
        help="Lossless WEBP destination for --single-source.",
    )
    parser.add_argument(
        "--responsive-prefix",
        type=Path,
        help="Optional prefix for 480/960/1600 responsive cutouts.",
    )
    args = parser.parse_args()

    repo = args.repo.resolve()
    product_source = repo / "apps/web/public/assets/products/upscaled"
    cutout_output = repo / "apps/web/public/assets/products/dark-cutouts"
    backdrop_output = repo / "apps/web/public/assets/products/dark-studio/shared-dark-studio-backdrop.webp"

    if args.single_source:
        if not args.single_destination:
            parser.error("--single-destination is required with --single-source")
        destination = args.single_destination.resolve()
        visible, background = make_cutout(args.single_source.resolve(), destination)
        print(f"single cutout: {visible:.1f}% visible; background={background}; destination={destination}")
        if args.responsive_prefix:
            make_responsive_cutouts(destination, args.responsive_prefix.resolve())
        return

    if not args.backdrop_only:
        rembg_session = None
        if args.rembg_runtime:
            sys.path.insert(0, str(args.rembg_runtime.resolve()))
            from rembg import new_session

            rembg_session = new_session("u2net")

        for product_id in PRODUCT_IDS:
            source = product_source / f"{product_id}-1600.webp"
            destination = cutout_output / f"{product_id}-transparent.webp"
            visible, background = make_cutout(source, destination, rembg_session)
            print(f"{product_id}: {visible:.1f}% visible; background={background}")

    if not args.backdrop_source:
        parser.error("--backdrop-source is required unless --single-source is used")

    make_backdrop(args.backdrop_source.resolve(), backdrop_output)
    print(f"shared backdrop: {backdrop_output}")


if __name__ == "__main__":
    main()
