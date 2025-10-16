# Multi-Sided Platform Development Guide

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** (LTS recommended)
- **pnpm 8+** (faster than npm/yarn)
- **Docker & Docker Compose** (for local development)
- **Git** (version control)
- **VS Code** (recommended IDE with extensions)

### Quick Setup

```bash
# Clone repository
git clone <repository-url>
cd multi-sided-platform

# Run automated setup (handles everything)
chmod +x scripts/setup.sh
./scripts/setup.sh

# Start development
pnpm dev
```

### Verify Installation

```bash
# Check all services are running
curl http://localhost:3000/health  # Gateway
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Core Service

# Test user registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@example.com",
    "password": "password123",
    "firstName": "Dev",
    "lastName": "User",
    "roles": ["CUSTOMER"],
    "acceptTerms": true
  }'
```

## 🏗️ Project Structure

```
multi-sided-platform/
├── services/                 # Microservices
│   ├── gateway/             # API Gateway (Port 3000)
│   ├── auth/               # Authentication (Port 3001)
│   ├── core/               # Core/Ecommerce (Port 3002)
│   ├── payment/            # Payment Service (Port 3003)
│   ├── taxi/               # Taxi Service (Port 3004)
│   ├── hotel/              # Hotel Service (Port 3005)
│   └── ads/                # Advertisement Service (Port 3006)
├── shared/                  # Shared packages
│   └── types/              # TypeScript types with Zod
├── docs/                   # Documentation
├── scripts/                # Setup and deployment scripts
├── docker-compose.yml      # Development environment
└── package.json           # Workspace configuration
```

### Service Structure

```
services/auth/
├── src/
│   ├── index.ts           # Service entry point
│   ├── routes/            # API route handlers
│   ├── plugins/           # Fastify plugins
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── Dockerfile             # Container configuration
├── package.json           # Service dependencies
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Development Workflow

### Daily Development

```bash
# Start all services in development mode
pnpm dev

# Start specific service
cd services/auth
pnpm dev

# Run tests
pnpm test                  # All services
cd services/auth && pnpm test  # Specific service

# Database operations
cd services/auth
pnpm prisma studio         # Database GUI
pnpm prisma migrate dev    # Create migration
pnpm prisma db push        # Push schema changes
```

### Code Quality

```bash
# Linting
pnpm lint                  # All services
pnpm lint:fix             # Auto-fix issues

# Type checking
pnpm type-check           # All services

# Formatting
pnpm format               # Format all code
```

### Testing Strategy

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# End-to-end tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

## 📝 Adding New Features

### 1. Creating a New Service

```bash
# Create service directory
mkdir services/new-service
cd services/new-service

# Initialize package.json
cat > package.json << EOF
{
  "name": "@platform/new-service",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@platform/types": "workspace:*",
    "fastify": "^4.24.3"
  }
}
EOF

# Create basic service structure
mkdir -p src/{routes,services,utils}
```

### 2. Service Template

```typescript
// src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

async function buildApp() {
  await fastify.register(cors);
  await fastify.register(helmet);

  // Health check
  fastify.get('/health', async () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'new-service',
  }));

  // Register routes
  // await fastify.register(routes, { prefix: '/api/v1' });

  return fastify;
}

async function start() {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || '3007');
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    console.log(`🚀 New Service running on http://${host}:${port}`);
  } catch (err) {
    console.error('Failed to start service:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export { buildApp };
```

### 3. Adding Routes

```typescript
// src/routes/items.ts
import { FastifyPluginAsync } from 'fastify';
import { ItemSchema, CreateItemSchema } from '@platform/types';

export const itemRoutes: FastifyPluginAsync = async fastify => {
  // Get all items
  fastify.get('/items', async (request, reply) => {
    const items = await fastify.itemService.getAll();
    reply.send({
      success: true,
      data: items,
      timestamp: new Date().toISOString(),
    });
  });

  // Create item
  fastify.post(
    '/items',
    {
      schema: {
        body: CreateItemSchema,
      },
    },
    async (request, reply) => {
      const item = await fastify.itemService.create(request.body);
      reply.code(201).send({
        success: true,
        data: item,
        timestamp: new Date().toISOString(),
      });
    }
  );

  // Get item by ID
  fastify.get('/items/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const item = await fastify.itemService.getById(id);

    if (!item) {
      return reply.code(404).send({
        success: false,
        error: 'Item not found',
        timestamp: new Date().toISOString(),
      });
    }

    reply.send({
      success: true,
      data: item,
      timestamp: new Date().toISOString(),
    });
  });
};
```

### 4. Adding Business Logic

```typescript
// src/services/itemService.ts
import { PrismaClient } from '@prisma/client';
import { CreateItem, Item } from '@platform/types';

export class ItemService {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<Item[]> {
    return this.prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string): Promise<Item | null> {
    return this.prisma.item.findUnique({
      where: { id },
    });
  }

  async create(data: CreateItem): Promise<Item> {
    return this.prisma.item.create({
      data,
    });
  }

  async update(id: string, data: Partial<CreateItem>): Promise<Item> {
    return this.prisma.item.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    });
  }
}
```

### 5. Adding Types

```typescript
// shared/types/src/newService.ts
import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateItemSchema = ItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateItemSchema = CreateItemSchema.partial();

export type Item = z.infer<typeof ItemSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
```

### 6. Update Gateway Routing

```typescript
// services/gateway/src/index.ts
const routes = [
  // ... existing routes
  { prefix: '/api/v1/items', upstream: services.newService },
];
```

## 🗄️ Database Development

### Prisma Workflow

```bash
# Create new migration
cd services/auth
pnpm prisma migrate dev --name "add_user_preferences"

# Reset database (development only)
pnpm prisma migrate reset

# Generate client after schema changes
pnpm prisma generate

# View database in browser
pnpm prisma studio
```

### Schema Best Practices

```prisma
// Good schema design
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  orders    Order[]
  profile   UserProfile?

  // Indexes for performance
  @@index([email])
  @@index([createdAt])
  @@map("users") // Explicit table name
}

model UserProfile {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // JSON for flexible data
  preferences Json?

  @@map("user_profiles")
}
```

### Database Migrations

```sql
-- Example migration: Add user preferences
ALTER TABLE "users" ADD COLUMN "preferences" JSONB;
CREATE INDEX "users_preferences_idx" ON "users" USING GIN ("preferences");

-- Add constraint
ALTER TABLE "orders" ADD CONSTRAINT "orders_total_positive" CHECK ("total" > 0);
```

## 🧪 Testing Guidelines

### Unit Testing

```typescript
// services/auth/src/services/__tests__/userService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../userService';
import { mockPrisma } from '../../__mocks__/prisma';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockPrisma);
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      roles: ['CUSTOMER'],
    };

    mockPrisma.user.create.mockResolvedValue({
      id: 'user123',
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await userService.create(userData);

    expect(user.email).toBe(userData.email);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: userData,
    });
  });
});
```

### Integration Testing

```typescript
// services/auth/src/__tests__/auth.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../index';
import { FastifyInstance } from 'fastify';

describe('Auth Service Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        roles: ['CUSTOMER'],
        acceptTerms: true,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe('test@example.com');
  });
});
```

### E2E Testing

```typescript
// tests/e2e/user-journey.test.ts
import { test, expect } from '@playwright/test';

test('complete user journey', async ({ page }) => {
  // Register as customer
  await page.goto('http://localhost:3000/register');
  await page.fill('[data-testid=email]', 'e2e@example.com');
  await page.fill('[data-testid=password]', 'password123');
  await page.click('[data-testid=register-button]');

  // Verify dashboard
  await expect(page.locator('[data-testid=user-dashboard]')).toBeVisible();

  // Switch to vendor role
  await page.click('[data-testid=role-switcher]');
  await page.click('[data-testid=vendor-role]');

  // Verify vendor dashboard
  await expect(page.locator('[data-testid=vendor-dashboard]')).toBeVisible();
});
```

## 🔐 Security Best Practices

### Input Validation

```typescript
// Always validate input with Zod
import { LoginRequestSchema } from '@platform/types';

fastify.post(
  '/login',
  {
    schema: {
      body: LoginRequestSchema,
    },
  },
  async (request, reply) => {
    // request.body is now type-safe and validated
    const { email, password } = request.body;
    // ... handle login
  }
);
```

### Authentication Middleware

```typescript
// Protect routes with authentication
fastify.register(async function (fastify) {
  await fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/protected', async (request, reply) => {
    // request.user is available and verified
    const userId = request.user.sub;
    // ... handle protected route
  });
});
```

### Rate Limiting

```typescript
// Apply rate limiting to sensitive endpoints
await fastify.register(rateLimit, {
  max: 5,
  timeWindow: '1 minute',
  keyGenerator: request => request.ip,
});

fastify.post(
  '/login',
  {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '5 minutes',
      },
    },
  },
  loginHandler
);
```

## 📊 Monitoring & Debugging

### Logging

```typescript
// Structured logging with context
fastify.addHook('onRequest', async request => {
  request.log.info(
    {
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      userId: request.user?.sub,
      requestId: request.id,
    },
    'Incoming request'
  );
});

// Business logic logging
async function createOrder(orderData) {
  logger.info(
    {
      action: 'create_order',
      customerId: orderData.customerId,
      vendorId: orderData.vendorId,
      amount: orderData.total,
    },
    'Creating new order'
  );

  try {
    const order = await orderService.create(orderData);

    logger.info(
      {
        action: 'order_created',
        orderId: order.id,
        amount: order.total,
      },
      'Order created successfully'
    );

    return order;
  } catch (error) {
    logger.error(
      {
        action: 'create_order_failed',
        error: error.message,
        customerId: orderData.customerId,
      },
      'Failed to create order'
    );

    throw error;
  }
}
```

### Health Checks

```typescript
// Comprehensive health checks
fastify.get('/health', async () => {
  const checks = await Promise.allSettled([checkDatabase(), checkRedis(), checkExternalServices()]);

  const healthy = checks.every(check => check.status === 'fulfilled');

  return {
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks: checks.map((check, index) => ({
      name: ['database', 'redis', 'external'][index],
      status: check.status,
      ...(check.status === 'rejected' && { error: check.reason.message }),
    })),
  };
});
```

### Performance Monitoring

```typescript
// Request timing
fastify.addHook('onRequest', async request => {
  request.startTime = Date.now();
});

fastify.addHook('onResponse', async (request, reply) => {
  const duration = Date.now() - request.startTime;

  request.log.info(
    {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      userId: request.user?.sub,
    },
    'Request completed'
  );

  // Alert on slow requests
  if (duration > 1000) {
    request.log.warn(
      {
        method: request.method,
        url: request.url,
        duration,
      },
      'Slow request detected'
    );
  }
});
```

## 🚀 Deployment

### Docker Build

```bash
# Build specific service
docker build -f services/auth/Dockerfile -t platform/auth:latest .

# Build all services
docker-compose build

# Push to registry
docker tag platform/auth:latest registry.example.com/platform/auth:latest
docker push registry.example.com/platform/auth:latest
```

### Environment Configuration

```bash
# Development
export NODE_ENV=development
export DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db
export REDIS_URL=redis://localhost:6379
export JWT_SECRET=dev-secret-key

# Production
export NODE_ENV=production
export DATABASE_URL=postgresql://user:pass@prod-db:5432/auth_db
export REDIS_URL=redis://prod-redis:6379
export JWT_SECRET=super-secure-production-key
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Load balancer configured
- [ ] CDN configured for static assets
- [ ] Security headers configured
- [ ] Rate limiting configured
- [ ] Error tracking configured

## 🤝 Contributing

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

### Pull Request Process

1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Run full test suite
5. Create pull request with description
6. Address review feedback
7. Merge after approval

### Commit Messages

```bash
# Good commit messages
feat(auth): add multi-role user registration
fix(payment): handle stripe webhook timeout
docs(api): update authentication endpoints
test(ecommerce): add product search integration tests
refactor(taxi): optimize driver matching algorithm
```

This development guide provides everything needed to contribute effectively to the multi-sided
platform. Follow these patterns and practices to maintain code quality and consistency across all
services.
