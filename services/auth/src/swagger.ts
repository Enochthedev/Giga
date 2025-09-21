import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Sided Platform - Auth Service',
      version: '1.0.0',
      description: 'Authentication service with multi-role support',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
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
          required: ['email', 'password', 'firstName', 'lastName', 'roles', 'acceptTerms'],
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
              example: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
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
                  description: 'Token expiration time (for send verification responses)',
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
                  description: 'Code expiration time (for send verification responses)',
                },
                codeLength: {
                  type: 'number',
                  example: 6,
                  description: 'Length of verification code (for send verification responses)',
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
              example: 'John\'s Electronics Store',
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
                  example: -74.0060,
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
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);