#!/bin/bash

echo "🚀 Starting All Services..."
echo "=========================="
echo ""

# Check if infrastructure is running
echo "🔍 Checking infrastructure..."
if ! docker ps | grep -q giga-postgres-1; then
    echo "⚠️  Infrastructure not running. Starting PostgreSQL and Redis..."
    docker-compose up -d postgres redis
    echo "⏳ Waiting for services to be ready..."
    sleep 15
fi

echo "✅ Infrastructure is ready!"
echo ""

# Start all services in parallel
echo "🚀 Starting all platform services..."
echo ""

# Core Infrastructure Services
echo "📡 Starting Gateway (Port 3000)..."
(cd services/gateway && pnpm dev) &
GATEWAY_PID=$!

echo "🔐 Starting Auth Service (Port 3001)..."
(cd services/auth && pnpm dev) &
AUTH_PID=$!

echo "🛒 Starting Ecommerce Service (Port 3002)..."
(cd services/ecommerce && pnpm dev) &
ECOMMERCE_PID=$!

echo "🏨 Starting Hotel Service (Port 3003)..."
(cd services/hotel && pnpm dev) &
HOTEL_PID=$!

echo "📧 Starting Notification Service (Port 3004)..."
(cd services/notification && pnpm dev) &
NOTIFICATION_PID=$!

# Wait a moment for services to start
sleep 5

echo ""
echo "✅ All services are starting up!"
echo ""
echo "🌐 Service URLs:"
echo "  - API Gateway:        http://localhost:3000"
echo "  - Auth Service:       http://localhost:3001 (Docs: /docs)"
echo "  - Ecommerce Service:  http://localhost:3002 (Docs: /docs)"
echo "  - Hotel Service:      http://localhost:3003 (Docs: /api-docs)"
echo "  - Notification Service: http://localhost:3004 (Docs: /api-docs)"
echo ""
echo "🗄️ Infrastructure:"
echo "  - PostgreSQL:         localhost:5433"
echo "  - Redis:              localhost:6380"
echo ""
echo "🧪 Test the services:"
echo "  ./test-services.sh"
echo ""
echo "Press Ctrl+C to stop all services..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $GATEWAY_PID $AUTH_PID $ECOMMERCE_PID $HOTEL_PID $NOTIFICATION_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
