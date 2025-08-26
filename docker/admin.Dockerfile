# Multi-stage build for admin interface
FROM node:20-alpine AS base
WORKDIR /app

# Optional but helps some Next/SWC builds on Alpine
RUN apk add --no-cache libc6-compat

# Install pnpm globally as root first
RUN npm install -g pnpm

# Create non-root user AFTER installing pnpm
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

# Dependencies stage
FROM base AS deps
COPY admin-app/package.json admin-app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY admin-app ./
COPY --from=deps /app/node_modules ./node_modules

# Build arguments for environment configuration
ARG NEXT_PUBLIC_ENVIRONMENT=production
ARG NEXT_PUBLIC_ENABLE_M3=1
ARG NEXT_PUBLIC_API_URL=/api/v1

ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENABLE_M3=$NEXT_PUBLIC_ENABLE_M3
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# Production stage
FROM base AS prod
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]

# Development stage (default)
FROM base AS dev
COPY admin-app/package.json admin-app/pnpm-lock.yaml ./

# Install deps as root to avoid permission issues
RUN pnpm install --frozen-lockfile

# Copy source
COPY admin-app ./

# Change ownership of entire app directory to nextjs user
RUN chown -R nextjs:nodejs /app

# Switch to nextjs user after installation and ownership change
USER nextjs

# Env
ENV NODE_ENV=development
ENV NEXT_PUBLIC_ENVIRONMENT=development
ENV NEXT_PUBLIC_ENABLE_M3=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
ENV API_PROXY_TARGET=http://api:8080
ENV NEXT_PUBLIC_API_URL=/api/v1

EXPOSE 3001

# Use pnpm exec instead of npx and bind to all interfaces
CMD ["pnpm", "exec", "next", "dev", "-H", "0.0.0.0", "-p", "3001"]
