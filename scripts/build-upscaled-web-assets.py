"""Build responsive storefront WebP assets from the verified Finspeed 4x delivery.

The delivery PNGs are source masters, not browser payloads. This script verifies
each selected source against DELIVERY-MANIFEST.json, creates bounded WebP
derivatives, and writes a provenance manifest beside the public assets.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public" / "assets"
PROVENANCE = PUBLIC / "asset-provenance-upscaled.json"


@dataclass(frozen=True)
class Export:
    source: str
    output: str
    width: int
    height: int | None = None
    quality: int = 86


PRODUCT_SOURCES = {
    "bull-shark": "01-raster-masters-4x/products/bull-shark/angle-1.png",
    "great-white-shark": "01-raster-masters-4x/products/great-white/angle-1.png",
    "hammerhead": "01-raster-masters-4x/products/hammerhead/angle-3.png",
    "lemon-shark": "01-raster-masters-4x/products/lemon-shark/angle-3.png",
    "lightning-marlin": "01-raster-masters-4x/products/lightning-marlin/angle-2.png",
    "mako-shark": "01-raster-masters-4x/products/mako-shark/angle-2.png",
    "red-snapper": "01-raster-masters-4x/products/red-snapper/side-clean.png",
    "sea-breeze": "01-raster-masters-4x/products/sea-breeze/angle-1.png",
    "shark-blue": "01-raster-masters-4x/products/shark-blue/angle-1.png",
    "sunset-marlin": "01-raster-masters-4x/products/sunset-marlin/angle-1.png",
    "tiger-shark": "01-raster-masters-4x/products/tiger-shark/angle-3.png",
}


CAMPAIGN_EXPORTS = (
    Export("01-raster-masters-4x/campaign/masters/light-summit-clean-desktop.png", "campaign/light-summit-hero-1440.webp", 1440, 900, 84),
    Export("01-raster-masters-4x/campaign/masters/light-summit-clean-desktop.png", "campaign/light-summit-hero.webp", 2880, 1801, 84),
    Export("01-raster-masters-4x/campaign/masters/light-summit-clean-mobile.png", "campaign/light-summit-hero-mobile-720.webp", 720, 960, 84),
    Export("01-raster-masters-4x/campaign/masters/light-summit-clean-mobile.png", "campaign/light-summit-hero-mobile.webp", 1440, 1920, 84),
    Export("01-raster-masters-4x/campaign/masters/quiet-summit-clean-desktop.png", "campaign/quiet-summit-hero-1440.webp", 1440, 900, 84),
    Export("01-raster-masters-4x/campaign/masters/quiet-summit-clean-desktop.png", "campaign/quiet-summit-hero.webp", 2880, 1801, 84),
    Export("01-raster-masters-4x/campaign/masters/quiet-summit-clean-mobile.png", "campaign/quiet-summit-hero-mobile-720.webp", 720, 960, 84),
    Export("01-raster-masters-4x/campaign/masters/quiet-summit-clean-mobile.png", "campaign/quiet-summit-hero-mobile.webp", 1440, 1920, 84),
    Export("01-raster-masters-4x/campaign/masters/light-terrain-mountain-master.png", "campaign/light-terrain-mountain-960.webp", 960, 480, 82),
    Export("01-raster-masters-4x/campaign/masters/light-terrain-mountain-master.png", "campaign/light-terrain-mountain.webp", 1920, 960, 82),
    Export("01-raster-masters-4x/campaign/masters/light-terrain-city-master.png", "campaign/light-terrain-city-960.webp", 960, 480, 82),
    Export("01-raster-masters-4x/campaign/masters/light-terrain-city-master.png", "campaign/light-terrain-city.webp", 1920, 960, 82),
    Export("01-raster-masters-4x/campaign/masters/light-terrain-hybrid-master.png", "campaign/light-terrain-hybrid-960.webp", 960, 480, 82),
    Export("01-raster-masters-4x/campaign/masters/light-terrain-hybrid-master.png", "campaign/light-terrain-hybrid.webp", 1920, 960, 82),
    Export("01-raster-masters-4x/campaign/terrain-mountain.png", "campaign/terrain-mountain-960.webp", 960, 541, 82),
    Export("01-raster-masters-4x/campaign/terrain-mountain.png", "campaign/terrain-mountain.webp", 1920, 1081, 82),
    Export("01-raster-masters-4x/campaign/terrain-city.png", "campaign/terrain-city-960.webp", 960, 480, 82),
    Export("01-raster-masters-4x/campaign/terrain-city.png", "campaign/terrain-city.webp", 1920, 960, 82),
    Export("01-raster-masters-4x/campaign/terrain-hybrid.png", "campaign/terrain-hybrid-960.webp", 960, 480, 82),
    Export("01-raster-masters-4x/campaign/terrain-hybrid.png", "campaign/terrain-hybrid.webp", 1920, 960, 82),
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def fit_height(source: Image.Image, width: int) -> int:
    return round(source.height * width / source.width)


def build_export(source_root: Path, export: Export, source_records: dict[str, dict]) -> dict:
    source_path = source_root / export.source
    source_record = source_records.get(export.source)
    if source_record is None:
        raise ValueError(f"Missing delivery manifest record: {export.source}")
    if not source_path.exists():
        raise FileNotFoundError(source_path)

    actual_source_hash = sha256(source_path)
    expected_source_hash = source_record["sha256"].upper()
    if actual_source_hash != expected_source_hash:
        raise ValueError(f"Source hash mismatch for {export.source}")

    output_path = PUBLIC / export.output
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source_path) as source:
        rgb = source.convert("RGB")
        height = export.height or fit_height(rgb, export.width)
        resized = rgb.resize((export.width, height), Image.Resampling.LANCZOS)
        resized.save(output_path, "WEBP", quality=export.quality, method=6)

    return {
        "source": export.source,
        "source_sha256": actual_source_hash,
        "output": f"assets/{export.output}",
        "output_sha256": sha256(output_path),
        "width": export.width,
        "height": height,
        "bytes": output_path.stat().st_size,
        "format": "WEBP",
        "quality": export.quality,
        "resampling": "Pillow LANCZOS",
    }


def exports() -> list[Export]:
    product_exports = []
    for product_id, source in PRODUCT_SOURCES.items():
        for width in (480, 960, 1600):
            product_exports.append(
                Export(source, f"products/upscaled/{product_id}-{width}.webp", width, quality=86)
            )
    return [*CAMPAIGN_EXPORTS, *product_exports]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="Path to Finspeed-Upscaled-Final")
    args = parser.parse_args()
    source_root = args.source.resolve()
    delivery_manifest = source_root / "DELIVERY-MANIFEST.json"
    manifest = json.loads(delivery_manifest.read_text(encoding="utf-8-sig"))
    source_records = {record["delivery_path"]: record for record in manifest["records"]}

    records = []
    for export in exports():
        record = build_export(source_root, export, source_records)
        records.append(record)
        print(f"{record['output']}\t{record['width']}x{record['height']}\t{record['bytes']} bytes")

    provenance = {
        "schema_version": 1,
        "source_package": manifest.get("package"),
        "source_manifest_sha256": sha256(delivery_manifest),
        "encoder": f"Pillow {Image.__version__}",
        "assets": records,
    }
    PROVENANCE.write_text(json.dumps(provenance, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {PROVENANCE.relative_to(ROOT)} ({len(records)} assets)")


if __name__ == "__main__":
    main()
