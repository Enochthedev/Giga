# Migration Guide: From Microservices to Hybrid Supabase Architecture

## Overview

This guide helps you migrate from the old microservices architecture to the new hybrid Supabase +
Microservices architecture.

---

## What Changed?

### Before (Old Architecture)

```
Client → Kong Gateway → Auth Service (Custom)
                     → Notification Service (Custom)
                     → Upload Service (Custom)
                     → Ecommerce Service
                     → Hotel Service
                     → Taxi Service
                     → Payment Service
```

### After (New Architecture)

```
Client → Kong Gateway → Supabase (Auth, Storage, Notifications)
                     → Ecommerce Service (uses Supabase SDKs)
                     → Hotel Service (uses Supabase SDKs)
                     → Taxi Service (uses Supabase SDKs)
                     → Payment Service (uses Supabase SDKs)
                     → Ads Service (uses Supabase SDKs)
```

---

## Breaking Changes

### 1. Authentication

**Old Way:**

```typescript
// Custom auth service
POST / api / v1 / auth / login;
POST / api / v1 / auth / register;
GET / api / v1 / auth / me;
```

**New Way:**

```typescript
// Supabase Auth
POST /auth/v1/token?grant_type=password
POST /auth/v1/signup
GET  /functions/v1/get-user-profile
```

**Migration:**

- Update client applications to use Supabase Auth endpoints
- Use `@giga/auth-sdk` for authentication
- Update JWT token validation to use Supabase tokens

### 2. File Uploads

**Old Way:**

```typescript
// Custom upload service
POST /api/v1/upload
GET  /api/v1/files/:id
```

**New Way:**

```typescript
// Supabase Storage
POST / functions / v1 / upload - file;
POST / functions / v1 / process - image;
```

**Migration:**

- Update file upload endpoints
- Use `@giga/file-storage-sdk` for uploads
- Migrate existing files to Supabase Storage

### 3. Notifications

**Old Way:**

```typescript
// Custom notification service
POST / api / v1 / notifications / send;
GET / api / v1 / notifications / history;
```

**New Way:**

```typescript
// Supabase Notifications
POST / functions / v1 / queue - notification;
GET / functions / v1 / get - notification - history;
```

**Migration:**

- Update notification sending logic
- Use `@giga/notifications-sdk` for notifications
- Migrate notification templates to Supabase

---

## Step-by-Step Migration

### Step 1: Install SDKs

In each microservice that needs auth, files, or notifications:

```bash
cd services/ecommerce
pnpm add @giga/auth-sdk @giga/file-storage-sdk @giga/notifications-sdk
```

### Step 2: Update Environment Variables

**Remove:**

```env
AUTH_SERVICE_URL=http://auth-service:3000
NOTIFICATION_SERVICE_URL=http://notification-service:3001
UPLOAD_SERVICE_URL=http://upload-service:3002
JWT_SECRET=your-secret
```

**Add:**

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Step 3: Replace Auth Middleware

**Old Way:**

```typescript
// services/ecommerce/src/middleware/auth.ts
import jwt from 'jsonwebtoken';

export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await fetchUserFromAuthService(decoded.userId);
  next();
}
```

**New Way:**

```typescript
// services/ecommerce/src/middleware/auth.ts
import { AuthClient } from '@giga/auth-sdk';

const authClient = new AuthClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
});

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    authClient.setTokens(token);
    const user = await authClient.getCurrentUser();
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(...roles: string[]) {
  return (req, res, next) => {
    if (!req.user.roles.some(r => roles.includes(r))) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

export function requireActiveRole(role: string) {
  return (req, res, next) => {
    if (req.user.active_role !== role) {
      return res.status(403).json({
        error: `Must be in ${role} mode`,
        current_role: req.user.active_role,
      });
    }
    next();
  };
}
```

### Step 4: Replace File Upload Logic

**Old Way:**

```typescript
// Upload to custom service
const formData = new FormData();
formData.append('file', file);
const response = await fetch(`${UPLOAD_SERVICE_URL}/upload`, {
  method: 'POST',
  body: formData,
});
```

**New Way:**

```typescript
import { FileStorageClient } from '@giga/file-storage-sdk';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const fileStorage = new FileStorageClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
});

app.post(
  '/products/:id/images',
  authenticate,
  requireRole('VENDOR'),
  upload.single('image'),
  async (req, res) => {
    const result = await fileStorage.uploadAndProcess(
      req.file.buffer,
      {
        entityType: 'PRODUCT',
        entityId: req.params.id,
        accessLevel: 'public',
      },
      [{ type: 'thumbnail' }, { type: 'resize', width: 800, height: 800 }]
    );

    res.json({ success: true, image: result });
  }
);
```

### Step 5: Replace Notification Logic

**Old Way:**

```typescript
// Send via custom service
await fetch(`${NOTIFICATION_SERVICE_URL}/send`, {
  method: 'POST',
  body: JSON.stringify({
    userId,
    type: 'order_confirmation',
    data: { orderNumber, total },
  }),
});
```

**New Way:**

```typescript
import { NotificationClient } from '@giga/notifications-sdk';

const notificationClient = new NotificationClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
});

// Queue notification (recommended - fast)
await notificationClient.sendOrderConfirmation(
  userId,
  customerName,
  orderNumber,
  total,
  deliveryDate,
  trackingLink,
  email,
  phone
);
```

### Step 6: Update Routes

**Old Way:**

```typescript
// No auth required
app.post('/orders', async (req, res) => {
  // Anyone can create orders
});
```

**New Way:**

```typescript
// Proper auth and role checks
app.post(
  '/orders',
  authenticate,
  requireRole('CUSTOMER'),
  requireActiveRole('CUSTOMER'),
  async (req, res) => {
    const order = await createOrder({
      customer_id: req.user.id,
      customer_email: req.user.email,
      ...req.body,
    });

    res.json({ success: true, order });
  }
);
```

### Step 7: Remove Old Dependencies

```bash
# Remove old auth/upload/notification packages
pnpm remove jsonwebtoken bcryptjs multer-s3 aws-sdk nodemailer twilio

# Keep only what you need for business logic
```

### Step 8: Update Tests

**Old Way:**

```typescript
// Mock auth service
jest.mock('../services/authService');
```

**New Way:**

```typescript
// Mock Supabase SDK
jest.mock('@giga/auth-sdk', () => ({
  AuthClient: jest.fn().mockImplementation(() => ({
    setTokens: jest.fn(),
    getCurrentUser: jest.fn().mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      roles: ['CUSTOMER'],
      active_role: 'CUSTOMER',
      profile: {
        first_name: 'Test',
        last_name: 'User',
      },
    }),
  })),
}));
```

---

## Data Migration

### User Data

User data is now in Supabase. No migration needed if you were using the old auth service - just
update references.

### Files

If you have files in the old upload service:

```typescript
// Migration script
import { FileStorageClient } from '@giga/file-storage-sdk';
import fs from 'fs';
import path from 'path';

const fileStorage = new FileStorageClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
});

async function migrateFiles() {
  const oldFiles = await getOldFiles(); // Your old file list

  for (const file of oldFiles) {
    const buffer = fs.readFileSync(file.path);

    await fileStorage.uploadFile(buffer, {
      entityType: file.entityType,
      entityId: file.entityId,
      accessLevel: file.accessLevel,
      filename: file.filename,
    });

    console.log(`Migrated: ${file.filename}`);
  }
}
```

### Notifications

Notification history is in Supabase. Old notifications can be archived or migrated if needed.

---

## Testing the Migration

### 1. Test Authentication

```bash
# Login
curl -X POST https://YOUR_PROJECT.supabase.co/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"email":"test@example.com","password":"password"}'

# Use token in service
curl -X GET http://localhost:3001/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test File Upload

```bash
curl -X POST http://localhost:3001/api/v1/products/123/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@product.jpg"
```

### 3. Test Notifications

```bash
# Create an order (should trigger notification)
curl -X POST http://localhost:3001/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[...]}'

# Check notification history
curl -X GET https://YOUR_PROJECT.supabase.co/functions/v1/get-notification-history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Rollback Plan

If you need to rollback:

1. Keep old services running in parallel during migration
2. Use feature flags to switch between old and new
3. Monitor error rates and performance
4. Gradually migrate users/features

---

## Common Issues

### Issue: "Invalid token"

**Solution:** Make sure you're using Supabase JWT tokens, not old custom tokens.

### Issue: "User not found"

**Solution:** Ensure user exists in Supabase Auth. May need to migrate users.

### Issue: "File upload fails"

**Solution:** Check Supabase Storage bucket permissions and policies.

### Issue: "Notifications not sending"

**Solution:** Verify Supabase service role key is set correctly.

---

## Support

For issues during migration:

- Check SDK documentation in `shared/sdk/*/README.md`
- Review Supabase Edge Functions in `supabase/functions/`
- See architecture guide in `docs/ARCHITECTURE_GUIDE.md`

---

## Timeline

Recommended migration timeline:

- **Week 1:** Install SDKs, update environment variables
- **Week 2:** Migrate auth middleware, test authentication
- **Week 3:** Migrate file uploads, test uploads
- **Week 4:** Migrate notifications, test notifications
- **Week 5:** Update all routes, comprehensive testing
- **Week 6:** Deploy to staging, monitor
- **Week 7:** Deploy to production, monitor
- **Week 8:** Decommission old services

---

## Checklist

- [ ] SDKs installed in all services
- [ ] Environment variables updated
- [ ] Auth middleware replaced
- [ ] File upload logic replaced
- [ ] Notification logic replaced
- [ ] Routes updated with proper auth
- [ ] Tests updated
- [ ] Data migrated (if needed)
- [ ] Staging deployment tested
- [ ] Production deployment completed
- [ ] Old services decommissioned
- [ ] Documentation updated
