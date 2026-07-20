# Sea Breeze remaining fit families — deterministic normalization revision 01

## Scope

Register the verified Sea Breeze 24-inch IBC photograph and the two accepted
26-inch assisted studies on one canonical product canvas without editing the
shared runtime manifest. The merge-ready fragment is
`specs/proofs/web/WEB-035/registration/sea-breeze-remaining-r01.json`.

## Deterministic pipeline

`scripts/build-sea-breeze-remaining.py`:

1. cleans invisible RGB and white-source matte contamination;
2. registers every accepted cutout at 84% subject width and 88% baseline on a
   3072 × 2048 transparent canvas;
3. derives the dark theme from the exact same registered bicycle pixels over
   the shared edge-black studio sweep;
4. writes lossless 480/960/1600 WebPs, SHA-256 records, geometry metadata,
   merge-ready manifest families, and warm/dark contact sheets.

The 24-inch IBC family is a Tier B deterministic derivative of:

| Input | SHA-256 |
| --- | --- |
| `apps/web/public/assets/products/upscaled/sea-breeze-1600.webp` | `FFA1D17F7061916484410D750E09E56141C00DDA2515685BA9D08E5820C0A8F5` |
| `apps/web/public/assets/products/dark-cutouts/sea-breeze-transparent.webp` | `4C64C24FAA74CCC4B098F1AE9190CEEC705A0442ACEF3AB83A875D0C130E91F5` |

Its normalized master hashes are recorded in
`specs/proofs/web/WEB-035/masters/sea-breeze-24-ibc-r01/hashes.json`.

The 26-inch IBC and non-IBC families are Tier C assisted studies whose exact
prompts, source hashes, boundaries, and master hashes are recorded in the two
AI-generation records for this revision.

## QA evidence

- Warm contact sheet:
  `specs/proofs/web/WEB-035/registration/sea-breeze-fit-contact-sheet-warm-r01.jpg`
- Dark contact sheet:
  `specs/proofs/web/WEB-035/registration/sea-breeze-fit-contact-sheet-dark-r01.jpg`
- Per-family previews and geometry:
  `specs/proofs/web/WEB-035/masters/sea-breeze-*-r01/`

The contact sheets were opened and visually inspected at full resolution. All
four Sea Breeze states remain complete, the 24/26 fit distinction reads in the
wheel-to-frame proportions, IBC state changes are unambiguous, and responsive
families share the same scale/baseline contract. Dark posters reach pure black
on all outer edges and light posters retain true transparency.

## Honest boundary

Only the delivered 24-inch IBC state is deterministic exact-product imagery.
The 24-inch non-IBC family predates this batch and remains the previously
accepted assisted rack-removal study. Both 26-inch families are assisted because
the delivery contains no independently photographed 26-inch Sea Breeze. They
are preview assets pending product-owner approval, not standalone commercial
authority.

RESULT: **PASS — three merge-ready Sea Breeze fit families produced without
editing `manifest.json`, `configurator.js`, or configurator tests.**

