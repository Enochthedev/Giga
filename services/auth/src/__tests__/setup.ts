import Redis from 'redis';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { PrismaClient } from '../generated/prisma-client';

// Global test setup
let _prisma: PrismaClient;
let redis: ReturnType<typeof Redis.createClient> | null = null;

beforeAll(() => {
  // Initialize test database connection
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

  // Try to initialize test Redis connection, but don't fail if Redis is not available
  try {
    redis = Redis.createClient({
      url:
        process.env.TEST_REDIS_URL ||
        process.env.REDIS_URL ||
        'redis://localhost:6379',
    });

    await redis.connect();
  } catch (error) {
    console.warn('Redis not available for testing, using mocked Redis');
    redis = null;

    // Mock Redis service for tests
    vi.doMock('../services/redis.service', () => ({
      redisService: {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue('OK'),
        del: vi.fn().mockResolvedValue(1),
        incr: vi.fn().mockResolvedValue(1),
        expire: vi.fn().mockResolvedValue(1),
        keys: vi.fn().mockResolvedValue([]),
        quit: vi.fn().mockResolvedValue(undefined),
        disconnect: vi.fn().mockResolvedValue(undefined),
      },
    }));
  }
});

afterAll(() => {
  // Cleanup connections
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.warn('Prisma disconnect failed:', error);
  }

  if (redis) {
    try {
      if (typeof redis.quit === 'function') {
        await redis.quit();
      } else if (typeof redis.disconnect === 'function') {
        await redis.disconnect();
      }
    } catch (error) {
      console.warn('Redis disconnect failed:', error);
    }
  }
});

beforeEach(() => {
  // Clean up test data before each test
  await cleanupTestData();
});

afterEach(() => {
  // Clean up test data after each test
  await cleanupTestData();
});

async function cleanupTestData() {
  try {
    // Clean up in reverse dependency order
    await prisma.passwordResetToken.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.address.deleteMany();
    await prisma.advertiserProfile.deleteMany();
    await prisma.hostProfile.deleteMany();
    await prisma.driverProfile.deleteMany();
    await prisma.vendorProfile.deleteMany();
    await prisma.customerProfile.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();

    // Clear Redis test data if Redis is available
    if (redis) {
      try {
        const keys = await redis.keys('test:*');
        if (keys.length > 0) {
          await redis.del(keys);
        }
      } catch (redisError) {
        console.warn('Redis cleanup failed:', redisError);
      }
    }
  } catch (error) {
    console.warn('Database cleanup failed:', error);
  }
}

// Export for use in tests
export { prisma, redis };
