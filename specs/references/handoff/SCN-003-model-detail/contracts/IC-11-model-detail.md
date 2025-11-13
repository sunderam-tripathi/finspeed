---
id: IC-11
title: Model detail experience
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Present an immersive detail page for a single Finspeed model that combines rich media, key specifications, sizing guidance, pricing context, warranty/service promises, and a high-visibility dealer call-to-action.

## Layout
- Above-the-fold hero with responsive image/video, model name, tagline, MSRP, finance badge, and quick spec highlights.
- Tabs (or accordions on mobile) for detailed specs, technology, sizing chart, and FAQs sourced from catalog metadata.
- Sticky sidebar (desktop) or anchored footer (mobile) containing `Find at a dealer` CTA plus share/save actions.
- Structured data script tag (`application/ld+json`) containing schema.org Product payload.

## Inputs
- `CATALOG-001` record identified by model slug (`/models/{slug}`) with rich text fragments and media references.
- Dealer locator route (`/dealers?model={slug}`) for CTA deep link.
- Localized copy for warranty/services from locale bundles.
- Feature flag `modelDetail.enable360Media` to progressively roll out 360° galleries.

## Behaviors
- Hydrates static props at build time; revalidates when catalog CSV changes.
- On CTA click, pushes analytics event then navigates using Next.js router preserving locale.
- Auto-scrolls to spec sections when hash anchors used (`#specs`, `#technology`, `#sizing`).
- Lazy-loads heavy media (videos, 360 assets) below the fold with intersection observers.
- Adds canonical `<link rel="canonical">` pointing to default locale page.

## Error & empty states
- If catalog record missing, renders 404 page with support contact.
- If optional media missing, falls back to hero image gallery with warning logged (`model-media-miss`).
- CTA disabled with tooltip if dealer locator feature flag off; instructs visitors to contact support.

## Accessibility
- Ensures hero media provides text alternative; includes keyboard-operable gallery controls.
- Spec tables expose summary captions and scope attributes for screen readers.
- CTA has accessible name `Find a dealer for {model}` and focus outline.

## Data sources
- `public/data/catalog/{slug}.json` generated from `CATALOG-001`.
- Locale strings `public/locales/{locale}/model-detail.json`.
- Warranty/service copy normalized in `20-requirements/data/product-catalog.csv`.

## Events / Analytics
- Emits `site.interaction.analytics.v1` events:
  - `model_dealer_cta_click` with `model_slug`, `locale`, `consent_granted`.
  - `model_gallery_interaction` with `model_slug`, `asset_type`, `frame_index`.
  - `model_specs_copy` when user copies feature blocks (captures `section` and `model_slug`).
  - `model_jsonld_validation_error` on client-side schema validation failure (non-PII).
