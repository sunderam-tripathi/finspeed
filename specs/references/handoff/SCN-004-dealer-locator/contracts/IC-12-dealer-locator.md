---
id: IC-12
title: Dealer locator search & map
type: ui
version: v1.0
status: Frozen
owner: Frontend Team
last_reviewed: 2025-11-04
---

## Purpose
Help visitors discover nearby authorized Finspeed dealers, filter by offered services, and take action (call, directions, WhatsApp) while capturing engagement analytics.

## Layout
- Search panel with location input (postal code or city), radius selector, and service filters (multi-select chips).
- Results list showing dealer name, distance, service badges, contact buttons, and directions icon.
- Map view (Leaflet) synchronized with results; hovering or focusing on a result highlights matching map pin.
- Outage banner placeholder displayed when dealer data refresh fails.

## Inputs
- Dealer dataset `DEALER-001` transformed into GeoJSON at build time.
- Map tile provider configuration (Leaflet + OSM tile URL, attribution string).
- GA4 measurement ID for event forwarding.
- Feature toggle `dealerLocator.enableWhatsApp` for conditional action buttons.

## Behaviors
- Reverse geocode postal codes into lat/long using client-side lookup table (no external API dependency).
- Applies filters client-side with debounced updates; maintains state in URL query params.
- Clicking map pin scrolls & focuses corresponding result; ensures keyboard parity.
- Directions button opens Google Maps (or Apple Maps on iOS) with prepopulated destination via universal link.
- Gracefully handles geolocation errors with inline guidance.

## Error & empty states
- Invalid postal code yields inline validation, retains prior values, and focuses the field.
- Zero results displays empathetic copy plus support contact link.
- Map tile load failure collapses map and surfaces text-only list with notice.

## Accessibility
- Search inputs labeled with `aria-describedby` for helper text.
- Results list uses semantic `<ul>` with role `list`; pins include `aria-label` for screen readers.
- Keyboard shortcuts: `j/k` to move through results, `Enter` to open details.

## Data sources
- `public/data/dealers.geo.json` derived from `DEALER-001`.
- Localized helper copy from `public/locales/{locale}/dealer.json`.
- Consent state from analytics consent manager.

## Events / Analytics
- Emits `site.interaction.analytics.v1` events:
  - `dealer_search_submitted` with `postal_code_prefix`, `radius_km`, `filters`.
  - `dealer_directions_click` with `dealer_id`, `model_slug?` (if present in query), `locale`.
  - `dealer_contact_action` with `dealer_id`, `channel` (`phone`, `email`, `whatsapp`).
  - `dealer_no_results` with `postal_code_prefix`, `radius_km`, `filters`.
