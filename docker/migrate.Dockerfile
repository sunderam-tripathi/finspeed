# Use the official Golang image to create a build artifact.
# This is known as a multi-stage build.
FROM golang:1.21-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY api/go.mod api/go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code
COPY api/ ./api/
COPY cmd/ ./cmd/

# Build the Go app
# -o /app/main: output the binary to /app/main
# CGO_ENABLED=0: disable CGO for a statically linked binary
# -ldflags "-w -s": strip debug information to reduce binary size
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags "-w -s" -o /app/main ./cmd/migrate

# --- Final Stage ---
# Use a minimal image for the final container
FROM alpine:latest

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# This container is a one-off job, so it doesn't need to expose a port.
# The command to run the migration will be specified in the Cloud Run Job configuration.
ENTRYPOINT ["/app/main"]
