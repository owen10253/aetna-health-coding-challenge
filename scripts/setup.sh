#!/bin/bash

# Project Setup Script
echo "🚀 Setting up Movie Services API..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    exit 1
fi

# Check SQLite (optional)
if command -v sqlite3 &> /dev/null; then
    echo "✅ SQLite3 found"
else
    echo "⚠️  SQLite3 not found - database inspection features may not work"
fi

echo "✅ Prerequisites check complete"

# Install dependencies
echo "📦 Installing dependencies..."
cd movie-services
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

# Check database files
echo "💾 Checking database files..."
cd ..
if [ -f "db/movies.db" ] && [ -f "db/ratings.db" ]; then
    echo "✅ Database files found"
    echo "   - Movies: db/movies.db"
    echo "   - Ratings: db/ratings.db"
else
    echo "❌ Database files missing!"
    echo "   Expected: db/movies.db and db/ratings.db"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 Available commands:"
echo "   npm run start:dev     - Start in development mode"
echo "   npm run start:prod    - Start in production mode"  
echo "   npm test              - Run tests"
echo "   npm run test:e2e      - Run e2e tests"
echo "   npm run docker:build  - Build Docker image"
echo "   npm run docker:run    - Run with Docker"
echo "   npm run health        - Check service health"
echo ""
echo "🌐 Service will be available at: http://localhost:3000"
echo "🏥 Health check: http://localhost:3000/health"
echo "📚 API docs: See README.md for endpoint details"