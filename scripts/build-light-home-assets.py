"""Build production WebP exports for the WEB-030 light homepage campaign."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "specs" / "proofs" / "web" / "WEB-030" / "artefacts" / "design"
PUBLIC = ROOT / "apps" / "web" / "public" / "assets" / "campaign"


@dataclass(frozen=True)
class Export:
    source: str
    output: str
    size: tuple[int, int]
    quality: int


EXPORTS = (
    Export("light-summit-hero-desktop-source.png", "light-summit-hero.webp", (2880, 1801), 80),
    Export("light-summit-hero-mobile-source.png", "light-summit-hero-mobile.webp", (1440, 1920), 82),
    Export("light-terrain-mountain-source.png", "light-terrain-mountain.webp", (1920, 960), 76),
    Export("light-terrain-city-source.png", "light-terrain-city.webp", (1920, 960), 76),
    Export("light-terrain-hybrid-source.png", "light-terrain-hybrid.webp", (1920, 960), 70),
)


def build(export: Export) -> None:
    source_path = SOURCE / export.source
    output_path = PUBLIC / export.output
    if not source_path.exists():
        raise FileNotFoundError(source_path)

    with Image.open(source_path) as source:
        image = source.convert("RGB").resize(export.size, Image.Resampling.LANCZOS)
        image = image.filter(ImageFilter.UnsharpMask(radius=1.1, percent=45, threshold=3))
        image.save(output_path, "WEBP", quality=export.quality, method=6)

    print(f"{output_path.relative_to(ROOT)}\t{export.size[0]}x{export.size[1]}\t{output_path.stat().st_size} bytes")


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for export in EXPORTS:
        build(export)


if __name__ == "__main__":
    main()
