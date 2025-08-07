# --- Builder Stage ---
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY api/go.mod api/go.sum ./
RUN go mod download
COPY api/ ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# --- Final Stage ---
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /server .
EXPOSE 8080
CMD ["/app/server"]

