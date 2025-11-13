---
title: Finspeed brand style guide (draft)
last_reviewed: 2024-04-27
source_assets:
  logo_light: assets/images/brand/logo.svg
  logo_dark: assets/images/brand/logo-dark.svg
  wordmark_light: assets/images/brand/finspeed-text.svg
  wordmark_dark: assets/images/brand/finspeed-text-dark.svg
fonts:
  primary: Space Grotesk
  secondary: Space Grotesk
---

## Brand narrative
- Vision: democratize cycling for Indian riders with high-quality, affordable machines.
- Tagline: "Turning Pedals into Power."
- Tone: professional, high-tech, marine-inspired.

## Color palette (frozen)
Use the token names below inside CSS variables / design tooling so the palette stays traceable.

**Brand / primary blues**
| Token | Hex | Usage |
|-------|-----|-------|
| `brand.primary.50`  | `#EBF8FA` | Background washes / cards on light theme |
| `brand.primary.100` | `#D7F1F6` | Hover states, subtle dividers |
| `brand.primary.200` | `#AFE3EC` | Hero gradient midpoints |
| `brand.primary.300` | `#88D4E3` | Link hover, input focus ring |
| `brand.primary.400` | `#60C6D9` | Secondary CTAs, icons |
| `brand.primary.500` | `#38B8D0` | Primary CTA fill, gradient start |
| `brand.primary.600` | `#309AAF` | CTA hover, pill outlines |
| `brand.primary.700` | `#277C8E` | Focus outline, nav active state |
| `brand.primary.800` | `#1F5E6C` | Body text on light bg |
| `brand.primary.900` | `#16404B` | Heading text, hero copy |
| `brand.ocean.500`   | `#0E222A` | Dark theme background / nav rails |

**Accent palette**
- `accent.seafoam.500 #2CE7C6` — secondary CTA, success states.
- `accent.coral.500 #FF6B6B` — alerts, in-product notices (use sparingly).
- `accent.indigo.500 #4F46E5` — analytics highlights, data viz accents.

**Neutral runway**
`neutral.50 #E7E9EA` down to `neutral.900 #1A2D35` (see JSON) provide skeleton/backdrop colors; `neutral.950 #0E222A` matches ocean base so light/dark themes share components.

**Status tokens**
- Success `#2CE7C6`
- Warning `#F59E0B`
- Danger `#F43F5E`
- Info `#4F46E5`

## Semantic surfaces
Reference these when building CSS variables so light/dark themes stay consistent:

| Token | Light | Dark | Notes |
|-------|-------|------|-------|
| `bg` | `#FFFFFF` | `#0E222A` | Page background |
| `surface` | `#FFFFFF` | `#1A2D35` | Card/background for modules |
| `surfaceElevated` | `#E7E9EA` | `#26383F` | Raised cards, drawers |
| `textPrimary` | `#0E222A` | `#E7E9EA` | Default copy |
| `textSecondary` | `#56646A` | `#9FA7AA` | Supporting text |
| `link` / `linkHover` | `#309AAF` / `#277C8E` | `#60C6D9` / `#88D4E3` | Anchor + hover |
| `border` | `#9FA7AA` | `#3E4E55` | Divider strokes |
| `focus` / `ring` | `#38B8D0` / `#88D4E3` | `#60C6D9` / `#277C8E` | Accessibility focus states |

`Marine Gradient`: start `brand.ocean.500 (#0E222A)` → blend through `brand.primary.600` into `brand.primary.300` for heroes/headings.

## Typography
- All headings, body copy, numerals, and UI chrome use Space Grotesk (weights 400, 500, 700).
- System fallbacks: `font-family: "Space Grotesk", "Helvetica Neue", Arial, sans-serif;`.
- Remove Orbitron usage from previous drafts; maintain consistency by varying weight/letter spacing instead of switching families.

## Component guidelines
- Buttons: pill or rounded-rectangle with gradient fill (Electric Teal → Deep Abyss), Orbitron uppercase labels, glowing focus outline.
- Cards: floating glassmorphism panels with thin borders in Electric Teal, drop shadow mimicking underwater lighting.
- Iconography: line icons with soft corners, teal accents, optional fin motif.
- Imagery: treat product photography with subtle teal overlay gradients; use marine backgrounds (abstract waves) to unify look.
- Theme handling: maintain synchronized light/dark palettes using shared CSS variables, default to system preference, and expose toggle in header.

## Accessibility
- Minimum contrast ratio 4.5:1 for body text; verify gradients with simulated color-blindness.
- Provide high-contrast toggle for more neutral palette if teal gradients reduce readability.
- Motion: limit parallax to < 150ms durations; offer "reduce motion" respect via prefers-reduced-motion.

## Assets
- See `20-requirements/data/asset-manifest.csv` for mapping between imagery and product lines.
