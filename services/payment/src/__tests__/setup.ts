import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { prisma } from '../lib/prisma';

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from test database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  await cleanupDatabase();
});

afterEach(async () => {
  // Clean up database after each test
  await cleanupDatabase();
});

async function cleanupDatabase() {
  // Delete in reverse order of dependencies
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
}

// Test utilities
export const createTestGateway = async () => {
  return await prisma.gatewayConfig.create({
    data: {
      type: 'STRIPE',
      name: 'Test Stripe Gateway',
      status: 'ACTIVE',
      priority: 1,
      credentials: {
        secretKey: 'sk_test_123',
        publishableKey: 'pk_test_123',
      },
      settings: {
        webhookSecret: 'whsec_test_123',
      },
      healthCheck: {
        enabled: true,
        interval: 60000,
      },
      rateLimit: {
        requestsPerSecond: 100,
      },
    },
  });
};

export const createTestPaymentMethod = async (userId: string = 'test-user-1') => {
  return await prisma.paymentMethod.create({
    data: {
      userId,
      type: 'CARD',
      provider: 'stripe',
      token: 'pm_test_123',
      isDefault: true,
      metadata: {
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        holderName: 'Test User',
      },
      billingAddress: {
        line1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'US',
      },
    },
  });
};

export const createTestTransaction = async (gatewayId: string, paymentMethodId?: string) => {
  return await prisma.transaction.create({
    data: {
      type: 'PAYMENT',
      status: 'PENDING',
      amount: 100.00,
      currency: 'USD',
      description: 'Test payment',
      userId: 'test-user-1',
      gatewayId,
      paymentMethodId,
      internalReference: 'test-ref-123',
      metadata: {
        testData: true,
      },
    },
  });
};