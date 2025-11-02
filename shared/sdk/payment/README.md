# Payment SDK

Payment SDK for the Giga Platform supporting both Stripe and Paystack.

## Features

- ✅ Stripe integration (global payments)
- ✅ Paystack integration (African payments - NGN, GHS, ZAR, KES)
- ✅ Customer payment gateway selection
- ✅ Automatic gateway recommendation based on currency
- ✅ Payment status tracking
- ✅ Payment history
- ✅ TypeScript support

## Installation

```bash
pnpm add @platform/payment-sdk
```

## Usage

### Initialize Client

```typescript
import { createPaymentClient } from '@platform/payment-sdk'

const paymentClient = createPaymentClient({
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  frontendUrl: 'https://yourapp.com', // optional
})
```

### Create Payment (Paystack)

```typescript
// User selects Paystack as payment gateway
const result = await paymentClient.createPayment({
  cartId: 'cart-uuid',
  gateway: 'paystack',
  callbackUrl: 'https://yourapp.com/checkout/callback',
  channels: ['card', 'bank', 'ussd'], // optional, defaults to all channels
})

if (result.success && result.data) {
  // Redirect user to Paystack payment page
  window.location.href = result.data.authorization_url
}
```

### Create Payment (Stripe)

```typescript
// User selects Stripe as payment gateway
const result = await paymentClient.createPayment({
  cartId: 'cart-uuid',
  gateway: 'stripe',
})

if (result.success && result.data) {
  // Use Stripe.js to handle payment
  const stripe = await loadStripe('pk_...')
  await stripe.confirmCardPayment(result.data.client_secret)
}
```

### Handle Paystack Callback

```typescript
// After user completes payment and is redirected back
const urlParams = new URLSearchParams(window.location.search)
const reference = urlParams.get('reference')

if (reference) {
  const result = await paymentClient.verifyPaystackPayment(reference)

  if (result.success && result.data?.status === 'succeeded') {
    // Payment successful! Show success message
    console.log('Payment successful!', result.data.amount)
  }
}
```

### Get Recommended Gateway

```typescript
// Get recommended gateway based on currency
const gateway = PaymentClient.getRecommendedGateway('NGN')
// Returns: 'paystack'

const gateway2 = PaymentClient.getRecommendedGateway('USD')
// Returns: 'stripe'
```

### Get Supported Gateways

```typescript
// Get all supported gateways for a currency
const gateways = PaymentClient.getSupportedGateways('NGN')
// Returns: ['stripe', 'paystack']

const gateways2 = PaymentClient.getSupportedGateways('USD')
// Returns: ['stripe']
```

### Get Payment History

```typescript
const history = await paymentClient.getPaymentHistory(10)

if (history.success) {
  history.data?.forEach(payment => {
    console.log(`${payment.provider}: ₦${payment.amount} - ${payment.status}`)
  })
}
```

## Complete Example

```typescript
import { createPaymentClient, PaymentClient } from '@platform/payment-sdk'

// Initialize
const paymentClient = createPaymentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
})

// Checkout flow
async function checkout(cartId: string, currency: string) {
  // Get supported gateways for currency
  const supportedGateways = PaymentClient.getSupportedGateways(currency as any)

  // Let user choose (or auto-select)
  const selectedGateway = supportedGateways[0] // Or show UI to select

  // Create payment
  const result = await paymentClient.createPayment({
    cartId,
    gateway: selectedGateway,
  })

  if (!result.success) {
    alert('Payment initiation failed: ' + result.error)
    return
  }

  // Handle based on gateway
  if (selectedGateway === 'paystack') {
    // Redirect to Paystack
    window.location.href = result.data!.authorization_url!
  } else {
    // Use Stripe.js
    const stripe = await loadStripe('pk_...')
    await stripe.confirmCardPayment(result.data!.client_secret!)
  }
}

// Callback handler (for Paystack)
async function handleCallback() {
  const params = new URLSearchParams(window.location.search)
  const reference = params.get('reference')

  if (reference) {
    const result = await paymentClient.verifyPaystackPayment(reference)

    if (result.success && result.data?.status === 'succeeded') {
      // Show success page
      router.push('/order/success')
    } else {
      // Show error
      alert('Payment verification failed')
    }
  }
}
```

## Currency Support

### Paystack
- ✅ NGN (Nigerian Naira) - **Primary**
- ✅ GHS (Ghanaian Cedi)
- ✅ ZAR (South African Rand)
- ✅ KES (Kenyan Shilling)

### Stripe
- ✅ USD (US Dollar)
- ✅ EUR (Euro)
- ✅ GBP (British Pound)
- ✅ NGN (Nigerian Naira)
- ✅ 135+ other currencies

## Payment Channels (Paystack)

```typescript
channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
```

Default: All channels enabled

## API Reference

See [API Documentation](./API.md) for full API reference.

## Testing

```bash
pnpm test
```

## License

MIT
