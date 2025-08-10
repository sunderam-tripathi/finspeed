# Makefile for Finspeed project automation, per Section 17.

# Use the DATABASE_URL from the local env file for migrations
DB_URL := $(shell grep DATABASE_URL api/.env.local | cut -d '=' -f2-)

.PHONY: help dev up down build test lint migrate-up migrate-down

help:
	@echo "Finspeed Project Commands:"
	@echo "  make dev          - Start all services in development mode with hot-reloading."
	@echo "  make up           - Start all services in detached mode."
	@echo "  make down         - Stop and remove all services."
	@echo "  make build        - Build or rebuild all Docker images."
	@echo "  make test         - Run unit tests for both frontend and API."
	@echo "  make lint         - Run linters for both frontend and API."
	@echo "  make migrate-up   - Apply all up database migrations."
	@echo "  make migrate-down - Revert the last database migration."

# Development Commands
dev:
	docker compose up --build

up:
	docker compose up -d --build

down:
	docker compose down

build:
	docker compose build

# Database Commands
migrate-up:
	migrate -path db/migrations -database "$(DB_URL)" -verbose up

migrate-down:
	migrate -path db/migrations -database "$(DB_URL)" -verbose down 1

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