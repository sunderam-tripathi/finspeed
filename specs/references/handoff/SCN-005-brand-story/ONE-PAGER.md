# SCN-005 / REQ-005 — Brand story narrative page

## Outcome (why)
Tell Finspeed's origin, mission, and impact to build trust and convert visitors into curious riders who explore catalog and dealers.

## Scope (this slice)
- In: Mission hero, timeline, impact metrics counters, community spotlights carousel, bilingual content, CTA strip to dealers/support.
- Out: Blog article authoring, CMS integration, testimonials carousel (covered by REQ-006).

## Interfaces (this slice only)
| ID   | Type | Purpose | Contract path | Version | Example |
|------|------|---------|---------------|---------|---------|
| IC-13 | ui | Render brand story narrative with timeline, metrics, CTA | contracts/IC-13-brand-story.md | v1.0 | Metrics counters animate when `brand-story` section enters viewport |

## Acceptance checks
```gherkin
Scenario: Hero conveys Finspeed mission and differentiators
Scenario: Timeline highlights major milestones in chronological order
Scenario: Impact metrics animate and remain accessible to screen readers
Scenario: Community spotlight surfaces latest story with CTA
Scenario: CTA strip routes visitors to dealers and support hubs
```

## Non-functional & security
- CLS < 0.1 with animated counters, page weight ≤ 200KB gzip per locale, timeline images lazy loaded.
- Public content; analytics for scroll depth uses aggregated `brand_timeline_scroll_depth` with percent buckets.
- Ensure MDX render sanitized; no external embeds beyond pre-approved assets.

## Rollout/rollback
- Rollout: Publish MDX content, validate `BRAND-001` schema, deploy behind `brandStory.enable` flag, run `TST-E2E-007` shared hero checks.
- Rollback: Disable flag, revert MDX to previous revision, and clear CDN cache for `/brand-story`.

## Links
- RFC (Accepted): 40-decisions/RFC-001-site-architecture.md
- Traceability: traceability/requirements-to-design.md (REQ-005 row)
- Design tag: contents of `TAG.txt`
