# Authentication Service

A comprehensive authentication and authorization service for the multi-sided platform, supporting
multiple user roles, JWT-based authentication, and extensive security features.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- pnpm (recommended) or npm

### Installation

1. **Clone and navigate to the auth service:**

   ```bash
   cd services/auth
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database:**

   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Run database migrations
   pnpm db:migrate

   # Seed the database (optional)
   pnpm db:seed
   ```

5. **Start the service:**

   ```bash
   # Development mode
   pnpm dev

   # Production mode
   pnpm build && pnpm start
   ```

The service will be available at `http://localhost:3001`

## 📚 API Documentation

### Swagger UI

Access the interactive API documentation at: **http://localhost:3001/docs**

### Key Endpoints

| Endpoint                   | Method | Description         |
| -------------------------- | ------ | ------------------- |
| `/api/v1/auth/register`    | POST   | Register a new user |
| `/api/v1/auth/login`       | POST   | User login          |
| `/api/v1/auth/refresh`     | POST   | Refresh JWT token   |
| `/api/v1/auth/logout`      | POST   | User logout         |
| `/api/v1/auth/profile`     | GET    | Get user profile    |
| `/api/v1/auth/profile`     | PUT    | Update user profile |
| `/api/v1/auth/switch-role` | POST   | Switch active role  |
| `/health`                  | GET    | Health check        |

## 🔐 Authentication Flow

### 1. User Registration

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "activeRole": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

### 3. Using Protected Endpoints

```bash
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

## 👥 Multi-Role System

The service supports multiple user roles:

- **CUSTOMER**: End users who purchase products/services
- **VENDOR**: Sellers who offer products/services
- **DRIVER**: Delivery/transport service providers
- **HOST**: Accommodation/venue providers
- **ADVERTISER**: Marketing/advertising clients
- **ADMIN**: System administrators

### Role Switching

Users can have multiple roles and switch between them:

```bash
curl -X POST http://localhost:3001/api/v1/auth/switch-role \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"roleName": "VENDOR"}'
```

## 🔒 Security Features

### JWT Token Management

- **Access tokens**: Short-lived (15 minutes)
- **Refresh tokens**: Long-lived (7 days) with rotation
- **Device tracking**: Tokens tied to specific devices
- **Automatic cleanup**: Expired tokens are automatically removed

### Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes
- **Password operations**: 3 requests per 60 minutes
- **General API**: 100 requests per 15 minutes

### Account Security

- **Password requirements**: Minimum 8 characters, uppercase, lowercase, number, special character
- **Account lockout**: After 5 failed login attempts
- **Email/Phone verification**: Required for account activation
- **Password history**: Prevents reusing last 5 passwords

### Advanced Security

- **IP Access Control**: Whitelist/blacklist IP addresses
- **Device fingerprinting**: Track and validate devices
- **Suspicious activity detection**: Monitor for unusual patterns
- **Audit logging**: Complete audit trail of all actions

## 📊 Monitoring & Health Checks

### Health Endpoints

- `/health` - Basic health check
- `/health/live` - Liveness probe (K8s compatible)
- `/health/ready` - Readiness probe (K8s compatible)
- `/health/metrics` - Detailed metrics

### Monitoring Features

- **Performance monitoring**: Response times, throughput
- **Database monitoring**: Connection pool, query performance
- **Redis monitoring**: Connection status, memory usage
- **Circuit breakers**: Automatic failure handling
- **Graceful degradation**: Fallback mechanisms

## 🗄️ Database Schema

The service uses PostgreSQL with Prisma ORM. Key entities:

- **Users**: Core user information
- **Roles & Permissions**: RBAC system
- **User Profiles**: Role-specific profile data
- **Auth Tokens**: JWT and verification tokens
- **Audit Logs**: Security and admin action logs
- **Security Events**: Monitoring and analytics

### Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Create and run migrations
pnpm db:migrate

# Push schema changes (development)
pnpm db:push

# Seed database with sample data
pnpm db:seed
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description                  | Default       |
| ---------------- | ---------------------------- | ------------- |
| `DATABASE_URL`   | PostgreSQL connection string | Required      |
| `JWT_SECRET`     | JWT signing secret           | Required      |
| `JWT_EXPIRES_IN` | Access token expiration      | `15m`         |
| `NODE_ENV`       | Environment mode             | `development` |
| `AUTH_PORT`      | Service port                 | `3001`        |
| `REDIS_HOST`     | Redis host                   | `localhost`   |
| `REDIS_PORT`     | Redis port                   | `6380`        |

### Security Configuration

```bash
# JWT Configuration
JWT_SECRET=your-secure-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Account Security
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=1800000  # 30 minutes
PASSWORD_HISTORY_COUNT=5

# Email/SMS Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMS_PROVIDER_URL=https://api.sms-provider.com
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t auth-service .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="your-secret" \
  auth-service
```

### Docker Compose

```yaml
version: '3.8'
services:
  auth-service:
    build: .
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/auth_db
      - JWT_SECRET=your-secure-secret
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: auth-service:latest
          ports:
            - containerPort: 3001
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: auth-secrets
                  key: database-url
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3001
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3001
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   ```bash
   # Check database is running
   pg_isready -h localhost -p 5433

   # Verify connection string
   echo $DATABASE_URL
   ```

2. **Redis Connection Failed**

   ```bash
   # Check Redis is running
   redis-cli -h localhost -p 6380 ping
   ```

3. **JWT Token Issues**

   ```bash
   # Verify JWT secret is set
   echo $JWT_SECRET

   # Check token expiration
   # Tokens expire after 15 minutes by default
   ```

4. **Rate Limiting**
   ```bash
   # Check rate limit headers in response
   curl -I http://localhost:3001/api/v1/auth/login
   ```

### Logs

```bash
# View application logs
pnpm logs

# View with specific log level
LOG_LEVEL=debug pnpm dev

# View database query logs
DATABASE_LOGGING=true pnpm dev
```

## 📈 Performance

### Optimization Features

- **Connection pooling**: Efficient database connections
- **Response caching**: Cache frequently accessed data
- **Response compression**: Gzip compression for large responses
- **Query optimization**: Optimized database queries
- **Memory management**: Efficient memory usage

### Metrics

The service exposes metrics at `/health/metrics`:

- Request/response times
- Database query performance
- Memory and CPU usage
- Error rates and types
- Active connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow security best practices
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the [API documentation](http://localhost:3001/docs)
- Review the troubleshooting section
- Check existing issues in the repository
- Create a new issue with detailed information

---

**Built with ❤️ for the Multi-Sided Platform**
