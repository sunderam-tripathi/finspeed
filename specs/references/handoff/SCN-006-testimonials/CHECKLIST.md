### Readiness
- [x] RFC **Accepted** (`../_shared/rfcs/RFC-001-site-architecture.md`) covering testimonials experience.
- [x] Build-Ready gate complete; `TAG.txt` = `design-0.1-REQ-006` and `PROGRESS.md` updated.
- [x] Traceability row (REQ-006) links interface, schema, tests, and runbook.

### Discovery & Q&A
- [x] Client Q&A summary captured in `README.md` with owner/date stamps (see Client Q&A section).
- [x] Sanitized discovery prompts copied into `content/discovery/` (mirror of `10-discovery/`; no open blockers as of 2025-11-04).

### Specifications & Quality
- [x] Interface `contracts/IC-14-testimonials.md` frozen with autoplay, accessibility, analytics requirements.
- [x] Data contract `contracts/testimonial.schema.json` validated; event schema reused.
- [x] Diagrams refreshed for carousel flow (`diagrams/context.mmd`, `container.mmd`, `sequence.mmd`).
- [x] Acceptance + contract + load plans finalized (`tests-and-runbook/acceptance.feature`, `contract-plan.md`, `load-plan.md`).

### Assets & Content
- [x] Asset inventory recorded in README with bundle checksums for `_shared/assets/`, `data/`, and `content/design/`.
- [x] Testimonials copy + consent status tracked in `20-requirements/functional/REQ-006-testimonials.md`.
- [x] Content source documented to live under `content/testimonials/{locale}.json` aligned to schema; asset manifest includes portrait imagery references.
- [x] Brand voice + accessibility tone confirmed in `30-design/blueprints/brand-style-guide.md`.

### Operations & Access
- [x] Runbook documents autoplay toggle, fallback behaviour, and incident handling.
- [x] Deployment/DR/secrets docs align with static JSON pipeline and CDN caching.
- [x] Monitoring covers slide engagement + autoplay toggles via GA4 dashboard entries.
- [x] Content updates require marketing approval; consent records stored off-repo per legal.

### Security & Governance
- [x] Data classification: testimonials (Public with consent) per `65-security/data-classification.md`.
- [x] Logging ensures no full names beyond approved fields; analytics uses testimonial IDs only.
- [x] Governance approvals recorded per `71-governance/approval-matrix.md`.
