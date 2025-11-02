# CI/CD Setup Guide

This document explains the complete CI/CD pipeline for the Giga platform, including GitHub Actions workflows, required secrets, and deployment strategies.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflows](#workflows)
3. [Required Secrets](#required-secrets)
4. [Setup Instructions](#setup-instructions)
5. [Deployment Targets](#deployment-targets)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Giga platform uses GitHub Actions for continuous integration and deployment. The pipeline includes:

- **CI Pipeline**: Lint, test, and build all microservices
- **Docker Pipeline**: Build and push Docker images to registry
- **Supabase Pipeline**: Deploy Edge Functions to Supabase
- **Database Pipeline**: Manage Prisma migrations
- **Deployment Pipeline**: Deploy services to staging/production

### Pipeline Flow

```
Code Push → CI (Lint/Test/Build) → Docker Build → Deploy to Staging → Deploy to Production
                                                                  ↓
                                              Database Migrations (parallel)
                                                                  ↓
                                              Supabase Edge Functions (parallel)
```

---

## 🔄 Workflows

### 1. CI - Lint, Test, and Build (`ci.yml`)

**Triggers:**
- Push to `main`, `develop`, `feature/**` branches
- Pull requests to `main`, `develop`

**What it does:**
1. Detects which services changed using path filters
2. Runs ESLint, TypeScript type checking, Prettier
3. Runs tests for changed services (with PostgreSQL + Redis)
4. Builds services and uploads artifacts

**Key Features:**
- ✅ Smart change detection (only tests changed services)
- ✅ Matrix strategy for parallel testing
- ✅ Real database testing with PostgreSQL + Redis
- ✅ Build artifact caching

### 2. Build and Push Docker Images (`docker-build.yml`)

**Triggers:**
- Push to `main`, `develop` (when service code changes)
- Pull requests to `main`
- Manual trigger via workflow_dispatch

**What it does:**
1. Detects changed services
2. Builds Docker images with multi-stage builds
3. Pushes images to GitHub Container Registry (ghcr.io)
4. Runs Trivy security scans
5. Uploads scan results to GitHub Security tab

**Image Naming:**
```
ghcr.io/<your-org>/giga-gateway:main
ghcr.io/<your-org>/giga-auth:develop
ghcr.io/<your-org>/giga-hotel:sha-abc123
```

**Key Features:**
- ✅ Multi-architecture support (amd64, arm64)
- ✅ Layer caching for faster builds
- ✅ Security vulnerability scanning
- ✅ Semantic versioning support

### 3. Deploy Supabase Edge Functions (`supabase-deploy.yml`)

**Triggers:**
- Push to `main`, `develop` (when `supabase/functions/` changes)
- Manual trigger with environment selection

**What it does:**
1. Detects which Edge Functions changed
2. Validates Deno syntax
3. Runs function tests (if available)
4. Deploys to Supabase staging
5. Deploys to Supabase production (on `main` branch)
6. Sets function secrets
7. Runs smoke tests

**Deployed Functions:**
- `admin-dashboard-stats`
- `apply-for-role`, `apply-vendor`
- `create-payment-intent`, `stripe-webhook`
- `process-image`, `send-notification`
- `send-order-confirmation`, `send-sms`
- `queue-notification`, `process-notification-queue`
- And more...

**Key Features:**
- ✅ Incremental deployment (only changed functions)
- ✅ Environment-specific secrets
- ✅ Smoke tests after deployment
- ✅ Deployment summary in GitHub UI

### 4. Database Migrations (`database-migrations.yml`)

**Triggers:**
- Push to `main`, `develop` (when `services/*/prisma/**` changes)
- Manual trigger with service and environment selection

**What it does:**
1. Detects which Prisma schemas changed
2. Generates migration preview for PRs
3. Validates migrations on clean database
4. Creates database backups
5. Deploys migrations to staging
6. Deploys migrations to production (on `main` branch)
7. Verifies migration status

**Services with Databases:**
- `auth` - User authentication and profiles
- `hotel` - Hotel bookings and properties
- `taxi` - Ride-hailing data
- `payment` - Payment transactions
- `notification` - Notification history
- `upload` - File metadata

**Key Features:**
- ✅ Sequential migration deployment (no race conditions)
- ✅ Automatic database backups (configure your backup strategy)
- ✅ Migration validation before deployment
- ✅ Post-migration verification

### 5. Deploy Services (`deploy.yml`)

**Triggers:**
- Manual trigger with environment and service selection
- Auto-deploy after successful CI + Docker build

**What it does:**
1. Determines deployment environment and services
2. Deploys to Kubernetes/ECS/Cloud Run/VPS (configurable)
3. Runs post-deployment health checks
4. Runs integration tests
5. Automatic rollback on failure (production only)

**Deployment Targets:**
- **Kubernetes** - Standard K8s deployment with rollout
- **AWS ECS** - Task definition update and service deployment
- **Google Cloud Run** - Serverless container deployment
- **VPS Docker** - SSH deployment with docker-compose

**Key Features:**
- ✅ Multi-cloud support
- ✅ Health check verification
- ✅ Automatic rollback on failure
- ✅ Blue-green deployment ready

---

## 🔐 Required Secrets

Set these secrets in **GitHub Settings → Secrets and variables → Actions**.

### General Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `GITHUB_TOKEN` | Auto-provided by GitHub | (automatic) |

### Supabase Secrets

#### Common
| Secret Name | Description |
|-------------|-------------|
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI access token |
| `ALGOLIA_APP_ID` | Algolia application ID (for search) |
| `SENDGRID_API_KEY` | SendGrid API key (for emails) |

#### Staging
| Secret Name | Description |
|-------------|-------------|
| `SUPABASE_STAGING_PROJECT_ID` | Staging project ref (e.g., `abc123def456`) |
| `SUPABASE_ANON_KEY_STAGING` | Staging anonymous key |
| `STRIPE_SECRET_KEY_STAGING` | Stripe test key |
| `TWILIO_ACCOUNT_SID_STAGING` | Twilio test SID |
| `TWILIO_AUTH_TOKEN_STAGING` | Twilio test token |
| `ALGOLIA_API_KEY_STAGING` | Algolia staging key |

#### Production
| Secret Name | Description |
|-------------|-------------|
| `SUPABASE_PROD_PROJECT_ID` | Production project ref |
| `SUPABASE_ANON_KEY_PROD` | Production anonymous key |
| `STRIPE_SECRET_KEY_PROD` | Stripe live key |
| `TWILIO_ACCOUNT_SID_PROD` | Twilio production SID |
| `TWILIO_AUTH_TOKEN_PROD` | Twilio production token |
| `ALGOLIA_API_KEY_PROD` | Algolia production key |

### Database Secrets (per service, per environment)

**Format:** `<SERVICE>_DATABASE_URL_<ENV>`

#### Staging
- `AUTH_DATABASE_URL_STAGING`
- `HOTEL_DATABASE_URL_STAGING`
- `TAXI_DATABASE_URL_STAGING`
- `PAYMENT_DATABASE_URL_STAGING`
- `NOTIFICATION_DATABASE_URL_STAGING`
- `UPLOAD_DATABASE_URL_STAGING`

#### Production
- `AUTH_DATABASE_URL_PROD`
- `HOTEL_DATABASE_URL_PROD`
- `TAXI_DATABASE_URL_PROD`
- `PAYMENT_DATABASE_URL_PROD`
- `NOTIFICATION_DATABASE_URL_PROD`
- `UPLOAD_DATABASE_URL_PROD`

**Format:**
```
postgresql://user:password@host:5432/database_name
```

### Deployment Secrets (choose based on your target)

#### Kubernetes
| Secret Name | Description |
|-------------|-------------|
| `KUBE_CONFIG` | Base64-encoded kubeconfig file |
| `K8S_CLUSTER_STAGING` | Staging cluster name |
| `K8S_CLUSTER_PROD` | Production cluster name |

#### AWS ECS
| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `AWS_REGION` | AWS region (e.g., `us-east-1`) |

#### Google Cloud Run
| Secret Name | Description |
|-------------|-------------|
| `GCP_CREDENTIALS` | Service account JSON |
| `GCP_REGION` | GCP region (e.g., `us-central1`) |

#### VPS Docker
| Secret Name | Description |
|-------------|-------------|
| `VPS_HOST` | VPS IP or hostname |
| `VPS_USERNAME` | SSH username |
| `VPS_SSH_KEY` | Private SSH key |

### Endpoint URLs
| Secret Name | Description |
|-------------|-------------|
| `STAGING_BASE_URL` | Staging API base URL |
| `PROD_BASE_URL` | Production API base URL |

### Configuration Variables

Set these in **GitHub Settings → Secrets and variables → Variables**.

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `DEPLOY_TARGET` | `kubernetes` \| `aws-ecs` \| `gcp-run` \| `vps-docker` | Choose deployment target |

---

## ⚙️ Setup Instructions

### Step 1: Fork/Clone Repository

```bash
git clone https://github.com/your-org/giga.git
cd giga
```

### Step 2: Set Up Supabase

1. Create two Supabase projects (staging & production)
2. Get project IDs from dashboard
3. Get access token: Settings → Access Tokens → Generate new token
4. Add secrets to GitHub

### Step 3: Set Up Database Secrets

For **managed PostgreSQL** (recommended):

```bash
# Staging databases
AUTH_DATABASE_URL_STAGING=postgresql://user:pass@staging-db.example.com:5432/auth_db
HOTEL_DATABASE_URL_STAGING=postgresql://user:pass@staging-db.example.com:5432/hotel_db
# ... repeat for all services

# Production databases
AUTH_DATABASE_URL_PROD=postgresql://user:pass@prod-db.example.com:5432/auth_db
HOTEL_DATABASE_URL_PROD=postgresql://user:pass@prod-db.example.com:5432/hotel_db
# ... repeat for all services
```

### Step 4: Configure Deployment Target

Choose your deployment platform and set the `DEPLOY_TARGET` variable:

#### Option A: Kubernetes

```bash
# Set variable
DEPLOY_TARGET=kubernetes

# Add secrets
KUBE_CONFIG=<base64-encoded-kubeconfig>
K8S_CLUSTER_STAGING=giga-staging
K8S_CLUSTER_PROD=giga-production
```

Create Kubernetes deployments:
```bash
kubectl apply -f k8s/staging/ -n giga-staging
kubectl apply -f k8s/production/ -n giga-production
```

#### Option B: AWS ECS

```bash
# Set variable
DEPLOY_TARGET=aws-ecs

# Add secrets
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

#### Option C: Google Cloud Run

```bash
# Set variable
DEPLOY_TARGET=gcp-run

# Add secrets
GCP_CREDENTIALS=<service-account-json>
GCP_REGION=us-central1
```

#### Option D: VPS with Docker

```bash
# Set variable
DEPLOY_TARGET=vps-docker

# Add secrets
VPS_HOST=123.456.789.0
VPS_USERNAME=deployer
VPS_SSH_KEY=<private-key>
```

On your VPS:
```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Clone repository
git clone https://github.com/your-org/giga.git /opt/giga
cd /opt/giga
```

### Step 5: Enable Workflows

1. Go to **Actions** tab in GitHub
2. Click "I understand my workflows, go ahead and enable them"
3. Workflows will trigger on next push

### Step 6: Test CI Pipeline

```bash
# Create a test branch
git checkout -b test-ci

# Make a small change
echo "# Test" >> README.md

# Push and watch CI run
git add .
git commit -m "test: CI pipeline"
git push -u origin test-ci
```

### Step 7: Manual Deployment Test

1. Go to **Actions** tab
2. Select "Deploy Services" workflow
3. Click "Run workflow"
4. Select:
   - Environment: `staging`
   - Services: `gateway` (start with one service)
5. Monitor deployment

---

## 🎯 Deployment Targets

### Kubernetes (Recommended for Production)

**Pros:**
- ✅ Auto-scaling, self-healing
- ✅ Rolling updates with zero downtime
- ✅ Industry standard

**Setup:**
```yaml
# k8s/gateway-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: gateway
        image: ghcr.io/your-org/giga-gateway:latest
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### AWS ECS (Managed Containers)

**Pros:**
- ✅ Fully managed by AWS
- ✅ Good AWS ecosystem integration
- ✅ Fargate for serverless containers

**Setup:**
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name giga-production

# Create task definitions for each service
# (automated in workflow)
```

### Google Cloud Run (Serverless)

**Pros:**
- ✅ Pay-per-request pricing
- ✅ Auto-scaling to zero
- ✅ Simple deployment

**Cons:**
- ⚠️ Limited to HTTP/HTTPS
- ⚠️ Cold start latency

### VPS with Docker (Simple/Budget)

**Pros:**
- ✅ Full control
- ✅ Low cost ($5-20/month)
- ✅ Simple setup

**Cons:**
- ⚠️ Manual scaling
- ⚠️ No built-in redundancy

**Recommended VPS Specs:**
- **Staging**: 2 CPU, 4GB RAM
- **Production**: 4 CPU, 8GB RAM (or multiple servers with load balancer)

---

## 🐛 Troubleshooting

### CI Pipeline Issues

#### Tests Failing Locally But Pass in CI
```bash
# Ensure you're using same Node version
nvm use 20

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Run tests with same environment as CI
NODE_ENV=test pnpm test
```

#### Database Connection Issues in Tests
```bash
# Check if PostgreSQL is running on correct port
psql -h localhost -p 5432 -U platform_user -d platform_db

# CI uses port 5432, local might use 5433
# Update DATABASE_URL in test environment
```

### Docker Build Issues

#### Image Too Large
```dockerfile
# Use multi-stage builds
FROM node:20-alpine AS builder
# ... build steps

FROM node:20-alpine
COPY --from=builder /app/dist ./dist
# Only copy production dependencies
```

#### Build Cache Not Working
```yaml
# Ensure cache keys are consistent
cache-from: type=gha
cache-to: type=gha,mode=max
```

### Supabase Deployment Issues

#### Function Deployment Fails
```bash
# Test function locally first
supabase functions serve create-payment-intent

# Check Deno syntax
deno check supabase/functions/create-payment-intent/index.ts
```

#### Secrets Not Set
```bash
# Verify secrets are set
supabase secrets list --project-ref your-project-id

# Set missing secret
supabase secrets set MY_SECRET=value --project-ref your-project-id
```

### Database Migration Issues

#### Migration Fails in Production
```bash
# Always test migration in staging first
# Check migration status
pnpm prisma migrate status

# If stuck, reset (STAGING ONLY!)
pnpm prisma migrate reset

# For production, manual intervention may be needed
```

#### Database Schema Out of Sync
```bash
# Pull current schema from database
pnpm prisma db pull

# Generate new migration
pnpm prisma migrate dev --name fix-schema-sync
```

### Deployment Issues

#### Service Won't Start
```bash
# Check logs (Kubernetes)
kubectl logs deployment/gateway -n giga-production

# Check logs (Docker)
docker logs giga-gateway

# Common issues:
# - Missing environment variables
# - Database connection string incorrect
# - Port already in use
```

#### Health Check Failing
```bash
# Test health endpoint directly
curl http://your-service/health

# Check if service is listening
netstat -tlnp | grep :3000

# Verify environment variables are set
printenv | grep DATABASE_URL
```

---

## 📊 Monitoring & Alerts

### Recommended Tools

1. **GitHub Actions Notifications**
   - Enable email/Slack notifications in GitHub Settings

2. **Application Monitoring**
   - Sentry for error tracking
   - New Relic / DataDog for APM
   - Prometheus + Grafana for metrics

3. **Log Aggregation**
   - CloudWatch (AWS)
   - Stackdriver (GCP)
   - Loki + Grafana (self-hosted)

### Health Check Endpoints

All services expose `/health`:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "service": "gateway",
  "version": "1.0.0",
  "uptime": 3600
}
```

---

## 🚀 Next Steps

1. **Set up all required secrets** (see checklist above)
2. **Test CI pipeline** with a test branch
3. **Deploy to staging** manually first
4. **Set up monitoring** (Sentry, logs, metrics)
5. **Configure backup strategy** for databases
6. **Enable auto-deployment** on main/develop branches

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes Deployment Guide](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

---

## 📝 Maintenance Checklist

### Weekly
- [ ] Review failed workflows
- [ ] Check security scan results
- [ ] Monitor disk usage (databases, logs)

### Monthly
- [ ] Update dependencies (`pnpm update`)
- [ ] Review and rotate secrets
- [ ] Test disaster recovery process

### Quarterly
- [ ] Audit access controls
- [ ] Review cost optimization
- [ ] Update documentation

---

**Questions?** Open an issue or contact the DevOps team.
