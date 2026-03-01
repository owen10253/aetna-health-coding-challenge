#!/bin/bash

# Build and run movie-services with Docker

echo "🐳 Building movie-services Docker image..."

# Build the production image
docker build -t movie-services:latest .

echo "✅ Build complete!"
echo ""
echo "🚀 Available commands:"
echo ""
echo "Production mode:"
echo "  docker run -p 3000:3000 movie-services:latest"
echo ""  
echo "Development mode:"
echo "  docker-compose --profile dev up movie-services-dev"
echo ""
echo "Using docker-compose:"
echo "  docker-compose up movie-services"
echo ""
echo "🏥 Health check available at: http://localhost:3000/health"
echo "📚 API endpoints available at: http://localhost:3000/movies"