# Plan — REPO-002

- Context:
  Extend commit-message guardrails into CI so every pushed commit follows conventions and references a slice ID pattern.
- Goals:
  - Share commit-message validation logic between local hooks and CI scripts.
  - Add script to scan commit ranges (`tools/spec/verify-commit-range.mjs`).
  - Update guard workflow to run the scan on push/PR.
  - Capture proof logs showing both pass and fail cases using message fixtures.
  - Refresh telemetry and document results.
- Risks:
  - GitHub events may have empty base SHA (handle fallback in workflow).
  - Pattern enforcement might reject historical commits lacking IDs (communicate in proof/README).

## Steps
1. Add shared validator utility (`tools/spec/lib/commit-message.js`) and refactor local verifier to use it.
2. Implement `verify-commit-range.mjs` supporting both git ranges and JSON fixtures for proofs.
3. Update `.github/workflows/guard.yml` with commit message lint step using env-provided base/head SHAs.
4. Create slice supplement + proof README; run scripts with sample messages to capture pass/fail logs.
5. Update ledger + telemetry, set slice state done, park repository.

## Execution Checklist
- [x] Shared validator implemented (`tools/spec/lib/commit-message.js`).
- [x] CI script added and workflow updated.
- [x] Proof artefacts captured (logs, fixture JSON, workflow snippet).
- [x] Telemetry refreshed.
- [x] Slice parked.

## Artefact References
- Proof README: `specs/proofs/repo/REPO-002/README.md`.
- Fixture messages: `artefacts/messages-pass.json`, `artefacts/messages-fail.json`.
- Logs: `artefacts/commit-range-pass.log`, `artefacts/commit-range-fail.log` (+ `.exit`).
- Telemetry logs: `artefacts/slice-index.log`, `artefacts/progress.log`.
