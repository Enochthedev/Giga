FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY services/hotel/package.json ./services/hotel/
COPY shared/types/package.json ./shared/types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY services/hotel ./services/hotel
COPY shared/types ./shared/types

# Build the application
WORKDIR /app/services/hotel
RUN pnpm build

# Expose port
EXPOSE 3004

# Start the application
CMD ["pnpm", "start"]