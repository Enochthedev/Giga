# Authentication Service API Guide

This guide provides detailed examples of how to use the Authentication Service API.

## 🚀 Getting Started

### Base URL

```
http://localhost:3001
```

### Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:3001/docs
```

## 🔐 Authentication Flow

### 1. User Registration

Register a new user account:

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clp123abc456def789",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isEmailVerified": false,
      "isPhoneVerified": false,
      "activeRole": "CUSTOMER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "User registered successfully. Please verify your email."
}
```

### 2. Email Verification

After registration, verify the email address:

```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "email-verification-token-from-email"
  }'
```

### 3. User Login

Login with email and password:

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "deviceFingerprint": "optional-device-id"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clp123abc456def789",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "activeRole": "CUSTOMER",
      "roles": ["CUSTOMER"]
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

### 4. Token Refresh

Refresh an expired access token:

```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### 5. Logout

Logout and invalidate tokens:

```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 👤 Profile Management

### Get User Profile

Retrieve the current user's profile:

```bash
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clp123abc456def789",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isEmailVerified": true,
    "isPhoneVerified": false,
    "activeRole": "CUSTOMER",
    "roles": [
      {
        "id": "role-id",
        "role": {
          "name": "CUSTOMER"
        }
      }
    ],
    "customerProfile": {
      "id": "profile-id",
      "loyaltyPoints": 0,
      "membershipTier": "BRONZE"
    }
  }
}
```

### Update Profile

Update user profile information:

```bash
curl -X PUT http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1987654321"
  }'
```

## 🔄 Role Management

### Switch Active Role

Switch between available roles:

```bash
curl -X POST http://localhost:3001/api/v1/auth/switch-role \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "VENDOR"
  }'
```

## 🔒 Password Management

### Change Password

Change the current password:

```bash
curl -X PUT http://localhost:3001/api/v1/auth/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'
```

### Request Password Reset

Request a password reset email:

```bash
curl -X POST http://localhost:3001/api/v1/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

### Verify Reset Token

Verify a password reset token:

```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "password-reset-token-from-email"
  }'
```

### Reset Password

Reset password with token:

```bash
curl -X POST http://localhost:3001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "password-reset-token-from-email",
    "newPassword": "NewSecurePass456!"
  }'
```

## 📱 Phone Verification

### Send Phone Verification

Send SMS verification code:

```bash
curl -X POST http://localhost:3001/api/v1/auth/send-phone-verification \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Verify Phone

Verify phone with SMS code:

```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-phone \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

## 📧 Email Verification

### Send Email Verification

Send email verification:

```bash
curl -X POST http://localhost:3001/api/v1/auth/send-email-verification \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Resend Email Verification

Resend verification email:

```bash
curl -X POST http://localhost:3001/api/v1/auth/resend-email-verification \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🏥 Health Checks

### Basic Health Check

```bash
curl -X GET http://localhost:3001/health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development"
}
```

### Detailed Health Check

```bash
curl -X GET http://localhost:3001/health/metrics
```

### Liveness Probe (Kubernetes)

```bash
curl -X GET http://localhost:3001/health/live
```

### Readiness Probe (Kubernetes)

```bash
curl -X GET http://localhost:3001/health/ready
```

## 📊 Admin Endpoints

### Get User by ID (Admin only)

```bash
curl -X GET http://localhost:3001/api/v1/users/clp123abc456def789 \
  -H "Authorization: Bearer admin-jwt-token"
```

### List Users (Admin only)

```bash
curl -X GET "http://localhost:3001/api/v1/users?page=1&limit=10&role=CUSTOMER" \
  -H "Authorization: Bearer admin-jwt-token"
```

### Update User Status (Admin only)

```bash
curl -X PATCH http://localhost:3001/api/v1/users/clp123abc456def789/status \
  -H "Authorization: Bearer admin-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false,
    "reason": "Account suspended for policy violation"
  }'
```

## 🔍 Error Handling

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "details": {
    "field": "password",
    "message": "Password is incorrect"
  }
}
```

### Common Error Codes

| Code                       | Description                     |
| -------------------------- | ------------------------------- |
| `VALIDATION_ERROR`         | Request validation failed       |
| `INVALID_CREDENTIALS`      | Login credentials are invalid   |
| `USER_NOT_FOUND`           | User does not exist             |
| `USER_EXISTS`              | User already exists             |
| `TOKEN_EXPIRED`            | JWT token has expired           |
| `TOKEN_INVALID`            | JWT token is invalid            |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `RATE_LIMIT_EXCEEDED`      | Too many requests               |
| `ACCOUNT_LOCKED`           | Account is temporarily locked   |
| `EMAIL_NOT_VERIFIED`       | Email verification required     |
| `PHONE_NOT_VERIFIED`       | Phone verification required     |

## 🚦 Rate Limiting

The API implements rate limiting with the following limits:

| Endpoint Type       | Limit        | Window     |
| ------------------- | ------------ | ---------- |
| Authentication      | 5 requests   | 15 minutes |
| Password operations | 3 requests   | 60 minutes |
| General API         | 100 requests | 15 minutes |

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## 🔐 Security Headers

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

## 📱 Client Integration Examples

### JavaScript/TypeScript

```typescript
class AuthClient {
  private baseUrl = 'http://localhost:3001';
  private accessToken: string | null = null;

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      this.accessToken = data.data.tokens.accessToken;
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    }

    return data;
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/profile`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return response.json();
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success) {
      this.accessToken = data.data.accessToken;
      localStorage.setItem('accessToken', this.accessToken);
    }

    return data;
  }
}
```

### Python

```python
import requests
import json

class AuthClient:
    def __init__(self, base_url='http://localhost:3001'):
        self.base_url = base_url
        self.access_token = None

    def login(self, email, password):
        response = requests.post(
            f'{self.base_url}/api/v1/auth/login',
            json={'email': email, 'password': password}
        )

        data = response.json()

        if data.get('success'):
            self.access_token = data['data']['tokens']['accessToken']

        return data

    def get_profile(self):
        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = requests.get(
            f'{self.base_url}/api/v1/auth/profile',
            headers=headers
        )

        return response.json()

    def refresh_token(self, refresh_token):
        response = requests.post(
            f'{self.base_url}/api/v1/auth/refresh',
            json={'refreshToken': refresh_token}
        )

        data = response.json()

        if data.get('success'):
            self.access_token = data['data']['accessToken']

        return data
```

## 🧪 Testing

### Test User Accounts

For development and testing, you can use these pre-seeded accounts:

```json
{
  "admin": {
    "email": "admin@platform.com",
    "password": "AdminPass123!",
    "role": "ADMIN"
  },
  "customer": {
    "email": "customer@example.com",
    "password": "CustomerPass123!",
    "role": "CUSTOMER"
  },
  "vendor": {
    "email": "vendor@example.com",
    "password": "VendorPass123!",
    "role": "VENDOR"
  }
}
```

### Postman Collection

Import the Postman collection for easy testing:

1. Download the collection from `/docs/postman-collection.json`
2. Import into Postman
3. Set the `baseUrl` variable to `http://localhost:3001`
4. Run the authentication flow

---

For more detailed information, visit the [Swagger documentation](http://localhost:3001/docs) or
check the main [README](./README.md).
