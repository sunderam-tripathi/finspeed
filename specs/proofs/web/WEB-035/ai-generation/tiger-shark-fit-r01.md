# Tiger Shark 24 / 26 fit visual family - revision 01

## Purpose

Produce a complete selection-dependent Tiger Shark fit family for the 24-inch
and 26-inch catalog SKUs. Both variants use the same right-facing side profile,
canonical 3072 x 2048 registration, 84% subject width, 88% tyre baseline, and
matching light and Finspeed night-studio treatments. This family changes only
the catalog wheel fit; it does not authorize an unlisted component or finish.

## Authoritative inputs

| Input | SHA-256 | Use |
| --- | --- | --- |
| `apps/web/public/assets/products/upscaled/tiger-shark-1600.webp` | `C138C31F4FCDAF32361F47403AD6C73210D1DD2505C18EF2D271123D3863D502` | Verified Tiger Shark 26-inch identity, orange/graphite finish, geometry, decals, and component inventory |
| `specs/references/handoff/_shared/assets/images/portfolio/MTB/TigerShark/TigerShark_angle3.png` | `7DD83BC86F083A7DD8D4515B73A8B8C4EC515A52535AF00D9EBF0ED49A55F6DE` | Delivery-side alias for the verified Tiger Shark catalog angle |
| `apps/web/public/assets/products/dark-studio-v2/tiger-shark-studio.webp` | `B94D4E06300C4AC17527FDBB9D453D109896FCB53516B0B7D9466ABAD49AA751` | Exact-product 26-inch Finspeed dark-studio poster |

## Image generation

- Tool: built-in OpenAI ImageGen image edit/generation.
- Seed: not exposed by the built-in tool.
- Generated 24-inch product output:
  `C:/Users/SunderamTripathi/.codex/generated_images/019f7b92-9c3a-7070-8d68-8119f857266f/exec-7f02dcb4-6949-4e8b-80c1-40c78d8126b1.png`.
- Generated neutral studio backdrop:
  `C:/Users/SunderamTripathi/.codex/generated_images/019f7b92-9c3a-7070-8d68-8119f857266f/exec-22c37f12-3826-45d7-b2ae-a7d9b685ff6c.png`.
- Generated 26-inch background-only extraction:
  `C:/Users/SunderamTripathi/.codex/generated_images/019f7b92-9c3a-7070-8d68-8119f857266f/exec-c3ac2621-e75a-45c4-892e-b685549ad6c9.png`.

The first 24-inch generation was rejected during review because it introduced
an incorrect `29 x 2.10` tyre marking. It was not promoted. The accepted
revision visibly reads `24 x 2.40`, uses smaller wheels, and was reviewed
against the verified 26-inch source for product silhouette, orange/graphite
finish, wordmark, fork, mudguards, disc brakes, drivetrain, saddle, bar, and
cable inventory.

### Accepted 24-inch edit prompt

```text
Using the verified orange and graphite Finspeed Tiger Shark as the product
identity reference, create the catalog 24-inch fit in the same clean right-
facing side profile. Change only the wheel fit to visibly smaller 24-inch
wheels and preserve the same frame family, orange/graphite paint, FINSPEED and
Tiger Shark markings, fork, disc brakes, drivetrain, cranks, pedals, saddle,
handlebar, cables, tyres, mudguards, and kickstand. The tyre marking must read
24 x 2.40; do not write 26, 27.5, or 29. Place the complete bicycle on a
perfectly flat solid #00ff00 chroma-key background with generous safety space,
no floor, shadow, reflection, texture, person, prop, border, crop, zoom,
rotation, perspective drift, or added component.
```

### Accepted 26-inch background-only prompt

```text
Preserve the supplied verified Tiger Shark 26-inch bicycle exactly as the
subject: same orange/graphite frame, geometry, FINSPEED wordmark, decals,
26 x 2.40 tyres, fork, disc brakes, drivetrain, saddle, mudguards, cables,
spokes, wheelbase, side-right angle, and component positions. Change only the
white catalog environment to a perfectly flat solid #00ff00 chroma-key
background. Do not redraw, recolour, relabel, simplify, crop, zoom, rotate,
replace, add, or remove any bicycle part. No floor, shadow, reflection,
texture, person, prop, border, or watermark.
```

### Dark-studio backdrop prompt

```text
Create an empty premium bicycle product-photo studio backdrop only: seamless
near-black charcoal background, pure-black outer edge tone, a restrained
upper-front-left softbox pool, and a faint cool-neutral floor light directly
under the future product position. No bicycle, object, prop, text, smoke,
visible wall-floor seam, vignette border, frame, or watermark. Landscape
3:2 composition suitable for a right-facing side-profile bicycle.
```

## Transparent-source preparation

The accepted green-screen outputs were copied into the governed proof tree and
passed through the imagegen skill's installed chroma-key helper using border
auto-key sampling, soft matte, 12/220 transparency thresholds, and despill:

```powershell
python "$env:USERPROFILE/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py" `
  --input specs/proofs/web/WEB-035/masters/tiger-shark-24-r01/light-chroma-source.png `
  --out specs/proofs/web/WEB-035/masters/tiger-shark-24-r01/light-cutout-source.png `
  --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill

python "$env:USERPROFILE/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py" `
  --input specs/proofs/web/WEB-035/masters/tiger-shark-26-r01/light-chroma-source.png `
  --out specs/proofs/web/WEB-035/masters/tiger-shark-26-r01/light-cutout-source-chroma.png `
  --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

| Selected source | SHA-256 |
| --- | --- |
| `tiger-shark-24-r01/light-chroma-source.png` | `1967D8535C6C5C5CC458876E964B1529802FC47AF1BADB87B65BCFF51B8342D5` |
| `tiger-shark-24-r01/light-cutout-source.png` | `9ABC4CD82E4D2A3EE4D63E45FA18A6DD4DB8C506A2096A64B75A175BFA29BB02` |
| `tiger-shark-26-r01/light-chroma-source.png` | `D6805B0744A858710EF876F7308F09694EB6208D507DAAE1254361D72CF4FD82` |
| `tiger-shark-26-r01/light-cutout-source-chroma.png` | `2C3076347BA80A8E20CEA3DE4DD423D686CF999B92C750951BFFA9118976522D` |
| `tiger-shark-dark-studio-r01/backdrop-source.png` | `58F251E19D29421CEF0E3DD145B78938D09940E212D241D6AE98AB3679944C61` |

Several white-sweep alpha-extraction attempts for the 26-inch source are kept
only as rejected process evidence in the proof directory. They were not used
because they visibly weakened spokes, cable edges, and contrast.

## Deterministic normalization and export

`scripts/build-configurator-fit-family.py` performs only deterministic
registration, theme compositing, and lossless responsive export. The 24-inch
dark poster uses its reviewed transparent product pixels over the generated
empty studio. The 26-inch dark poster preserves the already-reviewed exact
Tiger Shark dark-studio photograph and applies only uniform poster scale,
registration, and edge matching; it does not attempt to re-extract black
hardware from a white background.

The two commands below were rerun after landmark metadata was added. Every
master and responsive derivative reproduced the same SHA-256, and the script
preserved the human-reviewed landmark records.

```powershell
python scripts/build-configurator-fit-family.py `
  --cutout specs/proofs/web/WEB-035/masters/tiger-shark-24-r01/light-cutout-source.png `
  --dark-backdrop specs/proofs/web/WEB-035/masters/tiger-shark-dark-studio-r01/backdrop-source.png `
  --master-dir specs/proofs/web/WEB-035/masters/tiger-shark-24-r01 `
  --public-root apps/web/public `
  --product-id tiger-shark --asset-key tiger-shark-24

python scripts/build-configurator-fit-family.py `
  --cutout specs/proofs/web/WEB-035/masters/tiger-shark-26-r01/light-cutout-source-chroma.png `
  --dark-backdrop specs/proofs/web/WEB-035/masters/tiger-shark-dark-studio-r01/backdrop-source.png `
  --dark-source-poster apps/web/public/assets/products/dark-studio-v2/tiger-shark-studio.webp `
  --master-dir specs/proofs/web/WEB-035/masters/tiger-shark-26-r01 `
  --public-root apps/web/public `
  --product-id tiger-shark --asset-key tiger-shark-26
```

## Normalized masters

| Master | SHA-256 |
| --- | --- |
| `tiger-shark-24-r01/light-cutout-master-3072x2048.webp` | `FEDF1F1842E9B7934F6DABA6EF1B77342A0223587F8CDA79E97CF0C790186B3D` |
| `tiger-shark-24-r01/dark-master-3072x2048.png` | `A63B24A2F7003CA8E3F633ED5A5FA62B223E00073E7F846D199AC9603C98EE32` |
| `tiger-shark-26-r01/light-cutout-master-3072x2048.webp` | `2183C48587C8A526884098700A96ACD82CD23FE0902CBC8A1F4B851AC9C23C99` |
| `tiger-shark-26-r01/dark-master-3072x2048.png` | `2BAEC4B9DF9F8B4BE17418043F26D16E58BBA44B016C917425073C4070A664C3` |

The responsive 480, 960, and 1600 WebPs, their exact hashes, transparency
contracts, and measured pixel bounds are recorded in
`apps/web/public/assets/configurator/manifest.json`. Per-fit normalized axle,
contact, bottom-bracket, and head-tube review landmarks are recorded in each
master directory's `geometry.json`.

## Visual QA

- Light proof: each `preview-light.jpg` renders the transparent product on the
  actual warm `#f5f1eb` configurator surface with no image rectangle.
- Dark proof: each `preview-dark.jpg` uses a pure-black edge tone and retains
  readable orange paint, black cables, black spokes, brake hardware, and tyre
  detail under the night spotlight.
- Pixel QA confirms every perimeter pixel in both 3072 x 2048 dark masters is
  exactly `[0, 0, 0]`, so the poster edge is continuous with the black stage.
- Both variants occupy approximately 84% of poster width and share the 88%
  tyre baseline, so selection changes no longer jump in scale or crop.
- The 24-inch and 26-inch fits are visibly distinct while maintaining a common
  frame-family presentation and component inventory.

## Fidelity boundary and review status

The 24-inch image is a reviewed AI-assisted catalog variant derived from the
verified Tiger Shark 26-inch source. It is mechanically plausible and matches
the catalogued 24-inch fit, but it is not documentary photography of a supplied
24-inch production bicycle. Small tyre/chainstay lettering and fine pixel-level
details may not be exact even though the overall identity and component set
were reviewed.

The 26-inch light image used ImageGen only for background replacement around
the verified source; the 26-inch dark poster retains the existing exact-product
studio photograph. The background-replaced light derivative should still be
treated as an assisted presentation, not as untouched documentary pixels.

Review status: **accepted for the WEB-035 assisted configurator preview**.
Product-owner approval remains required before either assisted output is
represented as documentary product photography or used to authorize a
purchasable physical configuration.

## Validation

```text
node scripts/validate-configurator-assets.mjs
Configurator asset validation PASSED
- existing assets checked: 98
- runtime resolver states matched to manifest: 36
- custom visual families pixel-checked: 7

python scripts/inspect-configurator-images.py --verify-manifest apps/web/public/assets/configurator/manifest.json
Configurator pixel validation PASSED
- delivered custom assets decoded: 42

node --test apps/web/src/design/data/configurator.test.mjs
- tests: 13
- pass: 13
- fail: 0
```
