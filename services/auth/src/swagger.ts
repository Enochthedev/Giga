import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Sided Platform - Authentication Service',
      version: '1.0.0',
      description: `
# Authentication Service API

A comprehensive authentication and authorization service supporting multi-role user management, JWT-based authentication, and extensive security features.

## Features

- **Multi-Role Support**: Customer, Vendor, Driver, Host, Advertiser, and Admin roles
- **JWT Authentication**: Secure token-based authentication with refresh token rotation
- **Email & Phone Verification**: Complete verification workflows
- **Password Management**: Secure password reset and change functionality
- **Role-Based Access Control**: Fine-grained permissions and role switching
- **Advanced Security**: Rate limiting, account lockout, IP access control
- **Comprehensive Monitoring**: Health checks, metrics, and audit logging
- **Profile Management**: Role-specific profile creation and management

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes
- **Password operations**: 3 requests per 60 minutes  
- **General API**: 100 requests per 15 minutes

Rate limit headers are included in responses:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Requests remaining in current window
- \`X-RateLimit-Reset\`: When the rate limit resets

## Error Handling

All errors follow a consistent format:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

## Versioning

This API uses URL versioning. Current version is v1:
- Base URL: \`/api/v1\`
- Future versions will be available at \`/api/v2\`, etc.

## Support

For API support, please contact the development team or refer to the integration guides.
      `,
      termsOfService: 'https://platform.example.com/terms',
      contact: {
        name: 'API Support',
        url: 'https://platform.example.com/support',
        email: 'api-support@platform.example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api-staging.platform.example.com',
        description: 'Staging server',
      },
      {
        url: 'https://api.platform.example.com',
        description: 'Production server',
      },
    ],
    externalDocs: {
      description: 'Find more info here',
      url: 'https://docs.platform.example.com',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['CUSTOMER', 'VENDOR', 'DRIVER', 'HOST', 'ADVERTISER'],
              },
              example: ['CUSTOMER'],
            },
            activeRole: {
              type: 'string',
              enum: ['CUSTOMER', 'VENDOR', 'DRIVER', 'HOST', 'ADVERTISER'],
              example: 'CUSTOMER',
            },
            avatar: {
              type: 'string',
              nullable: true,
              example: null,
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: [
            'email',
            'password',
            'firstName',
            'lastName',
            'roles',
            'acceptTerms',
          ],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              minLength: 8,
              example: 'securePassword123!',
            },
            firstName: {
              type: 'string',
              minLength: 1,
              example: 'John',
            },
            lastName: {
              type: 'string',
              minLength: 1,
              example: 'Doe',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            roles: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['CUSTOMER', 'VENDOR', 'DRIVER', 'HOST', 'ADVERTISER'],
              },
              example: ['CUSTOMER'],
            },
            acceptTerms: {
              type: 'boolean',
              example: true,
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: 'securePassword123!',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                    refreshToken: {
                      type: 'string',
                      example: 'a1b2c3d4e5f6...',
                    },
                    expiresIn: {
                      type: 'number',
                      example: 900,
                    },
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR',
              description: 'Machine-readable error code',
            },
            fields: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              example: {
                email: ['Invalid email format'],
                password: ['Password must be at least 8 characters'],
              },
              description: 'Field-specific validation errors',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            requestId: {
              type: 'string',
              example: 'req_123456789',
              description: 'Unique request identifier for debugging',
            },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Validation failed',
            },
            code: {
              type: 'string',
              example: 'VALIDATION_ERROR',
            },
            fields: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              example: {
                email: ['Invalid email format'],
                password: ['Password must be at least 8 characters'],
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RateLimitErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Too many requests',
            },
            code: {
              type: 'string',
              example: 'RATE_LIMIT_EXCEEDED',
            },
            message: {
              type: 'string',
              example: 'Rate limit exceeded. Try again in 15 minutes.',
            },
            details: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  example: 5,
                },
                window: {
                  type: 'string',
                  example: '15 minutes',
                },
                retryAfter: {
                  type: 'number',
                  example: 900,
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        UnauthorizedErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Unauthorized',
            },
            code: {
              type: 'string',
              example: 'TOKEN_EXPIRED',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ForbiddenErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Forbidden',
            },
            code: {
              type: 'string',
              example: 'INSUFFICIENT_PERMISSIONS',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        NotFoundErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Resource not found',
            },
            code: {
              type: 'string',
              example: 'NOT_FOUND',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ConflictErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Resource already exists',
            },
            code: {
              type: 'string',
              example: 'RESOURCE_EXISTS',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['token'],
          properties: {
            token: {
              type: 'string',
              description: 'Email verification token received via email',
              example:
                'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
            },
          },
        },
        ResendEmailVerificationRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address to resend verification to',
              example: 'john@example.com',
            },
          },
        },
        EmailVerificationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Email verified successfully',
            },
            data: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'john@example.com',
                },
                isEmailVerified: {
                  type: 'boolean',
                  example: true,
                },
                expiresAt: {
                  type: 'string',
                  format: 'date-time',
                  description:
                    'Token expiration time (for send verification responses)',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        VerifyPhoneRequest: {
          type: 'object',
          required: ['code'],
          properties: {
            code: {
              type: 'string',
              pattern: '^[0-9]{6}$',
              description: '6-digit verification code received via SMS',
              example: '123456',
            },
          },
        },
        ResendPhoneVerificationRequest: {
          type: 'object',
          required: ['phone'],
          properties: {
            phone: {
              type: 'string',
              description: 'Phone number to resend verification code to',
              example: '+1234567890',
            },
          },
        },
        PhoneVerificationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Verification code sent successfully',
            },
            data: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string',
                  description: 'Masked phone number',
                  example: '+1****7890',
                },
                isPhoneVerified: {
                  type: 'boolean',
                  example: true,
                  description: 'Present in verify response only',
                },
                expiresAt: {
                  type: 'string',
                  format: 'date-time',
                  description:
                    'Code expiration time (for send verification responses)',
                },
                codeLength: {
                  type: 'number',
                  example: 6,
                  description:
                    'Length of verification code (for send verification responses)',
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CustomerProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            preferences: {
              type: 'object',
              description: 'Customer preferences as key-value pairs',
              example: {
                language: 'en',
                currency: 'USD',
                notifications: true,
              },
            },
            addresses: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Address',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        VendorProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            businessName: {
              type: 'string',
              example: "John's Electronics Store",
            },
            businessType: {
              type: 'string',
              example: 'Electronics',
            },
            description: {
              type: 'string',
              example: 'Premium electronics and gadgets',
            },
            logo: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/logo.png',
            },
            website: {
              type: 'string',
              format: 'uri',
              example: 'https://johnselectronics.com',
            },
            subscriptionTier: {
              type: 'string',
              enum: ['BASIC', 'PRO', 'ENTERPRISE'],
              example: 'BASIC',
            },
            commissionRate: {
              type: 'number',
              example: 0.15,
            },
            isVerified: {
              type: 'boolean',
              example: false,
            },
            rating: {
              type: 'number',
              nullable: true,
              example: 4.5,
            },
            totalSales: {
              type: 'number',
              example: 0,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        DriverProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            licenseNumber: {
              type: 'string',
              example: 'DL123456789',
            },
            vehicleInfo: {
              type: 'object',
              properties: {
                make: {
                  type: 'string',
                  example: 'Toyota',
                },
                model: {
                  type: 'string',
                  example: 'Camry',
                },
                year: {
                  type: 'integer',
                  example: 2020,
                },
                color: {
                  type: 'string',
                  example: 'Blue',
                },
                licensePlate: {
                  type: 'string',
                  example: 'ABC123',
                },
                type: {
                  type: 'string',
                  enum: ['CAR', 'MOTORCYCLE', 'BICYCLE', 'SCOOTER'],
                  example: 'CAR',
                },
              },
            },
            isOnline: {
              type: 'boolean',
              example: false,
            },
            currentLocation: {
              type: 'object',
              nullable: true,
              properties: {
                latitude: {
                  type: 'number',
                  example: 40.7128,
                },
                longitude: {
                  type: 'number',
                  example: -74.006,
                },
                address: {
                  type: 'string',
                  example: 'New York, NY',
                },
              },
            },
            rating: {
              type: 'number',
              nullable: true,
              example: 4.8,
            },
            totalRides: {
              type: 'integer',
              example: 0,
            },
            isVerified: {
              type: 'boolean',
              example: false,
            },
            subscriptionTier: {
              type: 'string',
              enum: ['BASIC', 'PRO'],
              example: 'BASIC',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        HostProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            businessName: {
              type: 'string',
              nullable: true,
              example: 'Cozy Downtown Apartments',
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Beautiful apartments in the heart of the city',
            },
            rating: {
              type: 'number',
              nullable: true,
              example: 4.7,
            },
            totalBookings: {
              type: 'integer',
              example: 0,
            },
            isVerified: {
              type: 'boolean',
              example: false,
            },
            subscriptionTier: {
              type: 'string',
              enum: ['BASIC', 'PRO'],
              example: 'BASIC',
            },
            responseRate: {
              type: 'number',
              nullable: true,
              example: 95.5,
            },
            responseTime: {
              type: 'integer',
              nullable: true,
              example: 30,
              description: 'Response time in minutes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AdvertiserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            companyName: {
              type: 'string',
              example: 'Tech Solutions Inc.',
            },
            industry: {
              type: 'string',
              example: 'Technology',
            },
            website: {
              type: 'string',
              format: 'uri',
              nullable: true,
              example: 'https://techsolutions.com',
            },
            totalSpend: {
              type: 'number',
              example: 0,
            },
            isVerified: {
              type: 'boolean',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Address: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            label: {
              type: 'string',
              example: 'Home',
            },
            address: {
              type: 'string',
              example: '123 Main Street',
            },
            city: {
              type: 'string',
              example: 'New York',
            },
            country: {
              type: 'string',
              example: 'United States',
            },
            isDefault: {
              type: 'boolean',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['pass', 'fail', 'warn'],
            },
            responseTime: {
              type: 'number',
            },
            message: {
              type: 'string',
            },
            details: {
              type: 'object',
            },
          },
        },
        PerformanceMetrics: {
          type: 'object',
          properties: {
            requestCount: {
              type: 'number',
            },
            averageResponseTime: {
              type: 'number',
            },
            errorRate: {
              type: 'number',
            },
            activeConnections: {
              type: 'number',
            },
            memoryUsage: {
              type: 'object',
            },
            cpuUsage: {
              type: 'number',
            },
          },
        },
        DatabaseMetrics: {
          type: 'object',
          properties: {
            connectionCount: {
              type: 'number',
            },
            queryCount: {
              type: 'number',
            },
            averageQueryTime: {
              type: 'number',
            },
            slowQueries: {
              type: 'number',
            },
            connectionErrors: {
              type: 'number',
            },
          },
        },
        RedisMetrics: {
          type: 'object',
          properties: {
            connectionCount: {
              type: 'number',
            },
            operationCount: {
              type: 'number',
            },
            averageOperationTime: {
              type: 'number',
            },
            cacheHitRate: {
              type: 'number',
            },
            connectionErrors: {
              type: 'number',
            },
          },
        },
        APIUsageAnalytics: {
          type: 'object',
          properties: {
            totalRequests: {
              type: 'number',
              description: 'Total number of API requests',
            },
            requestsByEndpoint: {
              type: 'object',
              additionalProperties: {
                type: 'number',
              },
              description: 'Request count by endpoint',
            },
            requestsByMethod: {
              type: 'object',
              additionalProperties: {
                type: 'number',
              },
              description: 'Request count by HTTP method',
            },
            requestsByStatus: {
              type: 'object',
              additionalProperties: {
                type: 'number',
              },
              description: 'Request count by status code',
            },
            averageResponseTime: {
              type: 'number',
              description: 'Average response time in milliseconds',
            },
            errorRate: {
              type: 'number',
              description: 'Error rate as percentage',
            },
            rateLimitHits: {
              type: 'number',
              description: 'Number of rate limit violations',
            },
            uniqueUsers: {
              type: 'number',
              description: 'Number of unique users',
            },
            timeRange: {
              type: 'object',
              properties: {
                start: {
                  type: 'string',
                  format: 'date-time',
                },
                end: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
        CacheInfo: {
          type: 'object',
          properties: {
            cached: {
              type: 'boolean',
              description: 'Whether the response was served from cache',
            },
            cacheKey: {
              type: 'string',
              description: 'Cache key used for this response',
            },
            ttl: {
              type: 'number',
              description: 'Time to live in seconds',
            },
            generatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the cached response was generated',
            },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Current page number',
            },
            limit: {
              type: 'number',
              description: 'Items per page',
            },
            total: {
              type: 'number',
              description: 'Total number of items',
            },
            totalPages: {
              type: 'number',
              description: 'Total number of pages',
            },
            hasNext: {
              type: 'boolean',
              description: 'Whether there is a next page',
            },
            hasPrev: {
              type: 'boolean',
              description: 'Whether there is a previous page',
            },
          },
        },
        APIVersionInfo: {
          type: 'object',
          properties: {
            version: {
              type: 'string',
              example: '1.0.0',
              description: 'Current API version',
            },
            deprecated: {
              type: 'boolean',
              example: false,
              description: 'Whether this version is deprecated',
            },
            deprecationDate: {
              type: 'string',
              format: 'date',
              description: 'When this version will be deprecated',
            },
            sunsetDate: {
              type: 'string',
              format: 'date',
              description: 'When this version will be removed',
            },
            supportedVersions: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['1.0.0', '1.1.0'],
              description: 'List of supported API versions',
            },
            latestVersion: {
              type: 'string',
              example: '1.1.0',
              description: 'Latest available API version',
            },
            changelog: {
              type: 'string',
              description: 'URL to version changelog',
            },
          },
        },
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
        SortParam: {
          name: 'sort',
          in: 'query',
          description: 'Sort field and direction (e.g., createdAt:desc)',
          schema: {
            type: 'string',
            pattern: '^[a-zA-Z]+:(asc|desc)$',
          },
        },
        FilterParam: {
          name: 'filter',
          in: 'query',
          description: 'JSON string of filter criteria',
          schema: {
            type: 'string',
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
          headers: {
            'X-Request-ID': {
              description: 'Unique request identifier',
              schema: {
                type: 'string',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing authentication',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
          headers: {
            'WWW-Authenticate': {
              description: 'Authentication scheme required',
              schema: {
                type: 'string',
                example: 'Bearer',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ForbiddenErrorResponse',
              },
            },
          },
        },
        NotFound: {
          description: 'Not Found - Resource does not exist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundErrorResponse',
              },
            },
          },
        },
        Conflict: {
          description: 'Conflict - Resource already exists',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictErrorResponse',
              },
            },
          },
        },
        TooManyRequests: {
          description: 'Too Many Requests - Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
          headers: {
            'X-RateLimit-Limit': {
              description: 'Request limit per time window',
              schema: {
                type: 'integer',
              },
            },
            'X-RateLimit-Remaining': {
              description: 'Requests remaining in current window',
              schema: {
                type: 'integer',
              },
            },
            'X-RateLimit-Reset': {
              description: 'Time when rate limit resets',
              schema: {
                type: 'string',
                format: 'date-time',
              },
            },
            'Retry-After': {
              description: 'Seconds to wait before retrying',
              schema: {
                type: 'integer',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
      headers: {
        'X-Request-ID': {
          description: 'Unique request identifier for tracking',
          schema: {
            type: 'string',
          },
        },
        'X-Response-Time': {
          description: 'Response time in milliseconds',
          schema: {
            type: 'string',
          },
        },
        'X-API-Version': {
          description: 'API version used for this request',
          schema: {
            type: 'string',
          },
        },
        'X-Cache-Status': {
          description: 'Cache status (HIT, MISS, BYPASS)',
          schema: {
            type: 'string',
            enum: ['HIT', 'MISS', 'BYPASS'],
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and token management',
      },
      {
        name: 'Profile',
        description: 'User profile management and updates',
      },
      {
        name: 'Role Management',
        description: 'Role switching and role-based operations',
      },
      {
        name: 'Email Verification',
        description: 'Email verification workflows',
      },
      {
        name: 'Phone Verification',
        description: 'Phone number verification workflows',
      },
      {
        name: 'Password Reset',
        description: 'Password reset and recovery operations',
      },
      {
        name: 'Security',
        description: 'Security-related operations and settings',
      },
      {
        name: 'User Management',
        description: 'Administrative user management operations',
      },
      {
        name: 'Bulk Operations',
        description: 'Bulk operations for administrative tasks',
      },
      {
        name: 'Audit',
        description: 'Audit logging and reporting',
      },
      {
        name: 'Reports',
        description: 'Administrative reports and analytics',
      },
      {
        name: 'Statistics',
        description: 'Usage statistics and metrics',
      },
      {
        name: 'Data Export',
        description: 'Data export functionality',
      },
      {
        name: 'Health',
        description: 'Service health monitoring and metrics',
      },
      {
        name: 'API Management',
        description: 'API versioning and usage analytics',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
