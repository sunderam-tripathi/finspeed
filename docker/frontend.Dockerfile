# --- Base Stage ---
FROM node:20-alpine AS base
RUN npm install -g pnpm

# --- Development Stage ---
FROM base AS dev
WORKDIR /app

# Set pnpm store directory to avoid conflicts
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN pnpm config set store-dir /app/.pnpm-store

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install ALL dependencies (including dev dependencies) with explicit store
RUN pnpm install --frozen-lockfile --store-dir /app/.pnpm-store

# Copy source code
COPY . ./

EXPOSE 3000
CMD ["pnpm", "dev"]
