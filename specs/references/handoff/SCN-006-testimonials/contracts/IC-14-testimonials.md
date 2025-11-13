---
id: IC-14
title: Testimonials carousel module
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Showcase rider testimonials and partner endorsements to build trust, combining text quotes, ratings, and optional media in a responsive carousel reusable across pages.

## Layout
- Card carousel with quote, rider name, location, ride category, and optional avatar/video.
- Navigation controls: previous/next buttons, pagination dots, autoplay toggle (default off).
- On mobile, single card view; on desktop, two-card layout with peek of next card.
- Optional badge row highlighting rating (out of 5) and years riding.

## Inputs
- Testimonials dataset `content/testimonials/{locale}.json` containing `id`, `quote`, `name`, `location`, `category`, `media`.
- Feature toggle `testimonials.enableVideo` to allow embedded MP4 or YouTube short.
- Theme context for gradient/background adaptation.

## Behaviors
- Initializes carousel via accessible slider (e.g., `react-aria`), respecting reduced motion preference.
- Supports auto-advance every 8s when autoplay enabled; pauses on hover/focus.
- Allows filtering by category (e.g., MTB, Road) when embedded in catalog pages.
- Logs duplicates or missing translation keys with `console.warn('testimonial-miss', id)`.

## Error & empty states
- If dataset empty, hides module and logs `testimonial-empty`.
- Failed media loads swap to fallback avatar and removes video control.

## Accessibility
- Each card has landmark role `group` with `aria-roledescription="testimonial"`.
- Buttons include `aria-controls` referencing active slide; pagination dots labelled `Slide {n} of {total}`.
- Supports keyboard navigation with arrow keys and `Home/End`.

## Data sources
- `public/data/testimonials/{locale}.json` built from CMS data.
- Background assets from `assets/testimonials/`.

## Events / Analytics
- Emits `site.interaction.analytics.v1` events:
  - `testimonial_slide_view` with `testimonial_id`, `position`, `autoplay` boolean.
  - `testimonial_autoplay_toggled` with `enabled`.
  - `testimonial_category_filter` with `category`.
