#!/bin/bash

# Code Quality Check Script
echo "🔍 Running comprehensive code quality checks..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall success
OVERALL_SUCCESS=true

# Function to run a check and track success
run_check() {
    local check_name="$1"
    local command="$2"
    
    echo -e "\n${BLUE}🔍 $check_name${NC}"
    echo "----------------------------------------"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $check_name passed${NC}"
    else
        echo -e "${RED}❌ $check_name failed${NC}"
        OVERALL_SUCCESS=false
    fi
}

# 1. TypeScript Type Checking
run_check "TypeScript Type Checking" "pnpm run type-check"

# 2. ESLint Checking
run_check "ESLint Code Quality" "pnpm run lint:check"

# 3. Prettier Formatting Check
run_check "Prettier Code Formatting" "pnpm run format:check"

# 4. Run Tests
run_check "Unit Tests" "pnpm run test"

# 5. Build Check
run_check "Build Compilation" "pnpm run build"

# 6. Security Audit (if available)
if command -v pnpm audit &> /dev/null; then
    run_check "Security Audit" "pnpm audit --audit-level moderate"
fi

# Summary
echo ""
echo "=============================================="
if [ "$OVERALL_SUCCESS" = true ]; then
    echo -e "${GREEN}🎉 All quality checks passed!${NC}"
    echo -e "${GREEN}✅ Code is ready for commit/push${NC}"
    exit 0
else
    echo -e "${RED}❌ Some quality checks failed${NC}"
    echo -e "${YELLOW}💡 Run the following to fix issues:${NC}"
    echo -e "   ${BLUE}pnpm run quality${NC}  # Auto-fix linting and formatting"
    echo -e "   ${BLUE}pnpm run test${NC}     # Run tests"
    echo -e "   ${BLUE}pnpm run build${NC}    # Check build"
    exit 1
fi