#!/bin/bash

# Master seeding script for all services
# This script seeds both auth and ecommerce services with comprehensive test data

set -e  # Exit on any error

echo "🌱 Starting comprehensive database seeding for all services..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if services exist
if [ ! -d "services/auth" ]; then
    print_error "Auth service directory not found"
    exit 1
fi

if [ ! -d "services/ecommerce" ]; then
    print_error "Ecommerce service directory not found"
    exit 1
fi

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name service to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if check_service "$service_name" "$port"; then
            print_success "$service_name service is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name service is not responding after $((max_attempts * 2)) seconds"
    return 1
}

# Install dependencies if needed
print_status "Checking dependencies..."

if [ ! -d "node_modules" ]; then
    print_status "Installing root dependencies..."
    npm install
fi

if [ ! -d "services/auth/node_modules" ]; then
    print_status "Installing auth service dependencies..."
    cd services/auth
    npm install
    cd ../..
fi

if [ ! -d "services/ecommerce/node_modules" ]; then
    print_status "Installing ecommerce service dependencies..."
    cd services/ecommerce
    npm install
    cd ../..
fi

# Generate Prisma clients
print_status "Generating Prisma clients..."

print_status "Generating auth service Prisma client..."
cd services/auth
npm run db:generate
cd ../..

print_status "Generating ecommerce service Prisma client..."
cd services/ecommerce
npm run db:generate
cd ../..

# Check if databases are accessible
print_status "Checking database connections..."

# Check auth database
cd services/auth
if npm run db:push > /dev/null 2>&1; then
    print_success "Auth database is accessible"
else
    print_error "Auth database is not accessible. Please check your DATABASE_URL in services/auth/.env"
    exit 1
fi
cd ../..

# Check ecommerce database
cd services/ecommerce
if npm run db:push > /dev/null 2>&1; then
    print_success "Ecommerce database is accessible"
else
    print_error "Ecommerce database is not accessible. Please check your DATABASE_URL in services/ecommerce/.env"
    exit 1
fi
cd ../..

# Seed auth service first (since ecommerce depends on vendor data)
print_status "Seeding auth service database..."
cd services/auth

if npm run db:seed-comprehensive; then
    print_success "Auth service seeded successfully!"
else
    print_error "Failed to seed auth service"
    exit 1
fi

cd ../..

# Wait a moment for auth service data to be committed
sleep 2

# Seed ecommerce service
print_status "Seeding ecommerce service database..."
cd services/ecommerce

if npm run db:seed-comprehensive; then
    print_success "Ecommerce service seeded successfully!"
else
    print_error "Failed to seed ecommerce service"
    exit 1
fi

cd ../..

# Display summary
echo ""
echo "🎉 All services seeded successfully!"
echo "=================================================="
echo ""
print_success "Database seeding completed for all services"
echo ""
echo "📊 What was created:"
echo "  🔐 Auth Service:"
echo "    • Multiple user accounts with different roles"
echo "    • Customer, Vendor, Driver, Host, and Advertiser profiles"
echo "    • Sample addresses and preferences"
echo "    • Admin accounts for testing"
echo "    • Email/phone verification tokens"
echo "    • Audit logs"
echo ""
echo "  🛒 Ecommerce Service:"
echo "    • Sample products across multiple categories"
echo "    • Product inventory and pricing"
echo "    • Sample orders with different statuses"
echo "    • Vendor order management"
echo "    • Inventory reservations"
echo ""
echo "🔑 Test Accounts (Auth Service):"
echo "  Admin: admin@platform.com / AdminPassword123!"
echo "  Customer: john.customer@example.com / CustomerPassword123!"
echo "  Vendor: vendor1@example.com / VendorPassword123!"
echo "  Driver: driver1@example.com / DriverPassword123!"
echo "  Host: host1@example.com / HostPassword123!"
echo "  Advertiser: advertiser1@example.com / AdvertiserPassword123!"
echo "  Multi-role: multirole@example.com / MultiRolePassword123!"
echo ""
echo "🚀 Next Steps:"
echo "  1. Start the services: npm run dev (in each service directory)"
echo "  2. Access the APIs:"
echo "     • Auth Service: http://localhost:3001"
echo "     • Ecommerce Service: http://localhost:3002"
echo "  3. View API documentation:"
echo "     • Auth: http://localhost:3001/docs"
echo "     • Ecommerce: http://localhost:3002/docs"
echo ""
echo "💡 Tips:"
echo "  • Use the test accounts above to login and test different roles"
echo "  • Check the database to see all the seeded data"
echo "  • Run individual service seeds with: npm run db:seed-comprehensive"
echo ""
print_success "Happy testing! 🎯"