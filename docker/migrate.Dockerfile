# Use the official Golang image to create a build artifact.
# This is known as a multi-stage build.
FROM golang:1.25-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the Go module files
COPY api/go.mod api/go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the API source code
COPY api/ .

# Create and copy the migrations directory
RUN mkdir -p /app/db/migrations
COPY db/migrations/ /app/db/migrations/

# Build the Go app
# -o /app/main: output the binary to /app/main
# CGO_ENABLED=0: disable CGO for a statically linked binary
# -ldflags "-w -s": strip debug information to reduce binary size
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags "-w -s" -o /app/main ./cmd/server

# --- Final Stage ---
# Use a minimal image for the final container
FROM alpine:latest

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .
# Copy the migrations directory
COPY --from=builder /app/db/migrations ./db/migrations

# This container is a one-off job, so it doesn't need to expose a port.
# The command to run the migration will be specified in the Cloud Run Job configuration.
ENTRYPOINT ["/app/main", "migrate"]
