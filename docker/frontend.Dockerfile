# --- Base Stage ---
FROM node:20-alpine AS base
# Install pnpm using corepack (built into Node.js 16+)
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
# Configure npm registry settings
RUN npm config set registry https://registry.npmjs.org/
RUN pnpm config set registry https://registry.npmjs.org/

# --- Dependencies Stage ---
FROM base AS deps
WORKDIR /app

# Set pnpm store directory
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /app/.pnpm-store
RUN pnpm config set registry https://registry.npmjs.org/

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install production dependencies only with retry
RUN pnpm install --frozen-lockfile --prod --store-dir /app/.pnpm-store --network-timeout 300000 || \
    (sleep 10 && pnpm install --frozen-lockfile --prod --store-dir /app/.pnpm-store --network-timeout 300000)

# --- Builder Stage ---
FROM base AS builder
WORKDIR /app

# Set pnpm store directory
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /app/.pnpm-store
RUN pnpm config set registry https://registry.npmjs.org/

# Accept environment arg for the build
ARG NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_ENABLE_M3
ENV NEXT_PUBLIC_ENABLE_M3=$NEXT_PUBLIC_ENABLE_M3

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies) with retry
RUN pnpm install --frozen-lockfile --store-dir /app/.pnpm-store --network-timeout 300000 || \
    (sleep 10 && pnpm install --frozen-lockfile --store-dir /app/.pnpm-store --network-timeout 300000)

# Copy source code
COPY frontend/. .

# Build the application
RUN pnpm run build

# --- Production Stage ---
FROM base AS prod
WORKDIR /app

# Accept build args again in this stage and set as runtime env vars
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_ENABLE_M3
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENABLE_M3=$NEXT_PUBLIC_ENABLE_M3

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
RUN pnpm config set registry https://registry.npmjs.org/

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml ./

# Install ALL dependencies (including dev dependencies) with explicit store and retry
RUN pnpm install --frozen-lockfile --store-dir /app/.pnpm-store --network-timeout 300000 || \
    (sleep 10 && pnpm install --frozen-lockfile --store-dir /app/.pnpm-store --network-timeout 300000)

# Copy source code
COPY frontend/. .

EXPOSE 3000
CMD ["pnpm", "dev"]
