# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy API source code
COPY . .

# Copy migrations to builder stage
COPY db/migrations ./db/migrations

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Copy migrations from builder stage
COPY --from=builder /app/db/migrations ./db/migrations

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]
