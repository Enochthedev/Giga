# Multi-Sided Platform API Documentation

## 🌐 Base URLs

- **Gateway (Production)**: `https://api.yourplatform.com`
- **Gateway (Development)**: `http://localhost:3000`
- **Direct Service Access** (Development only):
  - Auth: `http://localhost:3001`
  - Ecommerce: `http://localhost:3002`
  - Payment: `http://localhost:3003`
  - Taxi: `http://localhost:3004`
  - Hotel: `http://localhost:3005`
  - Ads: `http://localhost:3006`

## 🔐 Authentication

All API requests (except registration and login) require authentication via JWT token in the
Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle

- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days (30 days with "Remember Me")
- **Auto-refresh**: Implement token refresh logic in your client

---

## 👤 Authentication Service

### User Registration

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roles": ["CUSTOMER", "VENDOR"],
  "acceptTerms": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clr123abc",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["CUSTOMER", "VENDOR"],
      "activeRole": "CUSTOMER",
      "avatar": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "abc123def456...",
      "expiresIn": 900
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### User Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123",
  "rememberMe": false
}
```

### Switch User Role

```http
POST /api/v1/auth/switch-role
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetRole": "VENDOR",
  "targetService": "ECOMMERCE"
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "abc123def456..."
}
```

### Get User Profile

```http
GET /api/v1/auth/profile
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clr123abc",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "avatar": "https://cdn.example.com/avatars/john.jpg",
    "roles": ["CUSTOMER", "VENDOR"],
    "activeRole": "VENDOR",
    "isEmailVerified": true,
    "isPhoneVerified": false,
    "profiles": {
      "customer": {
        "id": "clr123customer",
        "preferences": {},
        "addresses": []
      },
      "vendor": {
        "id": "clr123vendor",
        "businessName": "John's Store",
        "subscriptionTier": "basic",
        "commissionRate": 0.15,
        "isVerified": false,
        "rating": null,
        "totalSales": 0
      }
    },
    "lastLoginAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-10T08:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

---

## 🛒 Ecommerce Service (Phase 2)

### Product Management

#### Get Products (Customer View)

```http
GET /api/v1/products?page=1&limit=20&category=electronics&minPrice=10&maxPrice=1000&q=smartphone
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `q`: Search query
- `category`: Product category
- `minPrice`, `maxPrice`: Price range
- `brand`: Filter by brand
- `rating`: Minimum rating (1-5)
- `inStock`: Only show in-stock items (true/false)
- `sortBy`: Sort field (price, rating, created_at)
- `sortOrder`: Sort direction (asc, desc)

#### Get Single Product

```http
GET /api/v1/products/{productId}
```

#### Create Product (Vendor Only)

```http
POST /api/v1/vendor/products
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "comparePrice": 1099.99,
  "sku": "IPH15PRO-128-BLU",
  "category": "electronics",
  "subcategory": "smartphones",
  "brand": "Apple",
  "images": [
    "https://cdn.example.com/products/iphone15pro-1.jpg",
    "https://cdn.example.com/products/iphone15pro-2.jpg"
  ],
  "specifications": {
    "storage": "128GB",
    "color": "Blue",
    "warranty": "1 year"
  },
  "inventory": {
    "quantity": 50,
    "lowStockThreshold": 5,
    "trackQuantity": true
  }
}
```

### Shopping Cart

#### Get Cart

```http
GET /api/v1/cart
Authorization: Bearer <customer_token>
```

#### Add to Cart

```http
POST /api/v1/cart/add
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "productId": "clr123product",
  "quantity": 2
}
```

#### Update Cart Item

```http
PUT /api/v1/cart/items/{itemId}
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart

```http
DELETE /api/v1/cart/items/{itemId}
Authorization: Bearer <customer_token>
```

### Order Management

#### Create Order

```http
POST /api/v1/orders
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "clr123product",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethodId": "pm_1234567890"
}
```

#### Get Orders (Customer)

```http
GET /api/v1/orders?page=1&limit=10&status=delivered
Authorization: Bearer <customer_token>
```

#### Get Orders (Vendor)

```http
GET /api/v1/vendor/orders?page=1&limit=10&status=pending
Authorization: Bearer <vendor_token>
```

#### Update Order Status (Vendor)

```http
PUT /api/v1/vendor/orders/{orderId}/status
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890"
}
```

### Vendor Dashboard

#### Get Dashboard Stats

```http
GET /api/v1/vendor/dashboard
Authorization: Bearer <vendor_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalProducts": 25,
    "totalOrders": 150,
    "totalRevenue": 15750.50,
    "pendingOrders": 8,
    "lowStockProducts": 3,
    "recentOrders": [...],
    "topProducts": [...],
    "analytics": {
      "salesThisMonth": 5250.75,
      "ordersThisMonth": 45,
      "averageOrderValue": 116.68,
      "conversionRate": 0.034
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🚗 Taxi Service (Phase 3)

### Ride Management

#### Request Ride (Passenger)

```http
POST /api/v1/rides/request
Authorization: Bearer <passenger_token>
Content-Type: application/json

{
  "pickupLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "dropoffLocation": {
    "latitude": 40.7589,
    "longitude": -73.9851,
    "address": "456 Broadway, New York, NY"
  },
  "vehicleType": "comfort",
  "scheduledTime": "2024-01-15T14:30:00.000Z",
  "notes": "Please call when you arrive"
}
```

#### Get Ride Status

```http
GET /api/v1/rides/{rideId}
Authorization: Bearer <token>
```

#### Track Ride (Real-time)

```http
GET /api/v1/rides/{rideId}/track
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "rideId": "clr123ride",
    "status": "started",
    "driverLocation": {
      "latitude": 40.72,
      "longitude": -74.01
    },
    "estimatedArrival": 8,
    "lastUpdated": "2024-01-15T14:35:00.000Z"
  }
}
```

### Driver Operations

#### Update Driver Status

```http
PUT /api/v1/drivers/status
Authorization: Bearer <driver_token>
Content-Type: application/json

{
  "isOnline": true,
  "currentLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "status": "available"
}
```

#### Accept Ride

```http
POST /api/v1/drivers/rides/{rideId}/accept
Authorization: Bearer <driver_token>
```

#### Get Driver Earnings

```http
GET /api/v1/drivers/earnings
Authorization: Bearer <driver_token>
```

---

## 🏨 Hotel Service (Phase 3)

### Property Search

#### Search Properties

```http
GET /api/v1/properties/search?location=New York&checkIn=2024-02-01&checkOut=2024-02-05&guests=2&propertyType=apartment&minPrice=100&maxPrice=300
```

**Query Parameters:**

- `location`: City or address
- `checkIn`, `checkOut`: ISO date strings
- `guests`: Number of guests
- `propertyType`: apartment, house, villa, hotel, resort, hostel
- `minPrice`, `maxPrice`: Price per night
- `amenities`: Array of amenity names
- `instantBook`: true/false
- `rating`: Minimum rating

#### Get Property Details

```http
GET /api/v1/properties/{propertyId}
```

### Booking Management

#### Create Booking

```http
POST /api/v1/bookings
Authorization: Bearer <guest_token>
Content-Type: application/json

{
  "propertyId": "clr123property",
  "checkIn": "2024-02-01T15:00:00.000Z",
  "checkOut": "2024-02-05T11:00:00.000Z",
  "guests": 2,
  "specialRequests": "Late check-in around 10 PM",
  "guestInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "paymentMethodId": "pm_1234567890"
}
```

#### Get Bookings (Guest)

```http
GET /api/v1/bookings?status=confirmed
Authorization: Bearer <guest_token>
```

### Host Dashboard

#### Get Host Dashboard

```http
GET /api/v1/host/dashboard
Authorization: Bearer <host_token>
```

#### Manage Property

```http
POST /api/v1/host/properties
Authorization: Bearer <host_token>
Content-Type: application/json

{
  "title": "Cozy Manhattan Apartment",
  "description": "Beautiful 2BR apartment in the heart of NYC",
  "propertyType": "apartment",
  "roomType": "entire_place",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, New York, NY",
    "city": "New York",
    "country": "USA"
  },
  "capacity": {
    "guests": 4,
    "bedrooms": 2,
    "beds": 2,
    "bathrooms": 1
  },
  "pricing": {
    "basePrice": 150,
    "cleaningFee": 25,
    "serviceFee": 15
  },
  "amenities": ["wifi", "kitchen", "parking", "pool"],
  "images": [...]
}
```

---

## 💳 Payment Service (Phase 2)

### Payment Methods

#### Add Payment Method

```http
POST /api/v1/payments/methods
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "card",
  "provider": "stripe",
  "token": "tok_1234567890",
  "setAsDefault": true
}
```

#### Get Payment Methods

```http
GET /api/v1/payments/methods
Authorization: Bearer <token>
```

### Process Payments

#### Create Payment

```http
POST /api/v1/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 99.99,
  "currency": "USD",
  "paymentMethodId": "pm_1234567890",
  "description": "Order #12345",
  "metadata": {
    "orderId": "clr123order",
    "service": "ecommerce"
  }
}
```

#### Get Payment History

```http
GET /api/v1/payments?page=1&limit=20&status=succeeded
Authorization: Bearer <token>
```

### Payouts (Vendors/Drivers/Hosts)

#### Get Payout History

```http
GET /api/v1/payments/payouts
Authorization: Bearer <provider_token>
```

---

## 📢 Advertisement Service (Phase 3)

### Campaign Management

#### Create Campaign

```http
POST /api/v1/campaigns
Authorization: Bearer <advertiser_token>
Content-Type: application/json

{
  "name": "Summer Sale Campaign",
  "budget": 1000,
  "dailyBudget": 50,
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-06-30T23:59:59.000Z",
  "targetAudience": {
    "age": [25, 45],
    "interests": ["shopping", "electronics"],
    "location": ["New York", "Los Angeles"]
  },
  "adCreatives": [
    {
      "type": "banner",
      "title": "Summer Electronics Sale",
      "description": "Up to 50% off on all electronics",
      "imageUrl": "https://cdn.example.com/ads/summer-sale.jpg",
      "callToAction": "Shop Now"
    }
  ]
}
```

#### Get Campaign Analytics

```http
GET /api/v1/campaigns/{campaignId}/analytics
Authorization: Bearer <advertiser_token>
```

---

## 🔍 Search Service (Phase 4)

### Universal Search

```http
GET /api/v1/search?q=smartphone&services=ecommerce,ads&page=1&limit=20
```

**Query Parameters:**

- `q`: Search query
- `services`: Comma-separated list of services to search
- `filters`: Service-specific filters
- `page`, `limit`: Pagination

---

## 📊 Analytics Service (Phase 4)

### Business Analytics

```http
GET /api/v1/analytics/dashboard
Authorization: Bearer <admin_token>
```

### Service-Specific Analytics

```http
GET /api/v1/analytics/ecommerce?period=30d&metrics=revenue,orders,users
Authorization: Bearer <admin_token>
```

---

## 💬 Messaging Service (Phase 4)

### Real-time Chat

```http
POST /api/v1/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "clr123conv",
  "message": "Hello, I have a question about my order",
  "type": "text"
}
```

### Get Conversations

```http
GET /api/v1/conversations
Authorization: Bearer <token>
```

---

## 🚨 Error Handling

All API responses follow a consistent error format:

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Email is required",
  "details": {
    "field": "email",
    "code": "REQUIRED"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## 📱 WebSocket Events (Real-time Features)

### Taxi Service Events

```javascript
// Connect to taxi WebSocket
const ws = new WebSocket('ws://localhost:3004/rides/track');

// Listen for ride updates
ws.on('ride_update', data => {
  console.log('Ride status:', data.status);
  console.log('Driver location:', data.driverLocation);
});

// Send location update (driver)
ws.send(
  JSON.stringify({
    type: 'location_update',
    rideId: 'clr123ride',
    location: { latitude: 40.7128, longitude: -74.006 },
  })
);
```

### Messaging Events

```javascript
// Connect to messaging WebSocket
const ws = new WebSocket('ws://localhost:3007/chat');

// Listen for new messages
ws.on('new_message', data => {
  console.log('New message:', data.message);
});
```

---

## 🔐 Rate Limiting

### Default Limits

- **Authentication**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **Search**: 50 requests per minute per user
- **File Upload**: 10 requests per minute per user

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## 🧪 Testing

### Postman Collection

Import the Postman collection from `/docs/postman/` for easy API testing.

### Example cURL Commands

```bash
# Register new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "roles": ["CUSTOMER"],
    "acceptTerms": true
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get products
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

This API documentation will be updated as we implement each phase of the platform. All endpoints
include proper authentication, validation, and error handling.
