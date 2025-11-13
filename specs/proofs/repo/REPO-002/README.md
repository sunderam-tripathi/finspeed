# Proof — REPO-002 (CI commit message lint)

Guard additions:
- Shared validator: `tools/spec/lib/commit-message.js`.
- CI script: `tools/spec/verify-commit-range.mjs`.
- Workflow step: `.github/workflows/guard.yml` (Commit message lint step).

Verification steps:
- Fixture pass run: `artefacts/commit-range-pass.log` (exit 0).
- Fixture fail run: `artefacts/commit-range-fail.log` (exit 5).

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local). CI run pending once pushed.
