# SCN-003 / REQ-003 — Model detail experience

## Outcome (why)
Model detail pages immerse riders in rich storytelling, specs, and financing context so they confidently click through to a nearby dealer.

## Scope (this slice)
- In: Model hero + gallery, specs/sizing tabs, warranty & service messaging, dealer CTA deep link, JSON-LD Product payload, structured analytics.
- Out: Catalog listing, dealer search results, checkout flows, CMS integrations.

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-11 | ui | Render model detail page with hero, specs, sizing, CTA, JSON-LD | contracts/IC-11-model-detail.md | v1.0 | `Find a dealer` CTA → `/dealers?model=storm-29` + analytics `model_dealer_cta_click` |

## Acceptance checks
```gherkin
Scenario: Model detail includes core information
Scenario: Dealer call-to-action routes to locator with context
Scenario: Dealer locator temporarily unavailable
Scenario: Mobile experience preserves essential content
Scenario: Structured data available for search engines
```

## Non-functional & security
- LCP ≤ 2.5s (4G mobile), CLS < 0.1, JSON-LD validation with Google Rich Results, page bundle ≤ 160KB gzip.
- Public access; CTA analytics only after consent; locale/warranty copy sourced from versioned catalog data.
- Logs only aggregate metadata (model slug, section) — no PII.

## Rollout/rollback
- Rollout: Deploy behind feature flag `modelDetail.enable`; run Playwright TST-E2E-003 + schema validation; update sitemap.
- Rollback: Disable flag + redeploy previous static build; restore prior JSON-LD snapshot if schema changed.

## Links
- RFC (Accepted): 40-decisions/RFC-001-site-architecture.md
- Traceability: traceability/requirements-to-design.md (REQ-003 row)
- Design tag: contents of `TAG.txt`
