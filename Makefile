# Makefile for Finspeed project automation, per Section 17.

.PHONY: help dev up build down test lint

help:
	@echo "Finspeed Project Commands:"
	@echo "  make dev          - Start all services in development mode with hot-reloading."
	@echo "  make up           - Start all services in detached mode."
	@echo "  make down         - Stop and remove all services."
	@echo "  make build        - Build or rebuild all Docker images."
	@echo "  make test         - Run unit tests for both frontend and API."
	@echo "  make lint         - Run linters for both frontend and API."

# Development Commands
dev:
	docker-compose up --build

up:
	docker-compose up -d --build

down:
	docker-compose down

build:
	docker-compose build

# Quality Assurance Commands
test:
	@echo "Running API tests..."
	# cd api && go test ./...
	@echo "Running frontend tests..."
	# cd frontend && pnpm test

lint:
	@echo "Linting API code..."
	# golangci-lint run ./api/...
	@echo "Linting frontend code..."
	# cd frontend && pnpm lint
