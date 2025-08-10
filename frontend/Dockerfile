# Dependencies stage
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Builder stage
FROM node:18-alpine AS builder
RUN npm install -g pnpm

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm build

# Runner stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
