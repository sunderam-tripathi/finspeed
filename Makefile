.PHONY: parity-ensure dev-web

parity-ensure:
	node tools/dev/parity-stack.mjs ensure

dev-web:
	node tools/dev/run-managed.mjs web "npm" "run" "dev" "--workspace" "web"
