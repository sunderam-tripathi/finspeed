# Shared Assets — Handoff Bundle

This folder contains project-level artefacts that apply to every slice. Developers see **only this handoff package**, so treat these files as the source of truth alongside each `SCN-*` folder.

## Contents
- `assets/` — Logos, imagery, and other shared design files referenced by each slice.
- `contracts/site-interaction-ga4.md` — Frozen GA4 payload contract (copy of `63-events/contracts/site-interaction-ga4.md`).
- `runbooks/deployment-spec.md` — Deployment target + rollback guidance (copy of `64-infra/deployment-spec.md`).
- `runbooks/RUN-001-finspeed-launch-checklist.md` — Launch/operations checklist.

Add any additional shared artefacts here whenever they are referenced by multiple slices.
