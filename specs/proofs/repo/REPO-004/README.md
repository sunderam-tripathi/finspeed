# REPO-004 Proof - Align release documents with the Amplify production path

## What changed

- `.github/workflows/guard.yml` — the disarmed Vercel `deploy-web` job is removed
  and replaced with a comment documenting the real release path (Amplify
  auto-build of protected `main`); the workflow now contains only the `guard`
  job (`artefacts/guard-yml-deploy-job-removal.diff.txt`).
- `specs/runbooks/repo/release.md` — new runbook: production identity, the
  merge-is-deploy gate, post-release verification, rollback via the Amplify CLI
  (requires `aws sso login`), the Vercel preview integration's non-production
  role, and release-path history.
- `AGENTS.md` — two template-era falsehoods corrected: GCP owner-access replaced
  by the AWS Amplify release reality, and Google Secret Manager replaced by
  Amplify environment variables / GitHub Actions secrets
  (`artefacts/charter-gcp-corrections.diff.txt`).

## Verification

- Workflow YAML parses; `jobs` contains exactly `guard` (python `yaml.safe_load`).
- `npm run spec:plan-lint -- specs/notes/plans/repo/REPO-004.md` — Plan lint OK.
- `npm run spec:validate-references` — exit 0.
- Green `guard` runs on this branch (PR event and push event) executed the
  edited workflow end to end: runs 30195473969 and 30195464195
  (`artefacts/run-30195473969-guard-pass.txt`).

## Context

The 2026-07-26 WEB-035/036 merges deployed to production through the Amplify
`main` connection while operators were watching only the disarmed Vercel CI job.
Branch protection (PR + `guard` + admins) was added the same day; this slice
makes the written record match that machinery.

final result: passed

## Follow-up executed: unused Production environment deleted (2026-07-27)

The optional owner action recorded in the REPO-004 plan was approved and
executed by the steward on 2026-07-27: the GitHub `Production` environment —
unreferenced since the Vercel `deploy-web` job's removal, holding zero
protection rules and zero secrets (verified immediately before deletion) —
was deleted via `gh api -X DELETE .../environments/Production`. Captures:
`artefacts/environments-before-deletion.json` (Preview + Production) and
`artefacts/environments-after-deletion.json` (Preview only). The `Preview`
environment belongs to the Vercel pull-request integration and is untouched;
if that integration ever records a production deployment it may recreate the
environment, which would be visible in repository settings and harmless.
