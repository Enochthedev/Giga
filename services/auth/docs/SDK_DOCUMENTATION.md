# Authentication Service SDK Documentation

## Overview

This document provides comprehensive SDK documentation for integrating with the Authentication Service across different programming languages and frameworks.

## JavaScript/TypeScript SDK

### Installation

```bash
npm install @platform/auth-sdk
# or
yarn add @platform/auth-sdk
```

### Basic Usage

```typescript
import { AuthSDK } from '@platform/auth-sdk';

const auth = new AuthSDK({
  baseURL: 'https://api.platform.example.com',
  version: '1.0.0',
  timeout: 30000
});

// Register user
const user = await auth.register({
  email: 'user@example.com',
  password: 'securePassword123!',
  firstName: 'John',
  lastName: 'Doe',
  roles: ['CUSTOMER'],
  acceptTerms: true
});

// Login
await auth.login('user@example.com', 'securePassword123!');

// Get profile
const profile = await auth.getProfile();
```

### Configuration Options

```typescript
interface AuthSDKConfig {
  baseURL: string;
  version?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  debug?: boolean;
  storage?: 'localStorage' | 'sessionStorage' | 'memory' | 'custom';
  customStorage?: TokenStorage;
  onTokenRefresh?: (tokens: TokenPair) => void;
  onError?: (error: AuthError) => void;
}

const auth = new AuthSDK({
  baseURL: 'https://api.platform.example.com',
  version: '1.0.0',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  debug: process.env.NODE_ENV === 'development',
  storage: 'localStorage',
  onTokenRefresh: (tokens) => {
    console.log('Tokens refreshed:', tokens);
  },
  onError: (error) => {
    console.error('Auth error:', error);
  }
});
```

### API Methods

#### Authentication

```typescript
// Register new user
interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: RoleName[];
  acceptTerms: boolean;
}

const result = await auth.register(userData);

// Login user
const result = await auth.login(email, password);

// Refresh tokens
const tokens = await auth.refreshTokens();

// Logout
await auth.logout();

// Check authentication status
const isAuthenticated = auth.isAuthenticated();
```

#### Profile Management

```typescript
// Get user profile
const profile = await auth.getProfile();

// Update profile
const updatedProfile = await auth.updateProfile({
  firstName: 'Updated Name',
  phone: '+1234567890'
});

// Change password
await auth.changePassword('currentPassword', 'newPassword');

// Switch role
await auth.switchRole('VENDOR');
```

#### Verification

```typescript
// Send email verification
await auth.sendEmailVerification();

// Verify email
await auth.verifyEmail('verification-token');

// Send phone verification
await auth.sendPhoneVerification();

// Verify phone
await auth.verifyPhone('123456');
```

#### Password Reset

```typescript
// Request password reset
await auth.requestPasswordReset('user@example.com');

// Verify reset token
const isValid = await auth.verifyResetToken('reset-token');

// Reset password
await auth.resetPassword('reset-token', 'newPassword');
```

### Error Handling

```typescript
import { AuthError, AuthErrorCode } from '@platform/auth-sdk';

try {
  await auth.login(email, password);
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        console.error('Invalid email or password');
        break;
      case AuthErrorCode.RATE_LIMIT_EXCEEDED:
        console.error('Too many attempts. Please try again later.');
        break;
      case AuthErrorCode.VALIDATION_ERROR:
        console.error('Validation errors:', error.fields);
        break;
      default:
        console.error('Authentication error:', error.message);
    }
  }
}
```

### React Integration

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthSDK } from '@platform/auth-sdk';

const AuthContext = createContext<{
  auth: AuthSDK;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>({} as any);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth] = useState(() => new AuthSDK({
    baseURL: process.env.REACT_APP_API_URL!,
    onTokenRefresh: (tokens) => {
      console.log('Tokens refreshed');
    }
  }));
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (auth.isAuthenticated()) {
          const profile = await auth.getProfile();
          setUser(profile.data);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [auth]);

  const login = async (email: string, password: string) => {
    const result = await auth.login(email, password);
    setUser(result.data.user);
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ auth, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Usage in components
const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

## Python SDK

### Installation

```bash
pip install platform-auth-sdk
```

### Basic Usage

```python
from platform_auth import AuthSDK, AuthError

# Initialize SDK
auth = AuthSDK(
    base_url='https://api.platform.example.com',
    version='1.0.0',
    timeout=30
)

# Register user
try:
    user = auth.register(
        email='user@example.com',
        password='securePassword123!',
        first_name='John',
        last_name='Doe',
        roles=['CUSTOMER'],
        accept_terms=True
    )
    print(f"User registered: {user['id']}")
except AuthError as e:
    print(f"Registration failed: {e}")

# Login
try:
    result = auth.login('user@example.com', 'securePassword123!')
    print(f"Login successful: {result['user']['email']}")
except AuthError as e:
    print(f"Login failed: {e}")

# Get profile
profile = auth.get_profile()
print(f"User profile: {profile}")
```

### Configuration

```python
from platform_auth import AuthSDK, TokenStorage

class CustomTokenStorage(TokenStorage):
    def save_tokens(self, access_token: str, refresh_token: str):
        # Custom token storage implementation
        pass
    
    def get_access_token(self) -> str:
        # Custom token retrieval
        pass
    
    def get_refresh_token(self) -> str:
        # Custom refresh token retrieval
        pass
    
    def clear_tokens(self):
        # Custom token clearing
        pass

auth = AuthSDK(
    base_url='https://api.platform.example.com',
    version='1.0.0',
    timeout=30,
    retry_attempts=3,
    retry_delay=1.0,
    debug=True,
    token_storage=CustomTokenStorage()
)
```

### Django Integration

```python
# settings.py
PLATFORM_AUTH = {
    'BASE_URL': 'https://api.platform.example.com',
    'VERSION': '1.0.0',
    'TIMEOUT': 30,
    'DEBUG': DEBUG
}

# middleware.py
from django.utils.deprecation import MiddlewareMixin
from platform_auth import AuthSDK

class AuthMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        self.get_response = get_response
        self.auth_sdk = AuthSDK(**settings.PLATFORM_AUTH)
        super().__init__(get_response)
    
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]
            try:
                user_data = self.auth_sdk.verify_token(token)
                request.user_data = user_data
            except AuthError:
                request.user_data = None
        else:
            request.user_data = None

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from platform_auth import AuthError

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            result = auth_sdk.login(email, password)
            return JsonResponse(result)
        except AuthError as e:
            return JsonResponse({'error': str(e)}, status=400)
```

### Flask Integration

```python
from flask import Flask, request, jsonify, g
from platform_auth import AuthSDK, AuthError
import functools

app = Flask(__name__)
auth_sdk = AuthSDK(
    base_url='https://api.platform.example.com',
    version='1.0.0'
)

def require_auth(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization required'}), 401
        
        token = auth_header[7:]
        try:
            user_data = auth_sdk.verify_token(token)
            g.user = user_data
        except AuthError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        result = auth_sdk.login(data['email'], data['password'])
        return jsonify(result)
    except AuthError as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/profile')
@require_auth
def get_profile():
    return jsonify(g.user)
```

## PHP SDK

### Installation

```bash
composer require platform/auth-sdk
```

### Basic Usage

```php
<?php
use Platform\Auth\AuthSDK;
use Platform\Auth\AuthException;

// Initialize SDK
$auth = new AuthSDK([
    'baseUrl' => 'https://api.platform.example.com',
    'version' => '1.0.0',
    'timeout' => 30
]);

// Register user
try {
    $user = $auth->register([
        'email' => 'user@example.com',
        'password' => 'securePassword123!',
        'firstName' => 'John',
        'lastName' => 'Doe',
        'roles' => ['CUSTOMER'],
        'acceptTerms' => true
    ]);
    echo "User registered: " . $user['id'];
} catch (AuthException $e) {
    echo "Registration failed: " . $e->getMessage();
}

// Login
try {
    $result = $auth->login('user@example.com', 'securePassword123!');
    echo "Login successful: " . $result['user']['email'];
} catch (AuthException $e) {
    echo "Login failed: " . $e->getMessage();
}
```

### Laravel Integration

```php
// config/platform_auth.php
return [
    'base_url' => env('PLATFORM_AUTH_BASE_URL', 'https://api.platform.example.com'),
    'version' => env('PLATFORM_AUTH_VERSION', '1.0.0'),
    'timeout' => env('PLATFORM_AUTH_TIMEOUT', 30),
];

// app/Providers/AuthServiceProvider.php
use Platform\Auth\AuthSDK;

public function register()
{
    $this->app->singleton(AuthSDK::class, function ($app) {
        return new AuthSDK(config('platform_auth'));
    });
}

// app/Http/Middleware/PlatformAuth.php
use Platform\Auth\AuthSDK;
use Platform\Auth\AuthException;

class PlatformAuth
{
    protected $authSDK;

    public function __construct(AuthSDK $authSDK)
    {
        $this->authSDK = $authSDK;
    }

    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['error' => 'Authorization required'], 401);
        }

        try {
            $userData = $this->authSDK->verifyToken($token);
            $request->merge(['user_data' => $userData]);
        } catch (AuthException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}

// app/Http/Controllers/AuthController.php
use Platform\Auth\AuthSDK;
use Platform\Auth\AuthException;

class AuthController extends Controller
{
    protected $authSDK;

    public function __construct(AuthSDK $authSDK)
    {
        $this->authSDK = $authSDK;
    }

    public function login(Request $request)
    {
        try {
            $result = $this->authSDK->login(
                $request->input('email'),
                $request->input('password')
            );
            return response()->json($result);
        } catch (AuthException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
```

## Java SDK

### Installation

```xml
<dependency>
    <groupId>com.platform</groupId>
    <artifactId>auth-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Basic Usage

```java
import com.platform.auth.AuthSDK;
import com.platform.auth.AuthException;
import com.platform.auth.models.User;
import com.platform.auth.models.RegisterRequest;

// Initialize SDK
AuthSDK auth = new AuthSDK.Builder()
    .baseUrl("https://api.platform.example.com")
    .version("1.0.0")
    .timeout(30000)
    .build();

// Register user
try {
    RegisterRequest request = new RegisterRequest.Builder()
        .email("user@example.com")
        .password("securePassword123!")
        .firstName("John")
        .lastName("Doe")
        .roles(Arrays.asList("CUSTOMER"))
        .acceptTerms(true)
        .build();
    
    User user = auth.register(request);
    System.out.println("User registered: " + user.getId());
} catch (AuthException e) {
    System.err.println("Registration failed: " + e.getMessage());
}

// Login
try {
    AuthResult result = auth.login("user@example.com", "securePassword123!");
    System.out.println("Login successful: " + result.getUser().getEmail());
} catch (AuthException e) {
    System.err.println("Login failed: " + e.getMessage());
}
```

### Spring Boot Integration

```java
// AuthConfig.java
@Configuration
public class AuthConfig {
    
    @Value("${platform.auth.base-url}")
    private String baseUrl;
    
    @Value("${platform.auth.version}")
    private String version;
    
    @Bean
    public AuthSDK authSDK() {
        return new AuthSDK.Builder()
            .baseUrl(baseUrl)
            .version(version)
            .timeout(30000)
            .build();
    }
}

// AuthController.java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthSDK authSDK;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResult result = authSDK.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(result);
        } catch (AuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authorization required"));
        }
        
        try {
            User user = authSDK.verifyToken(token);
            return ResponseEntity.ok(user);
        } catch (AuthException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }
    
    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
```

## Go SDK

### Installation

```bash
go get github.com/platform/auth-sdk-go
```

### Basic Usage

```go
package main

import (
    "fmt"
    "log"
    
    "github.com/platform/auth-sdk-go"
)

func main() {
    // Initialize SDK
    client := auth.NewClient(&auth.Config{
        BaseURL: "https://api.platform.example.com",
        Version: "1.0.0",
        Timeout: 30,
    })
    
    // Register user
    user, err := client.Register(&auth.RegisterRequest{
        Email:       "user@example.com",
        Password:    "securePassword123!",
        FirstName:   "John",
        LastName:    "Doe",
        Roles:       []string{"CUSTOMER"},
        AcceptTerms: true,
    })
    if err != nil {
        log.Printf("Registration failed: %v", err)
        return
    }
    fmt.Printf("User registered: %s\n", user.ID)
    
    // Login
    result, err := client.Login("user@example.com", "securePassword123!")
    if err != nil {
        log.Printf("Login failed: %v", err)
        return
    }
    fmt.Printf("Login successful: %s\n", result.User.Email)
}
```

### Gin Integration

```go
package main

import (
    "net/http"
    "strings"
    
    "github.com/gin-gonic/gin"
    "github.com/platform/auth-sdk-go"
)

func main() {
    authClient := auth.NewClient(&auth.Config{
        BaseURL: "https://api.platform.example.com",
        Version: "1.0.0",
    })
    
    r := gin.Default()
    
    // Auth middleware
    authMiddleware := func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if !strings.HasPrefix(authHeader, "Bearer ") {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
            c.Abort()
            return
        }
        
        token := authHeader[7:]
        user, err := authClient.VerifyToken(token)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        
        c.Set("user", user)
        c.Next()
    }
    
    // Routes
    r.POST("/login", func(c *gin.Context) {
        var req struct {
            Email    string `json:"email"`
            Password string `json:"password"`
        }
        
        if err := c.ShouldBindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        
        result, err := authClient.Login(req.Email, req.Password)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        
        c.JSON(http.StatusOK, result)
    })
    
    r.GET("/profile", authMiddleware, func(c *gin.Context) {
        user, _ := c.Get("user")
        c.JSON(http.StatusOK, user)
    })
    
    r.Run(":8080")
}
```

## Testing SDKs

### JavaScript/TypeScript Testing

```typescript
import { AuthSDK } from '@platform/auth-sdk';
import { MockAuthServer } from '@platform/auth-sdk/testing';

describe('AuthSDK', () => {
  let mockServer: MockAuthServer;
  let auth: AuthSDK;
  
  beforeEach(() => {
    mockServer = new MockAuthServer();
    auth = new AuthSDK({
      baseURL: mockServer.url,
      version: '1.0.0'
    });
  });
  
  afterEach(() => {
    mockServer.close();
  });
  
  test('should register user successfully', async () => {
    mockServer.mockRegister({
      success: true,
      data: {
        user: { id: '123', email: 'test@example.com' },
        tokens: { accessToken: 'token123', refreshToken: 'refresh123' }
      }
    });
    
    const result = await auth.register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roles: ['CUSTOMER'],
      acceptTerms: true
    });
    
    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe('test@example.com');
  });
});
```

### Python Testing

```python
import unittest
from unittest.mock import patch, Mock
from platform_auth import AuthSDK, AuthError

class TestAuthSDK(unittest.TestCase):
    def setUp(self):
        self.auth = AuthSDK(
            base_url='https://api.test.com',
            version='1.0.0'
        )
    
    @patch('platform_auth.requests.post')
    def test_register_success(self, mock_post):
        mock_response = Mock()
        mock_response.json.return_value = {
            'success': True,
            'data': {
                'user': {'id': '123', 'email': 'test@example.com'},
                'tokens': {'accessToken': 'token123', 'refreshToken': 'refresh123'}
            }
        }
        mock_response.status_code = 201
        mock_post.return_value = mock_response
        
        result = self.auth.register(
            email='test@example.com',
            password='password123',
            first_name='Test',
            last_name='User',
            roles=['CUSTOMER'],
            accept_terms=True
        )
        
        self.assertTrue(result['success'])
        self.assertEqual(result['data']['user']['email'], 'test@example.com')
    
    @patch('platform_auth.requests.post')
    def test_login_failure(self, mock_post):
        mock_response = Mock()
        mock_response.json.return_value = {
            'success': False,
            'error': 'Invalid credentials',
            'code': 'INVALID_CREDENTIALS'
        }
        mock_response.status_code = 401
        mock_post.return_value = mock_response
        
        with self.assertRaises(AuthError) as context:
            self.auth.login('test@example.com', 'wrongpassword')
        
        self.assertEqual(str(context.exception), 'Invalid credentials')

if __name__ == '__main__':
    unittest.main()
```

## Best Practices

### Security

1. **Token Storage**: Use secure storage mechanisms (httpOnly cookies, encrypted storage)
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Rotation**: Implement automatic token refresh
4. **Error Handling**: Don't expose sensitive information in error messages
5. **Rate Limiting**: Implement client-side rate limiting and retry logic

### Performance

1. **Connection Pooling**: Reuse HTTP connections
2. **Caching**: Cache non-sensitive data appropriately
3. **Timeouts**: Set reasonable request timeouts
4. **Retry Logic**: Implement exponential backoff for retries

### Monitoring

1. **Logging**: Log important events and errors
2. **Metrics**: Track API usage and performance
3. **Health Checks**: Monitor SDK health and connectivity
4. **Alerting**: Set up alerts for critical failures

## Support and Resources

- **Documentation**: https://docs.platform.example.com/sdk
- **GitHub**: https://github.com/platform/auth-sdks
- **NPM**: https://www.npmjs.com/package/@platform/auth-sdk
- **PyPI**: https://pypi.org/project/platform-auth-sdk/
- **Packagist**: https://packagist.org/packages/platform/auth-sdk
- **Maven**: https://mvnrepository.com/artifact/com.platform/auth-sdk
- **Support**: sdk-support@platform.example.com