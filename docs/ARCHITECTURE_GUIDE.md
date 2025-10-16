# Multi-Sided Platform Architecture Guide

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (Port 3000)                  │
│                     Fastify + Rate Limiting                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│Auth Service │ │Ecommerce    │ │Payment      │
│Port 3001    │ │Service      │ │Service      │
│             │ │Port 3002    │ │Port 3003    │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│Taxi Service │ │Hotel Service│ │Ads Service  │
│Port 3004    │ │Port 3005    │ │Port 3006    │
└─────────────┘ └─────────────┘ └─────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      ▼
        ┌─────────────────────────────┐
        │     Shared Infrastructure   │
        │  PostgreSQL + Redis + Files │
        └─────────────────────────────┘
```

## 🎯 Design Principles

### 1. **Multi-Sided Platform Architecture**

- **Single User, Multiple Roles**: Users can be customers, vendors, drivers, hosts, and advertisers
  simultaneously
- **Unified Experience**: One account, one wallet, seamless role switching
- **Network Effects**: Cross-service interactions create value (drivers as customers, vendors as
  advertisers)

### 2. **Microservices with Smart Boundaries**

- **Domain-Driven Design**: Services aligned with business domains
- **Shared Database per Service**: Each service owns its data
- **Event-Driven Communication**: Loose coupling via events
- **API Gateway Pattern**: Single entry point with intelligent routing

### 3. **Modern Tech Stack**

- **Node.js 20+** with **TypeScript 5+** for type safety
- **Fastify** for high-performance APIs (3x faster than Express)
- **Prisma ORM** for type-safe database operations
- **Zod** for runtime validation and type inference
- **Redis** for caching, sessions, and real-time features
- **PostgreSQL** with PostGIS for geospatial operations

## 🔧 Service Architecture

### API Gateway (Port 3000)

**Purpose**: Single entry point, routing, rate limiting, authentication

```typescript
// Service routing configuration
const serviceRoutes = {
  '/api/v1/auth/*': 'auth-service:3001',
  '/api/v1/products/*': 'ecommerce-service:3002',
  '/api/v1/vendor/*': 'ecommerce-service:3002',
  '/api/v1/rides/*': 'taxi-service:3004',
  '/api/v1/drivers/*': 'taxi-service:3004',
  '/api/v1/properties/*': 'hotel-service:3005',
  '/api/v1/host/*': 'hotel-service:3005',
  '/api/v1/campaigns/*': 'ads-service:3006',
  '/api/v1/payments/*': 'payment-service:3003',
};
```

**Features**:

- Intelligent load balancing
- Rate limiting per user/IP
- Request/response transformation
- Health check aggregation
- CORS and security headers

### Auth Service (Port 3001)

**Purpose**: Multi-role authentication, user management, JWT tokens

**Database**: `auth_db`

```sql
-- Core tables
users (id, email, password_hash, roles, active_role)
user_roles (user_id, role_id, assigned_at)
customer_profiles (user_id, preferences, addresses)
vendor_profiles (user_id, business_name, commission_rate)
driver_profiles (user_id, license_number, vehicle_info)
host_profiles (user_id, response_rate, verification_status)
advertiser_profiles (user_id, company_name, industry)
```

**Key Features**:

- Multi-role user system
- JWT with refresh tokens
- Role switching within session
- OAuth integration (Google, Apple)
- Profile management for all roles

### Ecommerce Service (Port 3002)

**Purpose**: Multi-vendor marketplace, product catalog, orders

**Database**: `ecommerce_db`

```sql
-- Product management
products (id, vendor_id, name, price, inventory, category)
categories (id, name, parent_id, slug)
product_images (product_id, image_url, sort_order)
product_reviews (product_id, customer_id, rating, review)

-- Shopping & Orders
shopping_carts (customer_id, items, updated_at)
orders (id, customer_id, vendor_id, status, total, shipping_address)
order_items (order_id, product_id, quantity, price)

-- Vendor management
vendor_analytics (vendor_id, period, revenue, orders, views)
```

**Business Logic**:

- **Customer Side**: Product search, cart, orders, reviews
- **Vendor Side**: Product management, order fulfillment, analytics
- **Commission System**: 5-15% based on subscription tier
- **Inventory Management**: Real-time stock tracking

### Payment Service (Port 3003)

**Purpose**: Multi-gateway payments, payouts, subscriptions

**Database**: `payment_db`

```sql
-- Payment processing
payment_methods (user_id, provider, token, is_default)
payments (id, user_id, amount, status, provider, metadata)
payouts (recipient_id, recipient_type, amount, status)

-- Subscriptions
subscription_plans (id, name, price, features, commission_rate)
subscriptions (user_id, plan_id, status, current_period)

-- Multi-sided wallet
wallets (user_id, balance, currency)
wallet_transactions (wallet_id, type, amount, description)
```

**Features**:

- Multi-gateway support (Stripe, PayPal, Flutterwave, Paystack)
- Automated vendor/driver/host payouts
- Subscription billing with tier-based commissions
- Unified wallet across all services

### Taxi Service (Port 3004)

**Purpose**: Ride-hailing platform with real-time matching

**Database**: `taxi_db` (with PostGIS)

```sql
-- Ride management
rides (id, passenger_id, driver_id, status, pickup_location, dropoff_location)
ride_tracking (ride_id, driver_location, timestamp)
fare_calculations (ride_id, base_fare, surge_multiplier, total_fare)

-- Driver management
driver_locations (driver_id, location, timestamp, is_online)
driver_earnings (driver_id, period, total_rides, total_earnings)
vehicle_types (id, name, base_rate, surge_threshold)
```

**Real-time Features**:

- WebSocket connections for live tracking
- Redis geospatial queries for driver matching
- 5-second location updates
- Dynamic pricing with surge multipliers

### Hotel Service (Port 3005)

**Purpose**: Accommodation booking platform

**Database**: `hotel_db` (with PostGIS)

```sql
-- Property management
properties (id, host_id, title, location, property_type, amenities)
property_images (property_id, image_url, sort_order)
property_availability (property_id, date, is_available, price)

-- Booking management
bookings (id, property_id, guest_id, check_in, check_out, status)
booking_payments (booking_id, amount, payment_status)
property_reviews (property_id, guest_id, rating, review)

-- Host analytics
host_earnings (host_id, period, bookings, revenue, occupancy_rate)
```

**Features**:

- Advanced property search with 20+ filters
- Dynamic pricing with seasonal rates
- Instant book vs. request approval
- Host dashboard with analytics

### Advertisement Service (Port 3006)

**Purpose**: Cross-platform advertising with RTB

**Database**: `ads_db`

```sql
-- Campaign management
campaigns (id, advertiser_id, name, budget, status, targeting)
ad_creatives (campaign_id, type, title, image_url, call_to_action)
campaign_analytics (campaign_id, impressions, clicks, conversions, spend)

-- Ad serving
ad_placements (id, service, location, dimensions, cpm_rate)
ad_impressions (placement_id, campaign_id, user_id, timestamp)
ad_clicks (impression_id, timestamp, conversion_value)
```

**Features**:

- Real-time bidding system
- Cross-service ad placement
- Performance tracking and optimization
- Revenue sharing (30% platform commission)

## 🔄 Inter-Service Communication

### Event-Driven Architecture

```typescript
// Event bus for cross-service communication
interface PlatformEvent {
  id: string;
  type: string;
  source: string;
  data: any;
  timestamp: string;
}

// Example events
const events = {
  'user.registered': { userId, email, roles },
  'user.role.switched': { userId, fromRole, toRole },
  'order.created': { orderId, customerId, vendorId, amount },
  'ride.completed': { rideId, driverId, passengerId, fare },
  'booking.confirmed': { bookingId, guestId, hostId, amount },
  'payment.processed': { paymentId, userId, amount, status },
};
```

### Service Discovery

```typescript
// Health check and service registry
const serviceRegistry = {
  auth: { url: 'http://auth:3001', healthy: true, lastCheck: Date.now() },
  ecommerce: { url: 'http://ecommerce:3002', healthy: true, lastCheck: Date.now() },
  payment: { url: 'http://payment:3003', healthy: true, lastCheck: Date.now() },
};
```

## 🗄️ Database Architecture

### Multi-Database Strategy

Each service owns its database for:

- **Data isolation**: Service failures don't affect others
- **Independent scaling**: Scale databases based on service needs
- **Technology flexibility**: Choose optimal database per service
- **Team autonomy**: Teams can evolve schemas independently

### Database Schemas

```sql
-- Separate databases
auth_db          -- User management and authentication
ecommerce_db     -- Products, orders, inventory
taxi_db          -- Rides, drivers, locations (with PostGIS)
hotel_db         -- Properties, bookings (with PostGIS)
payment_db       -- Payments, payouts, subscriptions
notification_db  -- Notifications, preferences
file_db          -- File metadata, uploads
analytics_db     -- Analytics data, metrics
admin_db         -- Admin users, audit logs
messaging_db     -- Conversations, messages
ads_db           -- Campaigns, advertisements
```

### Data Consistency Patterns

- **Eventual Consistency**: Cross-service data via events
- **Saga Pattern**: Distributed transactions for critical flows
- **CQRS**: Separate read/write models for analytics
- **Event Sourcing**: Audit trail for financial transactions

## 🚀 Scalability Architecture

### Horizontal Scaling

```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ecommerce-service
  template:
    spec:
      containers:
        - name: ecommerce
          image: platform/ecommerce:latest
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
```

### Caching Strategy

```typescript
// Redis caching layers
const cachingStrategy = {
  // L1: Application cache (in-memory)
  applicationCache: new Map(),

  // L2: Redis cache (shared)
  redisCache: {
    products: 'TTL: 1 hour',
    userSessions: 'TTL: 15 minutes',
    searchResults: 'TTL: 30 minutes',
    driverLocations: 'TTL: 30 seconds',
  },

  // L3: Database (persistent)
  database: 'PostgreSQL with read replicas',
};
```

### Load Balancing

- **API Gateway**: Round-robin with health checks
- **Database**: Read replicas for queries, master for writes
- **Redis**: Cluster mode for high availability
- **File Storage**: CDN for static assets

## 🔐 Security Architecture

### Authentication & Authorization

```typescript
// JWT token structure
interface JWTPayload {
  sub: string; // User ID
  email: string; // User email
  roles: RoleName[]; // All user roles
  activeRole: RoleName; // Current active role
  iat: number; // Issued at
  exp: number; // Expires at
}

// Role-based access control
const permissions = {
  CUSTOMER: ['products:read', 'orders:create', 'cart:manage'],
  VENDOR: ['products:manage', 'orders:fulfill', 'analytics:view'],
  DRIVER: ['rides:accept', 'location:update', 'earnings:view'],
  HOST: ['properties:manage', 'bookings:manage', 'calendar:update'],
  ADVERTISER: ['campaigns:manage', 'analytics:view', 'billing:view'],
  ADMIN: ['*'], // All permissions
};
```

### Data Protection

- **Encryption at Rest**: Database encryption
- **Encryption in Transit**: TLS 1.3 for all communications
- **PII Protection**: Tokenization of sensitive data
- **Audit Logging**: All financial transactions logged
- **Rate Limiting**: Per-user and per-IP limits

### Security Headers

```typescript
// Fastify security configuration
await fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});
```

## 📊 Monitoring & Observability

### Health Checks

```typescript
// Service health check endpoint
fastify.get('/health', async () => {
  const checks = await Promise.allSettled([checkDatabase(), checkRedis(), checkExternalAPIs()]);

  return {
    status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks: checks.map(c => ({
      name: c.name,
      status: c.status,
      responseTime: c.responseTime,
    })),
  };
});
```

### Logging Strategy

```typescript
// Structured logging with Pino
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: label => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['password', 'token', 'creditCard'], // PII protection
});

// Request logging
fastify.addHook('onRequest', async request => {
  request.log.info(
    {
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      userId: request.user?.sub,
    },
    'Incoming request'
  );
});
```

### Metrics Collection

- **Application Metrics**: Response times, error rates, throughput
- **Business Metrics**: Orders, rides, bookings, revenue
- **Infrastructure Metrics**: CPU, memory, disk, network
- **Custom Metrics**: Conversion rates, user engagement, churn

## 🔄 Deployment Architecture

### Container Strategy

```dockerfile
# Multi-stage build for production optimization
FROM node:20-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

FROM base AS dependencies
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:20-alpine AS production
RUN npm install -g pnpm
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Environment Configuration

```yaml
# Docker Compose for development
version: '3.8'
services:
  gateway:
    build: ./services/gateway
    ports: ['3000:3000']
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://redis:6379
    depends_on: [redis]

  auth:
    build: ./services/auth
    ports: ['3001:3001']
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/auth_db
      - JWT_SECRET=${JWT_SECRET}
    depends_on: [postgres, redis]
```

### CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: Deploy Platform
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

## 🎯 Performance Optimization

### Database Optimization

```sql
-- Indexing strategy
CREATE INDEX CONCURRENTLY idx_products_category_price ON products(category, price);
CREATE INDEX CONCURRENTLY idx_orders_customer_created ON orders(customer_id, created_at);
CREATE INDEX CONCURRENTLY idx_rides_driver_status ON rides(driver_id, status);

-- Geospatial indexes for location-based queries
CREATE INDEX CONCURRENTLY idx_driver_locations_gist ON driver_locations USING GIST(location);
CREATE INDEX CONCURRENTLY idx_properties_location_gist ON properties USING GIST(location);
```

### Caching Patterns

```typescript
// Multi-level caching
class CacheManager {
  async get(key: string) {
    // L1: Memory cache
    let value = this.memoryCache.get(key);
    if (value) return value;

    // L2: Redis cache
    value = await this.redis.get(key);
    if (value) {
      this.memoryCache.set(key, value, 60); // 1 minute TTL
      return JSON.parse(value);
    }

    // L3: Database
    value = await this.database.query(key);
    if (value) {
      await this.redis.setex(key, 3600, JSON.stringify(value)); // 1 hour TTL
      this.memoryCache.set(key, value, 60);
    }

    return value;
  }
}
```

### API Optimization

- **Response Compression**: Gzip/Brotli compression
- **Pagination**: Cursor-based pagination for large datasets
- **Field Selection**: GraphQL-style field selection
- **Batch Operations**: Bulk operations for efficiency
- **Connection Pooling**: Database connection optimization

This architecture provides a solid foundation for a scalable, maintainable multi-sided platform that
can handle millions of users across multiple business domains while maintaining high performance and
reliability.
