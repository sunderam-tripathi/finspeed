# Event Versioning Strategy

## Current Contract
- `site.interaction.analytics.v1` — GA4-bound analytics payload covering all marketing interactions.
- Schema enforced via JSON Schema in repo and contract tests in `handoff/SCN-*/tests-and-runbook/contract-plan.md`.

## Change Policy
- **Patch:** Documentation clarifications or description updates.
- **Minor:** Add optional payload fields or new enum values that GA4 can ignore; update documentation + custom dimension mapping.
- **Major:** Remove or rename fields, change required fields, or alter semantics. Publish as `site.interaction.analytics.v2` and run parallel emission until consumers migrated.

## Process
1. Raise change request in `../_shared/events/` with justification and impact analysis.
2. Update schema + mapping docs, bump version according to policy.
3. Update acceptance tests and GA4 configuration before deployment.
4. Record change in `50-deliverables/changelog.md` and notify marketing analytics stakeholders.

## Ordering & Idempotency
- Events are fire-and-forget, but dedupe logic uses `event_name + timestamp + element identifier` to prevent duplicates in analytics.
- GA4 handles ordering internally; ensure timestamp uses ISO8601 with timezone.

## Deprecation Policy
- Maintain previous major version for at least one release cycle.
- Document deprecation timeline in `PROGRESS.md` and inform stakeholders via release notes.
