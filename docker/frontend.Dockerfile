# --- Base Stage ---
FROM node:20-alpine AS base
RUN npm install -g pnpm

# --- Dependencies Stage ---
FROM base AS deps
WORKDIR /app

# Set pnpm store directory
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /app/.pnpm-store

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --store-dir /app/.pnpm-store

# --- Builder Stage ---
FROM base AS builder
WORKDIR /app

# Set pnpm store directory
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /app/.pnpm-store

# Accept environment arg for the build
ARG NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile --store-dir /app/.pnpm-store

# Copy source code
COPY frontend/. .

# Build the application
RUN pnpm run build

# --- Production Stage ---
FROM base AS prod
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3000/healthz || exit 1

# Start the application
CMD ["node", "server.js"]

# --- Development Stage ---
FROM base AS dev
WORKDIR /app

# Set pnpm store directory to avoid conflicts
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /app/.pnpm-store

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install ALL dependencies (including dev dependencies) with explicit store
RUN pnpm install --frozen-lockfile --store-dir /app/.pnpm-store

# Copy source code
COPY frontend/. .

EXPOSE 3000
CMD ["pnpm", "dev"]
