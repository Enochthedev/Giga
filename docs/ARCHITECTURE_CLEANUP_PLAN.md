# Architecture Cleanup Plan

## Overview
This document outlines the cleanup needed to align the codebase with the hybrid Supabase + Microservices architecture.

## Current State vs Target State

### ✅ Completed (Supabase-based)
- **Auth Service** → Supabase Auth + Edge Functions + SDK
- **File Storage** → Supabase Storage + Edge Functions + SDK
- **Notifications** → Supabase DB + Edge Functions + SDK

### 🔨 To Build (Microservices)
- **Ecommerce Service** - Products, Orders, Cart, Vendors
- **Hotels Service** - Properties, Bookings, Inventory
- **Taxi Service** - Rides, Drivers, Vehicles
- **Payment Service** - Transactions, Refunds, Subscriptions
- **Ads Service** - Campaigns, Advertisements

### ⏳ To Setup
- **Kong Gateway** - API Gateway for routing

---

## Phase 1: Remove Obsolete Services

### Services to Delete
These services are now handled by Supabase and should be removed:

```bash
# Remove old microservices (replaced by Supabase)
rm -rf services/auth/
rm -rf services/notification/
rm -rf services/upload/
```

**Rationale:**
- `services/auth/` → Replaced by Supabase Auth + Edge Functions
- `services/notification/` → Replaced by Supabase Edge Functions
- `services/upload/` → Replaced by Supabase Storage + Edge Functions

### Services to Keep
- `services/ecommerce/` - Business logic microservice
- `services/hotel/` - Business logic microservice
- `services/taxi/` - Business logic microservice
- `services/payment/` - Business logic microservice
- `services/core/` - Shared utilities (review and update)
- `services/gateway/` - Kong Gateway configuration

---

## Phase 2: Archive Obsolete Specs

### Specs to Archive
Move these to `.kiro/specs/_archived/`:

```bash
mkdir -p .kiro/specs/_archived
mv .kiro/specs/auth-service/ .kiro/specs/_archived/
mv .kiro/specs/notification-service/ .kiro/specs/_archived/
mv .kiro/specs/upload-service/ .kiro/specs/_archived/
```

### Specs to Update
These specs need to be updated to use Supabase SDKs:

1. **ecommerce-cart-orders/**
   - Remove auth implementation details
   - Add SDK integration examples
   - Update to use auth middleware

2. **hotel-service/**
   - Remove auth implementation details
   - Add SDK integration examples
   - Update to use auth middleware

3. **taxi-service/**
   - Remove auth implementation details
   - Add SDK integration examples
   - Update to use auth middleware

4. **payment-service/**
   - Remove auth implementation details
   - Add SDK integration examples
   - Update to use auth middleware

5. **ads-service/**
   - Update to use Supabase SDKs
   - Add file upload integration

6. **api-gateway/**
   - Update for Kong Gateway
   - Add routing configuration

### Specs to Keep As-Is
- **admin-dashboard-service/** - Review if still needed
- **analytics-service/** - Review if still needed

---

## Phase 3: Update Documentation

### Documents to Update

1. **docs/ARCHITECTURE_GUIDE.md**
   - Update to reflect hybrid architecture
   - Add Supabase integration details
   - Remove references to old services

2. **docs/API_DOCUMENTATION.md**
   - Update endpoints to reflect Supabase
   - Add SDK usage examples
   - Remove old service endpoints

3. **docs/DEVELOPMENT_GUIDE.md**
   - Add Supabase setup instructions
   - Update service development guidelines
   - Add SDK integration examples

4. **docs/SERVICE_ORCHESTRATION.md**
   - Update service communication patterns
   - Add Supabase integration flows

5. **docs/SERVICE_ROADMAP.md**
   - Update to reflect current architecture
   - Remove completed items
   - Add Kong Gateway setup

### New Documents to Create

1. **docs/SUPABASE_INTEGRATION.md**
   - How to use Supabase services
   - SDK usage examples
   - Edge Functions overview

2. **docs/MIGRATION_GUIDE.md**
   - How to migrate from old services
   - Breaking changes
   - Update checklist

3. **docs/AUTH_MIDDLEWARE_GUIDE.md**
   - How to use auth middleware in services
   - Role-based access control
   - Examples for each service

---

## Phase 4: Update Existing Services

### Ecommerce Service
- [ ] Remove any auth implementation
- [ ] Add auth middleware using SDK
- [ ] Add file upload integration using SDK
- [ ] Add notification integration using SDK
- [ ] Update tests

### Hotel Service
- [ ] Remove any auth implementation
- [ ] Add auth middleware using SDK
- [ ] Add file upload integration using SDK
- [ ] Add notification integration using SDK
- [ ] Update tests

### Taxi Service
- [ ] Remove any auth implementation
- [ ] Add auth middleware using SDK
- [ ] Add file upload integration using SDK
- [ ] Add notification integration using SDK
- [ ] Update tests

### Payment Service
- [ ] Remove any auth implementation
- [ ] Add auth middleware using SDK
- [ ] Add notification integration using SDK
- [ ] Update tests

---

## Phase 5: Update Steering Rules

### Update coding-standards.md
Add sections for:
- Supabase SDK usage patterns
- Auth middleware requirements
- File upload patterns
- Notification patterns
- Service-to-service communication

---

## Phase 6: Clean Up Dependencies

### Root package.json
- [ ] Remove dependencies for deleted services
- [ ] Update workspace references
- [ ] Run `pnpm install` to clean up

### Service package.json files
- [ ] Add SDK dependencies where needed
- [ ] Remove auth-related dependencies
- [ ] Remove file upload dependencies
- [ ] Remove notification dependencies

---

## Phase 7: Update Scripts

### Scripts to Update
- `run-services.sh` - Remove old services
- `start-services.sh` - Remove old services
- `test-services.sh` - Remove old services

### Scripts to Create
- `setup-supabase.sh` - Initialize Supabase locally
- `deploy-edge-functions.sh` - Deploy Edge Functions

---

## Phase 8: Update Environment Variables

### Remove from .env.example
```env
# Old service URLs (no longer needed)
AUTH_SERVICE_URL=
NOTIFICATION_SERVICE_URL=
UPLOAD_SERVICE_URL=
```

### Add to .env.example
```env
# Supabase Configuration
SUPABASE_URL=https://nkrqcigvcakqicutkpfd.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Service URLs (microservices only)
ECOMMERCE_SERVICE_URL=http://localhost:3001
HOTEL_SERVICE_URL=http://localhost:3002
TAXI_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
ADS_SERVICE_URL=http://localhost:3005
```

---

## Phase 9: Update Tests

### Integration Tests
- [ ] Update to use Supabase test environment
- [ ] Add SDK mocking utilities
- [ ] Update service tests to use auth middleware

### E2E Tests
- [ ] Update to use Supabase endpoints
- [ ] Add tests for SDK integration
- [ ] Test service-to-service communication

---

## Phase 10: Update CI/CD

### GitHub Actions / CI Pipeline
- [ ] Remove build steps for deleted services
- [ ] Add Supabase Edge Function deployment
- [ ] Update test workflows
- [ ] Update deployment workflows

---

## Execution Order

1. **Backup** - Create a backup branch before starting
2. **Phase 1** - Remove obsolete services
3. **Phase 2** - Archive obsolete specs
4. **Phase 3** - Update documentation
5. **Phase 4** - Update existing services
6. **Phase 5** - Update steering rules
7. **Phase 6** - Clean up dependencies
8. **Phase 7** - Update scripts
9. **Phase 8** - Update environment variables
10. **Phase 9** - Update tests
11. **Phase 10** - Update CI/CD

---

## Validation Checklist

After cleanup, verify:
- [ ] All services build successfully
- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] No references to deleted services
- [ ] SDKs are properly integrated
- [ ] Auth middleware works in all services
- [ ] File uploads work via SDK
- [ ] Notifications work via SDK
- [ ] Environment variables are correct
- [ ] Scripts work as expected

---

## Rollback Plan

If issues arise:
1. Checkout backup branch
2. Review what went wrong
3. Fix issues incrementally
4. Re-run validation checklist

---

## Notes

- Keep the SDKs in `shared/sdk/` - they are the foundation
- Keep Supabase Edge Functions - they are the new services
- Focus on business logic in microservices
- Use SDKs for all cross-cutting concerns
