# Payment Module - Complete Guide

Complete documentation for the Giga Platform payment system supporting **Stripe** and **Paystack**.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup](#setup)
4. [Integration Guide](#integration-guide)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Giga payment system supports two payment gateways:

### **Paystack** (Primary for African markets)
- ✅ **Best for**: Nigeria (NGN), Ghana (GHS), South Africa (ZAR), Kenya (KES)
- ✅ **Channels**: Card, Bank Transfer, USSD, Mobile Money, QR Codes
- ✅ **Fees**: Lower for local transactions
- ✅ **Settlement**: 1-2 business days

### **Stripe** (Global payments)
- ✅ **Best for**: USD, EUR, GBP, and 135+ currencies
- ✅ **Channels**: Cards, Apple Pay, Google Pay
- ✅ **Fees**: Standard international rates
- ✅ **Settlement**: 2-7 business days

**Customer Choice**: Users can select their preferred payment gateway at checkout.

---

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React/Next.js)                │
│                  Payment SDK (@platform/payment-sdk)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Edge Functions                    │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │ create-payment-intent│  │ create-paystack-payment      │ │
│  │   (Stripe)           │  │   (Paystack)                 │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │ stripe-webhook       │  │ paystack-webhook             │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     Supabase Database                        │
│  • payment_intents (tracking)                                │
│  • ecommerce_orders (completed orders)                       │
│  • ecommerce_carts (with payment_gateway selection)          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Paystack Flow:**
```
1. User selects Paystack → 2. create-paystack-payment Edge Function
3. Paystack API (initialize transaction) → 4. Return authorization_url
5. Redirect user to Paystack → 6. User completes payment
7. Paystack webhook → 8. paystack-webhook Edge Function
9. Create order → 10. Clear cart → 11. Send confirmation email
```

**Stripe Flow:**
```
1. User selects Stripe → 2. create-payment-intent Edge Function
3. Stripe API (create PaymentIntent) → 4. Return client_secret
5. Stripe.js on frontend → 6. User completes payment
7. Stripe webhook → 8. stripe-webhook Edge Function
9. Create order → 10. Clear cart → 11. Send confirmation email
```

---

## ⚙️ Setup

### 1. Prerequisites

- ✅ Supabase project (get from [supabase.com](https://supabase.com))
- ✅ Stripe account (get from [stripe.com](https://stripe.com))
- ✅ Paystack account (get from [paystack.com](https://paystack.com))

### 2. Environment Variables

#### Supabase Secrets

Set these in Supabase Dashboard → Project Settings → Edge Functions → Secrets:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_... # or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Paystack
PAYSTACK_SECRET_KEY=sk_test_... # or sk_live_...

# Frontend URL (for callbacks)
FRONTEND_URL=https://yourapp.com

# Supabase (auto-provided)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Set secrets via CLI:**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_...
supabase secrets set FRONTEND_URL=https://yourapp.com
```

#### Frontend Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Database Setup

Run the migration:

```bash
# Using Supabase CLI
supabase migration up

# Or manually run the SQL
psql $DATABASE_URL < supabase/migrations/20250115000000_payment_intents_and_gateway_selection.sql
```

This creates:
- ✅ `payment_intents` table
- ✅ `payment_gateway` column in `ecommerce_carts`
- ✅ Indexes and RLS policies
- ✅ `payment_analytics` view

### 4. Deploy Edge Functions

```bash
# Deploy all payment functions
supabase functions deploy create-payment-intent
supabase functions deploy create-paystack-payment
supabase functions deploy stripe-webhook
supabase functions deploy paystack-webhook
```

### 5. Configure Webhooks

#### Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://[project-id].supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy webhook signing secret → Set as `STRIPE_WEBHOOK_SECRET`

#### Paystack Webhook

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add callback URL: `https://[project-id].supabase.co/functions/v1/paystack-webhook`
3. Select events:
   - `charge.success`
   - `charge.failed`
   - `refund.processed`
4. Webhook secret is your **Paystack Secret Key** (auto-verified)

---

## 📱 Integration Guide

### Frontend Integration

#### 1. Install Payment SDK

```bash
pnpm add @platform/payment-sdk
```

#### 2. Initialize Client

```typescript
// lib/payment.ts
import { createPaymentClient } from '@platform/payment-sdk'

export const paymentClient = createPaymentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  frontendUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
})
```

#### 3. Checkout Page with Gateway Selection

```typescript
// pages/checkout.tsx
import { useState } from 'react'
import { paymentClient, PaymentGateway } from '@platform/payment-sdk'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage({ cartId, totalAmount, currency }) {
  const [gateway, setGateway] = useState<PaymentGateway>('paystack')
  const [loading, setLoading] = useState(false)

  // Get supported gateways for currency
  const supportedGateways = PaymentClient.getSupportedGateways(currency)

  const handlePayment = async () => {
    setLoading(true)

    try {
      const result = await paymentClient.createPayment({
        cartId,
        gateway,
        callbackUrl: `${window.location.origin}/checkout/callback`,
      })

      if (!result.success) {
        alert('Payment initiation failed: ' + result.error)
        return
      }

      // Handle based on gateway
      if (gateway === 'paystack') {
        // Redirect to Paystack
        window.location.href = result.data!.authorization_url!
      } else {
        // Use Stripe.js
        const stripe = await stripePromise
        const { error } = await stripe!.confirmCardPayment(
          result.data!.client_secret!
        )

        if (error) {
          alert('Payment failed: ' + error.message)
        } else {
          // Payment successful
          window.location.href = '/order/success'
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p>Total: {currency} {totalAmount}</p>

      {/* Gateway Selection */}
      <div>
        <h3>Select Payment Method</h3>
        {supportedGateways.includes('paystack') && (
          <button
            onClick={() => setGateway('paystack')}
            className={gateway === 'paystack' ? 'active' : ''}
          >
            💳 Paystack (Card, Bank Transfer, USSD)
          </button>
        )}
        {supportedGateways.includes('stripe') && (
          <button
            onClick={() => setGateway('stripe')}
            className={gateway === 'stripe' ? 'active' : ''}
          >
            💳 Stripe (International Cards)
          </button>
        )}
      </div>

      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : `Pay ${currency} ${totalAmount}`}
      </button>
    </div>
  )
}
```

#### 4. Callback Handler (Paystack)

```typescript
// pages/checkout/callback.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { paymentClient } from '@/lib/payment'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')

  useEffect(() => {
    const reference = router.query.reference as string

    if (reference) {
      verifyPayment(reference)
    }
  }, [router.query.reference])

  const verifyPayment = async (reference: string) => {
    const result = await paymentClient.verifyPaystackPayment(reference)

    if (result.success && result.data?.status === 'succeeded') {
      setStatus('success')
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push('/order/success')
      }, 2000)
    } else {
      setStatus('failed')
    }
  }

  if (status === 'loading') {
    return <div>Verifying payment...</div>
  }

  if (status === 'success') {
    return <div>✅ Payment successful! Redirecting...</div>
  }

  return <div>❌ Payment verification failed</div>
}
```

### Backend Integration (Optional)

If you want to use the payment service microservice:

```typescript
// services/your-service/src/index.ts
import { PaystackGateway } from '@platform/payment-service/gateways'

const paystack = new PaystackGateway({
  id: 'paystack-main',
  name: 'Paystack',
  type: 'paystack',
  enabled: true,
  priority: 1,
  credentials: {
    secretKey: process.env.PAYSTACK_SECRET_KEY!,
    webhookSecret: process.env.PAYSTACK_SECRET_KEY!, // Same for Paystack
  },
  settings: {
    timeout: 30000,
    retryAttempts: 3,
  },
})

// Process payment
const result = await paystack.processPayment({
  amount: 5000,
  currency: 'NGN',
  userId: 'user-123',
  merchantId: 'merchant-456',
  metadata: {
    customerEmail: 'customer@example.com',
  },
})

console.log('Payment URL:', result.nextAction?.redirectUrl)
```

---

## 🧪 Testing

### Test Cards

#### Paystack Test Cards

| Card Number         | CVV | Expiry | Result          |
|---------------------|-----|--------|-----------------|
| 5060666666666666666 | 123 | 01/99  | Success         |
| 4084084084084081    | 408 | 01/99  | Insufficient    |
| 507850785078507812  | 081 | 01/99  | Declined        |

**PIN**: `1234` (for cards that require PIN)
**OTP**: `123456`

#### Stripe Test Cards

| Card Number         | Result          |
|---------------------|-----------------|
| 4242 4242 4242 4242 | Success         |
| 4000 0000 0000 0002 | Card declined   |
| 4000 0025 0000 3155 | 3D Secure req.  |

### Testing Webhooks Locally

#### Stripe

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local function
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

#### Paystack

Use [ngrok](https://ngrok.com) to expose local endpoint:

```bash
# Install ngrok
brew install ngrok

# Expose Supabase local functions
ngrok http 54321

# Update Paystack webhook URL to:
# https://xxxx.ngrok.io/functions/v1/paystack-webhook
```

### Test Payment Flow

```bash
# 1. Create test cart
curl -X POST https://[project-id].supabase.co/rest/v1/ecommerce_carts \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"...","total_amount":5000,"payment_gateway":"paystack"}'

# 2. Create payment
curl -X POST https://[project-id].supabase.co/functions/v1/create-paystack-payment \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"cart_id":"..."}'

# 3. Visit authorization_url from response
# 4. Complete payment with test card
# 5. Webhook will be triggered automatically
```

---

## 🚀 Deployment

### Checklist

- [ ] Set all environment variables in Supabase
- [ ] Deploy all 4 Edge Functions
- [ ] Run database migration
- [ ] Configure webhooks in Stripe and Paystack dashboards
- [ ] Test with test cards
- [ ] Switch to live keys for production
- [ ] Monitor payment_intents table for transactions

### Production Secrets

```bash
# Stripe Production
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Paystack Production
supabase secrets set PAYSTACK_SECRET_KEY=sk_live_...

# Frontend URL
supabase secrets set FRONTEND_URL=https://yourapp.com
```

### Monitoring

Query payment analytics:

```sql
-- View payment stats
SELECT * FROM payment_analytics
WHERE transaction_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY transaction_date DESC;

-- Check failed payments
SELECT *
FROM payment_intents
WHERE status = 'failed'
AND created_at >= CURRENT_DATE - INTERVAL '1 day';
```

---

## 🔧 Troubleshooting

### Payment Not Created

**Symptom**: `createPayment()` returns error

**Checks**:
1. User is authenticated (check `supabase.auth.getUser()`)
2. Cart exists and belongs to user
3. Cart is not empty
4. Edge Function has correct secrets set

**Debug**:
```bash
# Check Edge Function logs
supabase functions logs create-paystack-payment --tail
```

### Webhook Not Received

**Symptom**: Payment successful but order not created

**Checks**:
1. Webhook URL is correct in gateway dashboard
2. Webhook secret matches
3. Edge Function is deployed and running

**Debug**:
```bash
# Check webhook logs
supabase functions logs paystack-webhook --tail

# Manually trigger webhook (testing)
curl -X POST https://[project-id].supabase.co/functions/v1/paystack-webhook \
  -H "x-paystack-signature: $SIGNATURE" \
  -d @webhook-payload.json
```

### Payment Stuck in "Pending"

**Symptom**: User paid but status is still pending

**Solution**:
1. Check webhook logs for errors
2. Manually verify payment:
```typescript
const result = await paymentClient.getPaymentStatus(reference)
```
3. If webhook failed, manually process:
```sql
-- Find payment intent
SELECT * FROM payment_intents WHERE provider_reference = 'xxx';

-- Manually update (only if verified)
UPDATE payment_intents SET status = 'succeeded' WHERE provider_reference = 'xxx';
```

### Duplicate Orders

**Symptom**: Same payment creates multiple orders

**Cause**: Webhook called multiple times

**Solution**: Webhooks are idempotent - check order doesn't already exist:
```typescript
// In webhook handler
const existingOrder = await supabase
  .from('ecommerce_orders')
  .select('id')
  .eq('payment_id', reference)
  .single()

if (existingOrder.data) {
  console.log('Order already exists, skipping')
  return
}
```

---

## 📊 Analytics

### Payment Success Rate

```sql
SELECT
  provider,
  COUNT(*) FILTER (WHERE status = 'succeeded') * 100.0 / COUNT(*) as success_rate,
  COUNT(*) as total_transactions
FROM payment_intents
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY provider;
```

### Revenue by Gateway

```sql
SELECT
  provider,
  SUM(amount) FILTER (WHERE status = 'succeeded') as total_revenue,
  COUNT(*) FILTER (WHERE status = 'succeeded') as successful_payments
FROM payment_intents
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY provider;
```

---

## 📚 Additional Resources

- **Paystack API Docs**: https://paystack.com/docs/api
- **Stripe API Docs**: https://stripe.com/docs/api
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Payment SDK README**: `shared/sdk/payment/README.md`

---

## 🆘 Support

For issues:
1. Check logs: `supabase functions logs <function-name>`
2. Check webhook delivery in gateway dashboard
3. Query `payment_intents` table for transaction details
4. Open issue in repository

---

**Last Updated**: 2025-01-15
