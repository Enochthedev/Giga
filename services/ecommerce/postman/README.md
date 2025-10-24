# 🛒 Ecommerce API - Postman Collection

**28 endpoints** ready to test! Import and start testing in 2 minutes.

## 📦 What's Included

| Category             | Endpoints | What You Can Do                                 |
| -------------------- | --------- | ----------------------------------------------- |
| 🛍️ **Shopping Cart** | 9         | Add items, update quantities, merge guest carts |
| 📦 **Products**      | 3         | Browse, search, view details                    |
| 📋 **Orders**        | 4         | Create, view, cancel orders                     |
| ✅ **Checkout**      | 2         | Validate cart, reserve inventory                |
| 🏪 **Vendors**       | 4         | Browse vendors, view products                   |
| 🎁 **Promotions**    | 2         | Get deals, validate codes                       |
| 🚚 **Shipping**      | 2         | Get methods, calculate costs                    |
| 📍 **Tracking**      | 2         | Track deliveries                                |

## 🚀 Get Started (2 Minutes)

### Step 1: Import

1. Open Postman
2. Click **Import**
3. Drag these files:
   - `Ecommerce-API.postman_collection.json`
   - `Ecommerce-Local.postman_environment.json`

### Step 2: Select Environment

- Choose **"Ecommerce Local Development"** from dropdown (top right)

### Step 3: Test!

```bash
# Make sure service is running
pnpm run dev
```

Try **Health Check** → Click **Send** → Should see `"status": "healthy"`

## 🎯 Common Workflows

### Guest Shopping

```
1. Get Cart (Guest) → Creates anonymous cart
2. Add Item to Cart → Add products
3. Update Item Quantity → Change amounts
4. Validate Cart → Check before checkout
5. Create Order → Complete purchase
```

### Login & Merge

```
1. Shop as guest → Add items to anonymous cart
2. Login → Get auth token
3. Merge Cart → Combine with user cart
4. Continue shopping → As authenticated user
```

### Vendor Management

```
1. Create Vendor → Register as vendor
2. Add Products → List items for sale
3. View Orders → See customer orders
4. Update Status → Process orders
```

## 🔑 Variables

| Variable          | What It's For | Example                  |
| ----------------- | ------------- | ------------------------ |
| `baseUrl`         | API endpoint  | `http://localhost:3002`  |
| `authToken`       | Login token   | (set after login)        |
| `anonymousCartId` | Guest cart    | `cart_anonymous_550e...` |

## 📝 Simple Examples

### Get Cart (Guest)

```http
GET /api/v1/cart
Headers:
  X-Cart-Id: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
```

### Add Item

```http
POST /api/v1/cart/add
Headers:
  X-Cart-Id: cart_anonymous_550e8400-e29b-41d4-a716-446655440000
Body:
{
  "productId": "prod_123",
  "quantity": 2
}
```

### Create Order

```http
POST /api/v1/orders
Headers:
  Authorization: Bearer YOUR_TOKEN
Body:
{
  "shippingAddress": {
    "name": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

## ❌ Common Errors

| Error              | Why                 | Fix                            |
| ------------------ | ------------------- | ------------------------------ |
| Connection refused | Service not running | Run `pnpm run dev`             |
| X-Cart-Id required | Missing header      | Add X-Cart-Id header for guest |
| Product not found  | Invalid ID          | Get valid ID from `/products`  |
| Unauthorized       | No auth token       | Login and set `authToken`      |

## 💡 Pro Tips

1. **Check Examples** - Each request has success/error examples
2. **Use Console** - View → Show Postman Console for details
3. **Save Responses** - Add your own examples
4. **Generate Cart ID** - Use UUID v4 format
5. **Test Errors** - Try invalid data to see error handling

## 📚 More Help

- **Quick Start**: See `POSTMAN_QUICK_START.md`
- **Guest Cart Guide**: See `GUEST_CART_GUIDE.md`
- **API Docs**: http://localhost:3002/docs
- **Swagger UI**: Interactive API documentation

## 🔄 Keep Updated

When APIs change:

- ✅ Update collection JSON
- ✅ Add new endpoints
- ✅ Update examples
- ✅ Test everything works

---

**Questions?** Check the main README or API docs at `/docs`
