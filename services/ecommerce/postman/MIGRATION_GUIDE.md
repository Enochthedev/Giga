# 🔄 Migration Guide: Microservice → Supabase

This guide helps you migrate from the old microservice-based ecommerce API to the new Supabase-based
implementation.

## 📋 What Changed

### Old Architecture (Microservice)

- Custom Express.js API server
- Local database with Prisma
- Custom authentication
- Manual cart/order management
- Complex deployment

### New Architecture (Supabase)

- Supabase REST API (PostgREST)
- Supabase Auth for authentication
- Edge Functions for business logic
- Automatic triggers and RLS
- Serverless deployment

## 🔄 API Endpoint Mapping

| Old Microservice Endpoint | New Supabase Endpoint                          | Notes               |
| ------------------------- | ---------------------------------------------- | ------------------- |
| `POST /api/v1/auth/login` | `POST {{auth_url}}/token?grant_type=password`  | Supabase Auth       |
| `GET /api/v1/products`    | `GET {{base_url}}/ecommerce_products`          | PostgREST           |
| `GET /api/v1/cart`        | `GET {{base_url}}/ecommerce_carts`             | PostgREST with RLS  |
| `POST /api/v1/cart/add`   | `POST {{base_url}}/ecommerce_cart_items`       | Direct table insert |
| `POST /api/v1/orders`     | `POST {{functions_url}}/create-payment-intent` | Stripe integration  |
| `GET /api/v1/orders`      | `GET {{base_url}}/ecommerce_orders`            | PostgREST with RLS  |

## 🔑 Authentication Changes

### Old Way (Custom JWT)

```http
POST /api/v1/auth/login
Body: { "email": "user@example.com", "password": "password" }
Response: { "token": "custom-jwt-token" }
```

### New Way (Supabase Auth)

```http
POST {{auth_url}}/token?grant_type=password
Headers: { "apikey": "{{anon_key}}" }
Body: { "email": "user@example.com", "password": "password" }
Response: { "access_token": "supabase-jwt", "user": {...} }
```

## 🛒 Cart Management Changes

### Old Way (Custom Logic)

```http
# Guest cart with X-Cart-Id header
GET /api/v1/cart
Headers: { "X-Cart-Id": "cart_anonymous_uuid" }

# Add item
POST /api/v1/cart/add
Headers: { "X-Cart-Id": "cart_anonymous_uuid" }
Body: { "productId": "prod_123", "quantity": 2 }
```

### New Way (Database-First)

```http
# Get user's cart (authenticated)
GET {{base_url}}/ecommerce_carts?user_id=eq.{{user_id}}
Headers: { "Authorization": "Bearer {{access_token}}" }

# Add item directly to cart_items table
POST {{base_url}}/ecommerce_cart_items
Headers: { "Authorization": "Bearer {{access_token}}" }
Body: { "cart_id": "{{cart_id}}", "product_id": "{{product_id}}", "quantity": 2 }
```

## 📦 Order Creation Changes

### Old Way (Single Endpoint)

```http
POST /api/v1/orders
Body: {
  "shippingAddress": {...},
  "paymentMethod": "credit_card"
}
```

### New Way (Payment-First)

```http
# 1. Create payment intent
POST {{functions_url}}/create-payment-intent
Body: { "cart_id": "{{cart_id}}" }

# 2. Confirm payment on frontend with Stripe.js
# 3. Webhook automatically creates order
```

## 🔍 Query Syntax Changes

### Old Way (REST Parameters)

```http
GET /api/v1/products?page=1&limit=20&category=Electronics&sortBy=price&sortOrder=asc
```

### New Way (PostgREST)

```http
GET {{base_url}}/ecommerce_products?category_id=eq.CATEGORY_ID&is_active=eq.true&limit=20&offset=0&order=base_price.asc
```

## 🚀 Migration Steps

### 1. Update Postman Collection

- [ ] Import `Ecommerce-API-Supabase.postman_collection.json`
- [ ] Import `Ecommerce-Supabase.postman_environment.json`
- [ ] Set your Supabase `anon_key` in environment

### 2. Test Authentication

- [ ] Try Sign Up endpoint
- [ ] Try Login endpoint
- [ ] Verify `access_token` is auto-saved

### 3. Test Core Workflows

- [ ] Browse products
- [ ] Get/create cart
- [ ] Add items to cart
- [ ] Create payment intent
- [ ] View orders

### 4. Update Frontend Code

```javascript
// Old way
const response = await fetch('/api/v1/products');

// New way
const response = await fetch(
  'https://xxx.supabase.co/rest/v1/ecommerce_products?is_active=eq.true',
  {
    headers: {
      apikey: 'your-anon-key',
    },
  }
);
```

### 5. Handle RLS Policies

- Ensure users can only access their own carts/orders
- Vendors can only manage their own products
- Admin endpoints require ADMIN role

## ⚠️ Breaking Changes

1. **Guest Carts**: No longer supported. Users must sign up/login.
2. **Custom Headers**: No more `X-Cart-Id`. Use authentication.
3. **Response Format**: PostgREST returns arrays, not wrapped objects.
4. **Error Format**: Different error response structure.
5. **Pagination**: Use `limit`/`offset` instead of `page`/`limit`.

## 🔧 Troubleshooting

### Common Issues

**401 Unauthorized**

- Check `anon_key` is set correctly
- Verify `access_token` for authenticated endpoints

**400 Bad Request**

- Check PostgREST query syntax (`eq.`, `gt.`, etc.)
- Verify column names match database schema

**403 Forbidden**

- RLS policy blocking access
- Check user has correct role/permissions

**Network Error**

- Verify Supabase URLs are correct
- Check if Supabase project is active

## 📚 Resources

- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## 🎯 Next Steps

1. **Phase 1**: Run both APIs in parallel
2. **Phase 2**: Migrate frontend to Supabase endpoints
3. **Phase 3**: Deprecate microservice API
4. **Phase 4**: Remove microservice infrastructure

---

**Need Help?** Check the updated README.md or Supabase documentation.
