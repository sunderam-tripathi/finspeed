# WEB-035 single-SKU visual normalization — revision 01

## RESULT: PASS WITH ONE DISCLOSED SOURCE LIMITATION

Eight physical single-SKU products were registered on the same 3072 × 2048
WEB-035 stage. This was a deterministic normalization pass, not a generative
redraw: the light poster uses the governed transparent cutout of the verified
upscaled catalogue photograph, while the dark poster recovers the already
reviewed dark-studio product pixels through that exact mask. No frame,
component, wheel, carrier, branding, or camera geometry was synthesized.

| SKU visual key | Light/dark width | Baseline | Top safety | Result |
| --- | ---: | ---: | ---: | --- |
| `hammerhead-24` | 84.0% | 88.0% | 8.0% | canonical |
| `great-white-shark-26` | 84.0% | 88.0% | 11.9% | canonical |
| `lemon-shark-27-5` | 84.0% | 88.0% | 13.3% | canonical |
| `lightning-marlin-700c` | 84.0% | 88.0% | 13.5% | canonical |
| `bull-shark-29` | 84.0% | 88.0% | 11.3% | canonical; commerce remains blocked by the existing identity conflict |
| `shark-blue-26-geared` | 84.0% | 88.0% | 12.5% | canonical |
| `mako-shark-27-5-geared` | 84.0% | 88.0% | 10.4% | canonical |
| `sunset-marlin-700c-geared` | 69.4% | 88.0% | 7.0% | reviewed source-limited |

The Sunset Marlin delivery contains only three-quarter views. The closest
governed photograph becomes 98% of the canonical canvas height when forced to
84% subject width, so an 84% render would clip the handlebar or tyres. Revision
01 keeps every photographed product pixel and uses the largest safe scale. A
true canonical side view requires new governed photography; perspective
warping or invented geometry was intentionally rejected.

## Deliverables

- Browser assets: `apps/web/public/assets/configurator/v1/{product}/side-r/{light|dark}/poster/{sku}-r01-w{480|960|1600}.webp`
- Governed masters and per-SKU geometry: `specs/proofs/web/WEB-035/masters/{sku}-r01/`
- Warm visual QA contact sheet: `specs/proofs/web/WEB-035/visual-qa/singletons-warm-contact.jpg`
- Black visual QA contact sheet: `specs/proofs/web/WEB-035/visual-qa/singletons-black-contact.jpg`
- Reproducible pipeline: `scripts/normalize-configurator-singletons.py`

## Visual review

Both contact sheets and every 1600 px product preview were opened and visually
inspected. The light exports reveal the real warm page surface through alpha;
there is no photographed white rectangle. The dark exports have pure-black
outer pixels, one continuous carbon-night stage, consistent product scale and
baseline, no alpha colour bands, and no clipped bicycle pixels. The product
geometry and branding match the verified source photographs.

Responsive inspection confirmed full `0..255` alpha on every light WebP,
opaque dark WebPs, pure-black dark corners, and stable subject bounds. The
1600 px light bounds are 84% wide and 88% baseline for the seven canonical
families; Sunset Marlin is recorded as the explicit non-canonical exception.
