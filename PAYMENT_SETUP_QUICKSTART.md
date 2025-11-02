# Payment Module - Quick Setup Guide

## ✅ What's Been Added

1. **✅ Resolved all merge conflicts** in payment gateways (Stripe, Paystack, Flutterwave, PayPal, Square)
2. **✅ Created Paystack Edge Functions** (payment initialization + webhook handling)
3. **✅ Database migration** for payment tracking
4. **✅ Payment SDK** for frontend integration
5. **✅ Complete documentation** (83 pages of setup, testing, and troubleshooting)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get API Keys

**Paystack:**
1. Sign up at [paystack.com](https://paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy **Secret Key** (starts with `sk_test_...`)

**Stripe (optional):**
1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy **Secret Key** (starts with `sk_test_...`)

### Step 2: Set Supabase Secrets

```bash
# Set Paystack secret
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_your_key_here

# Set Stripe secret (optional)
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here

# Set frontend URL
supabase secrets set FRONTEND_URL=http://localhost:3000
```

### Step 3: Run Database Migration

```bash
# Apply the migration
supabase migration up

# Or manually via SQL editor in Supabase dashboard
# Run: supabase/migrations/20250115000000_payment_intents_and_gateway_selection.sql
```

### Step 4: Deploy Edge Functions

```bash
# Deploy all payment functions
supabase functions deploy create-paystack-payment
supabase functions deploy paystack-webhook

# Deploy Stripe functions (if using)
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
```

### Step 5: Configure Paystack Webhook

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add callback URL: `https://[your-project-id].supabase.co/functions/v1/paystack-webhook`
3. Select events:
   - ✅ charge.success
   - ✅ charge.failed
   - ✅ refund.processed
4. Save

---

## 🧪 Test Your Setup

### Test Card

Use this Paystack test card:

- **Card Number**: `5060666666666666666`
- **CVV**: `123`
- **Expiry**: `01/99`
- **PIN**: `1234`
- **OTP**: `123456`

### Test Payment Flow

```bash
# 1. Create a test cart (via your app)
# 2. Select Paystack at checkout
# 3. Complete payment with test card above
# 4. Check Supabase logs: supabase functions logs paystack-webhook
# 5. Verify order created in ecommerce_orders table
```

---

## 📱 Frontend Integration

### Install SDK

```bash
pnpm add @platform/payment-sdk
```

### Basic Usage

```typescript
import { createPaymentClient } from '@platform/payment-sdk'

const paymentClient = createPaymentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
})

// Create payment
const result = await paymentClient.createPayment({
  cartId: 'xxx',
  gateway: 'paystack',
})

// Redirect user to payment page
window.location.href = result.data.authorization_url
```

### Full Example

See `shared/sdk/payment/README.md` for complete React/Next.js examples.

---

## 📊 Verify Setup

### Check Payment Intents Table

```sql
SELECT * FROM payment_intents ORDER BY created_at DESC LIMIT 10;
```

### Check Payment Analytics

```sql
SELECT * FROM payment_analytics
WHERE transaction_date >= CURRENT_DATE - INTERVAL '7 days';
```

---

## 🆘 Common Issues

### "Function not found"
**Solution**: Deploy Edge Functions: `supabase functions deploy paystack-webhook`

### "Secret key not configured"
**Solution**: Set secrets: `supabase secrets set PAYSTACK_SECRET_KEY=...`

### "Webhook verification failed"
**Solution**: Check webhook URL in Paystack dashboard matches your Supabase function URL

### "Cart not found"
**Solution**: Ensure cart belongs to authenticated user

---

## 📚 Full Documentation

For complete documentation, see:
- **`docs/PAYMENT_MODULE.md`** - Complete setup and integration guide
- **`shared/sdk/payment/README.md`** - Frontend SDK documentation
- **`.github/CI_CD_SETUP.md`** - Deployment and CI/CD

---

## 🎯 What's Next?

1. ✅ Test with Paystack test cards
2. ✅ Configure webhook in Paystack dashboard
3. ✅ Integrate frontend checkout page
4. ✅ Switch to live keys for production

**Need help?** Check `docs/PAYMENT_MODULE.md` or open an issue!

---

**Committed to branch**: `claude/codebase-review-011CUiuYCkThQVV1CAsRwE96`
