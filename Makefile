.PHONY: docker-dev-detached dev-web dev-api

docker-dev-detached:
	node tools/dev/parity-stack.mjs ensure

dev-web:
	node tools/dev/run-managed.mjs web "npm" "run" "dev" "--workspace" "web"

dev-api:
	node tools/dev/run-managed.mjs api "npm" "run" "start:api"
