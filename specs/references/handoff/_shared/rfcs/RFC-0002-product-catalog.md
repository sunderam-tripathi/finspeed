---
rfc: 0002
title: Product catalog browsing & comparison
status: Accepted
owner: Finspeed Product Owner
last_reviewed: 2025-11-04
links:
  requirements: [REQ-002]
  decisions: [DR-005, DR-007, DR-008]
  apis: [IC-9, IC-10]
  data_contracts: [CATALOG-001]
  event_contracts: [site.interaction.analytics.v1]
  runbooks: [RUN-001]
---
## Summary
Deliver a static Next.js catalog experience that lets visitors browse eight Finspeed bicycle models by category, filter within a discipline, and compare models side-by-side while reinforcing value props (warranty, service, EMI). Interactions remain client-side, powered by frozen catalog data and consent-aware analytics events.

## Context
- **Business goals.** Increase prospect conversion by making catalog exploration intuitive, highlight value-added benefits, and capture filter/comparison engagement for marketing insight.
- **Scope.** Listing pages for ATB/MTB/Road Racer, filter panel, comparison drawer, value messaging, and analytics. Model detail pages are covered elsewhere.
- **Assumptions.**
  - Catalog data is sourced from Git-managed CSV (`CATALOG-001`) transformed at build time.
  - Site continues to deploy as static export on Vercel edge network (DR-005).
  - Filters affect only client-side state—no server round trips.
- **Constraints.**
  - Must respect performance budgets (LCP ≤ 2.5s) even with filter/comparison interactions.
  - No PII collected; analytics limited to behavioral events with consent.

## Design
- **Architecture.**
  - Static build transforms `product-catalog.csv` into typed JSON consumed by `CatalogGrid` component.
  - Category routes: `/catalog` (default), `/catalog/atb`, `/catalog/mtb`, `/catalog/road-racer`.
  - Filter state managed via URL query params (e.g., `?frame=carbon`) to support shareable links.
  - Comparison drawer persists selections in memory; limited to 3 models to protect layout.
- **Visual system.** Cards, filters, buttons, and grid behavior follow the shared UI spec at `../ui-ux-aesthetics.md` so catalog matches the rest of the site.
- **Data model.**
  - `CATALOG-001` schema normalized to `catalog-item.schema.json` specifying fields (model, variant, category, specs, warranty, finance).
  - Build step validates CSV against schema; failure blocks deployment.
  - Filter facets derived from schema enumerations (frame, suspension, brakes, wheels, tyres, gears).
- **Interfaces.**
- `IC-9` Catalog listing & filter contract (Frozen v1.0) defines card layout, badges, filter controls, empty state messaging, and accessibility treatment.
- `IC-10` Comparison drawer contract (Frozen v1.0) covers selection limits, table layout, CTA placement, and analytics instrumentation.
- **Events & analytics.**
  - Extend `site.interaction.analytics.v1` with events: `catalog_filter_applied`, `catalog_compare_opened`, `catalog_compare_removed`.
  - Payload includes `filter_id`, `filter_value`, `comparison_models` array, and theme/locale context.
- **Security & privacy.**
  - All data public read-only; no storage of user selections beyond session memory.
  - Respect consent gate before emitting analytics; `consent_granted` flag remains required.
- **Observability.**
  - GA4 dashboards: filter engagement %, comparison usage, exit rate by category.
  - Web Vitals instrumentation already in place; ensure LCP covers catalog hero image (lazy-loaded after main content).
- **Performance.**
  - Use dynamic import for comparison drawer to defer cost until invoked.
  - Prefetch category routes when nav becomes visible.
  - Ensure filters render <100ms by memoizing filtered results.

## Alternatives
- **Server-side filtering via API.** Rejected—static dataset small; client-side simpler and faster.
- **CMS-managed catalog.** Deferred; Git-based content adequate, keeps hosting free-tier.
- **Unlimited comparison selections.** Rejected to avoid layout/perf issues; limit to 3 models.

## Rollout / Migration
1. Validate CSV against new schema; clean data issues.
2. Implement catalog listing, filters, comparison drawer, and analytics hooks.
3. Update Playwright tests for filters/comparison scenarios; add schema validation step to CI.
4. Run Lighthouse CI focusing on `/catalog` to confirm budgets.
5. Announce `design-0.1-REQ-002` tag with handoff pack.

## Testability
- Acceptance scenarios covered in `../_shared/tests/e2e/catalog.feature` (filters, comparison, empty state, value messaging).
- Contract tests: component snapshot + accessibility for `IC-9` and `IC-10`; schema validation for `CATALOG-001`.
- Performance: LHCI run on `/catalog` route using budgets defined in `../_shared/tests/performance/load-plan.md`.

## Build-Ready Checklist
- RFC accepted: ✅
- Interfaces frozen: `IC-9`, `IC-10`.
- Data/event contracts: `catalog-item.schema.json`, `site.interaction.analytics.v1.json` updated.
- Tests: `../_shared/tests/e2e/catalog.feature`, schema validation scripts defined.
- Runbook: `RUN-001` updated with catalog-specific checks.
- Traceability: `traceability/requirements-to-design.md` contains REQ-002 row.
- Handoff pack: `handoff/SCN-002-product-catalog/` populated.

## Open Questions
- None; next review will confirm filter facets remain in sync with future product additions.
