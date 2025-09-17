import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Sided Platform - Ecommerce Service',
      version: '1.0.0',
      description: 'Multi-vendor marketplace with products, orders, and vendor management',
    },
    servers: [
      {
        url: 'http://localhost:3002',
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
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clr123product1' },
            name: { type: 'string', example: 'iPhone 15 Pro' },
            description: { type: 'string', example: 'Latest iPhone with advanced features' },
            price: { type: 'number', example: 999.99 },
            comparePrice: { type: 'number', example: 1099.99 },
            sku: { type: 'string', example: 'IPH15PRO-128-BLU' },
            category: { type: 'string', example: 'electronics' },
            subcategory: { type: 'string', example: 'smartphones' },
            brand: { type: 'string', example: 'Apple' },
            images: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://example.com/image1.jpg'],
            },
            vendorId: { type: 'string', example: 'clr123vendor' },
            inventory: {
              type: 'object',
              properties: {
                quantity: { type: 'number', example: 50 },
                lowStockThreshold: { type: 'number', example: 5 },
                trackQuantity: { type: 'boolean', example: true },
              },
            },
            isActive: { type: 'boolean', example: true },
            rating: { type: 'number', example: 4.8 },
            reviewCount: { type: 'number', example: 1247 },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            productId: { type: 'string', example: 'clr123product1' },
            quantity: { type: 'number', example: 2 },
            price: { type: 'number', example: 999.99 },
            total: { type: 'number', example: 1999.98 },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: 'clr123user' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
            subtotal: { type: 'number', example: 1999.98 },
            tax: { type: 'number', example: 199.99 },
            total: { type: 'number', example: 2199.97 },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clr123order' },
            userId: { type: 'string', example: 'clr123user' },
            status: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
              example: 'PENDING',
            },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartItem' },
            },
            subtotal: { type: 'number', example: 1999.98 },
            tax: { type: 'number', example: 199.99 },
            shipping: { type: 'number', example: 9.99 },
            total: { type: 'number', example: 2209.96 },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string', example: '123 Main St' },
                city: { type: 'string', example: 'New York' },
                state: { type: 'string', example: 'NY' },
                zipCode: { type: 'string', example: '10001' },
                country: { type: 'string', example: 'US' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Error message' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);