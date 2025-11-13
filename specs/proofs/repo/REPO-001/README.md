# Proof — REPO-001 (Commit message enforcement)

Guard:
- `.githooks/commit-msg` executes `tools/spec/verify-commit-msg.mjs` which enforces conventional prefix and active slice ID when repository state is ACTIVE.

Verification steps:
- Good message passes: `artefacts/commitmsg-good.log` (exit 0).
- Missing slice ID fails: `artefacts/commitmsg-bad1.log` (exit 4).
- Missing conventional prefix fails: `artefacts/commitmsg-bad2.log` (exit 3).

Telemetry:
- `artefacts/slice-index.log`
- `artefacts/progress.log`

RESULT: PASS (local). CI adoption pending.

Next:
- Add CI job to lint PR commit messages or rely on protected branch hooks.
