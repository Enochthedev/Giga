# Multi-stage build for API Gateway
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY services/gateway/package.json ./services/gateway/
COPY shared/types/package.json ./shared/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY . .
WORKDIR /app/services/gateway
EXPOSE 3000
CMD ["pnpm", "dev"]

# Build stage
FROM base AS build
COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production
RUN npm install -g pnpm
WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml* ./
COPY --from=build /app/services/gateway/package.json ./services/gateway/
COPY --from=build /app/services/gateway/dist ./services/gateway/dist
COPY --from=build /app/shared ./shared

RUN pnpm install --prod --frozen-lockfile

WORKDIR /app/services/gateway
EXPOSE 3000
CMD ["pnpm", "start"]