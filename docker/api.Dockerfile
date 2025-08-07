# --- Final Development Dockerfile for API ---
# Use the full Go image so the 'go' command is available for live-reloading.
FROM golang:1.24.5-alpine

# Install air for live reloading
RUN go install github.com/air-verse/air@latest

WORKDIR /app

# Copy modules first to leverage Docker cache
COPY api/go.mod api/go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY api/ .

EXPOSE 8080
# The CMD is specified in docker-compose.yml
