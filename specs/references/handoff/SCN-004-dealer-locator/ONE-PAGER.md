# SCN-004 / REQ-004 — Dealer locator search & map

## Outcome (why)
Visitors quickly locate nearby Finspeed dealers, filter by services, and capture engagement analytics to measure intent to visit.

## Scope (this slice)
- In: Location search, postal code validation, radius + service filters, Leaflet map sync, directions/contact CTAs, outage handling, consent-aware analytics.
- Out: Dealer CMS sync, CRM integrations, appointment booking, sales lead capture.

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-12 | ui | Search/filter/map experience tying dealers to contact/directions CTAs | contracts/IC-12-dealer-locator.md | v1.0 | Search `201306` + filter "service center" → updates list & map pins |

## Acceptance checks
```gherkin
Scenario: Locate dealers by postal code
Scenario: Filter dealers by services offered
Scenario: Invalid postal code gracefully handled
Scenario: Map view anchors the search results
Scenario: Directions icon captures engagement
```

## Non-functional & security
- p95 map render ≤ 2.5s on 4G, search results update < 500ms, GA4 events success ≥ 95%.
- Public experience; postal code prefix stored for analytics, no precise user location persisted.
- Map tiles fetched over HTTPS with attribution; WhatsApp/phone CTAs disabled when consent missing.

## Rollout/rollback
- Rollout: Deploy with feature flag `dealerLocator.enable`, warm map tiles cache, and backfill service tags in `DEALER-001`.
- Rollback: Disable flag, revert to support CTA linking to email, and remove `/dealers` nav entry if required.

## Links
- RFC (Accepted): 40-decisions/RFC-001-site-architecture.md
- Traceability: traceability/requirements-to-design.md (REQ-004 row)
- Design tag: contents of `TAG.txt`
