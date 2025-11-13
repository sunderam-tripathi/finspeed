### Readiness
- [x] RFC **Accepted** (`../_shared/rfcs/RFC-001-site-architecture.md`) detailing dealer locator decisions.
- [x] Build-Ready gate complete; `TAG.txt` = `design-0.1-REQ-004`, reflected in `PROGRESS.md`.
- [x] Traceability row for REQ-004 maps RFC → IC-12 → tests/runbook.

### Discovery & Q&A
- [x] Client Q&A summary captured in `README.md` with owner/date stamps (see Client Q&A section).
- [x] Sanitized discovery prompts copied into `content/discovery/` (mirror of `10-discovery/`; no open blockers as of 2025-11-04).

### Specifications & Quality
- [x] Interface `contracts/IC-12-dealer-locator.md` frozen with map/search behaviour.
- [x] Data contract `contracts/dealer-locations.schema.json` + GA4 event schema finalized.
- [x] Diagrams (context/container/sequence) updated with map + Formspree flows.
- [x] Acceptance/contract/load plans finalized (`tests-and-runbook/acceptance.feature`, `contract-plan.md`, `load-plan.md`).

### Assets & Content
- [x] Asset inventory recorded in README with bundle checksums for `_shared/assets/`, `data/`, and `content/design/`.
- [x] Dealer dataset maintained in `20-requirements/data/dealer-locations.csv` with schema mapping.
- [x] Channel copy and metadata captured in `20-requirements/data/contact-points.yaml`.
- [x] Map tile usage + accessibility notes documented inside contract and RFC.

### Operations & Access
- [x] Runbook covers geosearch smoke tests, fallback behaviour, cache purges.
- [x] Deployment/DR documentation addresses tile provider fallback and DNS switching.
- [x] Monitoring tracks search success rate + no-result events (`66-observability/slis.md`).
- [x] Dealer data updates restricted to approved roles (per Git PR + schema validation).

### Security & Governance
- [x] Dealer dataset classified as Internal; distribution rules captured in `65-security/data-classification.md`.
- [x] Logging avoids storing precise addresses beyond dataset; GA4 payload uses postal prefix only.
- [x] Approvals captured per `71-governance/approval-matrix.md`; OSM usage documented in RFC.
