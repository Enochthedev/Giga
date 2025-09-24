# Service Orchestration Guide

This document explains how to run and manage all platform services, both currently and as the platform evolves.

## Current Service Architecture

### 🏗️ **Infrastructure Services**
- **PostgreSQL** (Port 5433) - Primary database
- **Redis** (Port 6380) - Caching and queues

### 🚀 **Application Services**
- **API Gateway** (Port 3000) - Request routing and load balancing
- **Auth Service** (Port 3001) - Authentication and authorization
- **Ecommerce Service** (Port 3002) - Product catalog and orders
- **Hotel Service** (Port 3003) - Hotel bookings and management
- **Notification Service** (Port 3004) - Multi-channel notifications

## Running Services

### 🎯 **Quick Start - All Services**

```bash
# Start infrastructure and all services
./start-services.sh

# Or using Docker Compose
docker-compose up -d

# Or using pnpm workspaces
pnpm dev
```

### 🔧 **Development Mode Options**

#### 1. Interactive Development Script
```bash
./scripts/dev-interactive.sh
```

This provides a menu with options:
- **All services** - Full platform
- **Frontend essentials** - Gateway + Auth + Core services
- **Ecommerce development** - Gateway + Auth + Ecommerce + Notification
- **Hotel development** - Gateway + Auth + Hotel + Notification
- **Individual services** - Run specific services only

#### 2. Individual Service Development
```bash
# Gateway only
cd services/gateway && pnpm dev

# Auth service only
cd services/auth && pnpm dev

# Ecommerce service only
cd services/ecommerce && pnpm dev

# Hotel service only
cd services/hotel && pnpm dev

# Notification service only
cd services/notification && pnpm dev
```

#### 3. Service Groups
```bash
# Core services (Gateway + Auth)
(cd services/gateway && pnpm dev) &
(cd services/auth && pnpm dev) &

# Ecommerce stack (Core + Ecommerce + Notification)
(cd services/gateway && pnpm dev) &
(cd services/auth && pnpm dev) &
(cd services/ecommerce && pnpm dev) &
(cd services/notification && pnpm dev) &

# Hotel stack (Core + Hotel + Notification)
(cd services/gateway && pnpm dev) &
(cd services/auth && pnpm dev) &
(cd services/hotel && pnpm dev) &
(cd services/notification && pnpm dev) &
```

## Service URLs and Documentation

### 🌐 **Service Endpoints**
| Service | URL | Documentation | Health Check |
|---------|-----|---------------|--------------|
| API Gateway | http://localhost:3000 | - | /health |
| Auth Service | http://localhost:3001 | /docs | /health |
| Ecommerce Service | http://localhost:3002 | /docs | /health |
| Hotel Service | http://localhost:3003 | /api-docs | /health |
| Notification Service | http://localhost:3004 | /api-docs | /health |

### 🗄️ **Infrastructure**
| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | localhost:5433 | user: platform_user, pass: platform_pass |
| Redis | localhost:6380 | No auth (development) |

## Future Service Architecture

As the platform grows, here's how the service orchestration will evolve:

### 📈 **Phase 2 Services** (Coming Soon)
- **Payment Service** (Port 3005) - Payment processing and billing
- **Upload Service** (Port 3006) - File upload and media management
- **Analytics Service** (Port 3007) - Business intelligence and reporting

### 🚀 **Phase 3 Services** (Planned)
- **Taxi Service** (Port 3008) - Ride-hailing functionality
- **Admin Dashboard Service** (Port 3009) - Administrative interface
- **Real-time Service** (Port 3010) - WebSocket connections and live updates

### 🔮 **Future Architecture with Gateway**

Once the API Gateway is fully implemented, the architecture will look like:

```
┌─────────────────┐
│   Load Balancer │ (Port 80/443)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   API Gateway   │ (Port 3000)
│  - Routing      │
│  - Rate Limiting│
│  - Auth Proxy   │
│  - Load Balance │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼───┐   ┌───▼────────────────────────────┐
│ Auth  │   │        Business Services        │
│Service│   │                                │
│(3001) │   │ ┌─────────┐ ┌─────────────────┐│
└───────┘   │ │Ecommerce│ │   Notification  ││
            │ │ (3002)  │ │    (3004)       ││
            │ └─────────┘ └─────────────────┘│
            │ ┌─────────┐ ┌─────────────────┐│
            │ │ Hotel   │ │    Payment      ││
            │ │ (3003)  │ │    (3005)       ││
            │ └─────────┘ └─────────────────┘│
            │ ┌─────────┐ ┌─────────────────┐│
            │ │ Upload  │ │   Analytics     ││
            │ │ (3006)  │ │    (3007)       ││
            │ └─────────┘ └─────────────────┘│
            └────────────────────────────────┘
```

## Service Dependencies

### 🔗 **Current Dependencies**
```
Infrastructure (PostgreSQL + Redis)
    ↓
Auth Service (3001)
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
Ecommerce (3002)  Hotel (3003)     Gateway (3000)
    ↓                 ↓                 ↓
Notification (3004) ←─┴─────────────────┘
```

### 📊 **Service Communication**
- **Gateway** → Routes to all services
- **Auth** → Validates tokens for all services
- **Ecommerce/Hotel** → Sends notifications via Notification Service
- **All Services** → Use Redis for caching and queues
- **All Services** → Use PostgreSQL for data persistence

## Testing Services

### 🧪 **Health Checks**
```bash
# Test all services
./test-services.sh

# Individual health checks
curl http://localhost:3000/health  # Gateway
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Ecommerce
curl http://localhost:3003/health  # Hotel
curl http://localhost:3004/health  # Notification
```

### 🔍 **Service Status Monitoring**
```bash
# Check running processes
ps aux | grep "pnpm dev"

# Check Docker containers
docker-compose ps

# Check port usage
lsof -i :3000-3010
```

## Environment Configuration

### 🔧 **Development Environment**
```bash
# Copy environment template
cp .env.example .env

# Service-specific environments
cp services/auth/.env.example services/auth/.env
cp services/ecommerce/.env.example services/ecommerce/.env
cp services/hotel/.env.example services/hotel/.env
cp services/notification/.env.example services/notification/.env
```

### 🐳 **Docker Environment**
All environment variables are configured in `docker-compose.yml` for containerized deployment.

## Scaling and Production

### 🚀 **Production Deployment**
```bash
# Build all services
pnpm build

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d

# Or deploy individual services
docker build -t platform/auth services/auth
docker build -t platform/ecommerce services/ecommerce
docker build -t platform/hotel services/hotel
docker build -t platform/notification services/notification
```

### 📈 **Horizontal Scaling**
With the API Gateway, services can be scaled independently:

```yaml
# docker-compose.scale.yml example
services:
  ecommerce:
    deploy:
      replicas: 3
  notification:
    deploy:
      replicas: 2
  hotel:
    deploy:
      replicas: 2
```

## Troubleshooting

### 🔧 **Common Issues**

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   lsof -i :3000-3010
   
   # Kill processes on specific ports
   kill -9 $(lsof -t -i:3001)
   ```

2. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   docker-compose ps postgres
   
   # Restart database
   docker-compose restart postgres
   ```

3. **Service Dependencies**
   ```bash
   # Start services in order
   docker-compose up -d postgres redis
   sleep 10
   docker-compose up -d auth
   sleep 5
   docker-compose up -d ecommerce hotel notification
   docker-compose up -d gateway
   ```

### 📋 **Service Logs**
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth
docker-compose logs -f notification

# View development logs
tail -f services/auth/logs/app.log
tail -f services/notification/logs/app.log
```

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `./start-services.sh` | Start all services in development mode |
| `./test-services.sh` | Test all service health endpoints |
| `./scripts/dev-interactive.sh` | Interactive service selection menu |
| `./scripts/setup.sh` | Initial platform setup |
| `./scripts/seed-all-services.sh` | Seed all databases with test data |

## Next Steps

1. **Complete Gateway Implementation** - Full request routing and load balancing
2. **Add Payment Service** - Payment processing integration
3. **Add Upload Service** - File and media management
4. **Add Analytics Service** - Business intelligence and reporting
5. **Implement Service Mesh** - Advanced service communication and monitoring
6. **Add Monitoring Stack** - Prometheus, Grafana, and alerting
7. **Implement CI/CD Pipeline** - Automated testing and deployment
