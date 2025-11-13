---
id: IC-13
title: Brand story narrative page
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Tell the founding story, mission, and community impact of Finspeed through rich narrative, timeline, and media that reinforce trust and differentiation in the Indian cycling market.

## Layout
- Hero section with mission headline, supporting copy, and background illustration.
- Timeline module with milestone cards, alternating layout for desktop and stacked for mobile.
- Impact metrics band displaying stats (bikes sold, riders trained, service centers) with animated counters.
- Community spotlight carousel linking to blog entries or testimonials.
- CTA strip leading to dealer locator and support hub.

## Inputs
- Markdown content files under `content/brand-story/{locale}.mdx` curated by marketing.
- Metrics data (`brandMetrics.json`) versioned in repo with fields `metric`, `value`, `description`.
- Timeline asset manifest referencing images in `assets/brand-story/`.
- CTA destinations configured in `brand-story.config.ts`.

## Behaviors
- Parses MDX at build time, injecting callout components for quotes and statistics.
- Animates counters when entering viewport (prefers `prefers-reduced-motion` respect).
- Loads media lazily with blur-up placeholders; preloads hero for LCP budget.
- Surface bilingual toggle to switch content while staying anchored at same section.
- Provides share meta tags (OpenGraph/Twitter) derived from hero copy.

## Error & empty states
- Missing metrics file falls back to placeholder copy and logs `brand-metrics-miss`.
- Missing timeline asset shows text-only milestone card with `aria-label` describing absence.

## Accessibility
- Ensures timeline sequence labelled with `<ol>` and includes `aria-current` for present milestone.
- Provides accessible name/description for stats (e.g., `data-value` attributes with screen-reader text).
- Carousel controls are keyboard operable with visible focus and `aria-live="polite"` updates.

## Data sources
- `public/data/brand-story/{locale}.json` generated from MDX.
- `public/data/brandMetrics.json`.
- Locale strings `public/locales/{locale}/brand.json`.

## Events / Analytics
- Emits `site.interaction.analytics.v1` events:
  - `brand_timeline_scroll_depth` with `percent` buckets.
  - `brand_metric_hover` with `metric_id`.
  - `brand_cta_click` with `target` (`dealers`, `support`), `locale`.
