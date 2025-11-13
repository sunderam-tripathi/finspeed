# Plan — DOCS-001

- Context:
  Bootstrap the autonomous, spec-driven workflow (charters, guards, hooks, CI, telemetry) so slices can run with enforced scope and proofs.
- Goals:
  - Add charter modules and domain capsules.
  - Implement active-slice tooling and scope guard.
  - Install git hooks and a CI guard workflow.
  - Provide plan generation/lint and telemetry (slice index, progress summary).
  - Produce a proof bundle demonstrating guard behavior (allowed/violation, post-done rules) and parity evidence.
- Risks:
  - CI environment differences vs local (fetch depth, base ref).
  - Overly permissive allow-list on bootstrap slice.
  - Missing directories causing script write failures.

## Steps
1. Add charter modules and indexes under `AGENTS/charter/*`; add `AGENTS/domains/repo.md` and slice supplements dir.
2. Scaffold docs domain spec `specs/contracts/docs/json/spec.json` with slice DOCS-001 allow-list.
3. Create guard scripts: `check-active-slice`, `set-active-slice`, `verify-active-slice` (with CI/pre-commit/pre-push modes).
4. Add plan tools: `plan/generate-plan.mjs`, `plan/lint-plan.mjs`; progress and slice-index generators.
5. Add dev utilities: parity stack, run-managed, sudo-request; write runbooks and READMEs.
6. Configure git hooks in `.githooks/` and package.json scripts, plus `.github/workflows/guard.yml`.
7. Initialize plan stub and activate DOCS-001; ensure parity; generate telemetry.
8. Demonstrate pre-commit guard with allowed and violating changes; capture logs.
9. Harden guard for post-done phase; mark slice done; re-run allowed/violation; capture logs.
10. Update proof README with artefact links; park to IDLE.

## Execution Checklist
- [x] Proof artefacts captured (`specs/proofs/docs/DOCS-001/**`).
- [x] Parity-state recorded and linked.
- [x] Guard verified locally (pre-commit allowed/violation; post-done allowed/violation).
- [x] Telemetry updated (`specs/notes/indexes/slice-index.md`, `specs/project-progress/progress-summary.json`).
- [x] Slice parked to IDLE after completion.

## Artefact References
- Proof README: `specs/proofs/docs/DOCS-001/README.md`.
- Parity snapshot: `specs/proofs/docs/DOCS-001/artefacts/parity-state.json`.
- Pre-commit logs: `artefacts/precommit-allowed.log`, `artefacts/precommit-violation.log` (+ `.exit`).
- Post-done logs: `artefacts/postdone-allowed2.log`, `artefacts/postdone-violation2.log` (+ `.exit`).
- Telemetry logs: `artefacts/slice-index.log`, `artefacts/progress.log`.
