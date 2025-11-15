### Readiness
- [x] RFC **Accepted** (`../_shared/rfcs/RFC-0001-site-structure.md`) capturing REQ-001 scope.
- [x] Build-Ready gate passed; `TAG.txt` = `design-0.1-REQ-001` and `PROGRESS.md` updated.
- [x] Traceability matrix row (`traceability/requirements-to-design.md`, REQ-001) links RFC, interfaces, tests, and runbook.

### Discovery & Q&A
- [x] Client Q&A summary captured in `README.md` with owner/date stamps (see Client Q&A section).
- [x] Sanitized discovery prompts copied into `content/discovery/` (mirror of `10-discovery/`; no open blockers as of 2025-11-04).

### Specifications & Quality
- [x] Interfaces frozen (`contracts/IC-6-language-toggle.md`, `contracts/IC-8-primary-navigation.md`).
- [x] Event contract frozen (`events/site.interaction.analytics.v1.json`) with slice summary in `events/event-catalog-slice.md`.
- [x] C4 diagrams refreshed (`diagrams/context.mmd`, `container.mmd`, `component.mmd`, `sequence.mmd`).
- [x] Acceptance, contract, and load plans finalized (`tests-and-runbook/acceptance.feature`, `contract-plan.md`, `load-plan.md`).

### Assets & Content
- [x] Asset inventory recorded in README with bundle checksums for `_shared/assets/`, `data/`, and `content/design/`.
- [x] Copy references captured (`30-design/blueprints/hero-copy.md`, `assets/images/brand/*`) and UI/UX aligned with `../ui-ux-aesthetics.md`.
- [x] Localisation assets linked (`assets/locales/en/home.json`, `assets/locales/hi/home.json`) with structure documented in `20-requirements/data/i18n-structure.md`.
- [x] Legal/footer and support contact content validated (`20-requirements/data/privacy-policy.md`, `20-requirements/data/terms-of-use.md`, `20-requirements/data/contact-points.yaml`).

### Operations & Access
- [x] Runbook `tests-and-runbook/runbook.md` mirrors `67-runbooks/finspeed-launch-checklist.md`.
- [x] Deployment, DR/BCDR, and secrets workflows final (`../_shared/runbooks/deployment-spec.md`, `../_shared/infra/dr-bcdr.md`, `../_shared/infra/secrets-handling.md`).
- [x] Monitoring & SLO hooks configured per `66-observability/*`; consent gating + GA4 debug steps noted.
- [x] Credential handover (GA4, Formspree, deploy tokens) recorded in 1Password and referenced in `../_shared/infra/secrets-handling.md`.

### Security & Governance
- [x] Auth model & data classification confirmed (`65-security/authz-model.md`, `65-security/data-classification.md`); public-only access preserved.
- [x] Logging & privacy controls aligned with `65-security/logging-and-privacy.md`; consent banner copy approved.
- [x] Governance approvals logged per `71-governance/approval-matrix.md`; no open risks.
