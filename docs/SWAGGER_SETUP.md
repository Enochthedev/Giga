# Swagger/OpenAPI Documentation Setup

## 📚 Overview

Each service in our multi-sided platform includes comprehensive Swagger/OpenAPI documentation
accessible via `/docs` endpoint.

## 🔗 Service Documentation URLs

### Development Environment

- **Auth Service**: http://localhost:3001/docs
- **Gateway**: http://localhost:3000/docs
- **Ecommerce**: http://localhost:3002/docs (Phase 2)
- **Payment**: http://localhost:3003/docs (Phase 2)
- **Taxi**: http://localhost:3004/docs (Phase 3)
- **Hotel**: http://localhost:3005/docs (Phase 3)
- **Ads**: http://localhost:3006/docs (Phase 3)

### Production Environment

- **Main API**: https://api.yourplatform.com/docs
- **Auth Service**: https://auth.yourplatform.com/docs

## 🎯 Documentation Standards

### 1. **Endpoint Documentation**

Every endpoint must include:

- Clear description
- Request/response examples using mock data
- Error responses with status codes
- Authentication requirements
- Rate limiting information

### 2. **Schema Definitions**

- Use TypeScript types converted to JSON Schema
- Include realistic examples from mock data
- Document all required and optional fields
- Specify validation rules and constraints

### 3. **Authentication Documentation**

- JWT Bearer token format
- Token expiration and refresh process
- Role-based access control
- Multi-role switching examples

## 📝 Implementation Pattern

### Service Setup

```typescript
// Add to service index.ts
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

await fastify.register(swagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Service Name',
      description: 'Service description',
      version: '1.0.0',
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
    },
  },
});

await fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
});
```

### Route Documentation

```typescript
fastify.post(
  '/endpoint',
  {
    schema: {
      description: 'Endpoint description',
      tags: ['Category'],
      security: [{ bearerAuth: [] }], // If auth required
      body: {
        type: 'object',
        required: ['field1'],
        properties: {
          field1: {
            type: 'string',
            example: 'example value from mock data',
          },
        },
      },
      response: {
        200: {
          description: 'Success response',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              /* response schema */
            },
          },
        },
        400: {
          description: 'Validation error',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Validation failed' },
          },
        },
      },
    },
  },
  handler
);
```

## 🧪 Mock Data Integration

### Using Mock Data in Examples

```typescript
// Import mock data
import mockUsers from '../../../mock-data/auth/users.json';
import mockRegistration from '../../../mock-data/auth/registration-requests.json';

// Use in schema examples
body: {
  type: 'object',
  example: mockRegistration[0].request
},
response: {
  200: {
    type: 'object',
    example: mockRegistration[0].expectedResponse
  }
}
```

## 📊 Documentation Checklist

### For Each New Endpoint

- [ ] Clear description and purpose
- [ ] Appropriate tags for grouping
- [ ] Request schema with examples
- [ ] Response schema with examples
- [ ] Error responses (400, 401, 403, 404, 500)
- [ ] Authentication requirements
- [ ] Rate limiting information
- [ ] Mock data examples

### For Each New Service

- [ ] Service-level documentation
- [ ] Authentication setup
- [ ] Error handling patterns
- [ ] Health check endpoint
- [ ] Mock data structure
- [ ] Postman collection export

## 🔧 Development Workflow

### Adding New Endpoints

1. Create endpoint with full schema documentation
2. Add corresponding mock data examples
3. Test endpoint with Swagger UI
4. Export Postman collection
5. Update API documentation

### Testing Documentation

```bash
# Start service
pnpm dev

# Visit Swagger UI
open http://localhost:3001/docs

# Test endpoints directly in browser
# Verify examples work correctly
```

## 📤 Export Options

### Postman Collections

Each service can export Postman collections:

```bash
# From Swagger UI, click "Export" -> "Postman Collection"
# Save to docs/postman/{service-name}.json
```

### OpenAPI Spec

```bash
# Access raw OpenAPI spec
curl http://localhost:3001/docs/json > docs/openapi/auth-service.json
```

## 🎯 Best Practices

1. **Consistent Naming**: Use consistent field names across services
2. **Realistic Examples**: Use mock data for all examples
3. **Error Documentation**: Document all possible error scenarios
4. **Version Management**: Include API version in documentation
5. **Security**: Document authentication and authorization
6. **Performance**: Include rate limiting and pagination info

This documentation setup ensures that any developer can understand and use our APIs effectively,
with realistic examples and comprehensive error handling information.
