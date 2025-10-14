import Redis from 'redis';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { PrismaClient } from '../generated/prisma-client';

// Global test setup
let _prisma: PrismaClient;
let redis: ReturnType<typeof Redis.createClient> | null = null;

beforeAll(async () => {
  // Initialize test database connection
  _prisma = new PrismaClient({
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

afterAll(async () => {
  // Cleanup connections
  try {
    await _prisma.$disconnect();
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

beforeEach(async () => {
  // Clean up test data before each test
  await cleanupTestData();
});

afterEach(async () => {
  // Clean up test data after each test
  await cleanupTestData();
});

async function cleanupTestData() {
  try {
    // Clean up in reverse dependency order
    await _prisma.passwordResetToken.deleteMany();
    await _prisma.emailVerificationToken.deleteMany();
    await _prisma.refreshToken.deleteMany();
    await _prisma.address.deleteMany();
    await _prisma.advertiserProfile.deleteMany();
    await _prisma.hostProfile.deleteMany();
    await _prisma.driverProfile.deleteMany();
    await _prisma.vendorProfile.deleteMany();
    await _prisma.customerProfile.deleteMany();
    await _prisma.userRole.deleteMany();
    await _prisma.user.deleteMany();

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
export { _prisma as prisma, redis };
