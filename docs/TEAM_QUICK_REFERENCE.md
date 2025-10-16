# Team Quick Reference

## 🚀 Getting Started

### Setup

```bash
./scripts/setup.sh  # One-time setup
pnpm dev           # Start all services
```

### Service URLs

- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001 | [Docs](http://localhost:3001/docs)
- **Core Service**: http://localhost:3002
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6379

## 📚 Documentation & Mock Data

### Swagger Documentation

- **Auth Service**: http://localhost:3001/docs
- **Gateway**: http://localhost:3000/docs (when implemented)

### Mock Data Location

```
mock-data/
├── auth/           # Users, registration, login examples
├── ecommerce/      # Products, orders, vendors
├── taxi/           # Rides, drivers (Phase 3)
├── hotel/          # Properties, bookings (Phase 3)
└── payment/        # Payments, methods (Phase 2)
```

## 🧪 Testing Endpoints

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "roles": ["CUSTOMER"],
    "acceptTerms": true
  }'
```

### Login User

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Switch Role

```bash
curl -X POST http://localhost:3000/api/v1/auth/switch-role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetRole": "VENDOR"}'
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890"
  }'
```

### Change Password

```bash
curl -X PUT http://localhost:3000/api/v1/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldPassword123",
    "newPassword": "newSecurePassword456!"
  }'
```

### Email Verification

```bash
# Send verification email
curl -X POST http://localhost:3000/api/v1/auth/send-verification-email \
  -H "Authorization: Bearer YOUR_TOKEN"

# Verify email with token
curl -X POST http://localhost:3000/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_VERIFICATION_TOKEN"}'
```

## 📝 Development Guidelines

### Adding New Endpoints

1. **Create endpoint** with full Swagger schema
2. **Add mock data** examples in `mock-data/`
3. **Test with Swagger UI** at `/docs`
4. **Update documentation** if needed

### Mock Data Standards

- Use realistic data (names, addresses, prices)
- Maintain consistent ID formats
- Include edge cases and error scenarios
- Reference mock data in Swagger examples

### Documentation Requirements

- Every endpoint needs Swagger documentation
- Include request/response examples
- Document all error codes
- Use mock data for examples

## 🔧 Common Commands

### Database

```bash
cd services/auth
pnpm prisma studio    # Database GUI
pnpm prisma generate  # Generate client
pnpm prisma db push   # Push schema changes
```

### Development

```bash
pnpm dev              # Start all services
pnpm test             # Run all tests
pnpm build            # Build for production

# Code Quality
pnpm run quality:fix        # Auto-fix linting and formatting
pnpm run quality:check      # Check code quality (no fixes)
pnpm run quality:full-check # Comprehensive quality check
pnpm run lint               # Fix ESLint issues
pnpm run format             # Format code with Prettier
pnpm run type-check         # TypeScript type checking
```

### Docker

```bash
docker-compose up -d     # Start infrastructure
docker-compose logs -f   # View logs
docker-compose down      # Stop all services
```

## 🎯 Current Implementation Status

### ✅ Phase 1 Complete

- Multi-role authentication system
- API Gateway with routing
- Database schemas for all services
- Swagger documentation setup
- Mock data structure

### 🔄 Phase 2 In Progress

- Ecommerce service implementation
- Payment service with Stripe
- Vendor dashboard
- Shopping cart with Redis

### 🛒 Ecommerce API Examples

#### Search Products

```bash
curl "http://localhost:3000/api/v1/products?q=iPhone&category=electronics&minPrice=500&maxPrice=1500"
```

#### Get Single Product

```bash
curl "http://localhost:3000/api/v1/products/clr123product1"
```

#### Get Categories

```bash
curl "http://localhost:3000/api/v1/products/categories"
```

#### Get Shopping Cart

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/v1/cart"
```

#### Add to Cart

```bash
curl -X POST http://localhost:3000/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": "clr123product1", "quantity": 2}'
```

#### Update Cart Item

```bash
curl -X PUT http://localhost:3000/api/v1/cart/items/item_123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

#### Remove Cart Item

```bash
curl -X DELETE http://localhost:3000/api/v1/cart/items/item_123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Clear Cart

```bash
curl -X DELETE http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 📋 Next Tasks

1. ✅ Ecommerce service with product catalog
2. ✅ Shopping cart with Redis
3. ✅ Swagger documentation complete
4. 🔄 Implement vendor dashboard
5. 🔄 Set up payment processing
6. 🔄 Build order management

## 🆘 Troubleshooting

### Port Conflicts

- PostgreSQL: 5433 (not 5432)
- Redis: 6379
- Services: 3000-3006

### Common Issues

- **Database connection**: Check PostgreSQL is running on 5433
- **Redis connection**: Ensure Redis is running
- **Missing dependencies**: Run `pnpm install`
- **Prisma issues**: Run `pnpm prisma generate`

### Getting Help

1. Check service logs: `docker-compose logs service-name`
2. Verify health: `curl http://localhost:3001/health`
3. Check Swagger docs for API examples
4. Review mock data for expected formats
