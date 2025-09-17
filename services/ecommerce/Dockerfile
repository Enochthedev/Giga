# Multi-stage build for Ecommerce Service
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY services/ecommerce/package.json ./services/ecommerce/
COPY shared/types/package.json ./shared/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY . .
WORKDIR /app/services/ecommerce
EXPOSE 3002
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
COPY --from=build /app/services/ecommerce/package.json ./services/ecommerce/
COPY --from=build /app/services/ecommerce/dist ./services/ecommerce/dist
COPY --from=build /app/shared ./shared

RUN pnpm install --prod --frozen-lockfile

WORKDIR /app/services/ecommerce
EXPOSE 3002
CMD ["pnpm", "start"]