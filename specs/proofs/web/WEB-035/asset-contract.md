# WEB-035 configurator asset and provenance contract

## Purpose

This contract keeps the Build Your Ride preview mechanically honest while the
visual library grows. A resolved configuration may use an asset only when the
asset is registered in `apps/web/public/assets/configurator/manifest.json` and
its authority is strong enough for the requested use. A missing visual is a
backlog item, not permission to substitute a similar bicycle or invent a file
path.

Contract version `2.0.0` covers all eleven products with 224 physical masters,
1,120 selectable visual states, 2,240 light/dark states, and 6,720 responsive
WebPs. A matrix becomes runtime-available only after its complete inventory,
encoded pixels, hashes, dimensions, canonical placement, and resolver reachability
pass the fail-closed registration preflight. Assisted component states remain
Tier C and retain the explicit product-owner-review requirement.

## Source-authority ladder

| Tier | Meaning | Permitted use |
| --- | --- | --- |
| A - verified source | Exact product master is tied to a governed delivery manifest and SHA-256. | Stock product, catalog, and configurator base. |
| B - deterministic derivative | Every pixel derives from a Tier A source through a versioned script; source/output hashes and parameters are recorded. | Base, cutout, mask, shadow, backdrop, and responsive derivative. |
| C - approved assisted edit | AI or manual edit is constrained by exact references and a mask, then passes product, geometry, and visual QA. Prompt, references, masks, model/tool version, reviewer, and hashes are recorded. | Only the named configuration state approved in its record. |
| D - provisional or missing | Identity may be plausible, but the chain or configuration truth is incomplete. | Preview fallback only when explicitly labelled stock; never a selection-dependent or purchasable claim. |

The verified light stock chain currently points to
`apps/web/public/assets/asset-provenance-upscaled.json`, whose source package is
`Finspeed-Upscaled-Final`. Each exhaustive inventory records immutable hashes
and pixel measurements for its transparent light and dark-studio responsive
derivatives. A visual may imply a selected component change only when the exact
state key is present in that registered inventory; stock-only substitution is
forbidden for a supposedly selection-dependent preview.

## Canonical authoring canvas

All new configurator masters use one registered coordinate system.

- Canvas: **3072 x 2048 px**, exactly **3:2**.
- Colour: sRGB IEC61966-2.1; 8-bit or 16-bit lossless PNG master.
- View: `side-r` - full bicycle, drive-side readable, facing right.
- Camera: axle-height, long-lens/orthographic-feeling side view. No wide-angle
  wheel distortion, pitched horizon, or three-quarter drift.
- Subject bounds: full bicycle occupies **84% +/- 2%** of canvas width.
- Ground baseline: both tyre contact points land at **94% +/- 1%** of canvas
  height.
- Safety: at least **6%** clear above the highest cable/handlebar point and
  **6%** clear at both horizontal edges.
- The complete subject must be visible: tyres, mudguards, carrier, handlebar,
  brake cables, pedals, stand, and shadows may not be clipped.
- A bicycle may not be resized independently between themes or option states.
  Axles and contact points must remain registered to the same landmarks.

Existing stock photographs are marked `legacy-stock` because they predate this
canvas. They remain valid exact-product fallbacks, but must not be used as
registration references for a newly generated patch until normalized and
reviewed.

Contract version `2.0.0` adopts width-first normalization: every bicycle is
placed at 84% canvas width, capped at 88% canvas height only as a safety limit,
and grounded at the 94% baseline. This supersedes the earlier 88% baseline and
invalidates derivatives produced under that older scale contract.

## Landmark metadata

Every new master or patch family has a sibling JSON record in normalized
canvas coordinates (`0..1`). Coordinates are measured from the top-left of the
3072 x 2048 canvas.

```json
{
  "canvas": { "width": 3072, "height": 2048 },
  "view": "side-r",
  "subjectBounds": { "x": 0.08, "y": 0.06, "width": 0.84, "height": 0.88 },
  "landmarks": {
    "rearAxle": { "x": 0.255, "y": 0.764 },
    "frontAxle": { "x": 0.745, "y": 0.764 },
    "rearContact": { "x": 0.255, "y": 0.94 },
    "frontContact": { "x": 0.745, "y": 0.94 },
    "bottomBracket": { "x": 0.50, "y": 0.69 },
    "headTubeTop": { "x": 0.65, "y": 0.37 },
    "headTubeBottom": { "x": 0.63, "y": 0.47 }
  },
  "masks": {
    "frontAssembly": "front-assembly-mask.png",
    "rearAssembly": "rear-assembly-mask.png",
    "frameFinish": "frame-finish-mask.png"
  }
}
```

The numbers above illustrate the schema; they are not product measurements.
Each product must be measured from its approved normalized master. Required
landmarks are both axles, both tyre contact points, bottom bracket, and both
head-tube endpoints. A layer fails registration when a required landmark moves
more than 0.35% of canvas width or height, unless the approved option physically
changes that landmark (for example, a validated wheel-size/fit SKU).

## Themes, roles, and layer order

Themes are `light` and `dark`. Product identity and geometry must be the same in
both themes; only environment, lighting, shadow density, and colour management
may differ.

Registered roles:

- `backdrop` - edge-matched environment only; contains no bicycle pixels.
- `accessory-back` - carrier or accessory that must sit behind the frame.
- `base` - exact full stock bicycle or normalized frame/core assembly.
- `rear-patch` - drivetrain, rear brake, cassette/freewheel, rear wheel, or
  rear mudguard replacement constrained to its mask.
- `front-patch` - fork, front brake, front wheel, handlebar, or front mudguard
  replacement constrained to its mask.
- `finish-patch` - validated frame-finish pixels only; never generated decals.
- `accessory-front` - basket, light, lock, or other foreground accessory.
- `shadow` - separate transparent contact/cast shadow.
- `poster` - flattened, approved fallback used before the compositor hydrates.
- `detail` - close-up explanatory image; never used as the full-bike preview.
- `knockout-mask` - alpha or selection mask used to remove an existing part.

Default composite order is:

`backdrop -> shadow -> accessory-back -> base -> rear-patch -> front-patch -> finish-patch -> accessory-front`.

Patches must be transparent, canvas-sized, and empty outside their approved
mask. A patch must never carry an unrelated wheel, frame, decal, cable, brake,
or accessory change.

## File naming and logical keys

Lossless authoring masters live outside the public browser payload:

`configurator-masters/v1/{product-id}/side-r/{theme}/{role}/{variant}.png`

Sibling landmark/mask metadata uses the same stem and `.json`. Browser
derivatives live under:

`assets/configurator/v1/{product-id}/side-r/{theme}/{role}/{variant}/{width}.webp`

The equivalent immutable logical key is:

`{product-id}__side-r__{theme}__{role}__{variant}__r{revision}__w{width}.webp`

Rules:

- lowercase ASCII kebab-case only;
- product IDs must match the configuration model contract exactly;
- `variant` is a stable option/SKU ID, never customer-facing copy;
- revisions are two digits and immutable once deployed;
- no `final`, `new`, `latest`, timestamps, spaces, or ambiguous angle names;
- missing assets use `null`/an empty array in the manifest, never a speculative
  path.

## Responsive delivery

- Required base/poster widths: **480, 960, and 1600 px**.
- All members of one composited state use the same canvas aspect and selected
  width; the browser must not mix a 960-pixel base with a 1600-pixel patch.
- WebP is the required browser format. AVIF may be added as a parallel optional
  encoding only after visual equivalence is verified.
- Transparent layers retain alpha. Never flatten them onto white or black.
- The first paint uses a complete poster to prevent layout shift. The
  compositor may hydrate after that poster, prefetching only alternatives for
  the next active step.
- Crossfades should be 160-220 ms and disabled for reduced motion.
- Public assets use immutable cache headers when their revisioned path is
  deployed.

## Manifest requirements

`apps/web/public/assets/configurator/manifest.json` is the runtime inventory,
not a wish list. It records:

- contract and schema versions;
- canonical canvas, roles, themes, responsive widths, and naming templates;
- all eleven product IDs;
- exact stock light assets and their governed provenance catalog;
- current dark cutout/poster assets with honest pending-provenance status;
- each required selection-dependent class as `missing` with no asset path;
- any shared backdrop and its authority status.

The resolver must ignore an asset whose manifest status is not `available`.
`missing` is a normal state and must resolve to the exact stock base plus a
truthful “preview pending” treatment, not to another model or a fabricated
component.

## AI-assisted edit invariants

An assisted edit starts from the exact normalized product master and a tightly
scoped mask. Its generation record must include input paths and SHA-256,
product/SKU ID, requested option ID, prompt, negative constraints, tool/model,
seed when available, output master hash, derivative hashes, date, and reviewer.

Every prompt and review enforces these invariants:

1. Change only the named component or finish inside the approved mask.
2. Preserve frame geometry, tubes, welds, wheel count/diameter, tyres, spokes,
   hubs, cranks, chain line, cables, saddle, handlebar, mudguards, stand, and
   accessories unless one is the named change.
3. Preserve the real `FINSPEED` wordmark and all catalog decals pixel-for-pixel.
   Generative lettering is never accepted.
4. Preserve camera, subject scale, axles, tyre contact points, baseline, crop,
   background, exposure, colour temperature, and shadow direction.
5. The replacement must be mechanically plausible and compatible with the
   approved SKU: mounts align, rotors/calipers match, cable/hose routing is
   complete, drivetrain components agree, and no part intersects the frame.
6. Light and dark versions represent the same physical bicycle and option.
7. No invented specification, finish, carrier, brake, fork, drivetrain, or
   wheel size may become selectable merely because an image looks convincing.

Human review uses a source/output blink comparison at 100% and 200%, plus an
absolute-difference overlay outside the approved mask. Unrelated changed pixels
are a rejection.

## QA and acceptance

### Automated gates

- `node scripts/validate-configurator-assets.mjs` passes.
- `python scripts/inspect-configurator-images.py --verify-manifest apps/web/public/assets/configurator/manifest.json`
  passes, proving the hash-bound alpha and subject metrics against decoded
  delivered pixels.
- JSON parses and includes exactly the eleven governed product IDs.
- Every `available` path exists below `apps/web/public`, contains no traversal,
  and its actual WebP dimensions match the manifest.
- The light stock set contains 480/960/1600 derivatives for every product.
- Every Tier A light asset is found in the governed provenance catalog and its
  actual SHA-256 matches that catalog.
- Every runtime SKU is enumerated in both themes. Its resolver `src` and
  `srcSet` must match either its exact registered custom family or its exact
  registered stock fallback; orphan manifest entries and unregistered runtime
  asset keys fail validation.
- Every registered custom family includes both themes at 480/960/1600, has
  immutable SHA-256 values, and is decoded from the delivered WebP bytes by the
  Pillow pixel inspector. Light posters must contain true transparent and
  opaque pixels; dark flattened posters must be fully opaque.
- Transparent-light subject width, baseline, and top/left/right safety metrics
  may shift no more than 0.5 percentage points across responsive derivatives.
  Families marked `canonical` must also meet the canonical 84% width, 94%
  baseline, and safety minima. A non-canonical pilot must carry an explicit
  `known-deviation` reason and is counted separately in validator output.
- Every required selection dimension (`fit`, `brakes`, `fork`, `drivetrain`,
  `finish`, `accessories`) is present. Until produced, its status is `missing`,
  it declares no assets, and no fabricated path is allowed.
- Registration tests keep layer landmarks inside tolerance and ensure all
  layers in one state share dimensions and alpha expectations.
- Resolver enumeration covers every approved configuration and returns either
  a complete visual state or an explicit stock fallback with missing reasons.

### Visual/product gates

- Product identity, colour, geometry, decals, installed stock equipment, and
  catalogue-facing orientation match the approved source.
- Full bicycle is visible with consistent scale, baseline, and safety margins.
- No white/black image rectangle, edge halo, matte fringe, clipped cable, or
  mismatched colour temperature is visible in either theme.
- Spokes, cables, chain, rotors, teeth, and small mounting hardware survive
  transparency and downsampling.
- Light/dark parity and responsive crop are reviewed at 360, 390, 768, 1366,
  1440, and 1920 CSS pixels at 100% browser zoom.
- Keyboard focus, reduced motion, loading/failure fallbacks, and descriptive
  alt text are verified in the real configurator.

### Promotion rule

A selection-dependent state can change from `missing` to `available` only when
the product/compatibility record is approved, the lossless master and metadata
exist, responsive derivatives are present, provenance is complete, automated
validation passes, and a human reviewer signs off on identity, mechanics,
registration, and theme parity. Passing visual QA alone does not authorize a
purchasable configuration.
