# Movie Services API

A comprehensive movie database API built with **NestJS**, **TypeORM**, and **SQLite** featuring dual-database architecture with embedded **Pino logging**.

## 🚀 Quick Start

From the root directory:

```bash
# cd to working folder
cd movie-services

# Install dependencies 
npm install

# Start development server
npm run start:dev

# Or build and start production
npm run build && npm start
```

**Alternative with Docker:**
```bash
cd movie-services
docker build -t movie-services .
docker run -p 3000:3000 movie-services
```

Access the API at: **http://localhost:3000**

## 📋 Available Scripts

### 🏗️ Development
- `npm install` - Install dependencies 
- `npm run start:dev` - Development mode with hot reload
- `npm run start:prod` - Production mode
- `npm run build` - Build the project
- `npm run clean` - Clean build artifacts and node_modules
- `npm run dev` - Alias for start:dev

### 🧪 Testing  
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### 🐳 Docker
**From movie-services directory:**
- `docker build -t movie-services .` - Build Docker image
- `docker run -p 3000:3000 movie-services` - Run container
- `docker-compose up` - Start with docker-compose (production)
- `docker-compose -f docker-compose.yml up movie-services-dev` - Development with hot reload

### 💾 Database Management
**Using scripts directory:**
- `./scripts/db.sh check` - Show database status and tables
- `./scripts/db.sh backup` - Create timestamped backup  
- `./scripts/db.sh info` - Database statistics
- `./scripts/setup.sh` - Project setup and validation

## 🎯 API Endpoints

### 🏥 Health & Monitoring
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |

### 🎬 Movies API
| Endpoint | Method | Description | Query Parameters |
|----------|--------|-------------|------------------|
| `/movies` | GET | List all movies (paginated) | `page` (default: 1), `limit` (default: 50) |
| `/movies/:id` | GET | Get movie details by ID | - |
| `/movies/year/:year` | GET | Get movies by release year | `sort` (`asc`/`desc`) |
| `/movies/genre/:genre` | GET | Get movies by genre | `page`, `limit` |

### 📊 Response Format
**Movie List Response:**
```json
{
  "data": [
    {
      "imdbId": "tt0111161",
      "title": "The Shawshank Redemption",
      "genres": ["Crime", "Drama"],
      "releaseDate": "1994-09-23",
      "budget": "$25,000,000"
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 1000,
  "totalPages": 20
}
```

**Movie Details Response:**
```json
{
  "imdbId": "tt0111161",
  "title": "The Shawshank Redemption", 
  "description": "Two imprisoned men bond over years...",
  "releaseDate": "1994-09-23",
  "budget": "$25,000,000",
  "runtime": 142,
  "averageRating": 9.3,
  "genres": ["Crime", "Drama"],
  "originalLanguage": "English",
  "productionCompanies": ["Castle Rock Entertainment"]
}
```

## 🏗️ Technology Stack

### Backend Framework
- **NestJS 11.0.1** - Enterprise Node.js framework  
- **TypeScript 5.7.3** - Type-safe JavaScript
- **Node.js 20** - Runtime environment

### Database & ORM  
- **TypeORM 0.3.28** - Advanced object-relational mapping
- **SQLite 5.1.7** - Embedded database
- **Dual Database Architecture** - Separate movies and ratings databases

### Logging & Monitoring
- **Pino 10.3.1** - High-performance JSON logger
- **nestjs-pino 4.6.0** - NestJS integration
- **pino-pretty 13.1.3** - Development formatting

### Testing & Quality
- **Jest 30.0.0** - Testing framework
- **ESLint 9.18.0** - Code linting
- **Prettier 3.4.2** - Code formatting  
- **Supertest 7.0.0** - HTTP integration testing

### DevOps & Deployment
- **Docker** - Multi-stage containerization
- **Docker Compose** - Container orchestration
- **Health Checks** - Built-in monitoring

## 📁 Project Structure

```
aetna-health-coding-challenge/
├── 📁 movie-services/          # Main NestJS application
│   ├── 📁 src/                # Source code
│   │   ├── 📁 movies/         # Movies module
│   │   │   ├── movies.controller.ts    # REST endpoints
│   │   │   ├── movies.service.ts       # Business logic
│   │   │   ├── movies.module.ts        # Module configuration
│   │   │   ├── 📁 entities/            # TypeORM entities
│   │   │   │   ├── movie.entity.ts     # Movie database model
│   │   │   │   └── rating.entity.ts    # Rating database model
│   │   │   └── 📁 Interfaces/          # TypeScript interfaces
│   │   │       ├── movie.detail.interface.ts
│   │   │       └── movie.list.item.interface.ts
│   │   ├── app.module.ts              # Root application module
│   │   ├── app.controller.ts          # Root controller
│   │   ├── app.service.ts             # Root service
│   │   └── main.ts                    # Application bootstrap
│   ├── 📁 test/               # End-to-end tests  
│   ├── 📁 scripts/            # Build scripts
│   ├── Dockerfile             # Container configuration
│   ├── docker-compose.yml     # Multi-container setup
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript configuration
│   └── eslint.config.mjs      # ESLint configuration
├── 📁 db/                     # SQLite databases
│   ├── movies.db              # Movies data 
│   └── ratings.db             # User ratings data
├── 📁 scripts/                # Utility scripts
│   ├── setup.sh               # Project setup
│   ├── validate.sh            # Validation checks  
│   └── db.sh                  # Database management
├── 📁 movie-services-requirements/  # Original requirements
└── package.json               # Root workspace configuration
```

## ✨ Key Features

### 🎯 Core Functionality
- **RESTful API** - Clean, organized endpoints following REST principles
- **Paginated Responses** - Efficient data loading with customizable page sizes
- **Dual Database Architecture** - Separated movies and ratings for optimal performance
- **Rich Movie Data** - Comprehensive movie information with ratings integration
- **Type Safety** - Full TypeScript implementation with strict typing

### 🔧 Enterprise Features
- **Structured Logging** - JSON-formatted logs with request tracing
- **Health Monitoring** - Built-in health checks for deployment readiness  
- **Error Handling** - Comprehensive error responses with proper HTTP status codes
- **Input Validation** - Request validation and sanitization
- **Performance Optimized** - Efficient database queries and response caching

### 🐳 DevOps Ready
- **Docker Containerization** - Multi-stage builds for development and production
- **Environment Configuration** - Flexible configuration management
- **Database Included** - Self-contained with embedded SQLite databases
- **CI/CD Friendly** - Comprehensive testing and validation scripts

## 🔧 Configuration

The application follows **[12-factor app](http://12factor.net/) principles**:

### Environment Variables
```bash
NODE_ENV=production|development    # Runtime environment
PORT=3000                         # Service port (default: 3000)
```

### Database Configuration
- **Movies Database**: `db/movies.db` - Contains movie metadata, genres, budget, etc.
- **Ratings Database**: `db/ratings.db` - Contains user ratings and reviews
- **Connection**: Embedded SQLite with TypeORM auto-configuration
- **Migrations**: Automatic schema synchronization in development

### Logging Configuration
```typescript
// Pino logger with pretty formatting in development
transport: {
  target: 'pino-pretty',
  options: {
    singleLine: true,
    colorize: true,
  }
}
```

## 🧪 Testing

The project includes **comprehensive testing strategy**:

### Test Types
- **Unit Tests** - Service and controller logic testing
- **Integration Tests** - Database and API endpoint testing  
- **E2E Tests** - Full application workflow testing
- **Coverage Reports** - Code coverage analysis with Jest

### Running Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:cov

# Run end-to-end tests
npm run test:e2e

# Run specific test files
npm test -- movies.service.spec.ts
```

### Test Configuration
- **Jest 30.0.0** - Primary testing framework
- **Supertest** - HTTP endpoint testing
- **SQLite In-Memory** - Fast test database
- **Test Coverage** - Minimum coverage thresholds enforced

## 🐳 Docker Usage

### Development Environment
**Hot reload with live code changes:**
```bash
cd movie-services
docker-compose up movie-services-dev
```

### Production Deployment 
**Optimized production build:**
```bash
cd movie-services
docker build -t movie-services .
docker run -p 3000:3000 movie-services
```

### Using Docker Compose
```bash
# Production (default)
docker-compose up

# Development with hot reload
docker-compose up movie-services-dev

# Background services
docker-compose up -d

# View logs
docker-compose logs -f movie-services
```

### Multi-Stage Build Benefits
- **Development Stage** - Full development environment with npm and source code
- **Build Stage** - Optimized TypeScript compilation  
- **Production Stage** - Minimal runtime image with only necessary files
- **Security** - Non-root user execution
- **Performance** - Layer caching for faster builds

## 💾 Database Architecture

### Database Design
The application uses **dual SQLite databases** for optimal performance:

**movies.db Structure:**
- `movies` table - Movie metadata (title, genre, budget, runtime, etc.)
- Indexed on `imdbId` for fast lookups
- String-based budget formatting for currency display

**ratings.db Structure:**  
- `ratings` table - User ratings (userId, movieId, rating, timestamp)
- Aggregated for average rating calculations
- Optimized for analytics queries

### Database Tools
```bash
# Check database status and view tables
./scripts/db.sh check

# Create timestamped backup 
./scripts/db.sh backup

# View database statistics and row counts
./scripts/db.sh info

# Direct SQLite access (requires sqlite3)
sqlite3 db/movies.db ".tables"
sqlite3 db/ratings.db ".schema ratings"
```

### Data Relationships
- **Movies** ↔ **Ratings** - Related by `movieId` 
- **Denormalized design** - Optimized for read performance
- **Genre storage** - Comma-separated strings for flexibility
- **Currency formatting** - Budget displayed as formatted dollars

## 📊 Logging & Monitoring

### Structured Logging with Pino
The application provides **enterprise-grade logging**:

**Development Mode:**
- **Colorized output** - Easy-to-read console logs
- **Pretty formatting** - Human-readable log messages
- **Request tracing** - HTTP request/response logging
- **Performance metrics** - Response times and database query durations

**Production Mode:**
- **JSON structured logs** - Machine-parseable format
- **Log levels** - Configurable logging levels (error, warn, info, debug)
- **Correlation IDs** - Request tracking across services
- **Performance monitoring** - Built-in metrics collection

### Health Monitoring
**GET `/health`** endpoint provides:
```json
{
  "status": "ok",
  "timestamp": "2026-02-28T10:00:00.000Z",
  "uptime": 3600,
  "service": "movie-services",  
  "version": "0.0.1",
  "database": {
    "movies": "connected",
    "ratings": "connected"
  }
}
```

## 🚀 Production Deployment

### Deployment Checklist
The project is **production-ready** with:

- ✅ **Docker containerization** - Multi-stage optimized builds
- ✅ **Security hardening** - Non-root user, minimal attack surface  
- ✅ **Health checks** - Container and application health monitoring
- ✅ **Structured logging** - JSON logs for log aggregation
- ✅ **Environment configuration** - 12-factor app compliance
- ✅ **Database included** - Self-contained SQLite databases
- ✅ **Error handling** - Comprehensive error responses
- ✅ **Performance optimized** - Efficient queries and caching

### Deployment Options

**1. Docker Container (Recommended)**
```bash
# Build production image
cd movie-services
docker build -t movie-services:latest .

# Run in production
docker run -d \
  --name movie-services \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  movie-services:latest
```

**2. Direct Node.js**
```bash
# Install dependencies
npm install

# Build application  
npm run build

# Start production server
NODE_ENV=production npm start
```

**3. Docker Compose**
```bash
# Production deployment with health checks
docker-compose up -d
```

### Scaling Considerations
- **Stateless design** - Easy horizontal scaling
- **Database embedded** - Consider external database for high-traffic
- **Load balancer ready** - Health check endpoint included
- **Container orchestration** - Kubernetes/Docker Swarm compatible

## 🛠️ Development Guide

### Getting Started for Developers
```bash
# 1. Clone and setup
git clone <repository>
cd aetna-health-coding-challenge

# 2. Install dependencies
npm install

# 3. Start development server  
npm run start:dev

# 4. Run tests
npm test

# 5. Check code quality
npm run lint
npm run format
```

### Development Workflow
1. **Code changes** - Edit TypeScript files in `src/`
2. **Hot reload** - Changes automatically restart server
3. **Test early** - Run unit tests for modified modules  
4. **Database inspection** - Use `./scripts/db.sh check`
5. **Format code** - Run `npm run format` before commits

### Adding New Features
1. **Create module** - Use NestJS CLI: `nest generate module feature`
2. **Add entities** - Create TypeORM entities in `entities/`
3. **Define interfaces** - Add TypeScript interfaces  
4. **Write tests** - Create `.spec.ts` files
5. **Update README** - Document new endpoints

---

## 📚 Additional Resources

- **[Original Requirements](movie-services-requirements/README.md)** - Project specifications
- **[NestJS Documentation](https://nestjs.com/)** - Framework reference
- **[TypeORM Guide](https://typeorm.io/)** - Database ORM documentation  
- **[Pino Logging](https://github.com/pinojs/pino)** - Logger documentation
- **[12-Factor App](https://12factor.net/)** - Deployment best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Run validation: `npm test && npm run lint`  
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push branch: `git push origin feature/amazing-feature`
7. Create Pull Request

---

**Movie Services API** - Built with ❤️ using NestJS, TypeORM, and SQLite