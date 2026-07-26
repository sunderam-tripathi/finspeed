# Plan — REPO-005

- Context:
  The REPO-004 release runbook and charter told operators to authenticate with
  `aws sso login`. The WEB-038 Amplify audit established that this workstation
  actually authenticates with the AWS CLI v2 browser flow (`aws login`,
  `login_session` configuration), and recorded the discrepancy in its proof; on
  2026-07-27 the steward's `aws sso login` attempt failed with missing
  `sso_start_url`/`sso_region`, confirming SSO was never configured here. A
  wrong credential command in the rollback runbook is operational risk at the
  worst possible moment.
- Goals:
  - State the working credential mechanism in the release runbook's rollback
    section and the charter's production bullet.
- Risks:
  - None beyond documentation accuracy; no code, CI, or infrastructure changes.

## Steps
1. Correct the rollback credential note in `specs/runbooks/repo/release.md`.
2. Correct the charter production bullet in `AGENTS.md`.
3. Record the evidence chain in the proof and close through the guarded flow.

## Execution Checklist
- [x] Release runbook states `aws login` with the failure mode and recovery.
- [x] Charter production bullet references the same mechanism.
- [x] Proof records the WEB-038 credential note and the failed `aws sso login`
      attempt as evidence.
- [x] Telemetry refreshed.
- [x] Slice parked.
