# Auth Service - Express + TypeScript

A complete authentication service with multi-role support, built with Express, TypeScript, Prisma,
and Redis.

## 🚀 Features

### Authentication & Authorization

- ✅ User registration with role assignment
- ✅ JWT-based authentication
- ✅ Refresh token rotation
- ✅ Multi-role support (CUSTOMER, VENDOR, DRIVER, HOST, ADVERTISER)
- ✅ Role switching for users with multiple roles
- ✅ Password change with security validation

### Security

- ✅ Request validation with Zod schemas
- ✅ Rate limiting on sensitive endpoints
- ✅ Password hashing with bcrypt
- ✅ JWT token expiration and refresh
- ✅ Role-based access control

### API Documentation

- ✅ Complete Swagger/OpenAPI documentation
- ✅ Interactive API explorer at `/docs`
- ✅ Request/response schemas

### Infrastructure

- ✅ PostgreSQL with Prisma ORM
- ✅ Redis for session management and rate limiting
- ✅ Docker support
- ✅ Health check endpoint

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint           | Description          | Auth Required |
| ------ | ------------------ | -------------------- | ------------- |
| POST   | `/register`        | Register new user    | ❌            |
| POST   | `/login`           | User login           | ❌            |
| POST   | `/refresh`         | Refresh access token | ❌            |
| POST   | `/logout`          | User logout          | ❌            |
| GET    | `/profile`         | Get user profile     | ✅            |
| PUT    | `/profile`         | Update user profile  | ✅            |
| PUT    | `/change-password` | Change password      | ✅            |
| POST   | `/switch-role`     | Switch active role   | ✅            |

### User Management (`/api/v1/users`)

| Method | Endpoint      | Description            | Auth Required | Role Required |
| ------ | ------------- | ---------------------- | ------------- | ------------- |
| GET    | `/:id`        | Get user by ID         | ✅            | ADMIN         |
| GET    | `/`           | List users (paginated) | ✅            | ADMIN         |
| PATCH  | `/:id/status` | Update user status     | ✅            | ADMIN         |

## 🏗️ Architecture

```
src/
├── controllers/          # Business logic
│   ├── auth.controller.ts
│   └── user.controller.ts
├── middleware/           # Express middleware
│   ├── auth.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── validation.middleware.ts
├── routes/              # API routes
│   ├── auth.ts
│   └── user.ts
├── services/            # External services
│   └── redis.service.ts
├── types/               # TypeScript definitions
│   └── express.d.ts
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── swagger.ts          # API documentation
└── seed.ts             # Database seeding
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- pnpm

### Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed database with roles
pnpm exec tsx src/seed.ts

# Start development server
pnpm dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://platform_user:platform_pass@localhost:5433/auth_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REDIS_URL=redis://localhost:6380
AUTH_PORT=3001
NODE_ENV=development
```

## 📚 Documentation

- **API Docs**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health

## 🔒 Security Features

- **Rate Limiting**: 5 requests per 15 minutes on auth endpoints
- **Input Validation**: Zod schemas for all requests
- **Password Security**: bcrypt with 12 rounds
- **JWT Security**: Short-lived access tokens (15min) + refresh tokens (7 days)
- **Role-based Access**: Granular permissions per endpoint

## 🐳 Docker

```bash
# Build and run with Docker Compose
docker-compose up auth

# Or build individually
docker build -f services/auth/Dockerfile -t auth-service .
docker run -p 3001:3001 auth-service
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Test API endpoints
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","acceptTerms":true}'
```

## 📈 Monitoring

- Health endpoint: `GET /health`
- Rate limit headers in responses
- Structured logging with timestamps
- Redis connection monitoring
