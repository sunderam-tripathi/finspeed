# SCN-001 / REQ-001 — Site structure shell

## Outcome (why)
Visitors land on a bilingual, high-performance marketing shell that highlights Finspeed offerings, keeps dealer access one click away, and respects consent-aware analytics.

## Scope (this slice)
- In: Home layout, primary navigation, hero/CTA content, language + theme toggles, footer support links, GA4 instrumentation, performance budgets.
- Out: Catalog detail content, dealer search results logic, blog rendering, subscription processing (covered by other slices).

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-6 | ui   | Locale toggle between English/Hindi with consent-aware persistence | contracts/IC-6-language-toggle.md | v1.0 | Toggle to Hindi -> route `/hi` + analytics `language_change` |
| IC-8 | ui   | Primary navigation & dealer CTA across desktop/mobile | contracts/IC-8-primary-navigation.md | v1.0 | Dealer CTA click -> route `/dealers` + analytics `dealer_directions_click` |

## Acceptance checks
```gherkin
Scenario: Navigate to product categories from landing page
Scenario: Hero conveys brand promise
Scenario: Language selection supports English and Hindi
Scenario: Theme respects device preference and manual toggle
Scenario: Dealer access is discoverable from top-level navigation
Scenario: Support contact is reachable globally
Scenario: Language toggle handles missing translation keys
```

## Non-functional & security
- Performance: LCP ≤ 2.5s, TTI ≤ 3.5s, CLS < 0.1 (mobile 4G).
- Availability: 99.5% via static hosting + CDN; assets served globally.
- AuthN/Z: public access; consent gate controls analytics scripts.
- Logging: analytics events follow `site.interaction.analytics.v1`; locale warnings logged client-side.
- Data class: No PII stored; optional locale cookie (non-PII) under consent.

## Rollout/rollback
- Rollout: Deploy static build, run Playwright + Lighthouse gates, announce design tag `design-0.1-REQ-001`.
- Rollback: Redeploy previous static build; delete locale cookie if schema changes.

## Links
- RFC (Accepted): 60-architecture/RFCs/RFC-0001-site-structure.md
- Traceability: traceability/requirements-to-design.md (REQ-001 row)
- Design tag: see `TAG.txt`
