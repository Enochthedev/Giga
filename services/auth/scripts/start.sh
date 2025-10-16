#!/bin/bash

# Authentication Service Quick Start Script

set -e

echo "🚀 Starting Authentication Service Setup..."

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        echo "⚠️  pnpm is not installed. Installing pnpm..."
        npm install -g pnpm
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "⚠️  Docker is not installed. Some features may not work."
    fi
    
    echo "✅ Requirements check completed"
}

# Setup environment
setup_environment() {
    echo "🔧 Setting up environment..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            echo "📄 Created .env file from .env.example"
            echo "⚠️  Please update the .env file with your configuration"
        else
            echo "❌ No .env.example file found"
            exit 1
        fi
    else
        echo "✅ .env file already exists"
    fi
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    pnpm install
    echo "✅ Dependencies installed"
}

# Setup database
setup_database() {
    echo "🗄️  Setting up database..."
    
    # Check if DATABASE_URL is set
    if grep -q "DATABASE_URL=" .env; then
        echo "📊 Generating Prisma client..."
        pnpm db:generate
        
        echo "🔄 Running database migrations..."
        pnpm db:migrate || echo "⚠️  Migration failed - database might not be running"
        
        echo "🌱 Seeding database (optional)..."
        pnpm db:seed || echo "⚠️  Seeding failed - this is optional"
        
        echo "✅ Database setup completed"
    else
        echo "⚠️  DATABASE_URL not found in .env file"
        echo "Please configure your database connection first"
    fi
}

# Start services with Docker (optional)
start_docker_services() {
    if command -v docker-compose &> /dev/null; then
        echo "🐳 Starting Docker services..."
        
        if [ -f docker-compose.yml ]; then
            docker-compose up -d postgres redis
            echo "✅ Docker services started"
            echo "⏳ Waiting for services to be ready..."
            sleep 10
        else
            echo "⚠️  docker-compose.yml not found"
        fi
    fi
}

# Build the application
build_application() {
    echo "🔨 Building application..."
    pnpm build
    echo "✅ Application built successfully"
}

# Start the service
start_service() {
    echo "🚀 Starting Authentication Service..."
    echo ""
    echo "📍 Service will be available at: http://localhost:3001"
    echo "📚 API Documentation: http://localhost:3001/docs"
    echo "🏥 Health Check: http://localhost:3001/health"
    echo ""
    echo "Press Ctrl+C to stop the service"
    echo ""
    
    pnpm dev
}

# Main execution
main() {
    echo "🔐 Authentication Service Quick Start"
    echo "===================================="
    echo ""
    
    check_requirements
    setup_environment
    install_dependencies
    
    # Ask if user wants to start Docker services
    if command -v docker-compose &> /dev/null && [ -f docker-compose.yml ]; then
        read -p "🐳 Start Docker services (PostgreSQL, Redis)? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_docker_services
        fi
    fi
    
    setup_database
    build_application
    start_service
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Authentication Service Quick Start Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --docker       Start with Docker services"
        echo "  --no-docker    Skip Docker services"
        echo ""
        echo "This script will:"
        echo "  1. Check requirements (Node.js, pnpm)"
        echo "  2. Setup environment (.env file)"
        echo "  3. Install dependencies"
        echo "  4. Setup database (generate, migrate, seed)"
        echo "  5. Build and start the service"
        ;;
    --docker)
        export START_DOCKER=true
        main
        ;;
    --no-docker)
        export START_DOCKER=false
        main
        ;;
    *)
        main
        ;;
esac