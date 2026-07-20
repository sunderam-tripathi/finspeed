#!/usr/bin/env python3
"""Register exact single-SKU product photography on the WEB-035 canvas.

This script is deliberately non-generative.  The warm-theme poster is built
from the governed transparent cutout of the upscaled catalogue photograph.
The dark-theme poster takes its product pixels from the already-reviewed
product-accurate dark-studio photograph, masked by that same exact cutout.
Both are then registered to one shared subject width and baseline before the
responsive WebPs are written.

Sunset Marlin is the one disclosed exception: the delivery contains only
three-quarter photographs.  Scaling that photographed view to 84% width would
clip it vertically, so the script preserves the full governed photograph at
the largest non-clipping scale and records the deviation in geometry.json.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


CANVAS = (3072, 2048)
RESPONSIVE_WIDTHS = (480, 960, 1600)
ALPHA_THRESHOLD = 32
TARGET_WIDTH_PERCENT = 84.0
TARGET_BASELINE_PERCENT = 88.0
MIN_TOP_SAFETY_PERCENT = 7.0
WARM_SURFACE = (247, 244, 238)


@dataclass(frozen=True)
class Singleton:
    product_id: str
    asset_key: str
    source_alias: str
    source_note: str = ""


SINGLETONS = (
    Singleton("hammerhead", "hammerhead-24", "01-raster-masters-4x/products/hammerhead/angle-3.png"),
    Singleton("great-white-shark", "great-white-shark-26", "01-raster-masters-4x/products/great-white/angle-1.png"),
    Singleton("lemon-shark", "lemon-shark-27-5", "01-raster-masters-4x/products/lemon-shark/angle-3.png"),
    Singleton("lightning-marlin", "lightning-marlin-700c", "01-raster-masters-4x/products/lightning-marlin/angle-2.png"),
    Singleton("bull-shark", "bull-shark-29", "01-raster-masters-4x/products/bull-shark/angle-1.png"),
    Singleton("shark-blue", "shark-blue-26-geared", "01-raster-masters-4x/products/shark-blue/angle-1.png"),
    Singleton("mako-shark", "mako-shark-27-5-geared", "01-raster-masters-4x/products/mako-shark/angle-2.png"),
    Singleton(
        "sunset-marlin",
        "sunset-marlin-700c-geared",
        "01-raster-masters-4x/products/sunset-marlin/angle-1.png",
        "Closest governed three-quarter view; no true side profile exists in the verified delivery.",
    ),
)


def alpha_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = np.asarray(image.getchannel("A"), dtype=np.uint8)
    ys, xs = np.where(alpha >= ALPHA_THRESHOLD)
    if not len(xs):
        raise ValueError("cutout has no visible subject pixels")
    return int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)


def clean_transparent_rgb(image: Image.Image) -> Image.Image:
    """Remove invisible colour junk without changing visible product pixels."""
    rgba = np.asarray(image.convert("RGBA"), dtype=np.uint8).copy()
    alpha = rgba[..., 3]
    alpha[alpha < ALPHA_THRESHOLD] = 0
    rgba[..., 3] = alpha
    rgba[..., :3][alpha == 0] = 0
    return Image.fromarray(rgba, "RGBA")


def premultiplied_resize(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Resize RGBA without letting hidden sweep RGB contaminate thin edges."""
    rgba = np.asarray(clean_transparent_rgb(image), dtype=np.float32) / 255.0
    alpha = rgba[..., 3]
    premultiplied = rgba[..., :3] * alpha[..., None]
    channels: list[np.ndarray] = []
    for channel in (*premultiplied.transpose(2, 0, 1), alpha):
        resized = Image.fromarray(channel.astype(np.float32), "F").resize(
            size,
            Image.Resampling.LANCZOS,
        )
        channels.append(np.asarray(resized, dtype=np.float32))
    resized_alpha = np.clip(channels[3], 0.0, 1.0)
    resized_rgb = np.stack(channels[:3], axis=2)
    resized_rgb = np.divide(
        resized_rgb,
        resized_alpha[..., None],
        out=np.zeros_like(resized_rgb),
        where=resized_alpha[..., None] > (1.0 / 255.0),
    )
    output = np.dstack(
        (
            np.clip(resized_rgb * 255.0, 0, 255).astype(np.uint8),
            np.clip(resized_alpha * 255.0, 0, 255).astype(np.uint8),
        )
    )
    output[..., :3][output[..., 3] == 0] = 0
    return Image.fromarray(output, "RGBA")


def target_scale(
    bounds: tuple[int, int, int, int],
) -> tuple[float, str]:
    left, top, right, bottom = bounds
    width_scale = (CANVAS[0] * TARGET_WIDTH_PERCENT / 100.0) / (right - left)
    max_subject_height = CANVAS[1] * (
        TARGET_BASELINE_PERCENT - MIN_TOP_SAFETY_PERCENT
    ) / 100.0
    height_scale = max_subject_height / (bottom - top)
    if height_scale < width_scale:
        return height_scale, "height-limited-governed-source"
    return width_scale, "canonical-width"


def normalize(
    source: Image.Image,
    forced_scale: float | None = None,
) -> tuple[Image.Image, dict[str, float | int | str]]:
    source = clean_transparent_rgb(source)
    source_bounds = alpha_bounds(source)
    scale, conformance = target_scale(source_bounds)
    if forced_scale is not None:
        scale = forced_scale
    resized = premultiplied_resize(
        source,
        (round(source.width * scale), round(source.height * scale)),
    )
    resized_bounds = alpha_bounds(resized)
    target_bottom = round(CANVAS[1] * TARGET_BASELINE_PERCENT / 100.0)
    subject_width = resized_bounds[2] - resized_bounds[0]
    paste_x = round((CANVAS[0] - subject_width) / 2.0) - resized_bounds[0]
    paste_y = target_bottom - resized_bounds[3]
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (paste_x, paste_y))
    canvas = clean_transparent_rgb(canvas)
    left, top, right, bottom = alpha_bounds(canvas)
    metrics: dict[str, float | int | str] = {
        "sourceWidth": source.width,
        "sourceHeight": source.height,
        "scale": round(scale, 8),
        "registrationMode": conformance,
        "leftSafetyPercent": round(left / CANVAS[0] * 100.0, 4),
        "rightSafetyPercent": round((CANVAS[0] - right) / CANVAS[0] * 100.0, 4),
        "topSafetyPercent": round(top / CANVAS[1] * 100.0, 4),
        "baselinePercent": round(bottom / CANVAS[1] * 100.0, 4),
        "subjectWidthPercent": round((right - left) / CANVAS[0] * 100.0, 4),
        "subjectHeightPercent": round((bottom - top) / CANVAS[1] * 100.0, 4),
    }
    return canvas, metrics


def dark_product_cutout(
    governed_cutout: Image.Image,
    reviewed_dark_poster: Image.Image,
) -> Image.Image:
    """Recover only reviewed dark-studio product pixels via the exact mask."""
    poster = reviewed_dark_poster.convert("RGB")
    mask = governed_cutout.getchannel("A").resize(poster.size, Image.Resampling.LANCZOS)
    rgba = np.asarray(poster.convert("RGBA"), dtype=np.uint8).copy()
    rgba[..., 3] = np.asarray(mask, dtype=np.uint8)
    return clean_transparent_rgb(Image.fromarray(rgba, "RGBA"))


def edge_matched_backdrop(source: Image.Image) -> Image.Image:
    backdrop = source.convert("RGB").resize(CANVAS, Image.Resampling.LANCZOS)
    rgb = np.asarray(backdrop, dtype=np.float32)
    height, width = rgb.shape[:2]
    xx = np.minimum(np.arange(width), np.arange(width)[::-1]) / max(width - 1, 1)
    yy = np.minimum(np.arange(height), np.arange(height)[::-1]) / max(height - 1, 1)
    edge = np.minimum(xx[None, :], yy[:, None])
    reveal = np.clip(edge / 0.045, 0.0, 1.0)
    reveal = reveal * reveal * (3.0 - 2.0 * reveal)
    rgb *= reveal[..., None]
    rgb[[0, 1, -2, -1], :, :] = 0
    rgb[:, [0, 1, -2, -1], :] = 0
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def compose_dark(product: Image.Image, backdrop: Image.Image) -> Image.Image:
    stage = edge_matched_backdrop(backdrop).convert("RGBA")
    left, _, right, bottom = alpha_bounds(product)
    shadow = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.ellipse(
        (left - 54, bottom - 22, right + 54, bottom + 68),
        fill=(0, 0, 0, 142),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=38))
    stage.alpha_composite(shadow)
    stage.alpha_composite(product)
    result = np.asarray(stage.convert("RGB"), dtype=np.uint8).copy()
    result[[0, 1, -2, -1], :, :] = 0
    result[:, [0, 1, -2, -1], :] = 0
    return Image.fromarray(result, "RGB")


def responsive_rgba(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return clean_transparent_rgb(premultiplied_resize(image, size))


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def delivered_pixel_metrics(path: Path) -> dict[str, int | dict[str, float]]:
    image = Image.open(path).convert("RGBA")
    alpha = image.getchannel("A")
    alpha_min, alpha_max = alpha.getextrema()
    bounds = alpha.point(lambda value: 255 if value >= ALPHA_THRESHOLD else 0).getbbox()
    if bounds is None:
        raise ValueError(f"{path} has no visible subject")
    left, top, right, bottom = bounds
    subject_width = right - left
    wheel_contacts: list[int] = []
    for fraction in (0.23, 0.79):
        centre = left + round(subject_width * fraction)
        half = max(2, round(subject_width * 0.075))
        crop = alpha.point(lambda value: 255 if value >= ALPHA_THRESHOLD else 0).crop(
            (max(left, centre - half), 0, min(right, centre + half), image.height),
        )
        crop_bounds = crop.getbbox()
        if crop_bounds is not None:
            wheel_contacts.append(crop_bounds[3])
    wheel_baseline = min(wheel_contacts) if wheel_contacts else bottom
    return {
        "subjectThreshold": ALPHA_THRESHOLD,
        "alphaMin": alpha_min,
        "alphaMax": alpha_max,
        "subjectBounds": {
            "leftSafetyPercent": round(left / image.width * 100.0, 4),
            "rightSafetyPercent": round((image.width - right) / image.width * 100.0, 4),
            "topSafetyPercent": round(top / image.height * 100.0, 4),
            # Keep authoring metadata identical to the runtime pixel inspector:
            # use the shallower of the rear/front wheel contact windows so a
            # kickstand or pedal cannot masquerade as the tyre baseline.
            "baselinePercent": round(wheel_baseline / image.height * 100.0, 4),
            "subjectWidthPercent": round((right - left) / image.width * 100.0, 4),
            "subjectHeightPercent": round((bottom - top) / image.height * 100.0, 4),
        },
    }


def save_responsive(
    image: Image.Image,
    destination: Path,
    asset_key: str,
    transparent: bool,
    public_root: Path,
) -> list[dict[str, str | int]]:
    destination.mkdir(parents=True, exist_ok=True)
    outputs: list[dict[str, str | int]] = []
    for width in RESPONSIVE_WIDTHS:
        height = round(width * 2 / 3)
        output = destination / f"{asset_key}-r01-w{width}.webp"
        if transparent:
            resized = responsive_rgba(image, (width, height))
            resized.save(output, "WEBP", lossless=True, method=6)
        else:
            image.resize((width, height), Image.Resampling.LANCZOS).convert("RGB").save(
                output,
                "WEBP",
                lossless=True,
                method=6,
            )
        asset: dict[str, str | int | dict] = {
            "path": f"/{output.relative_to(public_root).as_posix()}",
            "width": width,
            "height": height,
            "theme": "light" if transparent else "dark",
            "alphaMode": "transparent" if transparent else "opaque",
            "sha256": sha256(output),
        }
        if transparent:
            asset["pixelMetrics"] = delivered_pixel_metrics(output)
        outputs.append(asset)
    return outputs


def preview(light: Image.Image, dark: Image.Image, proof_dir: Path) -> None:
    warm = Image.new("RGB", CANVAS, WARM_SURFACE)
    warm.paste(light, mask=light.getchannel("A"))
    warm.resize((1600, 1067), Image.Resampling.LANCZOS).save(
        proof_dir / "preview-warm.jpg",
        "JPEG",
        quality=94,
        subsampling=0,
    )
    dark.resize((1600, 1067), Image.Resampling.LANCZOS).save(
        proof_dir / "preview-black.jpg",
        "JPEG",
        quality=94,
        subsampling=0,
    )


def process(entry: Singleton, repo: Path) -> dict:
    products = repo / "apps/web/public/assets/products"
    cutout_path = products / "dark-cutouts" / f"{entry.product_id}-transparent.webp"
    dark_source_path = products / "dark-studio-v2" / f"{entry.product_id}-studio.webp"
    backdrop_path = products / "dark-studio" / "shared-dark-studio-backdrop.webp"
    proof_dir = repo / "specs/proofs/web/WEB-035/masters" / f"{entry.asset_key}-r01"
    proof_dir.mkdir(parents=True, exist_ok=True)

    governed_cutout = Image.open(cutout_path).convert("RGBA")
    light, metrics = normalize(governed_cutout)
    scale = float(metrics["scale"])
    dark_source = dark_product_cutout(
        governed_cutout,
        Image.open(dark_source_path).convert("RGB"),
    )
    dark_product, dark_metrics = normalize(dark_source, forced_scale=scale * (governed_cutout.width / dark_source.width))
    dark = compose_dark(dark_product, Image.open(backdrop_path).convert("RGB"))

    light_master = proof_dir / "light-cutout-master-3072x2048.webp"
    dark_product_master = proof_dir / "dark-product-cutout-master-3072x2048.webp"
    dark_master = proof_dir / "dark-master-3072x2048.png"
    light.save(light_master, "WEBP", lossless=True, method=6)
    dark_product.save(dark_product_master, "WEBP", lossless=True, method=6)
    dark.save(dark_master, "PNG", optimize=True)
    preview(light, dark, proof_dir)

    browser_public_root = repo / "apps/web/public"
    public_root = browser_public_root / "assets/configurator/v1" / entry.product_id / "side-r"
    light_assets = save_responsive(
        light,
        public_root / "light/poster",
        entry.asset_key,
        transparent=True,
        public_root=browser_public_root,
    )
    dark_assets = save_responsive(
        dark,
        public_root / "dark/poster",
        entry.asset_key,
        transparent=False,
        public_root=browser_public_root,
    )
    geometry = {
        "canvas": {"width": CANVAS[0], "height": CANVAS[1]},
        "view": "side-r" if metrics["registrationMode"] == "canonical-width" else "three-quarter-r",
        "productId": entry.product_id,
        "skuId": entry.asset_key,
        "sourceAlias": entry.source_alias,
        "sourceNote": entry.source_note,
        "sourceAssets": {
            "lightCutout": cutout_path.relative_to(repo).as_posix(),
            "darkStudio": dark_source_path.relative_to(repo).as_posix(),
            "darkBackdrop": backdrop_path.relative_to(repo).as_posix(),
        },
        "registration": {
            "targetSubjectWidthPercent": TARGET_WIDTH_PERCENT,
            "targetBaselinePercent": TARGET_BASELINE_PERCENT,
            "minimumTopSafetyPercent": MIN_TOP_SAFETY_PERCENT,
            "alphaSubjectThreshold": ALPHA_THRESHOLD,
        },
        "lightSubjectBounds": metrics,
        "darkSubjectBounds": dark_metrics,
        "canvasConformance": "canonical" if metrics["registrationMode"] == "canonical-width" else "reviewed-source-limited",
        "assets": {"light": light_assets, "dark": dark_assets},
    }
    (proof_dir / "geometry.json").write_text(
        json.dumps(geometry, indent=2) + "\n",
        encoding="utf-8",
    )
    family = {
        "status": "available",
        "authorityTier": "B",
        "provenanceStatus": "deterministic-exact-product-registration",
        "role": "poster",
        "variant": entry.asset_key,
        "canvasConformance": (
            "canonical"
            if metrics["registrationMode"] == "canonical-width"
            else "reviewed-pilot-noncanonical"
        ),
        "sourceSkuIds": [entry.asset_key],
        "generationRecord": "specs/proofs/web/WEB-035/asset-normalization/singletons-r01.md",
        "assets": [*light_assets, *dark_assets],
    }
    if metrics["registrationMode"] != "canonical-width":
        family["layoutReview"] = {
            "status": "known-deviation",
            "reason": (
                "The verified delivery contains only a tall three-quarter view. "
                "Forcing 84-percent subject width would clip governed product pixels, "
                "so revision 01 preserves the complete photograph at the largest safe scale."
            ),
        }
    (proof_dir / "manifest-family.json").write_text(
        json.dumps(family, indent=2) + "\n",
        encoding="utf-8",
    )
    return geometry


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--product-id", action="append")
    args = parser.parse_args()
    repo = args.repo.resolve()
    requested = set(args.product_id or [entry.product_id for entry in SINGLETONS])
    unknown = requested - {entry.product_id for entry in SINGLETONS}
    if unknown:
        parser.error(f"unknown product id(s): {', '.join(sorted(unknown))}")
    results = [process(entry, repo) for entry in SINGLETONS if entry.product_id in requested]
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
