# Development Workflow Guide

## 🔄 Daily Development Workflow

### 1. Starting Development

```bash
# Pull latest changes
git pull origin main

# Install/update dependencies
pnpm install

# Start development environment
pnpm dev:interactive  # Choose services to run
# or
pnpm dev:frontend     # Start frontend essentials
```

### 2. Writing Code

- **VS Code** will automatically format and lint on save
- **ESLint** will show errors and warnings inline
- **Prettier** will format code automatically
- **TypeScript** will provide type checking

### 3. Before Committing

```bash
# Auto-fix all quality issues
pnpm run quality:fix

# Check everything is good
pnpm run quality:check

# Run tests
pnpm test
```

### 4. Git Workflow

```bash
# Stage changes
git add .

# Commit (pre-commit hooks will run automatically)
git commit -m "feat: add user profile update endpoint"

# Push (pre-push hooks will run automatically)
git push origin feature-branch
```

## 🔧 Code Quality Tools

### Automatic Checks

- **Pre-commit**: Runs linting and formatting on staged files
- **Pre-push**: Runs full quality checks and tests
- **VS Code**: Real-time linting and formatting

### Manual Commands

```bash
# Fix all issues automatically
pnpm run quality:fix

# Check code quality (no fixes)
pnpm run quality:check

# Run comprehensive checks
pnpm run quality:full-check

# Individual tools
pnpm run lint          # ESLint
pnpm run format        # Prettier
pnpm run type-check    # TypeScript
```

## 📝 Code Standards

### TypeScript Rules

- Use `const` over `let` when possible
- Avoid `any` type (warnings will show)
- Use explicit return types for public functions
- Organize imports automatically

### Code Style

- 2 spaces for indentation
- Single quotes for strings
- Trailing commas in objects/arrays
- Max line length: 80 characters
- Semicolons required

### File Organization

```
src/
├── routes/          # API route handlers
├── services/        # Business logic
├── plugins/         # Fastify plugins
├── utils/           # Utility functions
├── types/           # Local type definitions
└── index.ts         # Service entry point
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
// services/auth/src/__tests__/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { buildApp } from '../index';

describe('Auth Service', () => {
  let app: any;

  beforeEach(async () => {
    app = await buildApp();
    await app.ready();
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
  });
});
```

### Running Tests

```bash
# All tests
pnpm test

# Specific service
cd services/auth && pnpm test

# Watch mode
cd services/auth && pnpm test --watch

# Coverage
pnpm test --coverage
```

## 🚀 Deployment Workflow

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Code quality checks passing
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] Documentation updated

### Build Process

```bash
# Build all services
pnpm build

# Build Docker images
docker-compose build

# Run production checks
pnpm run quality:full-check
```

## 🔍 Debugging

### Service Logs

```bash
# View service logs
docker-compose logs -f auth
docker-compose logs -f ecommerce

# View all logs
docker-compose logs -f
```

### Database Debugging

```bash
# Open Prisma Studio
cd services/auth && pnpm prisma studio

# View database
psql -h localhost -p 5433 -U platform_user -d auth_db
```

### API Testing

```bash
# Test endpoints
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health

# Use Swagger UI
open http://localhost:3001/docs
open http://localhost:3002/docs
```

## 🆘 Troubleshooting

### Common Issues

**ESLint errors after pulling changes:**

```bash
pnpm install
pnpm run quality:fix
```

**TypeScript errors:**

```bash
pnpm run type-check
cd services/auth && pnpm prisma generate
```

**Tests failing:**

```bash
# Reset test database
cd services/auth && pnpm prisma migrate reset --force
pnpm test
```

**Git hooks not working:**

```bash
pnpm run prepare  # Reinstall husky hooks
```

### Getting Help

1. Check service logs: `docker-compose logs service-name`
2. Verify health endpoints: `curl http://localhost:3001/health`
3. Check VS Code problems panel
4. Run quality checks: `pnpm run quality:check`
5. Review this documentation

## 📚 Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs/)
