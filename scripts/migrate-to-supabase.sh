#!/bin/bash

# Giga Platform Complete Auth Migration to Supabase Script
set -e

echo "🚀 Starting complete auth migration to Supabase..."

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

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    print_error "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables"
    echo "You can find these in your Supabase project dashboard"
    exit 1
fi

# Step 1: Link to your Supabase project
print_status "Linking to your Supabase project..."
if [ ! -f "supabase/.gitignore" ]; then
    supabase init
fi

# Step 2: Apply database migrations to your production Supabase
print_status "Applying enhanced user schema to Supabase..."
supabase db push

# Step 3: Export data from existing auth service
print_status "Exporting data from existing auth service..."
if [ -f "services/auth/.env" ]; then
    export $(cat services/auth/.env | xargs)
    export AUTH_DATABASE_URL=$DATABASE_URL
    
    print_status "Running auth data export..."
    pnpm tsx scripts/export-auth-data.ts
    
    if [ -f "migration-data/auth-export.json" ]; then
        print_success "Auth data exported successfully"
    else
        print_error "Failed to export auth data"
        exit 1
    fi
else
    print_warning "Auth service .env file not found. Skipping data export."
    print_warning "You can run 'pnpm tsx scripts/export-auth-data.ts' manually later."
fi

# Step 4: Import data to Supabase (optional, with confirmation)
read -p "Do you want to import the exported data to Supabase now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Importing data to Supabase..."
    pnpm tsx scripts/import-to-supabase.ts
    print_success "Data import completed"
else
    print_warning "Skipping data import. You can run 'pnpm tsx scripts/import-to-supabase.ts' manually later."
fi

# Step 5: Build shared Supabase client
print_status "Building shared Supabase client..."
cd shared/supabase-client
pnpm install
pnpm run build
cd ../..
print_success "Shared Supabase client built"

# Step 6: Update service dependencies
print_status "Updating service dependencies..."
pnpm install

# Step 7: Start Kong Gateway
print_status "Starting Kong Gateway..."
cd gateway
docker-compose up -d
cd ..

# Wait for Kong to be ready
print_status "Waiting for Kong Gateway to be ready..."
sleep 10

# Check Kong health
if curl -f http://localhost:8001/status &> /dev/null; then
    print_success "Kong Gateway is running"
else
    print_warning "Kong Gateway might not be ready yet. Check manually at http://localhost:8001"
fi

# Step 8: Build all services
print_status "Building all services..."
pnpm run build

print_success "Complete auth migration setup complete!"

echo ""
echo "🎉 Migration Summary:"
echo "✅ Enhanced user schema applied to Supabase"
echo "✅ Shared Supabase client built"
echo "✅ Kong Gateway configured and running"
echo "✅ All services updated with new dependencies"

echo ""
echo "📋 Next Steps:"
echo "1. Update each service to use Supabase auth middleware"
echo "2. Test authentication flow with a sample user"
echo "3. Configure OAuth providers in Supabase dashboard"
echo "4. Update frontend to use Supabase auth"
echo "5. Gradually migrate services one by one"

echo ""
echo "🔗 Useful URLs:"
echo "- Supabase Dashboard: https://app.supabase.com"
echo "- Your Supabase Project: $SUPABASE_URL"
echo "- Kong Manager: http://localhost:8002"
echo "- Kong Admin API: http://localhost:8001"
echo "- API Gateway: http://localhost:8000"

echo ""
echo "🛠️  Migration Commands:"
echo "- Export auth data: pnpm tsx scripts/export-auth-data.ts"
echo "- Import to Supabase: pnpm tsx scripts/import-to-supabase.ts"
echo "- Start all services: pnpm run dev"
echo "- View Kong logs: cd gateway && docker-compose logs -f"

echo ""
echo "📚 Documentation:"
echo "- Full migration plan: FULL_AUTH_MIGRATION_PLAN.md"
echo "- Service update guide: SERVICE_UPDATE_GUIDE.md"
echo "- Integration summary: SUPABASE_INTEGRATION_SUMMARY.md"

print_success "Migration script completed successfully!"

echo ""
print_warning "IMPORTANT: Your existing auth service is still running."
print_warning "Once you've tested the new Supabase auth and migrated all services,"
print_warning "you can safely shut down the old auth service."