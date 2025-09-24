# Notification Service

A centralized notification service that handles multi-channel communication across the platform, including email, SMS, push notifications, and in-app messaging.

## Features

- **Multi-Channel Support**: Email, SMS, Push Notifications, In-App Messages
- **Template Management**: Dynamic templates with Handlebars support and multi-language capabilities
- **User Preferences**: Comprehensive preference management with opt-out/opt-in functionality
- **Queue Management**: Redis-based queuing with priority handling and retry logic
- **Provider Integration**: Multiple provider support with automatic failover
- **Analytics & Tracking**: Detailed delivery and engagement tracking
- **Scheduled Notifications**: Support for scheduled and recurring notifications
- **Workflow Automation**: Event-driven notification workflows
- **Compliance**: GDPR, CAN-SPAM, and other regulation compliance features

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- PNPM

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm prisma migrate dev

# Seed the database
pnpm run seed

# Start development server
pnpm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure the following:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SENDGRID_API_KEY`: SendGrid API key for email
- `TWILIO_ACCOUNT_SID`: Twilio account SID for SMS
- `FIREBASE_PROJECT_ID`: Firebase project ID for push notifications

## API Documentation

The service provides RESTful APIs for all notification operations. Once running, visit:

- API Documentation: `http://localhost:3004/api-docs`
- Health Check: `http://localhost:3004/health`

## Architecture

### Core Components

- **NotificationService**: Main orchestration service
- **TemplateEngine**: Handles template rendering and management
- **QueueManager**: Manages notification queues and processing
- **ProviderManager**: Handles multiple notification providers
- **PreferenceManager**: Manages user notification preferences
- **AnalyticsService**: Tracks delivery and engagement metrics

### Supported Providers

#### Email Providers
- SendGrid
- AWS SES
- Mailgun
- SMTP

#### SMS Providers
- Twilio
- AWS SNS
- Vonage
- MessageBird

#### Push Notification Providers
- Firebase Cloud Messaging (FCM)
- Apple Push Notification Service (APNS)

## Usage Examples

### Send Email Notification

```typescript
import { NotificationServiceClient } from '@platform/notification-service';

const client = new NotificationServiceClient();

await client.sendEmail({
  to: 'user@example.com',
  templateId: 'welcome-email',
  variables: {
    firstName: 'John',
    verificationUrl: 'https://app.com/verify/token'
  },
  priority: 'high'
});
```

### Send Multi-Channel Notification

```typescript
await client.sendNotification({
  userId: 'user123',
  channels: ['email', 'push', 'in_app'],
  templateId: 'order-confirmation',
  variables: {
    orderNumber: 'ORD-12345',
    total: '$99.99'
  },
  category: 'transactional',
  priority: 'high'
});
```

### Schedule Notification

```typescript
await client.scheduleNotification({
  userId: 'user123',
  channels: ['email'],
  templateId: 'reminder-email',
  variables: { eventName: 'Meeting' },
  scheduledAt: new Date('2024-01-15T10:00:00Z'),
  timezone: 'America/New_York'
});
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test notification.test.ts
```

## Development

### Project Structure

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic services
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── interfaces/      # Service interfaces
├── lib/             # Shared utilities and configurations
├── utils/           # Helper functions
├── __tests__/       # Test files
└── workers/         # Background job processors
```

### Code Quality

The project uses ESLint, Prettier, and TypeScript for code quality:

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Type check
pnpm type-check
```

## Deployment

### Docker

```bash
# Build image
docker build -t notification-service .

# Run container
docker run -p 3004:3004 notification-service
```

### Production Considerations

- Set up proper monitoring and alerting
- Configure provider rate limits and quotas
- Set up database connection pooling
- Configure Redis clustering for high availability
- Set up proper logging and error tracking
- Configure backup and disaster recovery

## Monitoring

The service provides comprehensive monitoring capabilities:

- Health checks for all dependencies
- Metrics for queue processing and provider performance
- Analytics dashboards for delivery and engagement tracking
- Alerting for failed deliveries and system issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.