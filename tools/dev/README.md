# Dev Tools

- Parity session marker: `node tools/dev/parity-stack.mjs [ensure|status]` —
  records the session in `specs/working-memory/parity-state.json`; parity means
  the host runs the same gate set CI enforces (no container layer exists here).
- Run managed: `node tools/dev/run-managed.mjs <name> <cmd> [args...]` — logs
  under `tmp/process-logs/`, metadata in `specs/working-memory/dev-processes.json`.

