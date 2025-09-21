import { PrismaClient } from '@prisma/client';
import Redis from 'redis';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

// Global test setup
let prisma: PrismaClient;
let redis: ReturnType<typeof Redis.createClient>;

beforeAll(async () => {
  // Initialize test database connection
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

  // Initialize test Redis connection
  redis = Redis.createClient({
    url: process.env.TEST_REDIS_URL || process.env.REDIS_URL,
  });

  await redis.connect();
});

afterAll(async () => {
  // Cleanup connections
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.warn('Prisma disconnect failed:', error);
  }

  try {
    if (redis && typeof redis.quit === 'function') {
      await redis.quit();
    } else if (redis && typeof redis.disconnect === 'function') {
      await redis.disconnect();
    }
  } catch (error) {
    console.warn('Redis disconnect failed:', error);
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
    await prisma.orderItem.deleteMany();
    await prisma.vendorOrder.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryReservation.deleteMany();
    await prisma.productInventory.deleteMany();
    await prisma.product.deleteMany();
    // Note: vendor table doesn't exist in this schema - vendors are managed by auth service

    // Clear Redis test data
    try {
      const keys = await redis.keys('test:*');
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (redisError) {
      console.warn('Redis cleanup failed:', redisError);
    }
  } catch (error) {
    console.warn('Database cleanup failed:', error);
  }
}

// Export for use in tests
export { prisma, redis };
