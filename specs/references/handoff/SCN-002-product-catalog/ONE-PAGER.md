# SCN-002 / REQ-002 — Product catalog browsing

## Outcome (why)
Prospects quickly explore Finspeed’s bicycle lineup, apply meaningful filters, and compare models with clear value messaging, increasing engagement and intent.

## Scope (this slice)
- In: Category listings (ATB, MTB, Road Racer), filter panel, comparison drawer, analytics instrumentation, catalog data validation, performance guardrails.
- Out: Individual model detail pages, dealer locator, checkout or lead capture, CMS integrations.

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-9 | interface | Catalog listing & filter contract | contracts/IC-9-catalog-grid.md | v1.0 | Filter to `fork=Front suspension` → cards update + analytics event |
| IC-10 | interface | Comparison drawer | contracts/IC-10-comparison-drawer.md | v1.0 | Add 3 models → drawer highlights differences, limit reached notice |

## Acceptance checks
```gherkin
Scenario: Category overview displays the expected models
Scenario: Value-added benefits visible from catalog
Scenario: Filter within category narrows model list
Scenario: Model comparison reveals key differences
Scenario: Filter with no matching results informs the visitor
```

## Non-functional & security
- Performance: LCP ≤ 2.5s, TBT ≤ 200ms, CLS < 0.1 on `/catalog` route.
- Availability: Static hosting on Vercel free tier; build fails if catalog data invalid.
- AuthN/Z: None (public). Logging limited to consent-gated analytics.
- Data class: Catalog data public; no user state persisted beyond session storage for comparison drawer.

## Rollout/rollback
- Rollout: Merge feature branch, ensure schema validation + Playwright + LHCI pass; publish GA4 dashboard for filter/comparison metrics.
- Rollback: Revert to previous static build if regressions; restore prior catalog JSON snapshot.

## Links
- RFC (Accepted): 60-architecture/RFCs/RFC-0002-product-catalog.md
- Traceability: traceability/requirements-to-design.md (REQ-002 row)
- Design tag: see `TAG.txt`
