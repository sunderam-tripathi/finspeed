---
id: IC-9
title: Catalog listing & filter interface
type: interface
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Expose bicycle catalog by discipline with consistent value messaging, filter interactions, and accessible navigation for screen readers and keyboard users.

## Layout
- **Desktop:** Two-column layout: filter panel (left, min-width 280px) and 3-card grid (right). Cards responsive to show 2 columns ≤1024px.
- **Mobile:** Filters collapse into accordions above card stack; "Show filters" button toggles overlay drawer.
- Value badges (warranty, services, EMI) appear beneath price on every card.

## Card Content
- Model name (Product + Variant).
- Category pill (ATB/MTB/Road Racer).
- Price label: `Factory-direct price ₹<amount>`.
- Spec highlights (frame, suspension, gears as available).
- CTA button: `Compare`.

## Filters
- Facets: `frame`, `fork`, `brakes`, `wheels`, `tyres`, `gears`.
- Each facet supports multi-select checkboxes.
- Filter state synced to query string (`?frame=steel&brakes=disc`).
- "Clear all" resets state and focus returns to first card.
- Empty state message: `"No models match your filters. Reset filters to view all bikes."`

## Accessibility
- Filters contain fieldset + legend per facet.
- Cards use `article` with `aria-labelledby`.
- Comparison CTA includes `aria-pressed` to indicate selection state (when model added).

## Analytics
- Emits `catalog_filter_applied` event (see `site.interaction.analytics.v1`) with:
  - `filter_id` (facet key) and `filter_value` array.
  - `locale`, `theme`, `consent_granted`.
- On empty result, emit `catalog_filter_applied` with `results_count=0`.

## Error & Edge Cases
- Missing price or warranty data fails build (schema validation).
- If imagery missing, display placeholder illustration with alt text `"Bicycle image placeholder"`.
