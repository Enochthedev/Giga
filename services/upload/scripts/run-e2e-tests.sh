#!/bin/bash

# Upload Service E2E Test Runner
# This script sets up the test environment and runs comprehensive E2E tests

set -e

echo "🚀 Starting Upload Service E2E Tests"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TEST_DB_NAME="upload_test_e2e"
TEST_DB_USER="test"
TEST_DB_PASSWORD="test"
TEST_DB_HOST="localhost"
TEST_DB_PORT="5432"
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_DB="1"

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

# Function to check if a service is running
check_service() {
    local service=$1
    local host=$2
    local port=$3
    
    if nc -z "$host" "$port" 2>/dev/null; then
        print_success "$service is running on $host:$port"
        return 0
    else
        print_error "$service is not running on $host:$port"
        return 1
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service=$1
    local host=$2
    local port=$3
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            print_success "$service is ready"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "$service failed to start within $max_attempts seconds"
    return 1
}

# Function to setup test database
setup_test_database() {
    print_status "Setting up test database..."
    
    # Check if PostgreSQL is running
    if ! check_service "PostgreSQL" "$TEST_DB_HOST" "$TEST_DB_PORT"; then
        print_error "PostgreSQL is required for E2E tests"
        print_status "Please start PostgreSQL and try again"
        exit 1
    fi
    
    # Create test database if it doesn't exist
    PGPASSWORD=$TEST_DB_PASSWORD psql -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" -U "$TEST_DB_USER" -d postgres -c "CREATE DATABASE $TEST_DB_NAME;" 2>/dev/null || true
    
    # Run migrations
    export DATABASE_URL="postgresql://$TEST_DB_USER:$TEST_DB_PASSWORD@$TEST_DB_HOST:$TEST_DB_PORT/$TEST_DB_NAME"
    npx prisma migrate deploy --schema=./prisma/schema.prisma
    
    print_success "Test database setup complete"
}

# Function to setup test Redis
setup_test_redis() {
    print_status "Checking Redis connection..."
    
    if ! check_service "Redis" "$REDIS_HOST" "$REDIS_PORT"; then
        print_warning "Redis is not running. Some tests may be skipped."
        export REDIS_AVAILABLE=false
    else
        export REDIS_AVAILABLE=true
        print_success "Redis is available"
    fi
}

# Function to create test directories
setup_test_directories() {
    print_status "Setting up test directories..."
    
    mkdir -p test-uploads/temp
    mkdir -p test-uploads/processed
    mkdir -p test-uploads/thumbnails
    mkdir -p test-results
    
    print_success "Test directories created"
}

# Function to cleanup test environment
cleanup_test_environment() {
    print_status "Cleaning up test environment..."
    
    # Remove test uploads
    rm -rf test-uploads
    
    # Remove test results (optional, comment out to keep results)
    # rm -rf test-results
    
    print_success "Test environment cleaned up"
}

# Function to run specific test suite
run_test_suite() {
    local suite_name=$1
    local test_pattern=$2
    
    print_status "Running $suite_name tests..."
    
    if npm run test:e2e -- --testNamePattern="$test_pattern" --reporter=verbose; then
        print_success "$suite_name tests passed"
        return 0
    else
        print_error "$suite_name tests failed"
        return 1
    fi
}

# Function to generate test report
generate_test_report() {
    print_status "Generating test report..."
    
    if [ -f "test-results/e2e-results.json" ]; then
        # Parse test results and generate summary
        local total_tests=$(jq '.numTotalTests' test-results/e2e-results.json)
        local passed_tests=$(jq '.numPassedTests' test-results/e2e-results.json)
        local failed_tests=$(jq '.numFailedTests' test-results/e2e-results.json)
        local test_duration=$(jq '.testResults[0].perfStats.runtime' test-results/e2e-results.json)
        
        echo ""
        echo "📊 E2E Test Results Summary"
        echo "=========================="
        echo "Total Tests: $total_tests"
        echo "Passed: $passed_tests"
        echo "Failed: $failed_tests"
        echo "Duration: ${test_duration}ms"
        echo ""
        
        if [ "$failed_tests" -eq 0 ]; then
            print_success "All E2E tests passed! 🎉"
        else
            print_error "$failed_tests test(s) failed"
        fi
    else
        print_warning "Test results file not found"
    fi
}

# Main execution
main() {
    echo "🧪 Upload Service E2E Test Suite"
    echo "================================"
    
    # Parse command line arguments
    RUN_SETUP=true
    RUN_CLEANUP=true
    SPECIFIC_SUITE=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --no-setup)
                RUN_SETUP=false
                shift
                ;;
            --no-cleanup)
                RUN_CLEANUP=false
                shift
                ;;
            --suite)
                SPECIFIC_SUITE="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --no-setup     Skip test environment setup"
                echo "  --no-cleanup   Skip test environment cleanup"
                echo "  --suite NAME   Run specific test suite"
                echo "  --help         Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Setup test environment
    if [ "$RUN_SETUP" = true ]; then
        setup_test_database
        setup_test_redis
        setup_test_directories
    fi
    
    # Set test environment variables
    export NODE_ENV=test
    export TEST_DATABASE_URL="postgresql://$TEST_DB_USER:$TEST_DB_PASSWORD@$TEST_DB_HOST:$TEST_DB_PORT/$TEST_DB_NAME"
    export REDIS_URL="redis://$REDIS_HOST:$REDIS_PORT/$REDIS_DB"
    export LOG_LEVEL=error
    export ENABLE_SECURITY_SCANNING=false
    
    # Run tests
    local exit_code=0
    
    if [ -n "$SPECIFIC_SUITE" ]; then
        # Run specific test suite
        case $SPECIFIC_SUITE in
            "workflows")
                run_test_suite "Upload Workflows" "Upload Workflows E2E Tests" || exit_code=1
                ;;
            "integration")
                run_test_suite "Service Integration" "Multi-Service Integration E2E Tests" || exit_code=1
                ;;
            "performance")
                run_test_suite "Performance" "Performance and Scalability E2E Tests" || exit_code=1
                ;;
            "error-recovery")
                run_test_suite "Error Recovery" "Error Handling and Recovery E2E Tests" || exit_code=1
                ;;
            "consistency")
                run_test_suite "Data Consistency" "Data Consistency E2E Tests" || exit_code=1
                ;;
            *)
                print_error "Unknown test suite: $SPECIFIC_SUITE"
                exit_code=1
                ;;
        esac
    else
        # Run all E2E tests
        print_status "Running all E2E tests..."
        
        if npm run test:e2e -- --reporter=verbose --reporter=json --outputFile=test-results/e2e-results.json; then
            print_success "All E2E tests completed"
        else
            print_error "Some E2E tests failed"
            exit_code=1
        fi
    fi
    
    # Generate test report
    generate_test_report
    
    # Cleanup test environment
    if [ "$RUN_CLEANUP" = true ]; then
        cleanup_test_environment
    fi
    
    # Exit with appropriate code
    if [ $exit_code -eq 0 ]; then
        print_success "E2E test run completed successfully! ✅"
    else
        print_error "E2E test run completed with failures! ❌"
    fi
    
    exit $exit_code
}

# Trap to ensure cleanup on script exit
trap 'cleanup_test_environment' EXIT

# Run main function
main "$@"