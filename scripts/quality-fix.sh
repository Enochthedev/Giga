#!/bin/bash

# Code Quality Fix Script
echo "🔧 Auto-fixing code quality issues..."
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run a fix step
run_fix() {
    local step_name="$1"
    local command="$2"
    
    echo -e "\n${BLUE}🔧 $step_name${NC}"
    echo "----------------------------------------"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $step_name completed${NC}"
    else
        echo -e "${YELLOW}⚠️  $step_name had issues (check output above)${NC}"
    fi
}

# 1. Format code with Prettier
run_fix "Formatting code with Prettier" "pnpm run format"

# 2. Fix ESLint issues
run_fix "Fixing ESLint issues" "pnpm run lint"

# 3. Generate Prisma clients (if needed)
echo -e "\n${BLUE}🔧 Generating Prisma clients${NC}"
echo "----------------------------------------"
if [ -d "services/auth/prisma" ]; then
    cd services/auth && pnpm prisma generate && cd ../..
    echo -e "${GREEN}✅ Auth Prisma client generated${NC}"
fi

if [ -d "services/ecommerce/prisma" ]; then
    cd services/ecommerce && pnpm prisma generate && cd ../..
    echo -e "${GREEN}✅ Ecommerce Prisma client generated${NC}"
fi

# 4. Build shared types
run_fix "Building shared types" "cd shared/types && pnpm build && cd ../.."

# 5. Type check everything
run_fix "Type checking all services" "pnpm run type-check"

echo ""
echo "====================================="
echo -e "${GREEN}🎉 Code quality fixes completed!${NC}"
echo -e "${BLUE}💡 Run 'pnpm run quality:check' to verify everything is good${NC}"