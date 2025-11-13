# Automation Matrix

Core tools (Node scripts):
- `tools/spec/check-active-slice.mjs` — reports guard state.
- `tools/spec/set-active-slice.mjs` — activate/park slice.
- `tools/spec/verify-active-slice.mjs` — enforce allow-list on changed files.
- `tools/spec/agents-load.mjs` — assemble charter + capsules for a slice.
- `tools/spec/plan/generate-plan.mjs` — scaffold plan from template.
- `tools/spec/plan/lint-plan.mjs` — lint plan format.
- `tools/spec/progress.mjs` — generate progress summary JSON.
- `tools/spec/slice-index.mjs` — generate slice index markdown.
- `tools/spec/lib/commit-message.js` — shared commit message validator.
- `tools/spec/verify-commit-msg.mjs` — local commit hook entrypoint.
- `tools/spec/verify-commit-range.mjs` — CI commit range lint.
- `tools/spec/validate-references.mjs` — ensures reference library and handoff index stay in sync.

Dev utility tools:
- `tools/dev/parity-stack.mjs` — manage parity state JSON.
- `tools/dev/run-managed.mjs` — run long-lived processes with log capture. Always invoke via a timeout wrapper (≤300s, e.g., `timeout 300s node tools/dev/run-managed.mjs ...`) so consoles never hang indefinitely.
- `tools/dev/sudo-request.mjs` — queue privileged commands for steward.

Git hooks:
- `.githooks/pre-commit` and `.githooks/pre-push` invoke `verify-active-slice`.
