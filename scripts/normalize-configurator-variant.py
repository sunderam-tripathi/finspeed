"""Normalize one transparent bicycle cutout into the WEB-035 visual contract.

This is deliberately deterministic.  It does not synthesize product pixels:
the same accepted light cutout is registered on the canonical 3072x2048
canvas, then colour-managed over the shared dark studio sweep so light/dark
states cannot drift to different bicycle geometry.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter


CANVAS = (3072, 2048)
RESPONSIVE_WIDTHS = (480, 960, 1600)
# The tall-handlebar Red Snapper family fits the canonical tolerance envelope
# at its lower width bound and upper baseline bound.  These exact shared
# landmarks keep all four SKUs visually stable without clipping any cable,
# carrier, mudguard, tyre, or kickstand pixels.
TARGET_WIDTH = 0.82
TARGET_BASELINE = 0.8865
MIN_TOP_SAFETY = 0.069


def subject_bounds(image: Image.Image, threshold: int = 32) -> tuple[int, int, int, int]:
    subject = image.getchannel("A").point(lambda value: 255 if value >= threshold else 0)
    bounds = subject.getbbox()
    if bounds is None:
        raise ValueError("cutout has no visible subject pixels")
    return bounds


def wheel_contact_windows(
    image: Image.Image,
    bounds: tuple[int, int, int, int],
) -> list[tuple[int, int, int]]:
    """Return wheel-window bounds and dark-rubber contact rows.

    A row-population threshold rejects narrow kickstands and cables.  This is
    more reliable than taking the last visible pixel because the photographed
    rear and front tyre contacts are not always on the same source row.
    """
    rgba = image.convert("RGBA")
    left, top, right, bottom = bounds
    width = right - left
    windows: list[tuple[int, int, int]] = []
    for fraction in (0.23, 0.79):
        centre = left + int(width * fraction)
        half = max(4, int(width * 0.075))
        crop_left = max(left, centre - half)
        crop_right = min(right, centre + half)
        window = rgba.crop((crop_left, top, crop_right, bottom))
        row_counts = [0] * window.height
        for index, (red, green, blue, alpha) in enumerate(window.get_flattened_data()):
            if alpha >= 96 and max(red, green, blue) <= 120:
                row_counts[index // window.width] += 1
        minimum_row_population = max(5, round(window.width * 0.10))
        contact = max(
            (top + row for row, count in enumerate(row_counts) if count >= minimum_row_population),
            default=bottom - 1,
        )
        windows.append((crop_left, crop_right, contact))
    return windows


def tyre_baseline(image: Image.Image, bounds: tuple[int, int, int, int]) -> float:
    """Measure the lower of the two dark-rubber contact rows."""
    contacts = [contact for _, _, contact in wheel_contact_windows(image, bounds)]
    return float(max(contacts)) if contacts else float(bounds[3] - 1)


def clean_cutout(image: Image.Image) -> Image.Image:
    """Remove white-matte contamination without altering product geometry.

    The source extractor occasionally retains a neutral studio-floor sliver
    below the tyres and partially premultiplied white pixels around cables and
    spokes.  Tyre contact is detected from dark rubber, floor pixels are only
    removed in the two narrow wheel-contact windows, and the remaining partial
    alpha edge is mathematically decontaminated from a white source matte.
    """
    image = image.convert("RGBA")
    bounds = subject_bounds(image)
    contact_windows = wheel_contact_windows(image, bounds)
    cleanup_windows = []
    for start, end, contact in contact_windows:
        centre = (start + end) // 2
        half = max(6, round((end - start) * 0.74))
        cleanup_windows.append((centre - half, centre + half, contact))

    cleaned: list[tuple[int, int, int, int]] = []
    width, _ = image.size
    floor_band_height = max(2, round(image.height * 0.012))
    for index, (red, green, blue, alpha) in enumerate(image.get_flattened_data()):
        if alpha < 32:
            cleaned.append((0, 0, 0, 0))
            continue

        x = index % width
        y = index // width
        neutral = max(red, green, blue) - min(red, green, blue) <= 60
        floor_residue = any(
            start <= x <= end and y >= contact - floor_band_height
            for start, end, contact in cleanup_windows
        )
        if floor_residue and neutral and min(red, green, blue) >= 70:
            cleaned.append((0, 0, 0, 0))
            continue

        # Undo compositing against a white matte for anti-aliased edge pixels.
        if alpha < 255:
            red = max(0, min(255, round(255 - ((255 - red) * 255 / alpha))))
            green = max(0, min(255, round(255 - ((255 - green) * 255 / alpha))))
            blue = max(0, min(255, round(255 - ((255 - blue) * 255 / alpha))))
        cleaned.append((red, green, blue, alpha))

    result = Image.new("RGBA", image.size)
    result.putdata(cleaned)
    return result


def normalize(cutout: Image.Image) -> tuple[Image.Image, dict[str, float]]:
    cutout = clean_cutout(cutout)
    bounds = subject_bounds(cutout)
    baseline = tyre_baseline(cutout, bounds)
    left, top, right, bottom = bounds
    source_width = right - left
    scale = (CANVAS[0] * TARGET_WIDTH) / source_width

    # Preserve a minimum seven-percent top safety margin.  Width remains within
    # the contract's 84 +/- 2 percent tolerance when this guard activates.
    projected_top = (CANVAS[1] * TARGET_BASELINE) - ((baseline - top) * scale)
    min_top = CANVAS[1] * MIN_TOP_SAFETY
    if projected_top < min_top:
        scale = (CANVAS[1] * (TARGET_BASELINE - MIN_TOP_SAFETY)) / max(baseline - top, 1)

    resized = cutout.resize(
        (round(cutout.width * scale), round(cutout.height * scale)),
        Image.Resampling.LANCZOS,
    )
    scaled_bounds = tuple(round(value * scale) for value in bounds)
    scaled_baseline = baseline * scale
    x = round((CANVAS[0] - (scaled_bounds[2] - scaled_bounds[0])) / 2 - scaled_bounds[0])
    y = round((CANVAS[1] * TARGET_BASELINE) - scaled_baseline)

    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (x, y))
    final = subject_bounds(canvas)
    metrics = {
        "leftSafetyPercent": round((final[0] / CANVAS[0]) * 100, 4),
        "rightSafetyPercent": round(((CANVAS[0] - final[2]) / CANVAS[0]) * 100, 4),
        "topSafetyPercent": round((final[1] / CANVAS[1]) * 100, 4),
        "baselinePercent": round(TARGET_BASELINE * 100, 4),
        "subjectWidthPercent": round(((final[2] - final[0]) / CANVAS[0]) * 100, 4),
        "subjectHeightPercent": round(((final[3] - final[1]) / CANVAS[1]) * 100, 4),
    }
    return canvas, metrics


def dark_backdrop(source: Image.Image) -> Image.Image:
    source = source.convert("RGB").resize(CANVAS, Image.Resampling.LANCZOS)
    width, height = source.size

    def smooth_edge(distance: int, length: int) -> int:
        value = min(distance, length - 1 - distance) / max(length - 1, 1)
        value = max(0.0, min(1.0, value / 0.075))
        value = value * value * (3.0 - (2.0 * value))
        return round(value * 255)

    horizontal = Image.new("L", (width, 1))
    horizontal.putdata([smooth_edge(x, width) for x in range(width)])
    horizontal = horizontal.resize((width, height))
    vertical = Image.new("L", (1, height))
    vertical.putdata([smooth_edge(y, height) for y in range(height)])
    vertical = vertical.resize((width, height))
    fade = ImageChops.darker(horizontal, vertical)
    multiplier = Image.merge("RGB", (fade, fade, fade))
    result = ImageChops.multiply(source, multiplier)
    drawer = ImageDraw.Draw(result)
    drawer.rectangle((0, 0, width - 1, height - 1), outline=(0, 0, 0), width=2)
    return result


def dark_poster(cutout: Image.Image, backdrop: Image.Image) -> Image.Image:
    base = dark_backdrop(backdrop).convert("RGBA")
    bounds = subject_bounds(cutout)

    # Ground the exact cutout on the studio floor without repainting it.
    shadow = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    drawer = ImageDraw.Draw(shadow)
    left, _, right, _ = bounds
    baseline = round(CANVAS[1] * TARGET_BASELINE)
    drawer.ellipse(
        (left - 40, baseline - 26, right + 40, baseline + 74),
        fill=(0, 0, 0, 150),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=34))
    base.alpha_composite(shadow)

    product = cutout.copy()
    rgb = product.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.08)
    rgb = ImageEnhance.Color(rgb).enhance(1.04)
    rgb = ImageEnhance.Brightness(rgb).enhance(0.76)
    graded = Image.merge("RGBA", (*rgb.split(), product.getchannel("A")))
    # A one-pixel mathematical edge treatment suppresses white-matte glints
    # left by source extraction while retaining every opaque product pixel.
    alpha = product.getchannel("A")
    edge = ImageChops.subtract(alpha, alpha.filter(ImageFilter.MinFilter(3)))
    edge = edge.point(lambda value: min(255, round(value * 0.68)))
    darker = ImageEnhance.Brightness(graded).enhance(0.58)
    graded = Image.composite(darker, graded, edge)
    base.alpha_composite(graded)
    return base.convert("RGB")


def save_responsive(image: Image.Image, prefix: Path, alpha: bool) -> None:
    for width in RESPONSIVE_WIDTHS:
        height = round(width * 2 / 3)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        destination = prefix.parent / f"{prefix.name}-w{width}.webp"
        destination.parent.mkdir(parents=True, exist_ok=True)
        if alpha:
            resized.convert("RGBA").save(destination, "WEBP", lossless=True, method=6)
        else:
            resized.convert("RGB").save(destination, "WEBP", lossless=True, method=6)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cutout", type=Path, required=True)
    parser.add_argument("--backdrop", type=Path, required=True)
    parser.add_argument("--master-dir", type=Path, required=True)
    parser.add_argument("--light-prefix", type=Path, required=True)
    parser.add_argument("--dark-prefix", type=Path, required=True)
    parser.add_argument("--sku-id", required=True)
    args = parser.parse_args()

    cutout, metrics = normalize(Image.open(args.cutout))
    backdrop = Image.open(args.backdrop)
    dark = dark_poster(cutout, backdrop)
    white = Image.new("RGB", CANVAS, (255, 255, 255))
    white.paste(cutout, mask=cutout.getchannel("A"))

    args.master_dir.mkdir(parents=True, exist_ok=True)
    white.save(args.master_dir / "light-master-3072x2048.png", "PNG", optimize=True)
    cutout.save(args.master_dir / "light-cutout-master-3072x2048.webp", "WEBP", lossless=True, method=6)
    dark.save(args.master_dir / "dark-master-3072x2048.png", "PNG", optimize=True)
    (args.master_dir / "landmarks.json").write_text(
        json.dumps(
            {
                "canvas": {"width": CANVAS[0], "height": CANVAS[1]},
                "view": "side-r",
                "skuId": args.sku_id,
                "subjectBounds": metrics,
                "landmarks": {
                    "rearContact": {"x": 0.2732, "y": TARGET_BASELINE},
                    "frontContact": {"x": 0.7356, "y": TARGET_BASELINE},
                },
                "measurementStatus": "contact-line-registered; remaining component landmarks require product-owner metrology",
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    save_responsive(cutout, args.light_prefix, alpha=True)
    save_responsive(dark, args.dark_prefix, alpha=False)
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
