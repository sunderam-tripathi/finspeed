# --- Final Development Dockerfile for API ---
# Use the full Go image so the 'go' command is available for live-reloading.
FROM golang:1.25-alpine

# Install dependencies for database migration and seeding
RUN apk add --no-cache curl tar postgresql-client

# Install golang-migrate
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.17.1/migrate.linux-amd64.tar.gz | tar -xz && \
    mv migrate /usr/local/bin/migrate

# Install air for live reloading
RUN go install github.com/air-verse/air@latest

WORKDIR /app

# Copy modules first to leverage Docker cache
COPY api/go.mod api/go.sum ./
RUN go mod download

# Copy the API source code only; in dev this will be overridden by a volume mount
COPY api/ .

# Copy the entrypoint script and make it executable
COPY docker/api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
RUN chmod +x /usr/local/bin/api-entrypoint.sh

ENTRYPOINT ["api-entrypoint.sh"]

EXPOSE 8080
# The CMD is specified in docker-compose.yml
CMD ["air"]
