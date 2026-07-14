# WEB-030 light homepage image generation record

Mode: built-in ImageGen lighting/weather edits with the shipped dark campaign files used as edit targets.

## Shared art direction

- Bright early-morning daylight, pale blue sky, soft warm sunlight, fresh natural color, and restrained editorial polish.
- Preserve each target's composition and responsive crop behavior.
- No baked UI, headline, caption, logo overlay, border, or watermark.
- Desktop hero keeps the rider and complete bicycle on the right with a calm left copy zone.
- Mobile hero keeps the complete bicycle in the lower half with a calm upper copy zone.
- Category panels remain panoramic and keep the left third available for the live label.

## Source and output mapping

- `light-summit-hero-desktop-source.png` -> `apps/web/public/assets/campaign/light-summit-hero.webp` (2880 x 1801)
- `light-summit-hero-mobile-source.png` -> `apps/web/public/assets/campaign/light-summit-hero-mobile.webp` (1440 x 1920)
- `light-terrain-mountain-source.png` -> `apps/web/public/assets/campaign/light-terrain-mountain.webp` (1920 x 960)
- `light-terrain-city-source.png` -> `apps/web/public/assets/campaign/light-terrain-city.webp` (1920 x 960)
- `light-terrain-hybrid-source.png` -> `apps/web/public/assets/campaign/light-terrain-hybrid.webp` (1920 x 960)

`scripts/build-light-home-assets.py` performs deterministic Lanczos resizing, restrained output sharpening, and WebP encoding. The built-in generated originals remain unchanged in this proof bundle.
