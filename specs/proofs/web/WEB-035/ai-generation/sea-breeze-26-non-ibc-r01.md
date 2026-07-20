# Sea Breeze 26 non-IBC visual pair — revision 01

## Purpose

Produce the non-carrier companion to the reviewed Sea Breeze 26-inch IBC fit
study. The accepted 26-inch IBC image controls every product pixel; this edit
removes only the frame-mounted carrier.

## Authoritative inputs

| Input | SHA-256 | Use |
| --- | --- | --- |
| `apps/web/public/assets/products/upscaled/sea-breeze-1600.webp` | `FFA1D17F7061916484410D750E09E56141C00DDA2515685BA9D08E5820C0A8F5` | Exact Sea Breeze identity and equipment reference |
| `specs/proofs/web/WEB-035/masters/sea-breeze-26-ibc-r01/light-chroma-source.png` | `64D2BB7050BE58479CB56070F9C80E97B1822B26BFD8DFF1AB62B6E63E6DF891` | Accepted 26-inch IBC geometry reference |
| `specs/proofs/web/WEB-035/masters/sea-breeze-26-non-ibc-r01/light-chroma-source.png` | `A606BF24013C92548116711BFB6814ED92CD7A69D7CC1278D92CA22A865DD8F6` | Reviewed carrier-removal source |

## Generation

- Tool: built-in OpenAI ImageGen image edit.
- Seed: not exposed by the built-in tool.
- Product/SKU: `sea-breeze` / `sea-breeze-26-non-ibc`.
- Requested physical change: remove only the turquoise IBC carrier; retain the
  reviewed 26-inch wheel, frame, brake, mudguard, and drivetrain geometry.

### Edit prompt

```text
Use case: precise-object-edit
Asset type: Finspeed Build Your Ride product configurator master
Input images: Image 1 is the accepted Sea Breeze 26-inch IBC fit study and controls every product pixel, 26-inch geometry, component, camera, scale, and color.
Primary request: Remove only the turquoise tubular IBC rear carrier above and behind the rear wheel, creating the matching Sea Breeze 26-inch non-IBC state. Reconstruct only the tiny newly exposed areas of the rear mudguard, tyre, frame/stay junction, and magenta background.
Scene/backdrop: keep the existing perfectly flat solid #ff00ff magenta chroma-key background unchanged, with no floor, shadow, gradient, texture, reflection, or lighting variation.
Constraints: Preserve Image 1 pixel-faithfully outside the carrier region: exact 26-inch wheel diameter and wheelbase, turquoise step-through frame and fit geometry, FINSPEED wordmark and all decals, black rigid fork, V-brakes with pads aligned to both rims, complete cable routes, single-speed chain and chain guard, crank, pedals, saddle, handlebar, both 26-inch wheels, tyres, rims, hubs, every spoke, both mudguards, kickstand, axles, side-right camera, scale, crop, baseline, exposure, and color temperature. Keep the complete bicycle fully visible with generous padding.
Avoid: changing wheel size, wheel count, frame tubes, decals, lettering, fork, brakes, drivetrain, spokes, mudguards, saddle, camera, zoom, crop, rotation, adding suspension, disc brake, derailleur, gears, basket, light, person, prop, watermark, invented branding, malformed tubing, duplicated parts, or extra accessories. Remove all carrier tubing and mounting stubs without changing the rear mudguard.
```

## Deterministic post-processing

The accepted magenta source was converted to alpha with the installed ImageGen
chroma-key helper. `scripts/build-sea-breeze-remaining.py` then registered the
same cutout for both themes and exported lossless 480/960/1600 WebPs.

| Artifact | SHA-256 |
| --- | --- |
| `reviewed-cutout.png` | `C9798F0F201C7A80814A21247492699767DE4471FE96F65523F2F0342CA36F2A` |
| `light-master-3072x2048.png` | `31EB69CF7EB3BA1F371B7E2B12CF0055B992F0CAFA7326E43AFB5A73E6693ECA` |
| `light-cutout-master-3072x2048.webp` | `9D72064EEA161F4CD816D74FC64FC76A3C8C77B9FDAA7AB4318B20F9EA8D5FBE` |
| `dark-master-3072x2048.png` | `B5816E891E813E648EB18422BC92D1298F4CBA3E7C43CA42421DE55C84C5DD67` |

The 1600-pixel light derivative occupies 84.0% of the canvas width, lands at
an 88.0037% baseline, and retains 8% horizontal and 10.6842% top safety.

## Visual and product QA

- The 26-inch IBC and non-IBC posters share wheel/frame fit, baseline, camera,
  colour, and responsive scale; the carrier is the only intended equipment
  difference.
- Rear mudguard, V-brake, tyre, spokes, chain, and kickstand remain complete.
- No carrier tube, mounting stub, magenta fringe, image rectangle, crop, or
  theme-specific geometry shift is visible in the reviewed previews.

## Fidelity boundary and review status

This family inherits the assisted 26-inch geometry boundary from the IBC fit
study. Pixels behind the removed carrier are reconstructed and are not
documentary evidence of an unseen production sample. Product-owner approval is
required before this preview authorizes or markets a purchasable configuration.

Review status: **accepted as a WEB-035 configurator preview study, pending
product-owner approval of 26-inch geometry and the reconstructed rear area**.

