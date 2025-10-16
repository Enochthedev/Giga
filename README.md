# Multi-Sided Platform

A modern, scalable multi-sided marketplace platform supporting ecommerce, taxi, hotel, and
advertising services with unified user management and multi-role support.

## 🏗️ Architecture

### Services

- **Gateway** (Port 3000) - API Gateway with routing and load balancing
- **Auth** (Port 3001) - Multi-role authentication and user management
- **Core** (Port 3002) - Will become ecommerce service
- **Payment** (Port 3003) - Multi-gateway payment processing
- **Taxi** (Port 3004) - Ride-hailing service
- **Hotel** (Port 3005) - Accommodation booking service
- **Ads** (Port 3006) - Advertisement platform

### Tech Stack

- **Runtime**: Node.js 20+ with TypeScript 5+
- **Framework**: Fastify (3x faster than Express)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for sessions and real-time features
- **Validation**: Zod for runtime type safety
- **Testing**: Vitest
- **Package Manager**: pnpm (faster than npm/yarn)
- **Containerization**: Docker with multi-stage builds

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Installation

1. **Clone and run setup**

```bash
git clone <repository-url>
cd multi-sided-platform
chmod +x scripts/setup.sh
./scripts/setup.sh
```

2. **Start all services in development**

```bash
# From root directory
pnpm dev
```

**Note**: The setup script will:

- Install all dependencies
- Start PostgreSQL on port 5433 (to avoid conflicts)
- Start Redis on port 6379
- Setup all databases with proper schemas
- Build shared TypeScript types
- Create environment configuration

### Using Docker (Alternative)

```bash
# Start all services (after running setup.sh)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Important**: PostgreSQL runs on port 5433 to avoid conflicts with existing installations.

## 📋 API Endpoints

### Authentication Service (Port 3001)

```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login user
POST   /api/v1/auth/switch-role  - Switch user role
POST   /api/v1/auth/refresh      - Refresh access token
POST   /api/v1/auth/logout       - Logout user
GET    /api/v1/auth/profile      - Get user profile
```

### Gateway (Port 3000)

All API requests should go through the gateway which routes to appropriate services:

```
/api/v1/auth/*        -> Auth Service
/api/v1/products/*    -> Ecommerce Service
/api/v1/vendor/*      -> Ecommerce Service
/api/v1/rides/*       -> Taxi Service
/api/v1/properties/*  -> Hotel Service
/api/v1/campaigns/*   -> Ads Service
```

## 🔐 Multi-Role System

Users can have multiple roles simultaneously:

- **CUSTOMER** - Buy products, book rides/hotels
- **VENDOR** - Sell products on marketplace
- **DRIVER** - Provide ride services
- **HOST** - List properties for booking
- **ADVERTISER** - Create ad campaigns
- **ADMIN** - Platform administration

### Role Switching

```bash
# Switch to vendor role
curl -X POST http://localhost:3000/api/v1/auth/switch-role \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"targetRole": "VENDOR"}'
```

## 🗄️ Database Schema

The platform uses separate databases for each service:

- `auth_db` - User authentication and profiles
- `ecommerce_db` - Products, orders, inventory
- `taxi_db` - Rides, drivers, locations
- `hotel_db` - Properties, bookings
- `payment_db` - Payments, payouts, subscriptions
- `notification_db` - Notifications
- `file_db` - File uploads
- `analytics_db` - Analytics data
- `admin_db` - Admin operations
- `messaging_db` - Chat and support
- `ads_db` - Advertisement campaigns

## 💰 Revenue Model

### Commission Structure

- **Ecommerce**: 5-15% from vendors (tier-based)
- **Taxi**: 20-25% from drivers (surge pricing)
- **Hotel**: 3% from guests + 12% from hosts
- **Ads**: 30% of ad spend

### Subscription Tiers

Premium features available for all provider roles with reduced commission rates.

## 🔧 Development

### Project Structure

```
├── services/
│   ├── gateway/          # API Gateway
│   ├── auth/            # Authentication service
│   └── core/            # Core business logic (will split)
├── shared/
│   └── types/           # Shared TypeScript types
├── scripts/             # Database and deployment scripts
└── docker-compose.yml   # Development environment
```

### Adding New Services

1. Create service directory in `services/`
2. Add service configuration to `docker-compose.yml`
3. Update gateway routing in `services/gateway/src/index.ts`
4. Add shared types in `shared/types/src/`

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific service
cd services/auth
pnpm test
```

### Database Migrations

```bash
cd services/auth
pnpm prisma migrate dev --name "migration_name"
pnpm prisma generate
```

## 🚀 Deployment

### Production Build

```bash
# Build all services
pnpm build

# Build Docker images
docker-compose -f docker-compose.prod.yml build
```

### Environment Variables

Create `.env` files for each service with production values:

- Database URLs
- JWT secrets
- Payment gateway keys
- Redis configuration

## 📊 Monitoring

- Health checks available at `/health` for each service
- Structured logging with Pino
- Error tracking and performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
