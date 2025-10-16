# Payment Service

A comprehensive payment processing service for the Giga platform that handles transactions, refunds,
and payment method management with support for multiple payment gateways.

## Implementation Status

### ✅ Completed - Basic Payment Processing

- **PaymentController**: RESTful API endpoints for payment operations
- **PaymentService**: Core business logic for payment processing
- **TransactionService**: Transaction management and storage
- **Request Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Unit Tests**: Test coverage for core payment functionality

### 🚧 Planned Features

- Multi-gateway payment processing (Stripe, PayPal, Square)
- Fraud detection and risk assessment
- Subscription billing and recurring payments
- Marketplace payment splits and vendor payouts
- Advanced security features and PCI DSS compliance

## Features

### Core Payment Processing

- Multi-gateway payment processing (Stripe, PayPal, Square)
- Automatic gateway failover and load balancing
- Payment method tokenization and management
- Real-time transaction processing and status tracking

### Advanced Capabilities

- Fraud detection and risk assessment
- Multi-currency support with real-time exchange rates
- Subscription billing and recurring payments
- Marketplace payment splits and vendor payouts
- Comprehensive refund and dispute management

### Security & Compliance

- PCI DSS compliant payment processing
- Advanced fraud detection with ML algorithms
- Secure webhook handling and verification
- Comprehensive audit logging and monitoring

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis 6+
- Payment gateway accounts (Stripe, PayPal, etc.)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### Environment Configuration

Key environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/payment_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# PayPal
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
```

## API Documentation

### Payment Processing

#### Create Payment

```http
POST /api/v1/payments
Content-Type: application/json

{
  "amount": 1000,
  "currency": "USD",
  "description": "Order payment",
  "userId": "user_123",
  "paymentMethodId": "pm_123",
  "metadata": {
    "orderId": "order_456"
  }
}
```

#### Get Payment

```http
GET /api/v1/payments/{paymentId}
```

#### Refund Payment

```http
POST /api/v1/payments/{paymentId}/refund
Content-Type: application/json

{
  "amount": 500,
  "reason": "Customer request"
}
```

### Payment Methods

#### Create Payment Method

```http
POST /api/v1/payment-methods
Content-Type: application/json

{
  "userId": "user_123",
  "type": "card",
  "token": "tok_123",
  "isDefault": true
}
```

#### List User Payment Methods

```http
GET /api/v1/users/{userId}/payment-methods
```

### Subscriptions

#### Create Subscription

```http
POST /api/v1/subscriptions
Content-Type: application/json

{
  "userId": "user_123",
  "planId": "plan_123",
  "paymentMethodId": "pm_123",
  "trialPeriodDays": 14
}
```

#### Update Subscription

```http
PUT /api/v1/subscriptions/{subscriptionId}
Content-Type: application/json

{
  "planId": "plan_456",
  "quantity": 2
}
```

## Architecture

### Service Structure

```
src/
├── controllers/     # API controllers
├── services/        # Business logic services
├── repositories/    # Data access layer
├── gateways/        # Payment gateway integrations
├── middleware/      # Express middleware
├── types/           # TypeScript type definitions
├── interfaces/      # Service interfaces
├── utils/           # Utility functions
├── config/          # Configuration files
└── __tests__/       # Test files
```

### Gateway Architecture

The service uses an abstraction layer for payment gateways:

```typescript
abstract class PaymentGateway {
  abstract processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  abstract refundPayment(transactionId: string, amount?: number): Promise<Refund>;
  abstract createPaymentMethod(data: any): Promise<PaymentMethod>;
  // ... other methods
}
```

### Failover System

- Automatic gateway selection based on performance metrics
- Circuit breaker pattern for failed gateways
- Configurable failover chains
- Real-time health monitoring

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- payment.test.ts
```

## Deployment

### Docker

```bash
# Build image
docker build -t giga/payment-service .

# Run container
docker run -p 3004:3004 \
  -e DATABASE_URL="postgresql://..." \
  -e REDIS_URL="redis://..." \
  -e STRIPE_SECRET_KEY="sk_..." \
  giga/payment-service
```

### Production Checklist

- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure payment gateway credentials
- [ ] Set up monitoring and alerting
- [ ] Configure webhook endpoints
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up backup procedures

## Monitoring

### Health Checks

- `GET /health` - Service health status
- `GET /health/detailed` - Detailed health information

### Metrics

- Payment success/failure rates
- Gateway performance metrics
- Fraud detection statistics
- Transaction volume and revenue

### Logging

Structured logging with correlation IDs for request tracing.

## Security

### PCI DSS Compliance

- No sensitive card data stored
- Tokenization for payment methods
- Secure communication with gateways
- Regular security audits

### Fraud Detection

- Real-time risk scoring
- Velocity checks
- Device fingerprinting
- Machine learning models

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
