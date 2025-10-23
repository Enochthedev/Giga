import { PrismaClient } from '@prisma/client';
import { connectDatabase, disconnectDatabase } from './prisma';

/**
 * Database setup and initialization script
 * This script handles database schema creation and initial data setup
 */

const prisma = new PrismaClient();

/**
 * Initialize the database with required data
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Starting database initialization...');

    // Connect to database
    await connectDatabase();

    // Create default gateway configurations
    await createDefaultGateways();

    // Create default fraud rules
    await createDefaultFraudRules();

    // Create default subscription plans
    await createDefaultSubscriptionPlans();

    console.log('✅ Database initialization completed successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

/**
 * Create default payment gateway configurations
 */
async function createDefaultGateways(): Promise<void> {
  console.log('📝 Creating default gateway configurations...');

  const defaultGateways = [
    {
      id: 'stripe-gateway',
      type: 'STRIPE' as const,
      name: 'Stripe',
      status: 'ACTIVE' as const,
      priority: 1,
      credentials: {
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
        publishableKey:
          process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder',
      },
      settings: {
        currency: 'USD',
        captureMethod: 'automatic',
        paymentMethodTypes: ['card', 'digital_wallet'],
        supportedCountries: ['US', 'CA', 'GB', 'AU'],
      },
      healthCheck: {
        endpoint: 'https://api.stripe.com/v1/charges',
        timeout: 30000,
        interval: 300000, // 5 minutes
      },
      rateLimit: {
        requestsPerSecond: 100,
        burstLimit: 200,
      },
    },
    {
      id: 'paystack-gateway',
      type: 'PAYSTACK' as const,
      name: 'Paystack',
      status: 'ACTIVE' as const,
      priority: 2,
      credentials: {
        secretKey: process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder',
        publicKey: process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
        webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || 'placeholder',
      },
      settings: {
        currency: 'NGN',
        captureMethod: 'automatic',
        paymentMethodTypes: ['card', 'bank_account', 'mobile_money'],
        supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
      },
      healthCheck: {
        endpoint: 'https://api.paystack.co/transaction/verify',
        timeout: 30000,
        interval: 300000,
      },
      rateLimit: {
        requestsPerSecond: 50,
        burstLimit: 100,
      },
    },
    {
      id: 'dummy-gateway',
      type: 'DUMMY' as const,
      name: 'Dummy Gateway (Development)',
      status: 'ACTIVE' as const,
      priority: 999, // Lowest priority
      credentials: {
        apiKey: 'dummy-key',
      },
      settings: {
        currency: 'USD',
        captureMethod: 'automatic',
        paymentMethodTypes: ['card', 'digital_wallet', 'bank_account'],
        supportedCountries: ['*'], // All countries
        simulateFailures: true,
        successRate: 0.95,
      },
      healthCheck: {
        endpoint: 'internal://dummy',
        timeout: 1000,
        interval: 60000,
      },
      rateLimit: {
        requestsPerSecond: 1000,
        burstLimit: 2000,
      },
    },
  ];

  for (const gateway of defaultGateways) {
    await prisma.gatewayConfig.upsert({
      where: { id: gateway.id },
      update: gateway,
      create: gateway,
    });
  }

  console.log(`✅ Created ${defaultGateways.length} gateway configurations`);
}

/**
 * Create default fraud detection rules
 */
async function createDefaultFraudRules(): Promise<void> {
  console.log('📝 Creating default fraud rules...');

  const defaultFraudRules = [
    {
      id: 'velocity-check-daily',
      name: 'Daily Transaction Velocity Check',
      type: 'VELOCITY' as const,
      isActive: true,
      priority: 1,
      conditions: [
        {
          field: 'transaction_count_24h',
          operator: 'greater_than',
          value: 10,
        },
        {
          field: 'transaction_amount_24h',
          operator: 'greater_than',
          value: 5000,
        },
      ],
      action: 'REVIEW' as const,
      riskScore: 75,
      description: 'Flag transactions when user exceeds daily velocity limits',
    },
    {
      id: 'high-amount-check',
      name: 'High Amount Transaction Check',
      type: 'AMOUNT' as const,
      isActive: true,
      priority: 2,
      conditions: [
        {
          field: 'amount',
          operator: 'greater_than',
          value: 10000,
        },
      ],
      action: 'REVIEW' as const,
      riskScore: 60,
      description: 'Review transactions above $10,000',
    },
    {
      id: 'geolocation-mismatch',
      name: 'Geolocation Mismatch Check',
      type: 'GEOLOCATION' as const,
      isActive: true,
      priority: 3,
      conditions: [
        {
          field: 'country_mismatch',
          operator: 'equals',
          value: true,
        },
        {
          field: 'distance_km',
          operator: 'greater_than',
          value: 1000,
        },
      ],
      action: 'CHALLENGE' as const,
      riskScore: 50,
      description: 'Challenge transactions from unusual locations',
    },
    {
      id: 'blacklist-check',
      name: 'Blacklist Check',
      type: 'BLACKLIST' as const,
      isActive: true,
      priority: 0, // Highest priority
      conditions: [
        {
          field: 'blacklisted',
          operator: 'equals',
          value: true,
        },
      ],
      action: 'DECLINE' as const,
      riskScore: 100,
      description: 'Automatically decline blacklisted users/cards/IPs',
    },
  ];

  for (const rule of defaultFraudRules) {
    await prisma.fraudRule.upsert({
      where: { id: rule.id },
      update: rule,
      create: rule,
    });
  }

  console.log(`✅ Created ${defaultFraudRules.length} fraud rules`);
}

/**
 * Create default subscription plans
 */
async function createDefaultSubscriptionPlans(): Promise<void> {
  console.log('📝 Creating default subscription plans...');

  const defaultPlans = [
    {
      id: 'basic-monthly',
      name: 'Basic Monthly Plan',
      description: 'Basic features with monthly billing',
      amount: 9.99,
      currency: 'USD',
      interval: 'MONTH' as const,
      intervalCount: 1,
      trialPeriodDays: 14,
      usageType: 'LICENSED' as const,
      isActive: true,
    },
    {
      id: 'pro-monthly',
      name: 'Pro Monthly Plan',
      description: 'Advanced features with monthly billing',
      amount: 29.99,
      currency: 'USD',
      interval: 'MONTH' as const,
      intervalCount: 1,
      trialPeriodDays: 14,
      usageType: 'LICENSED' as const,
      isActive: true,
    },
    {
      id: 'enterprise-yearly',
      name: 'Enterprise Yearly Plan',
      description: 'Full features with yearly billing',
      amount: 999.99,
      currency: 'USD',
      interval: 'YEAR' as const,
      intervalCount: 1,
      trialPeriodDays: 30,
      usageType: 'LICENSED' as const,
      isActive: true,
    },
    {
      id: 'usage-based',
      name: 'Usage-Based Plan',
      description: 'Pay per transaction processed',
      amount: 0.3,
      currency: 'USD',
      interval: 'MONTH' as const,
      intervalCount: 1,
      usageType: 'METERED' as const,
      meteringUnit: 'transaction',
      isActive: true,
    },
  ];

  for (const plan of defaultPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  console.log(`✅ Created ${defaultPlans.length} subscription plans`);
}

/**
 * Reset database (for development/testing)
 */
export async function resetDatabase(): Promise<void> {
  console.log('🗑️  Resetting database...');

  try {
    await connectDatabase();

    // Delete all data in reverse dependency order
    await prisma.auditLog.deleteMany();
    await prisma.webhookDelivery.deleteMany();
    await prisma.webhookEvent.deleteMany();
    await prisma.webhookEndpoint.deleteMany();
    await prisma.blacklistEntry.deleteMany();
    await prisma.whitelistEntry.deleteMany();
    await prisma.fraudAssessment.deleteMany();
    await prisma.fraudRule.deleteMany();
    await prisma.usageRecord.deleteMany();
    await prisma.invoicePayment.deleteMany();
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.gatewayHealthStatus.deleteMany();
    await prisma.gatewayMetrics.deleteMany();
    await prisma.paymentSplit.deleteMany();
    await prisma.dispute.deleteMany();
    await prisma.refund.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.gatewayConfig.deleteMany();

    console.log('✅ Database reset completed');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'init':
      initializeDatabase().catch(console.error);
      break;
    case 'reset':
      resetDatabase().catch(console.error);
      break;
    default:
      console.log('Usage: tsx database-setup.ts [init|reset]');
      process.exit(1);
  }
}
