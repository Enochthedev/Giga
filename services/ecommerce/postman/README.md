# 🛒 Giga E-commerce API - Supabase Collection

**Complete Supabase-based e-commerce API** ready to test! Two collections available:

## 📦 Collections Available

### 🆕 **Supabase Collection** (Recommended)

- **File**: `Ecommerce-API-Supabase.postman_collection.json`
- **Environment**: `Ecommerce-Supabase.postman_environment.json`
- **Uses**: Supabase REST API + Edge Functions

| Category                 | Endpoints | What You Can Do                            |
| ------------------------ | --------- | ------------------------------------------ |
| 🔐 **Authentication**    | 2         | Sign up, login with Supabase Auth          |
| 🛍️ **Products**          | 3         | Browse products, categories with PostgREST |
| 🛒 **Shopping Cart**     | 4         | Add items, update quantities via Supabase  |
| 💳 **Checkout**          | 1         | Create Stripe payment intents              |
| 📦 **Orders**            | 2         | View orders, track status                  |
| 🏪 **Vendor Management** | 2         | Apply to be vendor, create products        |

### 🔄 **Legacy Microservice Collection** (Deprecated)

- **File**: `Ecommerce-API-Legacy.postman_collection.json`
- **Status**: ⚠️ **DEPRECATED** - Use Supabase collection instead
- **Migration**: See `MIGRATION_GUIDE.md` for transition steps

## 🚀 Get Started with Supabase Collection (2 Minutes)

### Step 1: Import

1. Open Postman
2. Click **Import**
3. Drag these files:
   - `Ecommerce-API-Supabase.postman_collection.json`
   - `Ecommerce-Supabase.postman_environment.json`

### Step 2: Configure Environment

1. Select **"Giga E-commerce Supabase Environment"** from dropdown
2. Click the eye icon 👁️ to edit variables
3. Update `anon_key` with your actual Supabase anon key
4. Update URLs if using different Supabase project

### Step 3: Test Authentication!

1. Try **Sign Up** → Create a new user
2. Try **Login** → Get access token (auto-saved)
3. Try **Get All Products** → Browse products

## 🎯 Common Workflows

### Customer Shopping Flow

```
1. Sign Up/Login → Get authenticated
2. Get All Products → Browse catalog
3. Get Cart → Get or create cart
4. Add Item to Cart → Add products
5. Create Payment Intent → Start checkout
6. Get All Orders → View order history
```

### Vendor Flow

```
1. Sign Up/Login → Get authenticated
2. Apply to Become Vendor → Submit application
3. Create Product → Add products to catalog
4. Get All Orders → View customer orders
```

### PostgREST Query Examples

```
# Filter products by category
?category_id=eq.CATEGORY_ID&is_active=eq.true

# Get products with relationships
?select=*,category:ecommerce_categories(name),vendor:ecommerce_vendors(business_name)

# Pagination
?limit=20&offset=0&order=created_at.desc
```

## 🔑 Environment Variables

| Variable        | What It's For           | Example                                |
| --------------- | ----------------------- | -------------------------------------- |
| `base_url`      | Supabase REST API       | `https://xxx.supabase.co/rest/v1`      |
| `auth_url`      | Supabase Auth API       | `https://xxx.supabase.co/auth/v1`      |
| `functions_url` | Supabase Edge Functions | `https://xxx.supabase.co/functions/v1` |
| `anon_key`      | Supabase Anonymous Key  | `eyJ...` (from Supabase dashboard)     |
| `access_token`  | User JWT token          | (auto-set after login)                 |
| `user_id`       | Current user ID         | (auto-set after login)                 |
| `cart_id`       | Current cart ID         | (auto-set when cart retrieved)         |
| `product_id`    | Sample product ID       | (auto-set from product list)           |
| `order_id`      | Sample order ID         | (auto-set from order list)             |

## 📝 Supabase API Examples

### Authentication

```http
POST {{auth_url}}/signup
Headers:
  apikey: {{anon_key}}
  Content-Type: application/json
Body:
{
  "email": "user@example.com",
  "password": "password123",
  "options": {
    "data": {
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### Get Products (PostgREST)

```http
GET {{base_url}}/ecommerce_products?is_active=eq.true&limit=20
Headers:
  apikey: {{anon_key}}
```

### Add Item to Cart

```http
POST {{base_url}}/ecommerce_cart_items
Headers:
  apikey: {{anon_key}}
  Authorization: Bearer {{access_token}}
  Content-Type: application/json
Body:
{
  "cart_id": "{{cart_id}}",
  "product_id": "{{product_id}}",
  "quantity": 2,
  "price_per_unit": 4500.00
}
```

### Create Payment Intent (Edge Function)

```http
POST {{functions_url}}/create-payment-intent
Headers:
  Authorization: Bearer {{access_token}}
  Content-Type: application/json
Body:
{
  "cart_id": "{{cart_id}}"
}
```

## ❌ Common Errors

| Error            | Why                      | Fix                                   |
| ---------------- | ------------------------ | ------------------------------------- |
| 401 Unauthorized | Missing/invalid anon_key | Set correct `anon_key` in environment |
| 401 Unauthorized | Missing access_token     | Login first to get access_token       |
| 400 Bad Request  | Invalid PostgREST query  | Check query syntax (eq., gt., etc.)   |
| 404 Not Found    | Invalid table/column     | Verify table names in Supabase        |
| 403 Forbidden    | RLS policy violation     | Ensure user has permission for action |
| Network Error    | Wrong Supabase URL       | Verify URLs in environment variables  |

## 💡 Pro Tips

1. **Auto-Save Variables** - Login/signup automatically save `access_token` and `user_id`
2. **PostgREST Syntax** - Use `eq.`, `gt.`, `lt.` for filtering
3. **Relationships** - Use `select=*,table:other_table(*)` for joins
4. **RLS Policies** - Some endpoints require specific user roles
5. **Test Scripts** - Collection includes test scripts to save IDs automatically

## 📚 PostgREST Query Reference

```
# Exact match
?column=eq.value

# Comparisons
?column=gt.100&column=lt.500

# Text search
?column=like.*search*

# Ordering
?order=created_at.desc

# Pagination
?limit=20&offset=0

# Relationships
?select=*,category:ecommerce_categories(name)
```

## 🔄 Migration from Microservice

If migrating from the old microservice collection:

1. ✅ Import new Supabase collection
2. ✅ Update environment variables
3. ✅ Test authentication flow
4. ✅ Verify cart and order workflows
5. ✅ Remove old collection when ready

## 📚 More Help

- **Supabase Docs**: https://supabase.com/docs
- **PostgREST API**: https://postgrest.org/en/stable/
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

---

**Questions?** Check Supabase dashboard or PostgREST documentation
