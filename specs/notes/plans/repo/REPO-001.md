# Plan — REPO-001

- Context:
  Extend guardrails to commit messages so every commit references the active slice ID while following conventional commit syntax.
- Goals:
  - Add `commit-msg` hook invoking a verifier script.
  - Verifier enforces conventional prefix plus slice ID when ACTIVE; allows IDLE commits.
  - Capture proof artefacts showing passing and failing cases.
  - Refresh telemetry and proof directories.
- Risks:
  - Hook might block emergency commits (mitigation: requirement only applied when ACTIVE; instructions documented).
  - CI cannot easily introspect commit messages (follow-up to add server-side enforcement later).

## Steps
1. Implement `tools/spec/verify-commit-msg.mjs` with conventional + slice checks.
2. Add `.githooks/commit-msg` to call the script and ensure executable.
3. Activate REPO-001, craft example messages (good / missing slice / missing prefix), run hook manually, capture logs + exit codes.
4. Document artefacts in proof README; add slice supplement instructions.
5. Update ledger + telemetry, set RESULT to PASS, and park repository when finished.

## Execution Checklist
- [x] Hook installed (`.githooks/commit-msg`).
- [x] Verifier implemented (`tools/spec/verify-commit-msg.mjs`).
- [x] Proof artefacts captured (`specs/proofs/repo/REPO-001/artefacts/*`).
- [x] Telemetry refreshed (slice index + progress logs).
- [x] Slice parked after completion.
- [ ] CI adoption confirmed (tracked as follow-up).

## Artefact References
- Proof README: `specs/proofs/repo/REPO-001/README.md`.
- Logs: `artefacts/commitmsg-good.log`, `artefacts/commitmsg-bad1.log`, `artefacts/commitmsg-bad2.log` (+ `.exit`).
- Telemetry logs (pending once slice completes).
