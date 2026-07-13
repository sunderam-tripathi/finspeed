"""Build the WEB-025 Mako campaign composites from protected source assets.

The bicycle geometry and chromatic identity stay untouched. Only photographic
exposure, neutral-metal highlights, and the extraction edge are corrected so
the supplied product photograph can share the environment's lighting.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import distance_transform_edt


ROOT = Path(__file__).resolve().parents[1]
PROOF = ROOT / "specs" / "proofs" / "web" / "WEB-025" / "artefacts" / "design"
PUBLIC = ROOT / "apps" / "web" / "public" / "assets" / "campaign"
PRODUCT = (
    ROOT
    / "specs"
    / "proofs"
    / "web"
    / "WEB-024"
    / "artefacts"
    / "design"
    / "mako-shark-exact-minus-studio-ground.png"
)
DESKTOP_PLATE = PROOF / "environment-plate-desktop-source.png"
MOBILE_PLATE = PROOF / "environment-plate-mobile-source.png"


def scene_match_product(image: Image.Image) -> Image.Image:
    rgba = np.asarray(image.convert("RGBA"), dtype=np.float32)
    rgb = rgba[..., :3]
    alpha = rgba[..., 3]

    value = rgb.max(axis=2)
    chroma = value - rgb.min(axis=2)
    neutral = chroma < 40

    # Keep mint and yellow identity pixels close to source exposure. Neutral
    # metal/rubber receives the scene's lower-key product-lighting response.
    factor = np.where(neutral, 0.84, 0.93).astype(np.float32)
    highlight = np.clip((value - 78.0) / 177.0, 0.0, 1.0)
    factor *= np.where(neutral, 1.0 - 0.23 * highlight, 1.0)

    # Bright neutral contamination at the alpha boundary is the visible halo.
    # Darken that boundary without eroding the silhouette or thin spokes.
    inside = alpha > 12
    distance = distance_transform_edt(inside)
    boundary = inside & (distance <= 3.2) & neutral
    edge_strength = np.clip((3.2 - distance) / 3.2, 0.0, 1.0)
    factor *= np.where(boundary, 1.0 - 0.24 * edge_strength, 1.0)

    corrected = rgb * factor[..., None]
    # A tiny cool-neutral ambient reflection matches the charcoal plate. It is
    # applied only to neutral components, never to the mint or yellow paint.
    corrected[..., 1] += np.where(neutral & inside, 1.2, 0.0)
    corrected[..., 2] += np.where(neutral & inside, 2.8, 0.0)
    corrected = np.clip(corrected, 0, 255)

    out = np.dstack((corrected, alpha)).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def add_contact_shadows(
    background: Image.Image,
    contacts: list[tuple[int, int, int, int, int]],
) -> Image.Image:
    shadow = Image.new("RGBA", background.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow)
    for cx, cy, width, height, opacity in contacts:
        draw.ellipse(
            (cx - width // 2, cy - height // 2, cx + width // 2, cy + height // 2),
            fill=(0, 2, 4, opacity),
        )
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=14))
    return Image.alpha_composite(background.convert("RGBA"), shadow)


def add_unifying_grain(image: Image.Image, seed: int) -> Image.Image:
    rng = np.random.default_rng(seed)
    arr = np.asarray(image.convert("RGB"), dtype=np.int16)
    noise = rng.normal(0, 0.85, arr.shape[:2])[..., None]
    return Image.fromarray(np.clip(arr + noise, 0, 255).astype(np.uint8), "RGB")


def build_desktop(product: Image.Image) -> Image.Image:
    plate = Image.open(DESKTOP_PLATE).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
    plate = add_contact_shadows(
        plate,
        [
            (1138, 861, 248, 32, 175),
            (1504, 794, 202, 27, 148),
            (1326, 831, 400, 24, 66),
        ],
    )
    scaled = product.resize((1080, 810), Image.Resampling.LANCZOS)
    plate.alpha_composite(scaled, (770, 180))
    return add_unifying_grain(plate, seed=2501)


def build_mobile(product: Image.Image) -> Image.Image:
    plate = Image.open(MOBILE_PLATE).convert("RGB").resize((1080, 1350), Image.Resampling.LANCZOS)
    plate = add_contact_shadows(
        plate,
        [
            (402, 1247, 208, 30, 178),
            (707, 1190, 174, 24, 148),
            (555, 1219, 334, 20, 64),
        ],
    )
    scaled = product.resize((900, 675), Image.Resampling.LANCZOS)
    plate.alpha_composite(scaled, (94, 680))
    return add_unifying_grain(plate, seed=2502)


def main() -> None:
    PROOF.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    source = Image.open(PRODUCT).convert("RGBA")
    corrected = scene_match_product(source)
    corrected.save(PROOF / "mako-shark-scene-matched.png", optimize=True)

    desktop = build_desktop(corrected)
    mobile = build_mobile(corrected)

    desktop.save(PROOF / "mako-shark-hero-v3.png", optimize=True)
    mobile.save(PROOF / "mako-shark-hero-v3-mobile.png", optimize=True)
    desktop.save(PUBLIC / "mako-shark-hero-v3.webp", "WEBP", quality=94, method=6)
    mobile.save(PUBLIC / "mako-shark-hero-v3-mobile.webp", "WEBP", quality=94, method=6)


if __name__ == "__main__":
    main()
