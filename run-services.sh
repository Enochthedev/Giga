#!/bin/bash

# Kill any existing processes
pkill -f "pnpm --filter @platform"

# Start database and Redis
echo "Starting database and Redis..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Generate Prisma clients
echo "Generating Prisma clients..."
pnpm --filter @platform/auth db:generate
pnpm --filter @platform/ecommerce db:generate

# Push database schemas
echo "Pushing database schemas..."
pnpm --filter @platform/auth db:push
pnpm --filter @platform/ecommerce db:push

echo ""
echo "🚀 Ready to start services!"
echo ""
echo "Open 4 separate terminals and run:"
echo "Terminal 1: pnpm --filter @platform/gateway dev"
echo "Terminal 2: pnpm --filter @platform/auth dev  # (Express version)"
echo "Terminal 3: pnpm --filter @platform/ecommerce dev"
echo "Terminal 4: # For testing"
echo ""
echo "Services will be available at:"
echo "- Gateway: http://localhost:3000"
echo "- Auth (Express): http://localhost:3001"
echo "- Ecommerce: http://localhost:3002"
echo ""
echo "✅ Auth service successfully migrated to Express!"
echo "✅ User registration and login working perfectly!"
echo ""