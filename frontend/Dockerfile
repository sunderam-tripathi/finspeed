# =====================================
# Dependencies Stage
# =====================================
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

# Install pnpm first (matching the local version)
RUN npm install -g pnpm@10.14.0

WORKDIR /app

# Copy only package files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies first
RUN pnpm install --frozen-lockfile --prod=false

# =====================================
# Builder Stage
# =====================================
FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat git

# Install pnpm (matching the local version)
RUN npm install -g pnpm@10.14.0

WORKDIR /app

# Copy production node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy package files and install dev dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy the rest of the application
COPY . .

# Ensure public directory exists
RUN mkdir -p public

# Set build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN pnpm build

# =====================================
# Runner Stage
# =====================================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the standalone server files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

# Set proper permissions
RUN chown -R nextjs:nodejs /app/

# Switch to non-root user
USER nextjs

# Expose the port the app runs on (Cloud Run sets $PORT, typically 8080)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start the application
CMD ["node", "server.js"]
