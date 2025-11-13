---
id: IC-10
title: Catalog comparison drawer
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Provide visitors with side-by-side comparison of up to three models, highlighting spec differences and CTA pathways to detail pages.

## Interaction Model
- Drawer slides up from bottom (mobile) / right (desktop) when at least one model selected.
- Limit selection to 3 models; attempting to add a fourth triggers inline notice `"Remove a model to compare a new one."`
- Each column contains:
  - Model/variant header
  - Category label
  - Price (factory-direct)
  - Spec breakdown list (frame, suspension, brakes, tyres, gears)
  - Value badges (warranty, services, EMI)
  - CTA button `View details` linking to `/models/<slug>`
- Remove button (`aria-label="Remove <model>"`) clears selection.

## States
- **Empty:** Drawer hidden; sticky compare tray shows `"Compare up to 3 bikes"` with disabled state.
- **Active:** Drawer visible with selected models.
- **No specs difference:** Display banner `"These bikes share many specs—highlighted rows show differences."`
- **Filter change:** If filter removes a selected model, drawer displays notice and auto-removes model after confirmation.

## Accessibility
- Drawer focus trap active while open; ESC closes.
- Columns arranged via CSS grid, maintain reading order for screen readers using `aria-colindex`.
- Provide live region announcing `"Added <model> to comparison"` and `"Removed <model> from comparison"`.

## Analytics
- Emit `catalog_compare_opened` when drawer first opens with payload `comparison_models` array (model slugs).
- Emit `catalog_compare_removed` when a model removed, including `removed_model` and resulting list.
- Include `locale`, `theme`, `consent_granted`.

## Error Handling
- If detail URL missing, disable CTA and show tooltip `"Detail page coming soon"`.
- Ensure comparison persists after navigation back via session storage; expire after 30 minutes.
