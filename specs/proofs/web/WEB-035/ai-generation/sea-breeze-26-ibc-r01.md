# Sea Breeze 26 IBC visual pair — revision 01

## Purpose

Produce the catalogued Sea Breeze 26-inch IBC configurator state while keeping
the verified 24-inch IBC photograph as the product-identity authority. No
independent 26-inch Sea Breeze photograph exists in the governed delivery, so
the wheel-and-frame fit is an assisted study and not documentary photography.

## Authoritative inputs

| Input | SHA-256 | Use |
| --- | --- | --- |
| `apps/web/public/assets/products/upscaled/sea-breeze-1600.webp` | `FFA1D17F7061916484410D750E09E56141C00DDA2515685BA9D08E5820C0A8F5` | Exact Sea Breeze identity, 24-inch IBC equipment, paint, decals, and side profile |
| `specs/proofs/web/WEB-035/masters/sea-breeze-26-ibc-r01/light-chroma-source.png` | `64D2BB7050BE58479CB56070F9C80E97B1822B26BFD8DFF1AB62B6E63E6DF891` | Reviewed assisted 26-inch source |

## Generation

- Tool: built-in OpenAI ImageGen image edit.
- Seed: not exposed by the built-in tool.
- Product/SKU: `sea-breeze` / `sea-breeze-26-ibc`.
- Requested physical change: increase the wheel-and-frame fit from the
  photographed 24-inch state to the catalogued 26-inch state; retain the exact
  IBC carrier and all stock equipment.

### Edit prompt

```text
Use case: precise-object-edit
Asset type: Finspeed Build Your Ride product configurator master
Input images: Image 1 is the exact verified Sea Breeze 24-inch IBC product and controls product identity, component inventory, paint, decals, carrier, camera, and side-right orientation.
Primary request: Create the catalogued Sea Breeze 26-inch IBC fit by changing only the wheel-and-frame fit from the photographed 24-inch state to a mechanically plausible 26-inch state. Use two clearly larger 26-inch wheels with matching rims, tyres, hubs, and spoke layout, and proportionally adjust only the necessary frame/fork/mudguard clearances and wheelbase so the 26-inch wheels fit correctly. Retain the exact turquoise frame silhouette and step-through design language.
Scene/backdrop: perfectly flat solid #ff00ff magenta chroma-key background, uniform edge to edge, no floor, shadow, gradient, texture, reflection, or lighting variation.
Subject: complete turquoise FINSPEED Sea Breeze 26-inch step-through city bicycle with the factory turquoise tubular IBC rear carrier, side-right view, facing right.
Constraints: Preserve the exact FINSPEED wordmark and all decals, turquoise paint, tube shapes and weld logic, black rigid fork, V-brakes with pads aligned to the new rims, complete brake cables, single-speed chain and chain guard, crank, pedals, saddle, handlebar, front and rear mudguards reshaped only enough to follow the 26-inch tyres, kickstand, carrier construction and mounting points, component colors, axle-height camera, side profile, exposure, and color temperature. Both tyres, mudguards, carrier, handlebar, cables, pedals, and stand must be fully visible with generous padding. The two wheel centers must remain level and the bicycle must be mechanically buildable.
Avoid: changing brand lettering, inventing decals, adding suspension, disc brakes, derailleur, gears, basket, light, extra carrier, prop, person, watermark, malformed spokes, oval wheels, duplicated tubes, floating brakes, chain misalignment, carrier contact with tyre, crop, zoom, rotation, perspective drift, or three-quarter view. Do not merely scale the whole 24-inch bicycle; the 26-inch wheels must read larger relative to the main frame.
```

## Deterministic post-processing

The accepted magenta source was converted to alpha with the installed ImageGen
chroma-key helper, then `scripts/build-sea-breeze-remaining.py` registered the
same product pixels on both themes at 3072 × 2048. The light poster remains
transparent; the dark poster uses the shared edge-black Finspeed studio sweep.
No second generative pass is used for the dark theme.

| Artifact | SHA-256 |
| --- | --- |
| `reviewed-cutout.png` | `C21ACFC85950730573DF656D7281F53B4D43C3C9646642C73C620B87EB72C6B8` |
| `light-master-3072x2048.png` | `814108056E89D2202D8F50E1064421906537BE00085F2D42968F7D43A8049E49` |
| `light-cutout-master-3072x2048.webp` | `7E3C36E0B2BB1935C3F8BD419F2B8198FD33F1B1347BC6EE00B5B32B51114C47` |
| `dark-master-3072x2048.png` | `38FC381081A03DCD8078FD5C828061816CD4D3472CE1DD004A41C0DA64FFBA40` |

The 1600-pixel light derivative occupies 84.0% of the canvas width, lands at
an 88.0037% baseline, and retains 8% horizontal and 10.8716% top safety.

## Visual and product QA

- Full tyres, mudguards, carrier, handlebar, cables, pedals, and stand remain
  visible on the canonical canvas.
- The 26-inch wheels read larger relative to the step-through frame than the
  24-inch pair; wheel centers remain level and V-brake pads meet both rims.
- Carrier tubes clear the rear tyre and mudguard, and both themes use identical
  bicycle geometry.
- Warm and dark previews are included in the family proof directory and in the
  two contact sheets under `specs/proofs/web/WEB-035/registration/`.

## Fidelity boundary and review status

The verified delivery has no separately photographed 26-inch Sea Breeze. Wheel
diameter, associated frame clearance, wheelbase, mudguard arc, spoke placement,
and small pixels in those changed regions are an assisted interpretation of the
catalogued fit. The wordmark and decals were visually compared with the exact
source, but this assisted image must not be represented as documentary evidence
or used alone to authorize a purchasable SKU.

Review status: **accepted as a WEB-035 configurator preview study, pending
product-owner approval of 26-inch geometry and decal fidelity**.

