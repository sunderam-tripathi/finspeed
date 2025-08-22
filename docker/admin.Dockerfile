# Multi-stage build for admin interface
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY admin-app/package.json admin-app/package-lock.json* ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
COPY admin-app/package.json admin-app/package-lock.json* ./
RUN npm ci

# Accept environment args for the build-time flags
ARG NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_ENABLE_M3
ENV NEXT_PUBLIC_ENABLE_M3=$NEXT_PUBLIC_ENABLE_M3

COPY admin-app/ .
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Accept build args again and set runtime env vars
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_ENABLE_M3
ENV NEXT_PUBLIC_ENVIRONMENT=$NEXT_PUBLIC_ENVIRONMENT
ENV NEXT_PUBLIC_ENABLE_M3=$NEXT_PUBLIC_ENABLE_M3

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
