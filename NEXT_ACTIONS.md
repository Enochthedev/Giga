# Next Actions - What You Need to Do

## ✅ What's Done

- Obsolete services removed
- Documentation complete
- Security hardened
- SDK integration started in ecommerce service

---

## 🎯 What You Need to Do Next

### 1. Review & Merge (5 minutes)

```bash
# Review the changes
git log cleanup-hybrid-architecture ^main

# If satisfied, merge to main
git checkout main
git merge cleanup-hybrid-architecture
git push origin main
```

### 2. Setup Environment (2 minutes)

```bash
# Copy the template
cp .env.supabase.example .env.supabase

# Edit and add your real Supabase credentials
# Get them from: https://supabase.com/dashboard/project/_/settings/api
```

### 3. Install Dependencies (2 minutes)

```bash
# Install SDKs in ecommerce service
cd services/ecommerce
pnpm install
```

### 4. Test the Integration (5 minutes)

```bash
# In services/ecommerce
pnpm run build
pnpm run lint
pnpm run type-check
```

### 5. Update One Route (10 minutes)

Pick any route and add auth middleware:

```typescript
// Example: services/ecommerce/src/routes/products.ts
import { authenticate, requireRole, requireActiveRole } from '../middleware/auth.middleware';

// Before
router.post('/products', productController.create);

// After
router.post(
  '/products',
  authenticate,
  requireRole('VENDOR', 'ADMIN'),
  requireActiveRole('VENDOR'),
  productController.create
);
```

### 6. Test with Real Request (5 minutes)

```bash
# Start the service
pnpm run dev

# Test with curl (get a token from Supabase first)
curl -X POST http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99}'
```

---

## 🔄 Then Repeat for Other Services

### Hotel Service

```bash
cd services/hotel
# Copy auth middleware from ecommerce
cp ../ecommerce/src/middleware/auth.middleware.ts src/middleware/
cp ../ecommerce/src/lib/file-storage.ts src/lib/
cp ../ecommerce/src/lib/notifications.ts src/lib/
# Update package.json with SDKs
# Update routes
pnpm install
pnpm run build
```

### Taxi Service

Same process as hotel service

### Payment Service

Same process as hotel service

---

## 📋 Optional But Recommended

### Update Root README

```bash
# Edit README.md to reflect new architecture
# Remove references to deleted services
# Add Supabase setup instructions
```

### Update Scripts

```bash
# Edit any scripts that reference old services
# Example: start-services.sh, test-services.sh
```

### Update Specs

```bash
# Update .kiro/specs/ecommerce-cart-orders/
# Update .kiro/specs/hotel-service/
# Update .kiro/specs/taxi-service/
# Update .kiro/specs/payment-service/
# Add SDK usage examples
```

---

## ⚠️ Don't Forget

### Security Check

If `.env.supabase` was pushed to remote with real credentials:

1. Go to Supabase Dashboard → Settings → API
2. Regenerate both keys
3. Update all environments

### Environment Variables

Each service needs in `.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## 📚 Reference

- **Quick Start:** `docs/QUICK_START_SUPABASE.md`
- **Full Guide:** `docs/MIGRATION_TO_SUPABASE.md`
- **Status:** `CLEANUP_STATUS.md`
- **Checklist:** `CLEANUP_CHECKLIST.md`

---

## 🎯 Success Criteria

You're done when:

- [ ] All services build without errors
- [ ] All services use auth middleware
- [ ] File uploads work via SDK
- [ ] Notifications work via SDK
- [ ] All tests pass
- [ ] No references to deleted services

---

## 💡 Quick Wins

**Fastest path to working system:**

1. Merge the branch ✅
2. Setup `.env.supabase` ✅
3. Install dependencies in ecommerce ✅
4. Update 1-2 routes with auth ✅
5. Test it works ✅
6. Repeat for other services

**Time estimate:** 2-3 hours for all services

---

## 🆘 Need Help?

**Issue:** Auth middleware not working

- Check token format: `Bearer YOUR_TOKEN`
- Verify Supabase URL and keys
- Check user exists in Supabase

**Issue:** File upload fails

- Check Supabase Storage bucket exists
- Verify bucket permissions
- Check file size limits

**Issue:** Notifications not sending

- Verify SERVICE_ROLE_KEY (not ANON_KEY)
- Check template name exists
- Verify user_id is valid

---

**Current Status:** Foundation complete, ready for implementation  
**Next Step:** Merge branch and install dependencies  
**Time to Complete:** 2-3 hours for full integration

Let's finish this! 🚀
