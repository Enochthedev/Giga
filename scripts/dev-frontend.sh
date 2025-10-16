#!/bin/bash

# Quick Frontend Development Script
echo "🎯 Starting Frontend Development Stack..."
echo "========================================="
echo ""
echo "Services starting:"
echo "  🌐 Gateway: http://localhost:3000"
echo "  🔐 Auth: http://localhost:3001 | Docs: http://localhost:3001/docs"
echo "  🛒 Ecommerce: http://localhost:3002 | Docs: http://localhost:3002/docs"
echo ""
echo "📚 Quick API Test:"
echo "  curl http://localhost:3000/health"
echo ""
echo "🧪 Register Test User:"
echo '  curl -X POST http://localhost:3000/api/v1/auth/register \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '"'"'{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","roles":["CUSTOMER"],"acceptTerms":true}'"'"
echo ""

# Ensure infrastructure is running
if ! docker ps | grep -q giga-postgres-1; then
    echo "🚀 Starting infrastructure..."
    docker-compose up -d postgres redis
    sleep 10
fi

# Start essential services for frontend development
echo "🚀 Starting services..."
(cd services/gateway && pnpm dev) &
(cd services/auth && pnpm dev) &
(cd services/ecommerce && pnpm dev) &

echo "✅ Frontend stack is starting..."
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait