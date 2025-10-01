# Taxi Service

A comprehensive ride-sharing and transportation platform that connects passengers with drivers,
handles ride booking, real-time tracking, dynamic pricing, and payment processing.

## Features

- **Driver Management**: Registration, verification, and profile management
- **Ride Booking**: Real-time ride requests and matching
- **Location Tracking**: GPS-based real-time location updates
- **Dynamic Pricing**: Surge pricing and fare calculation
- **Safety Features**: Emergency alerts, ride sharing, and monitoring
- **Payment Integration**: Secure payment processing and driver payouts
- **Analytics**: Comprehensive reporting and business intelligence
- **Multi-vehicle Support**: Economy, premium, SUV, and accessible vehicles

## Architecture

The service is built with a modular architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and core functionality
- **Interfaces**: Type definitions and contracts
- **Middleware**: Authentication, validation, and security
- **Types**: TypeScript type definitions
- **Utils**: Helper functions and utilities

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- TypeScript 5+

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:

```bash
npm run prisma:migrate
npm run prisma:generate
```

4. Start the development server:

```bash
npm run dev
```

### Testing

Run the test suite:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Building

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## API Documentation

The service provides a comprehensive REST API with the following main endpoints:

### Rides

- `POST /api/rides` - Request a new ride
- `GET /api/rides/:id` - Get ride details
- `PUT /api/rides/:id/cancel` - Cancel a ride
- `GET /api/rides/history` - Get ride history

### Drivers

- `POST /api/drivers/register` - Register as a driver
- `PUT /api/drivers/status` - Update driver status
- `GET /api/drivers/profile` - Get driver profile
- `POST /api/drivers/vehicles` - Add a vehicle

### Location

- `POST /api/location/update` - Update location
- `GET /api/location/nearby-drivers` - Find nearby drivers
- `GET /api/rides/:id/tracking` - Track ride progress

### Pricing

- `POST /api/pricing/estimate` - Get fare estimate
- `GET /api/pricing/surge` - Get current surge pricing

## Configuration

### Environment Variables

| Variable                   | Description                  | Default |
| -------------------------- | ---------------------------- | ------- |
| `PORT`                     | Server port                  | `3005`  |
| `DATABASE_URL`             | PostgreSQL connection string | -       |
| `REDIS_URL`                | Redis connection string      | -       |
| `JWT_SECRET`               | JWT signing secret           | -       |
| `AUTH_SERVICE_URL`         | Auth service URL             | -       |
| `PAYMENT_SERVICE_URL`      | Payment service URL          | -       |
| `NOTIFICATION_SERVICE_URL` | Notification service URL     | -       |
| `GOOGLE_MAPS_API_KEY`      | Google Maps API key          | -       |

### Service Integration

The taxi service integrates with several platform services:

- **Auth Service**: User authentication and authorization
- **Payment Service**: Payment processing and driver payouts
- **Notification Service**: Real-time notifications and alerts
- **Upload Service**: Document and image uploads

## Development

### Code Structure

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── interfaces/      # Service interfaces
├── utils/           # Helper functions
├── lib/             # External library configurations
└── __tests__/       # Test files
```

### Adding New Features

1. Define types in `src/types/`
2. Create interfaces in `src/interfaces/`
3. Implement services in `src/services/`
4. Add controllers in `src/controllers/`
5. Define routes in `src/routes/`
6. Write tests in `src/__tests__/`

### Code Quality

The project uses:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vitest** for testing
- **Prisma** for database ORM

Run quality checks:

```bash
npm run lint
npm run type-check
npm run format:check
```

## Deployment

### Docker

Build Docker image:

```bash
docker build -t taxi-service .
```

Run with Docker Compose:

```bash
docker-compose up taxi-service
```

### Production Considerations

- Set up proper environment variables
- Configure database connection pooling
- Set up Redis for caching and real-time features
- Configure external service URLs
- Set up monitoring and logging
- Configure SSL/TLS certificates

## Monitoring

The service includes comprehensive monitoring:

- **Health Checks**: `/health` endpoint
- **Metrics**: Performance and business metrics
- **Logging**: Structured logging with Winston
- **Error Tracking**: Centralized error handling

## Security

Security features include:

- JWT-based authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- SQL injection prevention
- XSS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run quality checks
6. Submit a pull request

## License

This project is licensed under the MIT License.
