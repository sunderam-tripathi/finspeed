# Proof — DOCS-003 (Reference integrity automation)

Guard additions:
- Validator script `tools/spec/validate-references.mjs` compares scenario directories with the handoff index.
- NPM script `spec:validate-references` exposed for local runs; CI guard executes it.

Verification steps:
- Success run (actual repo): `artefacts/validate-pass.log` (exit 0).
- Failure fixture (missing entries) triggers error: `artefacts/validate-fail.log` (exit 1).

Telemetry:
- `artefacts/slice-index.log`, `artefacts/progress.log` (after ledger update).

RESULT: PASS (local). CI will enforce via `.github/workflows/guard.yml` step "Validate references".
