# Authentication Service Integration Guide

## Overview

This guide provides comprehensive instructions for integrating with the Authentication Service API.
The service provides multi-role authentication, JWT token management, and extensive security
features.

## Quick Start

### 1. Base URL and Versioning

The API uses URL-based versioning:

```
Base URL: https://api.platform.example.com
Current Version: v1
Endpoint Format: /api/v1/{resource}
```

### 2. Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### 3. Basic Registration Flow

```javascript
// 1. Register a new user
const registerResponse = await fetch('/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123!',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['CUSTOMER'],
    acceptTerms: true,
  }),
});

const { data } = await registerResponse.json();
const { user, tokens } = data;

// 2. Store tokens securely
localStorage.setItem('accessToken', tokens.accessToken);
localStorage.setItem('refreshToken', tokens.refreshToken);
```

## Authentication Flows

### User Registration

```javascript
async function registerUser(userData) {
  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Version': '1.0.0',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return await response.json();
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Usage
const newUser = await registerUser({
  email: 'user@example.com',
  password: 'securePassword123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  roles: ['CUSTOMER', 'VENDOR'],
  acceptTerms: true,
});
```

### User Login

```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();

    // Store tokens
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

    return data.data.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
```

### Token Refresh

```javascript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh token is invalid, redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return;
    }

    const data = await response.json();

    // Update stored tokens
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

    return data.data.tokens.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}
```

## API Client Implementation

### JavaScript/TypeScript Client

```typescript
class AuthAPIClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokens();
  }

  private loadTokens() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Version': '1.0.0',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle token expiration
      if (response.status === 401 && this.refreshToken) {
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          return fetch(url, { ...options, headers });
        }
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.success) {
      this.saveTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    }

    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      this.saveTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    }

    return data;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await this.makeRequest('/api/v1/auth/profile');
    return response.json();
  }

  async updateProfile(updates: ProfileUpdates): Promise<UserProfile> {
    const response = await this.makeRequest('/api/v1/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.json();
  }

  async switchRole(role: string): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/v1/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });

    const data = await response.json();

    if (data.success) {
      this.saveTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
    }

    return data;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      await this.makeRequest('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    }

    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) return null;

    try {
      const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      this.saveTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);

      return data.data.tokens.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }
}

// Usage
const authClient = new AuthAPIClient('https://api.platform.example.com');

// Register
await authClient.register({
  email: 'user@example.com',
  password: 'securePassword123!',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['CUSTOMER'],
  acceptTerms: true,
});

// Login
await authClient.login('user@example.com', 'securePassword123!');

// Get profile
const profile = await authClient.getProfile();

// Switch role
await authClient.switchRole('VENDOR');
```

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "fields": {
    "email": ["Invalid email format"],
    "password": ["Password must be at least 8 characters"]
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "req_123456789"
}
```

### Error Handling Best Practices

```javascript
async function handleAPICall(apiCall) {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    // Handle different error types
    if (error.code === 'VALIDATION_ERROR') {
      // Display field-specific errors
      Object.entries(error.fields || {}).forEach(([field, messages]) => {
        console.error(`${field}: ${messages.join(', ')}`);
      });
    } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Handle rate limiting
      const retryAfter = error.details?.retryAfter || 900;
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
    } else if (error.code === 'TOKEN_EXPIRED') {
      // Handle token expiration
      await refreshAccessToken();
    } else {
      // Handle generic errors
      console.error('API Error:', error.error);
    }

    throw error;
  }
}
```

## Rate Limiting

### Understanding Rate Limits

The API implements multiple levels of rate limiting:

- **IP-based**: 100 requests per 15 minutes for general endpoints
- **User-based**: 200 requests per 15 minutes for authenticated users
- **Authentication endpoints**: 5 requests per 15 minutes
- **Password operations**: 3 requests per 60 minutes

### Rate Limit Headers

```javascript
function checkRateLimit(response) {
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  console.log(`Rate limit: ${remaining}/${limit} remaining`);
  console.log(`Resets at: ${reset}`);

  if (remaining < 10) {
    console.warn('Approaching rate limit!');
  }
}
```

### Handling Rate Limits

```javascript
async function makeRequestWithRetry(apiCall, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiCall();

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;

        console.warn(`Rate limited. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      return response;
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## Security Best Practices

### Token Storage

```javascript
// ✅ Good: Use secure storage
class SecureTokenStorage {
  static setTokens(accessToken, refreshToken) {
    // Use httpOnly cookies in production
    document.cookie = `accessToken=${accessToken}; Secure; HttpOnly; SameSite=Strict`;
    document.cookie = `refreshToken=${refreshToken}; Secure; HttpOnly; SameSite=Strict`;
  }

  static getAccessToken() {
    // Implement secure token retrieval
    return this.getCookie('accessToken');
  }

  static clearTokens() {
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}

// ❌ Avoid: Storing tokens in localStorage in production
localStorage.setItem('accessToken', token); // Vulnerable to XSS
```

### Request Security

```javascript
// Always validate SSL certificates
const client = new AuthAPIClient('https://api.platform.example.com', {
  validateSSL: true,
  timeout: 30000,
});

// Use CSRF protection
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
headers['X-CSRF-Token'] = csrfToken;
```

## Testing

### Unit Tests

```javascript
describe('AuthAPIClient', () => {
  let client;

  beforeEach(() => {
    client = new AuthAPIClient('https://api.test.com');
  });

  test('should register user successfully', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: { id: '123', email: 'test@example.com' },
        tokens: { accessToken: 'token123', refreshToken: 'refresh123' },
      },
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await client.register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roles: ['CUSTOMER'],
      acceptTerms: true,
    });

    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe('test@example.com');
  });
});
```

### Integration Tests

```javascript
describe('Authentication Flow', () => {
  test('complete user journey', async () => {
    const client = new AuthAPIClient(process.env.TEST_API_URL);

    // Register
    const registerResult = await client.register({
      email: `test-${Date.now()}@example.com`,
      password: 'testPassword123!',
      firstName: 'Test',
      lastName: 'User',
      roles: ['CUSTOMER'],
      acceptTerms: true,
    });

    expect(registerResult.success).toBe(true);

    // Get profile
    const profile = await client.getProfile();
    expect(profile.success).toBe(true);

    // Update profile
    const updateResult = await client.updateProfile({
      firstName: 'Updated',
    });

    expect(updateResult.success).toBe(true);
    expect(updateResult.data.firstName).toBe('Updated');

    // Logout
    await client.logout();
  });
});
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if token is included in Authorization header
   - Verify token hasn't expired
   - Ensure token format is correct: `Bearer <token>`

2. **403 Forbidden**
   - User doesn't have required role/permissions
   - Check if user account is active
   - Verify role switching if needed

3. **429 Too Many Requests**
   - Implement exponential backoff
   - Check rate limit headers
   - Consider request batching

4. **Validation Errors**
   - Check required fields
   - Verify data formats (email, phone, etc.)
   - Ensure password meets security requirements

### Debug Mode

```javascript
const client = new AuthAPIClient('https://api.platform.example.com', {
  debug: true,
  onRequest: (url, options) => {
    console.log('API Request:', url, options);
  },
  onResponse: response => {
    console.log('API Response:', response.status, response.headers);
  },
  onError: error => {
    console.error('API Error:', error);
  },
});
```

## Support

For additional support:

- **Documentation**: https://docs.platform.example.com
- **API Status**: https://status.platform.example.com
- **Support Email**: api-support@platform.example.com
- **GitHub Issues**: https://github.com/platform/auth-service/issues

## Changelog

### v1.0.0

- Initial release
- Multi-role authentication
- JWT token management
- Email and phone verification
- Rate limiting and security features
