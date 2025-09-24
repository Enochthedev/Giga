# Hotel Service

A comprehensive accommodation booking and management service that handles property listings, room inventory, reservations, dynamic pricing, and guest management.

## Features

- **Property Management**: Create and manage hotel properties with detailed information, amenities, and policies
- **Room Type Management**: Define room types with capacity, amenities, and pricing
- **Availability Engine**: Real-time inventory management and availability checking
- **Dynamic Pricing**: Flexible pricing strategies based on demand, seasonality, and market conditions
- **Booking Management**: Complete reservation workflow with confirmation, modification, and cancellation
- **Guest Profiles**: Personalized guest management with preferences and booking history
- **Multi-Property Support**: Manage multiple properties and hotel chains
- **External Integrations**: Connect with OTAs, channel managers, and payment systems
- **Analytics & Reporting**: Comprehensive reporting and business intelligence

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT tokens
- **Validation**: Zod schemas
- **Testing**: Vitest
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
pnpm prisma:migrate
pnpm prisma:generate
```

4. Seed the database (optional):
```bash
pnpm seed
```

5. Start the development server:
```bash
pnpm dev
```

The service will be available at `http://localhost:3004`

### API Documentation

Once the service is running, you can access the API documentation at:
- Swagger UI: `http://localhost:3004/api/docs`
- OpenAPI JSON: `http://localhost:3004/api/docs.json`

## Project Structure

```
src/
├── types/              # TypeScript type definitions
│   ├── property.types.ts
│   ├── room.types.ts
│   ├── booking.types.ts
│   ├── availability.types.ts
│   ├── pricing.types.ts
│   ├── guest.types.ts
│   └── index.ts
├── controllers/        # Request handlers
├── services/          # Business logic
├── middleware/        # Express middleware
├── routes/           # API routes
├── lib/              # Database and external connections
├── utils/            # Utility functions
├── config/           # Configuration
└── __tests__/        # Test files
```

## Core Concepts

### Properties
Properties represent hotels, resorts, or other accommodation types. Each property has:
- Basic information (name, description, location)
- Amenities and facilities
- Policies (check-in/out times, cancellation policies)
- Contact information and media

### Room Types
Room types define the different categories of rooms available at a property:
- Capacity and bed configuration
- Amenities and features
- Base pricing
- Inventory counts

### Availability
The availability engine manages room inventory in real-time:
- Tracks available rooms by date and room type
- Handles reservations and releases
- Prevents overbooking with inventory locks
- Supports availability blocks for maintenance

### Pricing
Dynamic pricing engine supports:
- Base rates and seasonal adjustments
- Demand-based pricing rules
- Promotions and discounts
- Tax and fee calculations
- Group and corporate rates

### Bookings
Complete booking lifecycle management:
- Reservation creation and validation
- Payment processing integration
- Confirmation and notification
- Modification and cancellation
- Check-in/check-out workflow

### Guest Management
Personalized guest experience:
- Guest profiles and preferences
- Booking history tracking
- Loyalty program integration
- VIP status management
- Communication preferences

## API Endpoints

### Properties
- `GET /api/v1/properties` - Search properties
- `POST /api/v1/properties` - Create property
- `GET /api/v1/properties/:id` - Get property details
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Delete property

### Room Types
- `GET /api/v1/properties/:propertyId/room-types` - Get room types
- `POST /api/v1/properties/:propertyId/room-types` - Create room type
- `PUT /api/v1/room-types/:id` - Update room type
- `DELETE /api/v1/room-types/:id` - Delete room type

### Availability
- `POST /api/v1/availability/search` - Search availability
- `PUT /api/v1/properties/:propertyId/availability` - Update availability
- `POST /api/v1/properties/:propertyId/availability/block` - Block availability

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/:id` - Get booking details
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Cancel booking
- `GET /api/v1/bookings` - Search bookings

### Pricing
- `POST /api/v1/pricing/calculate` - Calculate price
- `PUT /api/v1/properties/:propertyId/rates` - Update rates
- `POST /api/v1/promotions` - Create promotion

### Guests
- `GET /api/v1/guests/:id` - Get guest profile
- `PUT /api/v1/guests/:id` - Update guest profile
- `GET /api/v1/guests` - Search guests

## Testing

Run the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Development

### Code Quality

The project uses several tools to maintain code quality:

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:check

# Build
pnpm build
```

### Database Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database
pnpm prisma migrate reset
```

### Environment Variables

Key environment variables:

- `PORT` - Server port (default: 3004)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `AUTH_SERVICE_URL` - Auth service endpoint
- `NOTIFICATION_SERVICE_URL` - Notification service endpoint
- `PAYMENT_SERVICE_URL` - Payment service endpoint

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t hotel-service .
docker run -p 3004:3004 hotel-service
```

### Production Considerations

- Set `NODE_ENV=production`
- Use a production-ready database
- Configure Redis for persistence
- Set up proper logging and monitoring
- Use HTTPS in production
- Configure rate limiting
- Set up health checks

## Integration

### External Services

The hotel service integrates with:

- **Auth Service**: User authentication and authorization
- **Notification Service**: Booking confirmations and updates
- **Payment Service**: Payment processing
- **Upload Service**: Image and file management

### Event System

The service publishes events for:
- Property changes
- Booking lifecycle events
- Availability updates
- Pricing changes

## Contributing

1. Follow the existing code style and patterns
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting
5. Follow the commit message conventions

## License

MIT License - see LICENSE file for details