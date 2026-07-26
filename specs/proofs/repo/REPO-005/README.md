# REPO-005 Proof - AWS auth command corrected in charter and release runbook

## Evidence chain

- The WEB-038 Amplify audit (2026-07-26) recorded: "this workstation
  authenticates with the AWS CLI v2 browser flow `aws login` (config
  `login_session`, account root), not `aws sso login` as the release runbook
  stated" (`specs/proofs/web/WEB-038/README.md`, delivery-audit section).
- On 2026-07-27 the steward's `aws sso login` attempt failed:
  "Missing the following required SSO configuration values: sso_start_url,
  sso_region" - confirming SSO was never configured on this machine.

## Change

- `specs/runbooks/repo/release.md` rollback section now states the `aws login`
  browser flow, that `aws sso login` is unconfigured here, and the
  expired-session recovery.
- `AGENTS.md` production bullet references the same mechanism and points at the
  runbook's credential note.

## Verification

- `grep -rn "aws sso login" AGENTS.md specs/runbooks/` returns no hits after
  the change; the historical references in slice plans and proofs are records
  of what was believed at the time and are deliberately left intact.

final result: passed
