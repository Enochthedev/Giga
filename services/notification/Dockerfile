# Multi-stage build for notification service
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY services/notification/package.json ./services/notification/
COPY shared/types/package.json ./shared/types/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Build the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build shared types first
RUN cd shared/types && pnpm build

# Build notification service
RUN cd services/notification && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 notification

# Copy built application
COPY --from=builder --chown=notification:nodejs /app/services/notification/dist ./dist
COPY --from=builder --chown=notification:nodejs /app/services/notification/package.json ./package.json
COPY --from=builder --chown=notification:nodejs /app/node_modules ./node_modules

USER notification

EXPOSE 3004

ENV PORT=3004

CMD ["node", "dist/server.js"]