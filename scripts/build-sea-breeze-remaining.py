#!/usr/bin/env python3
"""Build the three remaining WEB-035 Sea Breeze fit visual families.

The browser payload is derived from reviewed product cutouts only.  This file
does not generate or repaint a bicycle: it registers the accepted cutouts on
the canonical 3072 x 2048 canvas, derives the dark theme from the exact same
registered pixels, exports lossless WebPs, and writes merge-ready provenance
fragments without touching the shared runtime manifest.
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


REPO = Path(__file__).resolve().parents[1]
CANVAS = (3072, 2048)
WARM_SURFACE = (247, 244, 238)
REGISTRATION_ROOT = REPO / "specs/proofs/web/WEB-035/registration"


def load_normalizer():
    source = REPO / "scripts/normalize-configurator-singletons.py"
    spec = importlib.util.spec_from_file_location("web035_singleton_normalizer", source)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load {source}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


NORMALIZER = load_normalizer()


@dataclass(frozen=True)
class Family:
    sku_id: str
    cutout_path: Path
    authority_tier: str
    provenance_status: str
    generation_record: str
    source_note: str
    source_paths: tuple[Path, ...]
    assisted: bool


FAMILIES = (
    Family(
        sku_id="sea-breeze-24-ibc",
        cutout_path=REPO
        / "apps/web/public/assets/products/dark-cutouts/sea-breeze-transparent.webp",
        authority_tier="B",
        provenance_status="deterministic-verified-product-registration",
        generation_record="specs/proofs/web/WEB-035/asset-normalization/sea-breeze-remaining-r01.md",
        source_note=(
            "Deterministic registration of the governed Sea Breeze IBC photograph. The "
            "24-inch mapping follows the accepted WEB-035 Sea Breeze proof and catalog."
        ),
        source_paths=(
            REPO / "apps/web/public/assets/products/upscaled/sea-breeze-1600.webp",
            REPO
            / "apps/web/public/assets/products/dark-cutouts/sea-breeze-transparent.webp",
        ),
        assisted=False,
    ),
    Family(
        sku_id="sea-breeze-26-non-ibc",
        cutout_path=REPO
        / "specs/proofs/web/WEB-035/masters/sea-breeze-26-non-ibc-r01/reviewed-cutout.png",
        authority_tier="C",
        provenance_status="ai-assisted-carrier-removal-reviewed",
        generation_record="specs/proofs/web/WEB-035/ai-generation/sea-breeze-26-non-ibc-r01.md",
        source_note=(
            "The reviewed 26-inch IBC fit study controls 26-inch geometry; the second "
            "assisted edit removes only the frame-mounted carrier."
        ),
        source_paths=(
            REPO / "apps/web/public/assets/products/upscaled/sea-breeze-1600.webp",
            REPO
            / "specs/proofs/web/WEB-035/masters/sea-breeze-26-ibc-r01/light-chroma-source.png",
            REPO
            / "specs/proofs/web/WEB-035/masters/sea-breeze-26-non-ibc-r01/light-chroma-source.png",
        ),
        assisted=True,
    ),
    Family(
        sku_id="sea-breeze-26-ibc",
        cutout_path=REPO
        / "specs/proofs/web/WEB-035/masters/sea-breeze-26-ibc-r01/reviewed-cutout.png",
        authority_tier="C",
        provenance_status="ai-assisted-wheel-fit-variant-reviewed",
        generation_record="specs/proofs/web/WEB-035/ai-generation/sea-breeze-26-ibc-r01.md",
        source_note=(
            "The governed 24-inch IBC photograph controls identity and equipment; a tightly "
            "constrained assisted edit creates the catalogued 26-inch wheel-and-frame fit."
        ),
        source_paths=(
            REPO / "apps/web/public/assets/products/upscaled/sea-breeze-1600.webp",
            REPO
            / "specs/proofs/web/WEB-035/masters/sea-breeze-26-ibc-r01/light-chroma-source.png",
        ),
        assisted=True,
    ),
)


LANDMARKS = {
    "rearAxle": {"x": 0.235, "y": 0.654},
    "frontAxle": {"x": 0.763, "y": 0.658},
    "rearContact": {"x": 0.235, "y": 0.88},
    "frontContact": {"x": 0.763, "y": 0.88},
    "bottomBracket": {"x": 0.443, "y": 0.675},
    "headTubeTop": {"x": 0.668, "y": 0.3},
    "headTubeBottom": {"x": 0.689, "y": 0.405},
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def dark_grade(cutout: Image.Image) -> Image.Image:
    """Place unchanged cutout pixels in the shared cool night-studio grade."""
    rgba = np.asarray(cutout.convert("RGBA"), dtype=np.uint8).copy()
    alpha = rgba[..., 3]
    rgb = Image.fromarray(rgba[..., :3], "RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.08)
    rgb = ImageEnhance.Color(rgb).enhance(1.04)
    rgb = ImageEnhance.Brightness(rgb).enhance(0.79)
    graded = np.asarray(rgb, dtype=np.float32)
    graded *= np.array([0.97, 1.0, 1.04], dtype=np.float32)
    output = np.dstack((np.clip(graded, 0, 255).astype(np.uint8), alpha))
    output[..., :3][alpha == 0] = 0
    return Image.fromarray(output, "RGBA")


def remove_white_source_matte(cutout: Image.Image) -> Image.Image:
    """Undo white-sweep premultiplication on the governed legacy cutout.

    This only changes antialiased edge RGB. Opaque product pixels and alpha are
    untouched, while thin black spokes no longer become white outlines in the
    night studio.
    """
    rgba = np.asarray(cutout.convert("RGBA"), dtype=np.float32).copy()
    alpha = rgba[..., 3] / 255.0
    partial = (alpha > 0.0) & (alpha < 1.0)
    for channel in range(3):
        values = rgba[..., channel]
        values[partial] = (
            values[partial] - (255.0 * (1.0 - alpha[partial]))
        ) / alpha[partial]
        rgba[..., channel] = np.clip(values, 0.0, 255.0)
    rgba[..., :3][alpha == 0.0] = 0.0
    return Image.fromarray(rgba.astype(np.uint8), "RGBA")


def compose_dark(cutout: Image.Image, backdrop: Image.Image) -> Image.Image:
    stage = NORMALIZER.edge_matched_backdrop(backdrop).convert("RGBA")
    left, _, right, bottom = NORMALIZER.alpha_bounds(cutout)
    shadow = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    draw.ellipse(
        (left - 54, bottom - 22, right + 54, bottom + 68),
        fill=(0, 0, 0, 148),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=38))
    stage.alpha_composite(shadow)
    stage.alpha_composite(dark_grade(cutout))
    pixels = np.asarray(stage.convert("RGB"), dtype=np.uint8).copy()
    pixels[[0, 1, -2, -1], :, :] = 0
    pixels[:, [0, 1, -2, -1], :] = 0
    return Image.fromarray(pixels, "RGB")


def save_preview(light: Image.Image, dark: Image.Image, proof_dir: Path) -> None:
    warm = Image.new("RGB", CANVAS, WARM_SURFACE)
    warm.paste(light, mask=light.getchannel("A"))
    warm.resize((1600, 1067), Image.Resampling.LANCZOS).save(
        proof_dir / "preview-warm.jpg", "JPEG", quality=95, subsampling=0
    )
    dark.resize((1600, 1067), Image.Resampling.LANCZOS).save(
        proof_dir / "preview-black.jpg", "JPEG", quality=95, subsampling=0
    )


def write_metadata(
    family: Family,
    proof_dir: Path,
    metrics: dict,
    assets: list[dict],
) -> dict:
    geometry = {
        "schemaVersion": 1,
        "productId": "sea-breeze",
        "skuId": family.sku_id,
        "canvas": {"width": CANVAS[0], "height": CANVAS[1]},
        "view": "side-r",
        "registrationGroup": f"{family.sku_id}-r01",
        "canvasConformance": "canonical",
        "subjectBounds": metrics,
        "landmarks": LANDMARKS,
        "measurementMethod": (
            "Alpha-derived canonical subject registration; named component landmarks were "
            "reviewed against the accepted Sea Breeze side profile."
        ),
        "sourceNote": family.source_note,
        "sourceAssets": [
            {
                "path": path.relative_to(REPO).as_posix(),
                "sha256": sha256(path),
            }
            for path in family.source_paths
        ],
        "acceptedCutout": {
            "path": family.cutout_path.relative_to(REPO).as_posix(),
            "sha256": sha256(family.cutout_path),
        },
    }
    (proof_dir / "geometry.json").write_text(
        json.dumps(geometry, indent=2) + "\n", encoding="utf-8"
    )
    manifest_family = {
        "status": "available",
        "authorityTier": family.authority_tier,
        "provenanceStatus": family.provenance_status,
        "role": "poster",
        "variant": family.sku_id,
        "canvasConformance": "canonical",
        "sourceSkuIds": [family.sku_id],
        "generationRecord": family.generation_record,
        "assets": assets,
    }
    (proof_dir / "manifest-family.json").write_text(
        json.dumps(manifest_family, indent=2) + "\n", encoding="utf-8"
    )
    return manifest_family


def process(family: Family) -> tuple[dict, dict]:
    proof_dir = (
        REPO / "specs/proofs/web/WEB-035/masters" / f"{family.sku_id}-r01"
    )
    proof_dir.mkdir(parents=True, exist_ok=True)
    cutout = NORMALIZER.clean_transparent_rgb(
        Image.open(family.cutout_path).convert("RGBA")
    )
    if not family.assisted:
        cutout = remove_white_source_matte(cutout)
    light, metrics = NORMALIZER.normalize(cutout)
    backdrop_path = (
        REPO / "apps/web/public/assets/products/dark-studio/shared-dark-studio-backdrop.webp"
    )
    dark = compose_dark(light, Image.open(backdrop_path).convert("RGB"))

    light_master_png = proof_dir / "light-master-3072x2048.png"
    light_master_webp = proof_dir / "light-cutout-master-3072x2048.webp"
    dark_master = proof_dir / "dark-master-3072x2048.png"
    light.save(light_master_png, "PNG", optimize=True)
    light.save(light_master_webp, "WEBP", lossless=True, method=6)
    dark.save(dark_master, "PNG", optimize=True)
    save_preview(light, dark, proof_dir)

    browser_public_root = REPO / "apps/web/public"
    public_root = browser_public_root / "assets/configurator/v1/sea-breeze/side-r"
    light_assets = NORMALIZER.save_responsive(
        light,
        public_root / "light/poster",
        family.sku_id,
        transparent=True,
        public_root=browser_public_root,
    )
    dark_assets = NORMALIZER.save_responsive(
        dark,
        public_root / "dark/poster",
        family.sku_id,
        transparent=False,
        public_root=browser_public_root,
    )
    assets = [*light_assets, *dark_assets]
    manifest_family = write_metadata(family, proof_dir, metrics, assets)
    proof_hashes = {
        "lightMasterPng": sha256(light_master_png),
        "lightMasterWebp": sha256(light_master_webp),
        "darkMasterPng": sha256(dark_master),
        "responsiveAssets": [
            {"path": asset["path"], "sha256": asset["sha256"]}
            for asset in assets
        ],
    }
    (proof_dir / "hashes.json").write_text(
        json.dumps(proof_hashes, indent=2) + "\n", encoding="utf-8"
    )
    return manifest_family, geometry_summary(family, metrics)


def geometry_summary(family: Family, metrics: dict) -> dict:
    return {
        "skuId": family.sku_id,
        "authorityTier": family.authority_tier,
        "assisted": family.assisted,
        "subjectBounds": metrics,
    }


def contact_sheet() -> None:
    families = ("sea-breeze-24-non-ibc",) + tuple(
        family.sku_id for family in FAMILIES
    )
    sheet = Image.new("RGB", (1920, 1280), (8, 9, 11))
    draw = ImageDraw.Draw(sheet)
    cell_width, cell_height = 960, 640
    for index, sku_id in enumerate(families):
        column = index % 2
        row = index // 2
        proof_dir = REPO / "specs/proofs/web/WEB-035/masters" / f"{sku_id}-r01"
        warm_name = "final-warm.jpg" if sku_id == "sea-breeze-24-non-ibc" else "preview-warm.jpg"
        warm = Image.open(proof_dir / warm_name).convert("RGB")
        warm.thumbnail((cell_width, cell_height), Image.Resampling.LANCZOS)
        x, y = column * cell_width, row * cell_height
        sheet.paste(warm, (x, y))
        draw.rectangle((x, y, x + cell_width - 1, y + cell_height - 1), outline=(92, 197, 230), width=2)
        draw.rectangle((x + 18, y + 16, x + 490, y + 58), fill=(0, 0, 0))
        draw.text((x + 30, y + 26), sku_id.upper(), fill=(255, 255, 255))
    REGISTRATION_ROOT.mkdir(parents=True, exist_ok=True)
    sheet.save(REGISTRATION_ROOT / "sea-breeze-fit-contact-sheet-warm-r01.jpg", "JPEG", quality=94)

    dark_sheet = Image.new("RGB", (1920, 1280), (0, 0, 0))
    draw = ImageDraw.Draw(dark_sheet)
    for index, sku_id in enumerate(families):
        column = index % 2
        row = index // 2
        proof_dir = REPO / "specs/proofs/web/WEB-035/masters" / f"{sku_id}-r01"
        dark_name = "final-black.jpg" if sku_id == "sea-breeze-24-non-ibc" else "preview-black.jpg"
        poster = Image.open(proof_dir / dark_name).convert("RGB")
        poster.thumbnail((cell_width, cell_height), Image.Resampling.LANCZOS)
        x, y = column * cell_width, row * cell_height
        dark_sheet.paste(poster, (x, y))
        draw.rectangle((x, y, x + cell_width - 1, y + cell_height - 1), outline=(92, 197, 230), width=2)
        draw.rectangle((x + 18, y + 16, x + 490, y + 58), fill=(0, 0, 0))
        draw.text((x + 30, y + 26), sku_id.upper(), fill=(255, 255, 255))
    dark_sheet.save(REGISTRATION_ROOT / "sea-breeze-fit-contact-sheet-dark-r01.jpg", "JPEG", quality=94)


def main() -> None:
    families: list[dict] = []
    summaries: list[dict] = []
    for family in FAMILIES:
        manifest_family, summary = process(family)
        families.append(manifest_family)
        summaries.append(summary)
    REGISTRATION_ROOT.mkdir(parents=True, exist_ok=True)
    fragment = {
        "schemaVersion": 1,
        "productId": "sea-breeze",
        "patchOperation": "append-to-selectionDependent.fit.families",
        "families": families,
        "geometryReview": summaries,
    }
    (REGISTRATION_ROOT / "sea-breeze-remaining-r01.json").write_text(
        json.dumps(fragment, indent=2) + "\n", encoding="utf-8"
    )
    contact_sheet()
    print(json.dumps(fragment, indent=2))


if __name__ == "__main__":
    main()
