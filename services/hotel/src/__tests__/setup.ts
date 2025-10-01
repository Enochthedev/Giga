import { redisClient } from '@/lib/redis';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { PrismaClient } from '../generated/prisma-client';

// Test database instance
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();

  // Connect to Redis (if needed for tests)
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  console.log('Test environment setup complete');
});

// Global test teardown
afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();

  // Disconnect from Redis
  if (redisClient.isOpen) {
    await redisClient.quit();
  }

  console.log('Test environment cleanup complete');
});

// Clean up before each test
beforeEach(async () => {
  // Clear Redis cache
  if (redisClient.isOpen) {
    await redisClient.flushAll();
  }
});

// Clean up after each test
afterEach(async () => {
  // Clean up test data from database
  // Note: In a real implementation, you might want to use transactions
  // or a test database that gets reset between tests

  // Clear Redis cache
  if (redisClient.isOpen) {
    await redisClient.flushAll();
  }
});

// Export test utilities
export { prisma };

// Test helper functions
export const createTestProperty = async (overrides: any = {}) => {
  return prisma.property.create({
    data: {
      name: 'Test Hotel',
      description: 'A test hotel for unit testing',
      category: 'hotel',
      address: JSON.stringify({
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'US',
        postalCode: '12345',
      }),
      coordinates: JSON.stringify({
        latitude: 40.7128,
        longitude: -74.006,
      }),
      timezone: 'America/New_York',
      amenities: JSON.stringify(['wifi', 'parking', 'pool']),
      policies: JSON.stringify({
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'moderate',
      }),
      contactInfo: JSON.stringify({
        phone: '+1234567890',
        email: 'test@hotel.com',
      }),
      settings: JSON.stringify({
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'en',
      }),
      status: 'active',
      ownerId: 'test-owner-id',
      ...overrides,
    },
  });
};

export const createTestRoomType = async (
  propertyId: string,
  overrides: unknown = {}
) => {
  return prisma.roomType.create({
    data: {
      propertyId,
      name: 'Standard Room',
      description: 'A comfortable standard room',
      category: 'standard',
      maxOccupancy: 2,
      bedConfiguration: JSON.stringify([{ bedType: 'queen', quantity: 1 }]),
      roomSize: 25,
      roomSizeUnit: 'sqm',
      amenities: JSON.stringify(['wifi', 'tv', 'air_conditioning']),
      totalRooms: 10,
      baseRate: 100,
      currency: 'USD',
      isActive: true,
      ...overrides,
    },
  });
};

export const createTestBooking = async (
  propertyId: string,
  overrides: unknown = {}
) => {
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 1);
  const checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + 3);

  return prisma.booking.create({
    data: {
      confirmationNumber: 'TEST123456',
      propertyId,
      guestId: 'test-guest-id',
      primaryGuest: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      }),
      checkInDate,
      checkOutDate,
      nights: 2,
      rooms: JSON.stringify([
        {
          roomTypeId: 'test-room-type-id',
          quantity: 1,
          guestCount: 2,
          rate: 100,
          totalPrice: 200,
        },
      ]),
      pricing: JSON.stringify({
        roomTotal: 200,
        taxes: [],
        fees: [],
        discounts: [],
        subtotal: 200,
        total: 200,
      }),
      totalAmount: 200,
      currency: 'USD',
      status: 'confirmed',
      bookingSource: 'direct',
      preferences: JSON.stringify({}),
      paymentStatus: 'paid',
      cancellationPolicy: 'moderate',
      noShowPolicy: 'charge_first_night',
      bookedAt: new Date(),
      ...overrides,
    },
  });
};

export const cleanupTestData = async () => {
  // Clean up in reverse order of dependencies
  await prisma.booking.deleteMany({});
  await prisma.roomType.deleteMany({});
  await prisma.property.deleteMany({});

  // Clear Redis
  if (redisClient.isOpen) {
    await redisClient.flushAll();
  }
};
