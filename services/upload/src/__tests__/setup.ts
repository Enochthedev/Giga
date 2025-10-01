import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { prisma } from '../lib/prisma';
import { redis } from '../lib/redis';

// Test database setup
beforeAll(async () => {
  // Connect to test database
  try {
    await prisma.$connect();
  } catch (error) {
    console.warn('Database connection failed, some tests may not work:', error);
  }

  // Connect to test Redis (optional for some tests)
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (error) {
    console.warn('Redis connection failed, some tests may not work:', error);
  }
});

afterAll(async () => {
  // Cleanup and disconnect
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.warn('Database disconnect failed:', error);
  }

  try {
    if (redis.isOpen) {
      await redis.disconnect();
    }
  } catch (error) {
    console.warn('Redis disconnect failed:', error);
  }
});

beforeEach(async () => {
  // Clean up database before each test
  await cleanupDatabase();

  // Clean up Redis cache (if connected)
  try {
    if (redis.isOpen) {
      await redis.flushDb();
    }
  } catch (error) {
    console.warn('Redis cleanup failed:', error);
  }
});

afterEach(async () => {
  // Additional cleanup if needed
});

function cleanupDatabase() {
  // Delete all test data
  // Note: Add actual table cleanup when Prisma schema is created
  try {
    // await prisma.fileMetadata.deleteMany();
    // await prisma.fileRelationship.deleteMany();
    // Add other table cleanups as needed
  } catch (error) {
    console.warn('Database cleanup warning:', error);
  }
}

// Test utilities
export const testUtils = {
  createMockFile: (overrides: Partial<any> = {}) => ({
    buffer: Buffer.from('test file content'),
    originalName: 'test-file.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    ...overrides,
  }),

  createMockUploadRequest: (overrides: Partial<unknown> = {}) => ({
    file: testUtils.createMockFile(),
    entityType: 'user_profile',
    entityId: 'user-123',
    uploadedBy: 'service-auth',
    accessLevel: 'private',
    ...overrides,
  }),

  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Mock external services
export const mockServices = {
  malwareScanner: {
    scan: vi.fn().mockResolvedValue({ isClean: true, threats: [] }),
  },

  imageProcessor: {
    process: vi.fn().mockResolvedValue({
      success: true,
      processedFile: testUtils.createMockFile(),
      metadata: { width: 800, height: 600, format: 'jpeg' },
    }),
  },

  storageProvider: {
    store: vi.fn().mockResolvedValue({
      success: true,
      path: '/test/path',
      url: 'http://test.com/file',
    }),
    delete: vi.fn().mockResolvedValue(true),
  },
};

// Global test configuration
declare global {
  // eslint-disable-next-line no-var
  var testConfig: {
    timeout: number;
    retries: number;
  };
}

globalThis.testConfig = {
  timeout: 10000,
  retries: 2,
};
