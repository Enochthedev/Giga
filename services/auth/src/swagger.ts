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
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);