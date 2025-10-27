#!/bin/bash

# Interactive Development Script for Frontend Team
echo "🚀 Multi-Sided Platform - Development Server"
echo "=============================================="
echo ""

# Check if infrastructure is running
echo "🔍 Checking infrastructure..."
if ! docker ps | grep -q giga-postgres-1; then
    echo "⚠️  PostgreSQL not running. Starting infrastructure..."
    docker-compose up -d postgres redis
    echo "⏳ Waiting for services to be ready..."
    sleep 10
fi

echo "✅ Infrastructure is ready!"
echo ""

# Service selection menu
echo "📋 Which services would you like to run?"
echo ""
echo "🎯 Quick Options:"
echo "  1) All services (Full platform)"
echo "  2) Frontend essentials (Gateway + Auth + Core)"
echo "  3) Ecommerce development (Gateway + Auth + Ecommerce + Payment)"
echo "  4) Taxi development (Gateway + Auth + Taxi)"
echo "  5) Hotel development (Gateway + Auth + Hotel)"
echo ""
echo "🔧 Individual Services:"
echo "  6) Gateway only (Port 3000)"
echo "  7) Auth only (Port 3001)"
echo "  8) Core/Ecommerce only (Port 3002)"
echo "  9) Payment only (Port 3003)"
echo " 10) Custom selection"
echo ""
echo "📊 Utilities:"
echo " 11) View service status"
echo " 12) View logs"
echo " 13) Stop all services"
echo ""

read -p "Enter your choice (1-13): " choice

case $choice in
    1)
        echo "🚀 Starting all services..."
        pnpm dev
        ;;
    2)
        echo "🎯 Starting frontend essentials..."
        echo "Services: Gateway (3000), Auth (3001), Core (3002)"
        echo ""
        echo "📚 Documentation:"
        echo "  - Gateway: http://localhost:3000"
        echo "  - Auth API: http://localhost:3001/docs"
        echo "  - Core API: http://localhost:3002"
        echo ""
        
        # Start services in parallel
        (cd services/gateway && pnpm dev) &
        (cd services/auth && pnpm dev) &
        (cd services/core && pnpm dev) &
        
        echo "✅ Services starting... Press Ctrl+C to stop all"
        wait
        ;;
    3)
        echo "🛒 Starting ecommerce development stack..."
        echo "Services: Gateway (3000), Auth (3001), Ecommerce (3002)"
        echo ""
        echo "📚 Documentation:"
        echo "  - API Gateway: http://localhost:3000"
        echo "  - Auth API: http://localhost:3001/docs"
        echo "  - Ecommerce API: http://localhost:3002/docs"
        echo ""
        
        (cd services/gateway && pnpm dev) &
        (cd services/auth && pnpm dev) &
        # Ecommerce migrated to Supabase - see services/ecommerce/README.md
        
        echo "✅ Ecommerce stack starting (Supabase-based)... Press Ctrl+C to stop all"
        wait
        ;;
    4)
        echo "🚗 Starting taxi development stack..."
        echo "Services: Gateway (3000), Auth (3001), Taxi (3004)"
        echo "Note: Taxi service will be available in Phase 3"
        
        (cd services/gateway && pnpm dev) &
        (cd services/auth && pnpm dev) &
        
        echo "✅ Taxi stack starting... Press Ctrl+C to stop all"
        wait
        ;;
    5)
        echo "🏨 Starting hotel development stack..."
        echo "Services: Gateway (3000), Auth (3001), Hotel (3005)"
        echo "Note: Hotel service will be available in Phase 3"
        
        (cd services/gateway && pnpm dev) &
        (cd services/auth && pnpm dev) &
        
        echo "✅ Hotel stack starting... Press Ctrl+C to stop all"
        wait
        ;;
    6)
        echo "🌐 Starting Gateway only..."
        cd services/gateway && pnpm dev
        ;;
    7)
        echo "🔐 Starting Auth service only..."
        echo "📚 Documentation: http://localhost:3001/docs"
        cd services/auth && pnpm dev
        ;;
    8)
        echo "🛒 Ecommerce service migrated to Supabase"
        echo "📚 Use Postman collection: services/ecommerce/postman/Ecommerce-API-Supabase.postman_collection.json"
        echo "📖 Documentation: services/ecommerce/README.md"
        ;;
    9)
        echo "💳 Starting Payment service only..."
        echo "Note: Payment service will be available in Phase 2"
        # cd services/payment && pnpm dev
        ;;
    10)
        echo "🔧 Custom service selection..."
        echo ""
        echo "Available services:"
        echo "  - gateway (Port 3000)"
        echo "  - auth (Port 3001)"
        echo "  - ecommerce (Port 3002)"
        echo "  - payment (Port 3003) - Phase 2"
        echo "  - taxi (Port 3004) - Phase 3"
        echo "  - hotel (Port 3005) - Phase 3"
        echo "  - ads (Port 3006) - Phase 3"
        echo ""
        read -p "Enter services to start (space-separated): " services
        
        for service in $services; do
            if [ -d "services/$service" ]; then
                echo "🚀 Starting $service..."
                (cd services/$service && pnpm dev) &
            else
                echo "⚠️  Service '$service' not found or not implemented yet"
            fi
        done
        
        if [ ! -z "$services" ]; then
            echo "✅ Custom services starting... Press Ctrl+C to stop all"
            wait
        fi
        ;;
    11)
        echo "📊 Service Status:"
        echo "=================="
        echo ""
        echo "🐳 Infrastructure:"
        docker-compose ps
        echo ""
        echo "🔍 Port Status:"
        echo "Gateway (3000):" $(curl -s http://localhost:3000/health 2>/dev/null | jq -r '.status // "Not running"')
        echo "Auth (3001):" $(curl -s http://localhost:3001/health 2>/dev/null | jq -r '.status // "Not running"')
        echo "Core (3002):" $(curl -s http://localhost:3002/health 2>/dev/null | jq -r '.status // "Not running"')
        echo ""
        echo "📚 Documentation URLs:"
        echo "  - Auth API: http://localhost:3001/docs"
        echo "  - Gateway: http://localhost:3000"
        ;;
    12)
        echo "📋 Service Logs:"
        echo "================"
        echo ""
        echo "Which logs would you like to view?"
        echo "1) Infrastructure (PostgreSQL + Redis)"
        echo "2) All services (if running with Docker)"
        echo "3) Specific service"
        echo ""
        read -p "Enter choice (1-3): " log_choice
        
        case $log_choice in
            1)
                docker-compose logs -f postgres redis
                ;;
            2)
                docker-compose logs -f
                ;;
            3)
                read -p "Enter service name: " service_name
                docker-compose logs -f $service_name
                ;;
        esac
        ;;
    13)
        echo "🛑 Stopping all services..."
        docker-compose down
        pkill -f "pnpm dev" 2>/dev/null || true
        echo "✅ All services stopped"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac