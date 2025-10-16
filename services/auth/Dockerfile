# Multi-stage build for Auth Service
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY services/auth/package.json ./services/auth/
COPY shared/types/package.json ./shared/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY . .
WORKDIR /app/services/auth
RUN pnpm prisma generate
EXPOSE 3001
CMD ["pnpm", "dev"]

# Build stage
FROM base AS build
COPY . .
WORKDIR /app/services/auth
RUN pnpm prisma generate
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production
RUN npm install -g pnpm
WORKDIR /app

COPY --from=build /app/package.json /app/pnpm-lock.yaml* ./
COPY --from=build /app/services/auth/package.json ./services/auth/
COPY --from=build /app/services/auth/dist ./services/auth/dist
COPY --from=build /app/services/auth/prisma ./services/auth/prisma
COPY --from=build /app/shared ./shared
COPY --from=build /app/node_modules/.pnpm/@prisma+client* ./node_modules/.pnpm/

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

WORKDIR /app/services/auth
EXPOSE 3001
CMD ["pnpm", "start"]