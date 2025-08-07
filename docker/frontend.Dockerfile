# --- Base Stage ---
FROM node:20-alpine AS base
RUN npm install -g pnpm

# --- Dependencies Stage ---
FROM base AS deps
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Builder Stage (for production later) ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
RUN pnpm build

# --- Development Stage ---
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
EXPOSE 3000
CMD ["pnpm", "dev"]
