# ⚠️ DEPRECATION NOTICE

## Ecommerce Microservice → Supabase Migration

This ecommerce microservice is being **deprecated** in favor of the new Supabase-based
implementation.

### 🔄 Migration Status

| Component               | Status      | Action Required           |
| ----------------------- | ----------- | ------------------------- |
| **Authentication**      | ✅ Migrated | Use Supabase Auth         |
| **Products API**        | ✅ Migrated | Use PostgREST             |
| **Cart Management**     | ✅ Migrated | Use PostgREST + RLS       |
| **Order Processing**    | ✅ Migrated | Use Edge Functions        |
| **Payment Integration** | ✅ Migrated | Use Stripe + Webhooks     |
| **Vendor Management**   | ✅ Migrated | Use PostgREST + RLS       |
| **Admin Dashboard**     | ✅ Migrated | Use PostgREST + Functions |

### 📦 What's Deprecated

#### Fully Replaced by Supabase

- `src/controllers/` - Replaced by PostgREST
- `src/routes/` - Replaced by PostgREST endpoints
- `src/middleware/auth.ts` - Replaced by Supabase Auth + RLS
- `src/services/cart.service.ts` - Replaced by database triggers
- `src/services/order.service.ts` - Replaced by Edge Functions
- `prisma/schema.prisma` - Replaced by Supabase schema
- Express.js server - Replaced by Supabase REST API

#### Still Useful (Keep for Reference)

- `src/schemas/` - Zod schemas for validation
- `src/types/` - TypeScript types
- `src/utils/` - Utility functions
- `__tests__/` - Test patterns and examples

### 🚀 New Supabase Implementation

#### Database

- **Location**: Supabase Dashboard → Database
- **Schema**: Auto-generated from migrations
- **Access**: PostgREST API + Row Level Security

#### API Endpoints

- **Base URL**: `https://xxx.supabase.co/rest/v1`
- **Auth**: `https://xxx.supabase.co/auth/v1`
- **Functions**: `https://xxx.supabase.co/functions/v1`

#### Business Logic

- **Location**: `supabase/functions/`
- **Runtime**: Deno Edge Functions
- **Triggers**: Database triggers for cart totals, stock management

### 📋 Cleanup Plan

#### Phase 1: Immediate (Safe to Remove)

- [ ] `dist/` - Build output
- [ ] `node_modules/` - Dependencies
- [ ] `src/controllers/` - API controllers
- [ ] `src/routes/` - Express routes
- [ ] `src/middleware/auth.ts` - Custom auth
- [ ] `src/app.ts` - Express app
- [ ] `src/server.ts` - Server setup

#### Phase 2: After Frontend Migration

- [ ] `src/services/` - Business logic services
- [ ] `prisma/` - Database schema and migrations
- [ ] `package.json` - Dependencies
- [ ] `Dockerfile` - Container config

#### Phase 3: Keep for Reference

- [ ] `src/schemas/` - Validation schemas
- [ ] `src/types/` - TypeScript definitions
- [ ] `src/utils/` - Helper functions
- [ ] `__tests__/` - Test examples
- [ ] `postman/` - API documentation

### 🔧 How to Use New System

#### 1. Authentication

```typescript
// Old way
import { authenticateToken } from './middleware/auth';

// New way
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
const {
  data: { user },
} = await supabase.auth.getUser();
```

#### 2. Database Queries

```typescript
// Old way
const products = await prisma.product.findMany({
  where: { isActive: true },
  include: { category: true },
});

// New way
const { data: products } = await supabase
  .from('ecommerce_products')
  .select('*, category:ecommerce_categories(*)')
  .eq('is_active', true);
```

#### 3. Cart Management

```typescript
// Old way
await cartService.addItem(cartId, productId, quantity);

// New way
await supabase.from('ecommerce_cart_items').insert({
  cart_id: cartId,
  product_id: productId,
  quantity: quantity,
});
// Triggers automatically calculate totals
```

### 🎯 Benefits of Migration

1. **Serverless**: No server management
2. **Auto-scaling**: Handles traffic spikes
3. **Real-time**: Built-in subscriptions
4. **Security**: Row Level Security
5. **Performance**: Global CDN
6. **Cost**: Pay per usage

### 📚 Resources

- [Migration Guide](./postman/MIGRATION_GUIDE.md)
- [New Postman Collection](./postman/Ecommerce-API-Supabase.postman_collection.json)
- [Supabase Documentation](https://supabase.com/docs)

### ⏰ Timeline

- **Now**: Both systems running in parallel
- **Week 1-2**: Frontend migration to Supabase
- **Week 3**: Deprecate microservice endpoints
- **Week 4**: Remove microservice infrastructure

---

**Questions?** Check the migration guide or Supabase docs.
