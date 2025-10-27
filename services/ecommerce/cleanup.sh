#!/bin/bash

# Ecommerce Microservice Cleanup Script
# This script helps remove deprecated microservice components

set -e

echo "🧹 Ecommerce Microservice Cleanup"
echo "=================================="

# Phase 1: Safe to remove immediately
echo "📋 Phase 1: Removing build artifacts and dependencies..."

if [ -d "dist" ]; then
    echo "  ❌ Removing dist/"
    rm -rf dist/
fi

if [ -d "node_modules" ]; then
    echo "  ❌ Removing node_modules/"
    rm -rf node_modules/
fi

if [ -f "tsconfig.tsbuildinfo" ]; then
    echo "  ❌ Removing tsconfig.tsbuildinfo"
    rm -f tsconfig.tsbuildinfo
fi

# Phase 2: Remove deprecated source code (with confirmation)
echo ""
echo "📋 Phase 2: Removing deprecated source code..."
echo "⚠️  This will remove Express.js controllers, routes, and services"
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Remove Express.js specific files
    if [ -d "src/controllers" ]; then
        echo "  ❌ Removing src/controllers/"
        rm -rf src/controllers/
    fi
    
    if [ -d "src/routes" ]; then
        echo "  ❌ Removing src/routes/"
        rm -rf src/routes/
    fi
    
    if [ -d "src/services" ]; then
        echo "  ❌ Removing src/services/"
        rm -rf src/services/
    fi
    
    if [ -f "src/app.ts" ]; then
        echo "  ❌ Removing src/app.ts"
        rm -f src/app.ts
    fi
    
    if [ -f "src/server.ts" ]; then
        echo "  ❌ Removing src/server.ts"
        rm -f src/server.ts
    fi
    
    if [ -f "src/swagger.ts" ]; then
        echo "  ❌ Removing src/swagger.ts"
        rm -f src/swagger.ts
    fi
    
    # Remove auth middleware
    if [ -f "src/middleware/auth.ts" ]; then
        echo "  ❌ Removing src/middleware/auth.ts"
        rm -f src/middleware/auth.ts
    fi
    
    # Remove seed files (data is now in Supabase)
    if [ -f "src/seed.ts" ]; then
        echo "  ❌ Removing seed files"
        rm -f src/seed*.ts
    fi
    
    echo "  ✅ Deprecated source code removed"
else
    echo "  ⏭️  Skipping source code removal"
fi

# Phase 3: Remove Prisma (with confirmation)
echo ""
echo "📋 Phase 3: Removing Prisma database files..."
echo "⚠️  This will remove Prisma schema and migrations"
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "prisma" ]; then
        echo "  ❌ Removing prisma/"
        rm -rf prisma/
    fi
    
    if [ -d "src/generated" ]; then
        echo "  ❌ Removing src/generated/"
        rm -rf src/generated/
    fi
    
    echo "  ✅ Prisma files removed"
else
    echo "  ⏭️  Skipping Prisma removal"
fi

# Phase 4: Remove Docker and config files (with confirmation)
echo ""
echo "📋 Phase 4: Removing Docker and config files..."
echo "⚠️  This will remove Dockerfile, package.json, etc."
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "Dockerfile" ]; then
        echo "  ❌ Removing Dockerfile"
        rm -f Dockerfile
    fi
    
    if [ -f "package.json" ]; then
        echo "  ❌ Removing package.json"
        rm -f package.json
    fi
    
    if [ -f "tsconfig.json" ]; then
        echo "  ❌ Removing tsconfig.json"
        rm -f tsconfig.json
    fi
    
    if [ -f "vitest.config.ts" ]; then
        echo "  ❌ Removing vitest.config.ts"
        rm -f vitest.config.ts
    fi
    
    echo "  ✅ Config files removed"
else
    echo "  ⏭️  Skipping config file removal"
fi

# Show what's left
echo ""
echo "📋 Remaining files:"
find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | sort

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📚 What's left:"
echo "  - postman/ - API documentation (keep)"
echo "  - src/schemas/ - Validation schemas (useful for frontend)"
echo "  - src/types/ - TypeScript types (useful for frontend)"
echo "  - src/utils/ - Helper functions (might be useful)"
echo "  - __tests__/ - Test examples (useful patterns)"
echo ""
echo "🚀 Next steps:"
echo "  1. Use new Supabase collection: postman/Ecommerce-API-Supabase.postman_collection.json"
echo "  2. Update frontend to use Supabase endpoints"
echo "  3. Remove this entire services/ecommerce/ directory when ready"