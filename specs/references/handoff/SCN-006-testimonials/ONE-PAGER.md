# SCN-006 / REQ-006 — Testimonials carousel

## Outcome (why)
Showcase real rider voices to build social proof and prompt visitors to explore more bikes or reach out for support.

## Scope (this slice)
- In: Testimonial carousel component, autoplay toggle, category filter, accessibility support, analytics.
- Out: Data ingestion automation, CMS moderation workflow, brand story content (handled in REQ-005).

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-14 | ui | Testimonial carousel module with autoplay + analytics | contracts/IC-14-testimonials.md | v1.0 | Autoplay toggled on mobile triggers `testimonial_autoplay_toggled` event |

## Acceptance checks
```gherkin
Scenario: Testimonials carousel rotates through rider quotes
Scenario: Carousel is keyboard navigable and exposes aria labels
Scenario: Autoplay respects reduced motion preference
Scenario: Filtering by category updates visible testimonials
Scenario: Analytics fires when visitors interact with testimonials
```

## Non-functional & security
- Carousel FPS ≥ 30 on mid-tier devices, autoplay disabled when `prefers-reduced-motion`; ensures bundle adds < 20KB.
- Public quotes sourced from consented riders; no PII beyond name + city displayed.
- Analytics events `testimonial_slide_view` and `testimonial_autoplay_toggled` honour consent.

## Rollout/rollback
- Rollout: Validate TESTIMONIAL-001 content, run component visual regression, enable `testimonials.enable` flag across pages.
- Rollback: Disable flag, restore previous static quotes block, purge CDN for sections where component appears.

## Links
- RFC (Accepted): 40-decisions/RFC-001-site-architecture.md
- Traceability: traceability/requirements-to-design.md (REQ-006 row)
- Design tag: contents of `TAG.txt`
