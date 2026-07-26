# Plan — REPO-004

- Context:
  The repository's release documents contradict its live infrastructure. Production
  `www.finspeed.online` is the AWS Amplify app `finspeed` (`d2h8tz7elv2xy8`,
  `ap-south-1`) auto-building the `main` branch — established by WEB-022 and ratified
  as deliberate policy on 2026-07-26, when `main` gained branch protection requiring a
  pull request and a green `guard` check (admins enforced). Yet `guard.yml` still
  carries a disarmed `deploy-web` job targeting Vercel whose own comment calls the
  host "undecided", and the root charter still claims GCP infrastructure and Google
  Secret Manager credential flows from the template this repo grew out of. The
  2026-07-26 WEB-035/036 merges went live through the Amplify path while every
  operator was watching only the disarmed CI job — the written record must stop
  pointing away from the real release path.
- Goals:
  - Remove the unused Vercel `deploy-web` job so CI has no second, contradictory
    deploy path, and document the real path where the job used to be.
  - Write `specs/runbooks/repo/release.md`: production identity, the
    merge-is-deploy gate, post-release verification, rollback, and the preview
    integration's non-production role.
  - Correct the charter's GCP-era claims (infrastructure access, secret manager)
    to the AWS reality.
- Risks:
  - Editing `guard.yml` can break the workflow that branch protection now requires;
    the PR's own guard run is the executable proof either way, and merge is blocked
    until it passes.
  - Deleting the job removes the `Production` GitHub environment's only reference;
    the environment itself is left for the owner to delete in settings (optional).
  - The charter edit is deliberately surgical — two false claims — because a full
    template-debt rewrite (docker parity stub, sudo queue, GCP remnants elsewhere)
    is its own slice.

## Steps
1. Delete the `deploy-web` job from `.github/workflows/guard.yml` and replace it
   with a comment stating the Amplify release path and pointing at the runbook.
2. Write `specs/runbooks/repo/release.md` covering identity, gate, verification,
   rollback (requires `aws sso login`), previews, and history.
3. Correct the charter's GCP infrastructure and Google Secret Manager lines to the
   AWS Amplify / repository-secrets reality.
4. Register REPO-004 in the repo contract spec and ledger; keep plan, proof, and
   telemetry current; close through the guarded commit flow.

## Execution Checklist
- [x] `deploy-web` removed; workflow comment documents the real release path.
- [x] `specs/runbooks/repo/release.md` written and referenced from the workflow.
- [x] Charter GCP-era claims corrected to the AWS reality.
- [x] Workflow proven by a green `guard` run on this branch's pull request.
- [x] Proof artefacts captured under `specs/proofs/repo/REPO-004/`.
- [x] Telemetry refreshed.
- [x] Slice parked.

## Follow-ups (not in this slice)
- Full template-debt sweep of AGENTS.md and charter modules (docker parity stack is
  a state-file stub, sudo-request queue is POSIX-era, remaining GCP references in
  charter modules).
- Optional: delete the now-unreferenced `Production` GitHub environment (owner
  action in repository settings).
- Successor production UAT slice against the live build (replaces superseded
  WEB-020/021).
