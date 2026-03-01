# Movie Services API

A comprehensive movie database API built with NestJS, TypeORM, and SQLite featuring dual-database architecture with embedded pino logging.

## 🚀 Quick Start

From the root directory:

```bash
# Initial setup (installs deps, builds project, validates setup)
npm run setup

# Start development server
npm run start:dev

# Or run with Docker
npm run docker:build
npm run docker:run
```

Access the API at: **http://localhost:3000**

## 📋 Available Scripts

### 🏗️ Development
- `npm run setup` - Full project initialization
- `npm run start:dev` - Development mode with hot reload
- `npm run start:prod` - Production mode
- `npm run build` - Build the project
- `npm run clean` - Clean build artifacts
- `npm run dev` - Alias for start:dev

### 🧪 Testing  
- `npm test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run validate` - Full validation (lint, test, build)
- `npm run validate:quick` - Quick validation (skip e2e)

### 🐳 Docker
- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run production container
- `npm run docker:dev` - Development container with hot reload
- `npm run docker:up` - Start with docker-compose
- `npm run docker:down` - Stop containers

### 💾 Database Management
- `npm run db check` - Show database status and tables
- `npm run db backup` - Create timestamped backup  
- `npm run db info` - Database statistics
- `npm run db` - Show all database commands

### 🔍 Monitoring
- `npm run health` - Check service health
- `npm run logs` - View application logs

### 🚀 Deployment
- `npm run deploy:build` - Full validation + Docker build
- `npm run deploy:local` - Deploy locally with Docker
- `npm run ci` - CI/CD validation

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/movies` | GET | List all movies (paginated) |
| `/movies/:id` | GET | Get movie details |
| `/movies/year/:year` | GET | Movies by year |
| `/movies/genre/:genre` | GET | Movies by genre |

### Query Parameters
- `page` - Page number (default: 1)
- `sort` - Sort order: `asc` or `desc` (year endpoint only)

## 📁 Project Structure

```
├── movie-services/          # Main NestJS application
│   ├── src/                # Source code
│   ├── test/               # Tests  
│   ├── Dockerfile          # Container configuration
│   └── docker-compose.yml  # Multi-container setup
├── db/                     # SQLite databases
│   ├── movies.db          # Movies data
│   └── ratings.db         # Ratings data
├── scripts/               # Utility scripts
│   ├── setup.sh          # Project setup
│   ├── validate.sh       # Validation checks
│   └── db.sh             # Database management
└── package.json           # Root project configuration
```

## 🔧 Configuration

The application follows [12-factor app](http://12factor.net/) principles:

- **Environment-based configuration** - Uses `.env` files
- **Dual database support** - Separate SQLite files for movies and ratings
- **Structured logging** - Pino logger with pretty formatting
- **Health monitoring** - Built-in health checks
- **Docker ready** - Multi-stage builds with optimizations

## 🧪 Testing

The project includes comprehensive testing:

- **Unit tests** - Service and controller logic
- **E2E tests** - Full API endpoint testing
- **Database integration** - Real SQLite database testing
- **Docker testing** - Container build validation

## 🐳 Docker Usage

**Development with hot reload:**
```bash
npm run docker:dev
```

**Production:**
```bash
npm run docker:build
npm run docker:run
```

**With compose:**
```bash
npm run docker:up
```

## 💾 Database

The application uses two SQLite databases:

- **movies.db** - Movie information (title, genre, budget, etc.)
- **ratings.db** - User ratings and reviews

Database tools available:
```bash
npm run db check        # Status and tables
npm run db backup       # Create backup
npm run db info         # Statistics
```

## 📊 Logging

Integrated pino logger provides:

- **Structured logging** - JSON format for production
- **Pretty formatting** - Colorized development output  
- **HTTP logging** - Request/response tracking
- **Performance metrics** - Response times and database queries

## 🏥 Health Monitoring

Built-in health checks at `/health` endpoint provide:

- Service status
- Uptime information  
- Timestamp
- Service identification

## 🚀 Deployment Ready

The project is production-ready with:

- ✅ **Docker containerization**
- ✅ **Multi-stage builds**
- ✅ **Security hardening** (non-root user)
- ✅ **Health checks**
- ✅ **Comprehensive logging**
- ✅ **Environment configuration**
- ✅ **Database included in container**

---

For more details, see the [original requirements](movie-services-requirements/README.md).