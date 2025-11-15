# Plan — DOCS-004

- Context:
  Guard documentation (AGENTS.md, web handoff spec checklist, handoff guide) still references the retired brand style guide and needs to cite the new `ui-ux-aesthetics.md` spec plus refreshed terminology.
- Goals:
  - Update AGENTS contract + runbooks to point to the canonical UI/UX spec.
  - Refresh AGENTS/specs web checklist and handoff-guide wording to match the new source of truth.
  - Capture proof artefacts (diff summary + lint) and refresh telemetry if needed.
- Risks:
  - Forgetting to mention the updated spec in shared steps.
  - Breaking formatting/contract wording if not careful.

## Steps
1. Edit AGENTS.md to clarify customer-facing slices must follow `ui-ux-aesthetics.md`.
2. Update `AGENTS/specs/web-handoff-specs.md` shared steps + per-slice key inputs to drop the old brand-style doc and cite the new spec.
3. Update `handoff-guide.md` to describe contract types and link to the UI spec.
4. Stage docs, run lint (if applicable), capture proof summary, and commit referencing DOCS-004.
5. Update telemetry if required, mark proof README, and park when finished.

## Execution Checklist
- [ ] Docs updated.
- [ ] Proof artefacts captured (diff/log snippet).
- [ ] Telemetry refreshed if required.
- [ ] Slice parked.
