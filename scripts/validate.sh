#!/bin/bash

# Validation Script for Movie Services API
echo "🔍 Running Movie Services API Validation..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((TESTS_FAILED++))
    fi
}

# Check prerequisites
echo "📋 Checking Prerequisites..."
command -v node >/dev/null 2>&1
print_result $? "Node.js installed"

command -v npm >/dev/null 2>&1
print_result $? "npm installed"

# Check project structure
echo ""
echo "📁 Checking Project Structure..."
[ -f "package.json" ]
print_result $? "Root package.json exists"

[ -f "movie-services/package.json" ]
print_result $? "Movie-services package.json exists"

[ -f "db/movies.db" ]
print_result $? "Movies database exists"

[ -f "db/ratings.db" ]
print_result $? "Ratings database exists"

[ -f "movie-services/src/app.module.ts" ]
print_result $? "App module exists"

[ -f "movie-services/Dockerfile" ]
print_result $? "Dockerfile exists"

# Dependency check
echo ""
echo "📦 Checking Dependencies..."
cd movie-services
if npm list --depth=0 >/dev/null 2>&1; then
    print_result 0 "Dependencies installed"
else
    print_result 1 "Dependencies missing or broken"
fi

# Build test
echo ""
echo "🔨 Build Test..."
npm run build >/dev/null 2>&1
print_result $? "TypeScript compilation"

# Unit tests
echo ""
echo "🧪 Running Tests..."
npm test >/dev/null 2>&1
print_result $? "Unit tests"

# E2E tests
if [ "$1" != "--skip-e2e" ]; then
    npm run test:e2e >/dev/null 2>&1
    print_result $? "E2E tests"
fi

# Linting
echo ""
echo "🔍 Code Quality..."
npm run lint >/dev/null 2>&1
print_result $? "ESLint checks"

# Docker build test (optional)
if [ "$1" = "--full" ]; then
    echo ""
    echo "🐳 Docker Test..."
    docker build -t movie-services:test . >/dev/null 2>&1
    print_result $? "Docker build"
    
    # Cleanup test image
    docker rmi movie-services:test >/dev/null 2>&1
fi

# Database connectivity test
echo ""
echo "💾 Database Tests..."
cd ..
sqlite3 db/movies.db "SELECT COUNT(*) FROM movies;" >/dev/null 2>&1
print_result $? "Movies database connectivity"

sqlite3 db/ratings.db "SELECT COUNT(*) FROM ratings;" >/dev/null 2>&1
print_result $? "Ratings database connectivity"

# Summary
echo ""
echo "📊 Validation Summary:"
echo -e "   ${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "   ${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All validations passed! Project is ready for deployment.${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some validations failed. Please fix the issues before deployment.${NC}"
    exit 1
fi