# Frontend Integration Guide

This guide shows how the frontend can integrate with the enhanced ecommerce and checkout system with
**minimal payment service interaction**.

## 🎯 **Design Philosophy: Frontend Simplicity**

The frontend **never directly calls the payment service**. Instead, it interacts only with the
ecommerce service, which handles all payment complexity behind the scenes.

### ✅ **What Frontend Does**

- Manages cart operations (add, remove, update items)
- Initiates checkout with shipping details
- Confirms payment completion
- Displays order status

### ❌ **What Frontend Doesn't Do**

- Direct payment service API calls
- Payment intent management
- Payment method handling
- Service-to-service authentication

## 🛒 **Complete Frontend Checkout Flow**

### **Step 1: Cart Management**

#### Add Items to Cart (Unified Endpoint)

```javascript
// Single unified endpoint for both single and bulk operations
const addToCart = async data => {
  const response = await fetch('/api/v1/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return response.json();
};

// Add single item
await addToCart({
  productId: 'cmgrnxxab0017seeuiqtbj7we',
  quantity: 3,
});

// Add multiple items (bulk operation)
await addToCart({
  items: [
    { productId: 'cmgrnxxab0017seeuiqtbj7we', quantity: 3 },
    { productId: 'cmgrnxxa80014seeuww1kxorh', quantity: 4 },
    { productId: 'cmgrnxxa50011seeuap1ht0om', quantity: 3 },
  ],
});
```

#### Get Enhanced Cart Data

```javascript
const getCart = async () => {
  const response = await fetch('/api/v1/cart');
  const data = await response.json();

  // Rich cart data with full product details
  return data.data.cart;
};

// Cart includes:
// - Full product information (images, specs, ratings)
// - Real-time inventory status
// - Calculated totals (subtotal, tax, shipping, total)
// - User identification (anonymous/authenticated)
```

### **Step 2: Checkout Process**

#### Get Checkout Summary

```javascript
const getCheckoutSummary = async () => {
  const response = await fetch('/api/v1/checkout/summary');
  const data = await response.json();

  return data.data.summary;
};

// Summary includes:
// - Cart validation status
// - Calculated totals with breakdown
// - Customer information
// - Shipping options
```

#### Initiate Checkout (Creates Payment Intent Behind the Scenes)

```javascript
const initiateCheckout = async checkoutData => {
  const response = await fetch('/api/v1/checkout/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        phone: '+1234567890',
      },
      paymentMethodId: 'pm_1234567890', // From your payment form
      notes: 'Please deliver to front door',
    }),
  });

  const data = await response.json();
  return data.data.checkout;
};

// Returns:
// - Payment intent details (for frontend payment form)
// - Checkout session info
// - Expiration time
// - Total amounts
```

#### Complete Payment (Finalizes Order)

```javascript
const confirmPayment = async paymentIntentId => {
  const response = await fetch('/api/v1/checkout/confirm-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId }),
  });

  const data = await response.json();
  return data.data;
};

// Returns:
// - Complete order details
// - Payment confirmation
// - Order tracking information
```

## 🎨 **Frontend Implementation Examples**

### **React Checkout Component**

```jsx
import React, { useState, useEffect } from 'react';

const CheckoutFlow = () => {
  const [cart, setCart] = useState(null);
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load cart and checkout summary
  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    try {
      const [cartData, summaryData] = await Promise.all([getCart(), getCheckoutSummary()]);

      setCart(cartData);
      setCheckoutSummary(summaryData);
    } catch (error) {
      console.error('Failed to load checkout data:', error);
    }
  };

  const handleCheckout = async shippingData => {
    setLoading(true);
    try {
      // Step 1: Initiate checkout (creates payment intent)
      const checkoutResult = await initiateCheckout({
        shippingAddress: shippingData,
        paymentMethodId: 'pm_test_card', // From your payment form
      });

      setCheckout(checkoutResult);

      // Step 2: Process payment (in real app, use Stripe Elements or similar)
      // For demo, we'll simulate payment confirmation
      setTimeout(async () => {
        try {
          const orderResult = await confirmPayment(checkoutResult.paymentIntent.id);
          setOrder(orderResult.order);
          setCart(null); // Cart is cleared after successful order
        } catch (error) {
          console.error('Payment confirmation failed:', error);
        }
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Checkout failed:', error);
      setLoading(false);
    }
  };

  if (order) {
    return <OrderConfirmation order={order} />;
  }

  return (
    <div className="checkout-flow">
      {/* Cart Summary */}
      <CartSummary cart={cart} />

      {/* Checkout Form */}
      <CheckoutForm summary={checkoutSummary} onSubmit={handleCheckout} loading={loading} />

      {/* Payment Processing */}
      {checkout && <PaymentProcessing paymentIntent={checkout.paymentIntent} loading={loading} />}
    </div>
  );
};

const CartSummary = ({ cart }) => {
  if (!cart) return <div>Loading cart...</div>;

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      {cart.items.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.product.images[0]} alt={item.product.name} />
          <div>
            <h4>{item.product.name}</h4>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </div>
        </div>
      ))}

      <div className="totals">
        <p>Subtotal: ${cart.subtotal}</p>
        <p>Tax: ${cart.tax}</p>
        <p>Shipping: ${cart.shipping || 0}</p>
        <h3>Total: ${cart.total}</h3>
      </div>
    </div>
  );
};

const CheckoutForm = ({ summary, onSubmit, loading }) => {
  const [shippingData, setShippingData] = useState({
    name: '',
    address: '',
    city: '',
    country: 'USA',
    phone: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(shippingData);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h3>Shipping Information</h3>

      <input
        type="text"
        placeholder="Full Name"
        value={shippingData.name}
        onChange={e => setShippingData({ ...shippingData, name: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Address"
        value={shippingData.address}
        onChange={e => setShippingData({ ...shippingData, address: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="City"
        value={shippingData.city}
        onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        value={shippingData.phone}
        onChange={e => setShippingData({ ...shippingData, phone: e.target.value })}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : `Pay $${summary?.totals?.total || 0}`}
      </button>
    </form>
  );
};

const PaymentProcessing = ({ paymentIntent, loading }) => (
  <div className="payment-processing">
    <h3>Processing Payment</h3>
    <p>Payment ID: {paymentIntent.id}</p>
    <p>Amount: ${(paymentIntent.amount / 100).toFixed(2)}</p>
    {loading && <div className="spinner">Processing...</div>}
  </div>
);

const OrderConfirmation = ({ order }) => (
  <div className="order-confirmation">
    <h2>✅ Order Confirmed!</h2>
    <p>Order ID: {order.id}</p>
    <p>Total: ${order.total}</p>
    <p>Status: {order.status}</p>

    <div className="order-items">
      <h3>Items Ordered:</h3>
      {order.items.map(item => (
        <div key={item.id}>
          {item.product.name} x {item.quantity}
        </div>
      ))}
    </div>
  </div>
);
```

### **Vue.js Implementation**

```vue
<template>
  <div class="checkout-flow">
    <!-- Cart Summary -->
    <div v-if="cart" class="cart-summary">
      <h3>Order Summary ({{ cart.items.length }} items)</h3>
      <div v-for="item in cart.items" :key="item.id" class="cart-item">
        <img :src="item.product.images[0]" :alt="item.product.name" />
        <div>
          <h4>{{ item.product.name }}</h4>
          <p>{{ item.quantity }} x ${{ item.price }}</p>
        </div>
      </div>
      <div class="totals">
        <p>Total: ${{ cart.total }}</p>
      </div>
    </div>

    <!-- Checkout Form -->
    <form v-if="!order" @submit.prevent="handleCheckout" class="checkout-form">
      <h3>Shipping Information</h3>

      <input v-model="shippingData.name" type="text" placeholder="Full Name" required />
      <input v-model="shippingData.address" type="text" placeholder="Address" required />
      <input v-model="shippingData.city" type="text" placeholder="City" required />
      <input v-model="shippingData.phone" type="tel" placeholder="Phone" />

      <button type="submit" :disabled="loading">
        {{ loading ? 'Processing...' : `Pay $${cart?.total || 0}` }}
      </button>
    </form>

    <!-- Order Confirmation -->
    <div v-if="order" class="order-confirmation">
      <h2>✅ Order Confirmed!</h2>
      <p>Order ID: {{ order.id }}</p>
      <p>Total: ${{ order.total }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutFlow',
  data() {
    return {
      cart: null,
      order: null,
      loading: false,
      shippingData: {
        name: '',
        address: '',
        city: '',
        country: 'USA',
        phone: '',
      },
    };
  },

  async mounted() {
    await this.loadCart();
  },

  methods: {
    async loadCart() {
      try {
        const response = await fetch('/api/v1/cart');
        const data = await response.json();
        this.cart = data.data.cart;
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    },

    async handleCheckout() {
      this.loading = true;
      try {
        // Initiate checkout
        const checkoutResponse = await fetch('/api/v1/checkout/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingAddress: this.shippingData,
            paymentMethodId: 'pm_test_card',
          }),
        });

        const checkoutData = await checkoutResponse.json();
        const checkout = checkoutData.data.checkout;

        // Simulate payment processing
        setTimeout(async () => {
          try {
            const paymentResponse = await fetch('/api/v1/checkout/confirm-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentIntentId: checkout.paymentIntent.id,
              }),
            });

            const paymentData = await paymentResponse.json();
            this.order = paymentData.data.order;
          } catch (error) {
            console.error('Payment failed:', error);
          }
          this.loading = false;
        }, 2000);
      } catch (error) {
        console.error('Checkout failed:', error);
        this.loading = false;
      }
    },
  },
};
</script>
```

## 🔄 **API Flow Summary**

### **Frontend → Ecommerce Service Only**

```
1. GET /api/v1/cart
   ↓ (Rich cart data with products)

2. GET /api/v1/checkout/summary
   ↓ (Validation & totals)

3. POST /api/v1/checkout/initiate
   ↓ (Creates payment intent behind scenes)

4. POST /api/v1/checkout/confirm-payment
   ↓ (Completes order & payment)
```

### **Behind the Scenes (Invisible to Frontend)**

```
Ecommerce Service → Payment Service:
- Creates payment intents
- Confirms payments
- Handles service identification
- Manages payment metadata
```

## 🎯 **Key Benefits for Frontend**

### ✅ **Simplicity**

- **Single API endpoint** for all checkout operations
- **No payment service complexity** exposed to frontend
- **Consistent response format** across all operations

### ✅ **Rich Data**

- **Full product details** in cart responses
- **Real-time inventory** validation
- **Comprehensive totals** with breakdown

### ✅ **User Experience**

- **Bulk cart operations** reduce API calls
- **Anonymous user support** with session management
- **Seamless authentication** transition

### ✅ **Error Handling**

- **Consistent error responses** from ecommerce service
- **Business logic validation** handled server-side
- **Payment failures** gracefully managed

## 🧪 **Testing the Frontend Integration**

### **1. Start Services**

```bash
# Terminal 1: Payment Service
cd services/payment && pnpm run dev:simple

# Terminal 2: Ecommerce Service
cd services/ecommerce && pnpm run dev
```

### **2. Test Cart Operations**

```bash
# Add single item to cart
curl -X POST http://localhost:3002/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -d '{"productId": "test_product", "quantity": 2}'

# Add multiple items to cart
curl -X POST http://localhost:3002/api/v1/cart/add \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": "test_product", "quantity": 2}, {"productId": "test_product2", "quantity": 1}]}'

# Get cart with full data
curl http://localhost:3002/api/v1/cart
```

### **3. Test Checkout Flow**

```bash
# Get checkout summary
curl http://localhost:3002/api/v1/checkout/summary

# Initiate checkout
curl -X POST http://localhost:3002/api/v1/checkout/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "name": "John Doe",
      "address": "123 Main St",
      "city": "New York",
      "country": "USA"
    },
    "paymentMethodId": "pm_test"
  }'

# Confirm payment (use paymentIntent.id from above)
curl -X POST http://localhost:3002/api/v1/checkout/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{"paymentIntentId": "pi_from_initiate_response"}'
```

## 🚀 **Production Considerations**

### **Security**

- All payment processing happens server-side
- Frontend never handles sensitive payment data
- Service-to-service authentication managed internally

### **Performance**

- Bulk cart operations reduce API calls
- Rich cart data eliminates additional product lookups
- Efficient checkout flow with minimal round trips

### **Scalability**

- Payment service can be scaled independently
- Frontend remains simple regardless of payment complexity
- Service identification enables proper monitoring

The frontend integration is designed to be **simple, secure, and efficient** - exactly what you
wanted! The checkout flow works seamlessly while keeping all payment complexity hidden from the
frontend. 🎉
