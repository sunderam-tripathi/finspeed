# Multi-stage build for static frontend
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ .
RUN BUILD_TARGET=static npm run build

# Export static files
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
