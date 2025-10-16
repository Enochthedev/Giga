// Mock Prisma client for basic implementation
// In a real implementation, this would use the actual @prisma/client

interface MockPrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  transaction: {
    create(args: any): Promise<any>;
    findUnique(args: any): Promise<any>;
    findMany(args: any): Promise<any>;
    update(args: any): Promise<any>;
    count(args: any): Promise<number>;
    deleteMany(): Promise<any>;
  };
  paymentMethod: {
    create(args: any): Promise<any>;
    findUnique(args: any): Promise<any>;
    deleteMany(): Promise<any>;
  };
  gatewayConfig: {
    create(args: any): Promise<any>;
    update(args: any): Promise<any>;
    findUnique(args: any): Promise<any>;
    findMany(args: any): Promise<any>;
    delete(args: any): Promise<any>;
    deleteMany(): Promise<any>;
  };
  paymentSplit: {
    create(args: any): Promise<any>;
    findMany(args: any): Promise<any>;
    update(args: any): Promise<any>;
    deleteMany(): Promise<any>;
  };
  refund: { deleteMany(): Promise<any> };
  dispute: { deleteMany(): Promise<any> };
  fraudAssessment: { deleteMany(): Promise<any> };
  fraudRule: { deleteMany(): Promise<any> };
  usageRecord: { deleteMany(): Promise<any> };
  invoicePayment: { deleteMany(): Promise<any> };
  invoiceItem: { deleteMany(): Promise<any> };
  invoice: { deleteMany(): Promise<any> };
  subscription: { deleteMany(): Promise<any> };
  subscriptionPlan: { deleteMany(): Promise<any> };
  gatewayHealthStatus: { deleteMany(): Promise<any> };
  gatewayMetrics: { deleteMany(): Promise<any> };
  blacklistEntry: { deleteMany(): Promise<any> };
  whitelistEntry: { deleteMany(): Promise<any> };
  webhookDelivery: { deleteMany(): Promise<any> };
  webhookEvent: {
    create(args: any): Promise<any>;
    deleteMany(): Promise<any>;
  };
  webhookEndpoint: { deleteMany(): Promise<any> };
}

// Mock implementation for testing
const mockPrisma: MockPrismaClient = {
  async $connect() {
    // Mock connection
  },

  async $disconnect() {
    // Mock disconnection
  },

  transaction: {
    async create(args: any) {
      return {
        id: 'mock-transaction-id',
        type: args.data.type || 'PAYMENT',
        status: args.data.status || 'PENDING',
        amount: args.data.amount,
        currency: args.data.currency,
        description: args.data.description,
        userId: args.data.userId,
        merchantId: args.data.merchantId,
        vendorId: args.data.vendorId,
        paymentMethodId: args.data.paymentMethodId,
        gatewayId: args.data.gatewayId,
        gatewayTransactionId: args.data.gatewayTransactionId,
        internalReference: args.data.internalReference,
        externalReference: args.data.externalReference,
        platformFee: args.data.platformFee,
        gatewayFee: args.data.gatewayFee,
        riskScore: args.data.riskScore,
        fraudFlags: args.data.fraudFlags || [],
        metadata: args.data.metadata || {},
        processedAt: args.data.processedAt,
        settledAt: args.data.settledAt,
        parentId: args.data.parentId,
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentMethod: null,
        gateway: null,
        refunds: [],
        disputes: [],
        splits: [],
        fraudAssessment: null,
        parent: null,
        children: [],
      };
    },

    async findUnique(args: any) {
      if (args.where.id === 'non-existent-id') {
        return null;
      }
      return {
        id: args.where.id,
        type: 'PAYMENT',
        status: 'SUCCEEDED',
        amount: 100.0,
        currency: 'USD',
        description: 'Test transaction',
        userId: 'test-user-1',
        merchantId: null,
        vendorId: null,
        paymentMethodId: 'pm-123',
        gatewayId: 'gw-123',
        gatewayTransactionId: null,
        internalReference: 'test-ref-123',
        externalReference: null,
        platformFee: null,
        gatewayFee: null,
        riskScore: null,
        fraudFlags: [],
        metadata: {},
        processedAt: new Date(),
        settledAt: new Date(),
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentMethod: null,
        gateway: null,
        refunds: [],
        disputes: [],
        splits: [],
        fraudAssessment: null,
        parent: null,
        children: [],
      };
    },

    async findMany(args: any) {
      return [];
    },

    async update(args: any) {
      return {
        id: args.where.id,
        type: 'PAYMENT',
        status: args.data.status || 'SUCCEEDED',
        amount: 100.0,
        currency: 'USD',
        description: 'Test transaction',
        userId: 'test-user-1',
        merchantId: null,
        vendorId: null,
        paymentMethodId: 'pm-123',
        gatewayId: 'gw-123',
        gatewayTransactionId: args.data.gatewayTransactionId,
        internalReference: 'test-ref-123',
        externalReference: null,
        platformFee: args.data.platformFee,
        gatewayFee: args.data.gatewayFee,
        riskScore: args.data.riskScore,
        fraudFlags: args.data.fraudFlags || [],
        metadata: args.data.metadata || {},
        processedAt: args.data.processedAt || new Date(),
        settledAt: args.data.settledAt || new Date(),
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentMethod: null,
        gateway: null,
        refunds: [],
        disputes: [],
        splits: [],
        fraudAssessment: null,
        parent: null,
        children: [],
      };
    },

    async count(args: any) {
      return 0;
    },

    async deleteMany() {
      return { count: 0 };
    },
  },

  paymentMethod: {
    async create(args: any) {
      return {
        id: 'mock-pm-id',
        userId: args.data.userId,
        type: args.data.type,
        provider: args.data.provider,
        token: args.data.token,
        isDefault: args.data.isDefault,
        isActive: args.data.isActive,
        metadata: args.data.metadata,
        billingAddress: args.data.billingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async findUnique(args: any) {
      return {
        id: args.where.id,
        userId: 'test-user-1',
        type: 'CARD',
        provider: 'stripe',
        token: 'pm_test_123',
        isDefault: true,
        isActive: true,
        metadata: {
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          holderName: 'Test User',
        },
        billingAddress: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async deleteMany() {
      return { count: 0 };
    },
  },

  gatewayConfig: {
    async create(args: any) {
      return {
        id: 'mock-gw-id',
        type: args.data.type,
        name: args.data.name,
        status: args.data.status,
        priority: args.data.priority,
        credentials: args.data.credentials,
        settings: args.data.settings,
        healthCheck: args.data.healthCheck,
        rateLimit: args.data.rateLimit,
        metadata: args.data.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async update(args: any) {
      return {
        id: args.where.id,
        type: 'stripe',
        name: 'Updated Gateway',
        status: args.data.status || 'active',
        priority: args.data.priority || 1,
        credentials: args.data.credentials || {},
        settings: args.data.settings || {},
        healthCheck: args.data.healthCheck || {},
        rateLimit: args.data.rateLimit || {},
        metadata: args.data.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async findUnique(args: any) {
      if (args.where.id === 'non-existent-id') {
        return null;
      }
      return {
        id: args.where.id,
        type: 'stripe',
        name: 'Test Gateway',
        status: 'active',
        priority: 1,
        credentials: {},
        settings: {},
        healthCheck: {},
        rateLimit: {},
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async findMany(args: any) {
      return [];
    },

    async delete(args: any) {
      return {
        id: args.where.id,
        type: 'stripe',
        name: 'Deleted Gateway',
        status: 'inactive',
        priority: 1,
        credentials: {},
        settings: {},
        healthCheck: {},
        rateLimit: {},
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async deleteMany() {
      return { count: 0 };
    },
  },

  paymentSplit: {
    async create(args: any) {
      return {
        id: 'mock-split-id',
        transactionId: args.data.transactionId,
        recipientId: args.data.recipientId,
        amount: args.data.amount,
        currency: args.data.currency,
        type: args.data.type,
        description: args.data.description,
        status: args.data.status,
        processedAt: args.data.processedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async findMany(args: any) {
      return [];
    },

    async update(args: any) {
      return {
        id: args.where.id,
        transactionId: 'txn-123',
        recipientId: 'recipient-123',
        amount: 80.0,
        currency: 'USD',
        type: 'FIXED',
        description: 'Test split',
        status: args.data.status,
        processedAt: args.data.processedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async deleteMany() {
      return { count: 0 };
    },
  },

  // Mock cleanup methods for all other models
  refund: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  dispute: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  fraudAssessment: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  fraudRule: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  usageRecord: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  invoicePayment: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  invoiceItem: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  invoice: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  subscription: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  subscriptionPlan: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  gatewayHealthStatus: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  gatewayMetrics: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  blacklistEntry: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  whitelistEntry: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  webhookDelivery: {
    async deleteMany() {
      return { count: 0 };
    },
  },
  webhookEvent: {
    async create(args: any) {
      return {
        id: 'mock-webhook-id',
        type: args.data.type,
        gatewayId: args.data.gatewayId,
        gatewayEventId: args.data.gatewayEventId,
        data: args.data.data,
        timestamp: args.data.timestamp,
        processed: args.data.processed || false,
        retryCount: args.data.retryCount || 0,
        metadata: args.data.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },

    async deleteMany() {
      return { count: 0 };
    },
  },
  webhookEndpoint: {
    async deleteMany() {
      return { count: 0 };
    },
  },
};

export const prisma = mockPrisma;
export default prisma;
