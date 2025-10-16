#!/bin/bash

# Multi-Sided Platform Setup Script (Fixed Version)
echo "🚀 Setting up Multi-Sided Platform..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Stop any existing containers to avoid port conflicts
echo "🛑 Stopping any existing containers..."
docker-compose down 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Start infrastructure services with new port
echo "🐳 Starting infrastructure services (PostgreSQL on port 5433, Redis)..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 15

# Check if PostgreSQL is ready
echo "🔍 Checking PostgreSQL connection..."
until docker exec giga-postgres-1 pg_isready -U platform_user -d platform_db 2>/dev/null; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your actual values."
fi

# Setup auth database with correct connection string
echo "🗄️ Setting up auth database..."
cd services/auth

# Set the correct database URL for local development
export DATABASE_URL="postgresql://platform_user:platform_pass@localhost:5433/auth_db"

# Install dependencies for auth service
pnpm install

# Generate Prisma client
pnpm prisma generate

# Push database schema
pnpm prisma db push

cd ../..

echo "✅ Database setup complete!"

# Build shared types
echo "🔧 Building shared types..."
cd shared/types
pnpm install
pnpm build
cd ../..

# Install dependencies for all services
echo "📦 Installing service dependencies..."
cd services/gateway && pnpm install && cd ..
cd core && pnpm install && cd ..
cd ../..

echo "🎉 Setup complete! You can now start the services:"
echo ""
echo "Development mode (all services):"
echo "  pnpm dev"
echo ""
echo "Or start services individually:"
echo "  cd services/gateway && pnpm dev  # Port 3000"
echo "  cd services/auth && pnpm dev     # Port 3001"
echo "  cd services/core && pnpm dev     # Port 3002"
echo ""
echo "Or using Docker:"
echo "  docker-compose up -d"
echo ""
echo "🔗 Service URLs:"
echo "  API Gateway: http://localhost:3000"
echo "  Auth Service: http://localhost:3001"
echo "  Core Service: http://localhost:3002"
echo "  PostgreSQL: localhost:5433 (user: platform_user, pass: platform_pass)"
echo "  Redis: localhost:6379"
echo ""
echo "🧪 Test the setup:"
echo "  curl http://localhost:3000/health"
echo ""
echo "📚 Check the README.md for API documentation and usage examples."