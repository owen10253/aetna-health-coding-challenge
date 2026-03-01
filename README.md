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
- `npm run start` - Start in standard mode
- `npm run start:dev` - Development mode with hot reload
- `npm run start:debug` - Debug mode with inspector
- `npm run start:prod` - Production mode (requires build)
- `npm run build` - Build the project for production
- `npm run format` - Format code with Prettier

### 🧪 Testing  
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:debug` - Debug tests with inspector
- `npm run lint` - Run ESLint with auto-fix

### 🐳 Docker
**From movie-services directory:**
- `npm run docker:build` - Build optimized production image
- `npm run docker:build:dev` - Build development image
- `npm run docker:run` - Run production container
- `npm run docker:run:dev` - Run development container with volume mounts
- `npm run docker:up` - Start with docker-compose (production)
- `npm run docker:up:dev` - Development with hot reload (uses --profile dev)
- `npm run docker:down` - Stop and remove containers
- `npm run docker:logs` - View container logs

### 💾 Database Management
**Direct SQLite access:**
- `sqlite3 movie-services/db/movies.db ".tables"` - List tables in movies database
- `sqlite3 movie-services/db/ratings.db ".schema ratings"` - View ratings schema
- Database files located in `movie-services/db/` directory

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
- **Node.js 20** - Runtime environment (Alpine Linux in Docker)

### Database & ORM  
- **TypeORM 0.3.28** - Advanced object-relational mapping
- **SQLite 5.1.7** - Embedded database
- **Dual Database Architecture** - Separate movies and ratings databases

### Logging & Monitoring
- **Pino 10.3.1** - High-performance JSON logger
- **nestjs-pino 4.6.0** - NestJS integration
- **pino-pretty 13.1.3** - Development formatting

### Testing & Quality
- **Jest 30.0.0** - Testing framework with coverage
- **ts-jest 29.2.5** - TypeScript Jest transformer
- **ESLint 9.18.0** - Code linting with TypeScript support
- **Prettier 3.4.2** - Code formatting  
- **Supertest 7.0.0** - HTTP integration testing
- **typescript-eslint 8.20.0** - TypeScript ESLint plugin

### DevOps & Deployment
- **Docker** - Multi-stage containerization (Alpine Linux base)
- **Docker Compose** - Container orchestration with profiles
- **Health Checks** - Built-in monitoring via HTTP endpoints

## 📁 Project Structure

```
aetna-health-coding-challenge/
├── 📁 movie-services/          # Main NestJS application
│   ├── 📁 src/                # Source code
│   │   ├── 📁 movies/         # Movies module
│   │   │   ├── movies.controller.ts    # REST endpoints
│   │   │   ├── movies.service.ts       # Business logic
│   │   │   ├── movies.module.ts        # Module configuration
│   │   │   ├── movies.controller.spec.ts # Controller tests
│   │   │   ├── movies.service.spec.ts   # Service tests
│   │   │   ├── 📁 entities/            # TypeORM entities
│   │   │   │   ├── movie.entity.ts     # Movie database model
│   │   │   │   └── rating.entity.ts    # Rating database model
│   │   │   └── 📁 Interfaces/          # TypeScript interfaces
│   │   │       ├── movie.detail.interface.ts
│   │   │       └── movie.list.item.interface.ts
│   │   ├── app.module.ts              # Root application module
│   │   ├── app.controller.ts          # Root controller
│   │   ├── app.controller.spec.ts     # Root controller tests
│   │   ├── app.service.ts             # Root service
│   │   └── main.ts                    # Application bootstrap
│   ├── 📁 test/               # End-to-end tests  
│   │   ├── app.e2e-spec.ts    # E2E test suite
│   │   └── jest-e2e.json      # E2E Jest configuration
│   ├── 📁 scripts/            # Build scripts
│   │   └── docker-build.sh    # Docker build script
│   ├── 📁 db/                 # SQLite databases
│   │   ├── movies.db          # Movies data 
│   │   └── ratings.db         # User ratings data
│   ├── Dockerfile             # Multi-stage container configuration
│   ├── docker-compose.yml     # Container orchestration setup
│   ├── package.json           # Dependencies & npm scripts
│   ├── tsconfig.json          # TypeScript configuration
│   ├── tsconfig.build.json    # Build-specific TypeScript config
│   ├── eslint.config.mjs      # ESLint configuration
│   ├── nest-cli.json          # NestJS CLI configuration
│   └── README.md              # Module documentation
├── 📁 movie-services-requirements/  # Original requirements & specifications
│   ├── README.md              # Project requirements document
│   └── 📁 db/                 # Sample database files
├── .gitignore                 # Git ignore rules
└── README.md                  # This file - comprehensive project documentation
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
# Production (default service)
cd movie-services
docker-compose up

# Development with hot reload (uses profile)
docker-compose --profile dev up

# Background services
docker-compose up -d

# View logs
docker-compose logs -f movie-services

# Development with npm script
npm run docker:up:dev
```

### Multi-Stage Build Benefits
- **Development Stage** - Full development environment with npm and source code
- **Build Stage** - Optimized TypeScript compilation  
- **Production Stage** - Minimal runtime image (~150MB) with only necessary files
- **Security** - Non-root user execution
- **Performance** - Layer caching for faster builds
- **Health Checks** - Built-in container health monitoring via `/movies` endpoint

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
# Direct SQLite database access (requires sqlite3 CLI)
sqlite3 movie-services/db/movies.db ".tables"
sqlite3 movie-services/db/movies.db ".schema movies"
sqlite3 movie-services/db/ratings.db ".tables"  
sqlite3 movie-services/db/ratings.db ".schema ratings"

# Interactive database exploration
sqlite3 movie-services/db/movies.db
# Then run: SELECT COUNT(*) FROM movies;
# Or: SELECT * FROM movies LIMIT 5;

# Check database file information
ls -la movie-services/db/
file movie-services/db/*.db
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

# 2. Navigate to main application
cd movie-services

# 3. Install dependencies
npm install

# 4. Start development server  
npm run start:dev

# 5. Run tests
npm test

# 6. Check code quality
npm run lint
npm run format
```

### Development Workflow
1. **Code changes** - Edit TypeScript files in `src/`
2. **Hot reload** - Changes automatically restart server in dev mode
3. **Test early** - Run unit tests for modified modules: `npm test`  
4. **Database inspection** - Use SQLite CLI or database viewer
5. **Format code** - Run `npm run format` before commits
6. **Docker testing** - Test with `npm run docker:build:dev && npm run docker:run:dev`

### Adding New Features
1. **Create module** - Use NestJS CLI: `nest generate module feature`
2. **Add entities** - Create TypeORM entities in `entities/`
3. **Define interfaces** - Add TypeScript interfaces  
4. **Write tests** - Create `.spec.ts` files
5. **Update README** - Document new endpoints

### Troubleshooting

#### Common Issues

**Port Already in Use**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run start:dev
```

**Database Connection Issues**
```bash
# Check database files exist
ls -la movie-services/db/
# Verify database integrity
sqlite3 movie-services/db/movies.db "PRAGMA integrity_check;"
```

**Docker Health Check Fails**
```bash
# The health check uses curl which may not be in Alpine
# Check container health manually:
docker exec <container_id> wget -qO- http://localhost:3000/movies
```

**Build Errors**
```bash
# Clean build and reinstall
npm run format && npm run lint
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

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