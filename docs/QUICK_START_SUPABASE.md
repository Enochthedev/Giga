# Quick Start: Using Supabase in Your Service

This guide helps you quickly integrate Supabase SDKs into your microservice.

---

## 1. Install SDKs

```bash
cd services/your-service
pnpm add @giga/auth-sdk @giga/file-storage-sdk @giga/notifications-sdk
```

---

## 2. Environment Variables

Add to your `.env`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## 3. Authentication Middleware

Create `src/middleware/auth.ts`:

```typescript
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

---

## 4. Use in Routes

```typescript
import { authenticate, requireRole, requireActiveRole } from './middleware/auth';

// Public endpoint
router.get('/products', productController.list);

// Authenticated endpoint
router.get('/orders', authenticate, orderController.list);

// Role-based endpoint
router.post(
  '/products',
  authenticate,
  requireRole('VENDOR', 'ADMIN'),
  requireActiveRole('VENDOR'),
  productController.create
);

// Customer-only endpoint
router.post(
  '/orders',
  authenticate,
  requireRole('CUSTOMER'),
  requireActiveRole('CUSTOMER'),
  orderController.create
);
```

---

## 5. File Uploads

```typescript
import { FileStorageClient } from '@giga/file-storage-sdk';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const fileStorage = new FileStorageClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
});

router.post(
  '/products/:id/images',
  authenticate,
  requireRole('VENDOR'),
  upload.single('image'),
  async (req, res) => {
    try {
      // Upload and process image
      const result = await fileStorage.uploadAndProcess(
        req.file.buffer,
        {
          entityType: 'PRODUCT',
          entityId: req.params.id,
          accessLevel: 'public',
          filename: req.file.originalname,
        },
        [{ type: 'thumbnail' }, { type: 'resize', width: 800, height: 800 }]
      );

      // Save URL to your database
      await saveProductImage(req.params.id, result.upload.data.url);

      res.json({ success: true, image: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
```

---

## 6. Send Notifications

```typescript
import { NotificationClient } from '@giga/notifications-sdk';

const notificationClient = new NotificationClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!, // Note: SERVICE_ROLE_KEY
});

router.post('/orders', authenticate, async (req, res) => {
  try {
    // Create order
    const order = await createOrder({
      customer_id: req.user.id,
      customer_email: req.user.email,
      customer_name: `${req.user.profile.first_name} ${req.user.profile.last_name}`,
      ...req.body,
    });

    // Send notification (queued - returns immediately)
    await notificationClient.sendOrderConfirmation(
      order.customer_id,
      order.customer_name,
      order.order_number,
      order.total,
      order.estimated_delivery,
      order.tracking_link,
      req.user.email,
      req.user.profile.phone
    );

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 7. Available User Roles

```typescript
// Available roles
type RoleName =
  | 'CUSTOMER' // Can buy products, book hotels, request rides
  | 'VENDOR' // Can sell products
  | 'DRIVER' // Can accept rides
  | 'HOST' // Can list properties
  | 'ADVERTISER' // Can create ad campaigns
  | 'ADMIN'; // Platform admin

// User object structure
interface AuthUser {
  id: string; // UUID
  email: string;
  profile: {
    first_name: string;
    last_name: string;
    phone?: string;
    avatar?: string;
    // ... more fields
  };
  roles: RoleName[]; // All roles user has
  active_role: RoleName; // Currently active role
}
```

---

## 8. Common Patterns

### Get User Data

```typescript
// ✅ GOOD - From authenticated request
app.post('/orders', authenticate, async (req, res) => {
  const user = req.user; // From middleware
  // Use user.id, user.email, user.profile, etc.
});

// ❌ BAD - Don't query Supabase directly
const { data } = await supabase.from('user_profiles').select('*').eq('id', userId);
```

### Get User Addresses

```typescript
import { AuthClient } from '@giga/auth-sdk';

const authClient = new AuthClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
});

app.get('/checkout', authenticate, async (req, res) => {
  authClient.setTokens(req.headers.authorization.replace('Bearer ', ''));
  const addresses = await authClient.getAddresses();
  res.json({ addresses });
});
```

### Multiple File Upload

```typescript
router.post(
  '/properties/:id/images',
  authenticate,
  requireRole('HOST'),
  upload.array('images', 10), // Max 10 images
  async (req, res) => {
    const results = [];

    for (const file of req.files) {
      const result = await fileStorage.uploadAndProcess(
        file.buffer,
        {
          entityType: 'PROPERTY',
          entityId: req.params.id,
          accessLevel: 'public',
        },
        [{ type: 'thumbnail' }, { type: 'resize', width: 1200 }]
      );
      results.push(result);
    }

    res.json({ success: true, images: results });
  }
);
```

### Batch Notifications

```typescript
// Send to multiple users
await notificationClient.batchQueueNotifications([
  {
    user_id: user1.id,
    template_name: 'ride_accepted',
    template_data: { driver_name: 'John', eta: '5' },
    recipient_email: user1.email,
  },
  {
    user_id: user2.id,
    template_name: 'ride_accepted',
    template_data: { driver_name: 'John', eta: '5' },
    recipient_email: user2.email,
  },
]);
```

---

## 9. Testing

### Mock Auth Middleware

```typescript
// In tests
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

### Test with Different Roles

```typescript
it('should allow vendors to create products', async () => {
  const mockUser = {
    id: 'vendor-id',
    roles: ['VENDOR'],
    active_role: 'VENDOR',
  };

  // Mock getCurrentUser to return vendor
  authClient.getCurrentUser.mockResolvedValue(mockUser);

  const response = await request(app)
    .post('/api/v1/products')
    .set('Authorization', 'Bearer fake-token')
    .send({ name: 'Test Product' });

  expect(response.status).toBe(201);
});
```

---

## 10. Error Handling

```typescript
// Consistent error responses
try {
  // Your logic
} catch (error) {
  if (error.message.includes('Invalid token')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
    });
  }

  if (error.message.includes('Insufficient permissions')) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }

  // Generic error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
```

---

## 11. Available Notification Templates

```typescript
// Order notifications
await notificationClient.sendOrderConfirmation(...)
await notificationClient.sendOrderShipped(...)

// Booking notifications
await notificationClient.sendBookingConfirmation(...)
await notificationClient.sendBookingReminder(...)

// Ride notifications
await notificationClient.sendRideAccepted(...)
await notificationClient.sendRideCompleted(...)

// Auth notifications
await notificationClient.sendWelcomeEmail(...)
await notificationClient.sendPasswordReset(...)

// Generic notification
await notificationClient.queueNotification({
  user_id: userId,
  template_name: 'custom_template',
  template_data: { key: 'value' },
  recipient_email: email,
  recipient_phone: phone,
})
```

---

## 12. File Entity Types

```typescript
type EntityType =
  | 'USER_PROFILE' // Profile pictures
  | 'PRODUCT' // Product images
  | 'PROPERTY' // Hotel photos
  | 'VEHICLE' // Car/taxi photos
  | 'DOCUMENT' // Documents (licenses, etc.)
  | 'ADVERTISEMENT'; // Ad images
```

---

## 13. Image Processing Options

```typescript
// Thumbnail
{ type: 'thumbnail' } // 150x150

// Resize
{ type: 'resize', width: 800, height: 600 }

// Multiple transformations
await fileStorage.uploadAndProcess(buffer, metadata, [
  { type: 'thumbnail' },
  { type: 'resize', width: 800, height: 800 },
  { type: 'resize', width: 400, height: 400 },
])
```

---

## 14. Complete Example Service

See `services/ecommerce/` for a complete example of a service using all Supabase SDKs.

---

## 15. Troubleshooting

### "Invalid token" error

- Ensure token is passed in `Authorization: Bearer {token}` header
- Verify token is from Supabase Auth (not custom JWT)
- Check token hasn't expired

### "Insufficient permissions" error

- Verify user has required role
- Check user's active_role matches requirement
- User may need to switch roles

### File upload fails

- Check file size limits
- Verify Supabase Storage bucket exists
- Check bucket permissions/policies

### Notifications not sending

- Verify SERVICE_ROLE_KEY is used (not ANON_KEY)
- Check template name is correct
- Verify user_id exists

---

## Need Help?

- SDK Documentation: `shared/sdk/*/README.md`
- Edge Functions: `supabase/functions/`
- Architecture Guide: `docs/ARCHITECTURE_GUIDE.md`
- Migration Guide: `docs/MIGRATION_TO_SUPABASE.md`
