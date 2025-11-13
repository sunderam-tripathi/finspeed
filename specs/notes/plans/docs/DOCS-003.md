# Plan — DOCS-003

- Context:
  Reference packs (SCN-001 … SCN-008) now have summaries, but we need an automated guard to ensure every directory is indexed and table rows only reference existing packs.
- Goals:
  - Add a Node validator (`tools/spec/validate-references.mjs`).
  - Wire the script into package.json and CI guard workflow.
  - Capture proof artefacts (script output for pass + simulated failure) and refresh telemetry.
- Risks:
  - Regex parsing might miss new table formats; keep logic simple and documented.
  - Running the validator on CI must not require full repo traversal beyond `specs/references`.

## Steps
1. Extend docs spec/ledger + add slice supplement (done).
2. Implement validator script (list directories vs README entries) + npm script.
3. Add CI step to run validator.
4. Capture proof logs (success + failure sample), update proof README.
5. Refresh telemetry, mark slice done, park repo.

## Execution Checklist
- [x] Validator implemented.
- [x] CI updated.
- [x] Proof artefacts captured.
- [x] Telemetry refreshed.
- [x] Slice parked.

## Artefact References
- Proof README: `specs/proofs/docs/DOCS-003/README.md`.
- Logs: `artefacts/validate-pass.log`, `artefacts/validate-fail.log`, fixture `handoff-readme-missing.md`.
- CI evidence: `.github/workflows/guard.yml` step "Validate references".
