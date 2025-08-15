# Production multi-stage Dockerfile for Go API (Cloud Run)

# --- Builder stage ---
FROM golang:1.25-alpine AS builder
WORKDIR /workspace

# Ensure certificates for go get if needed
RUN apk add --no-cache ca-certificates git build-base

# Copy go.mod and go.sum first to leverage cache
COPY api/go.mod api/go.sum ./api/
WORKDIR /workspace/api
RUN go mod download

# Copy the API source
COPY api/ ./

# Build a static binary
ENV CGO_ENABLED=0
ENV GOOS=linux
RUN go build -ldflags="-s -w" -o /out/server ./cmd/server

# Also copy migrations needed at runtime
WORKDIR /workspace
COPY db/migrations ./db/migrations

# --- Runtime stage ---
FROM gcr.io/distroless/static:nonroot

# Create app directories and copy artifacts
WORKDIR /
COPY --from=builder /out/server /server
COPY --from=builder /workspace/db/migrations /app/db/migrations

# Cloud Run uses PORT env var; our app defaults to 8080
EXPOSE 8080

ENTRYPOINT ["/server"]
