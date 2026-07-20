# Sea Breeze 24 non-IBC visual pair — revision 01

## Purpose

Produce the first selection-dependent Sea Breeze configurator state: the
catalogued 24-inch non-IBC variant, paired across the warm light theme and the
Finspeed night-studio theme. The verified Sea Breeze photograph shows an IBC
carrier, so the non-IBC state requires a constrained assisted edit rather than
claiming the stock photograph is exact.

## Authoritative inputs

| Input | SHA-256 | Use |
| --- | --- | --- |
| `apps/web/public/assets/products/upscaled/sea-breeze-1600.webp` | `FFA1D17F7061916484410D750E09E56141C00DDA2515685BA9D08E5820C0A8F5` | Exact Sea Breeze identity, geometry, components, colour, and catalog angle |
| `apps/web/public/assets/products/dark-studio-v2/sea-breeze-studio.webp` | `0EC83E24E0D9D38FA3E2EA2DAEE951614E6CB803E3A391D1C952E27A4BD3D584` | Existing Finspeed studio lighting and backdrop reference only |

## Generation

- Tool: built-in OpenAI ImageGen image edit
- Seed: not exposed by the built-in tool
- Product/SKU: `sea-breeze` / `sea-breeze-24-non-ibc`
- Requested physical change: remove only the tubular rear IBC carrier/rack.
- Light generated source: `light-chroma-source.png`, SHA-256
  `D17B5B88C0B2BAC5ADDC52CBE49453C3356C4EBF1D8B4FB5756FEE3426379006`.
- Dark generated source: `dark-source.png`, SHA-256
  `1AD3A37B539753C24EE76109CDB2E0D69AD1232F21FB4DC60E7E50FA86CAF445`.

### Light edit prompt

```text
Remove only the turquoise tubular IBC rear carrier/rack above and behind the
rear wheel. Reconstruct only the small newly exposed areas of the rear
mudguard, tyre, background, and stock frame/stay junction that the rack
concealed. Preserve the original turquoise step-through frame geometry,
paint, welds, FINSPEED wordmark and decals; black fork; V-brakes and cable
routes; single-speed drivetrain and chain guard; crank, pedals, saddle,
handlebar, both mudguards, tyres, rims, hubs, spokes, kickstand, wheel
diameter, wheelbase, perspective, scale, baseline, and component layout.
Place the complete bicycle on a perfectly flat solid #ff00ff chroma-key
background with no floor, shadow, reflection, texture, gradient, crop, zoom,
rotation, perspective drift, added component, person, prop, or watermark.
```

### Dark edit prompt

```text
Convert only the environment and lighting of the completed non-IBC bicycle to
the premium Finspeed night studio look. Use a seamless near-black charcoal
backdrop with edge tone near #08090b, a faint cool floor pool, and a restrained
upper-front-left softbox spotlight. Preserve the same physical bicycle,
catalog angle, scale, axles, baseline, geometry, FINSPEED wordmark, decals,
components, cables, wheel set, and non-IBC state. Do not add a carrier, basket,
light, suspension, disc brake, derailleur, gears, prop, smoke, border, crop,
zoom, rotation, recolour, rewritten decal, or crushed-black product detail.
```

## Deterministic post-processing

`scripts/build-configurator-variant-pair.py` removes the uneven magenta key,
despills antialiased black spokes and cables, registers both themes to the
canonical 3072 × 2048 canvas, edge-matches the dark studio poster, and exports
lossless 480/960/1600 WebPs.

```powershell
python scripts/build-configurator-variant-pair.py `
  --light-chroma specs/proofs/web/WEB-035/masters/sea-breeze-24-non-ibc-r01/light-chroma-source.png `
  --dark-source specs/proofs/web/WEB-035/masters/sea-breeze-24-non-ibc-r01/dark-source.png `
  --proof-dir specs/proofs/web/WEB-035/masters/sea-breeze-24-non-ibc-r01 `
  --public-root apps/web/public/assets/configurator/v1 `
  --product-id sea-breeze `
  --asset-key sea-breeze-24-non-ibc
```

## Normalized masters

| Master | SHA-256 |
| --- | --- |
| `light-cutout-source.png` | `2DF02812FE7FBAE601CF211562D7F6A3EDBD6C6435ADDCCBB054113DB47F9962` |
| `light-master-3072x2048.png` | `223AD06E48A6FED57D1EBA957E0F17743D6523245258E93D67ED164285BA9587` |
| `light-cutout-master-3072x2048.webp` | `33339C92A4E3088572B05FAFF046106784CE8DF49B54FC7C7E16120B81D25D2E` |
| `dark-master-3072x2048.png` | `EE28C687A7C00C7F593968FA38DDB9077B3CB66EB12199397B2A95A72D246CD3` |

The alpha-derived 1600-pixel light poster occupies exactly 84.0% of canvas
width, lands at an 88.0037% baseline, and retains 8% horizontal and 10.2156%
top safety. The dark poster measures 83.9844% width and 87.9883% baseline
against its `#020204` edge tone. Responsive metrics and derivative hashes are
recorded in `apps/web/public/assets/configurator/manifest.json`.

## Visual QA

- Warm-surface proof: `final-warm.jpg` on `#f5f1eb`.
- Black-surface matte proof: `final-black.jpg`.
- The light proof has no image rectangle, long matte bands, magenta fringe, or
  clipped bicycle pixels after the final despill pass.
- The dark poster edge is continuous with the black configurator stage and
  keeps the turquoise frame, black lettering, cables, spokes, tyres, and both
  mudguards readable under the night spotlight.
- Both themes show the same full, rackless product at the same registered
  scale and tyre baseline.

## Fidelity boundary and review status

The non-IBC rear area is necessarily reconstructed because no verified
non-IBC Sea Breeze photograph is present in the delivery. Fine pixels inside
and immediately around the removed rack are an assisted interpretation of the
catalogued state, not documentary evidence of an unseen production sample.
The full-frame edit was reviewed against the source for frame silhouette,
colour, Finspeed lettering, component inventory, wheel layout, cables,
mudguards, and rack absence; no additional option was inferred.

Review status: **accepted for the WEB-035 AI-assisted configurator preview**.
Product-owner approval is still required before this image is represented as
documentary product photography or used to authorize a purchasable variant.
