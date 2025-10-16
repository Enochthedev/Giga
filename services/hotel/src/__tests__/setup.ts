<<<<<<< HEAD
import { vi } from 'vitest';

// Mock external dependencies for unit tests
vi.mock('@/lib/redis', () => ({
  redisClient: {
    isOpen: false,
    connect: vi.fn(),
    quit: vi.fn(),
    flushAll: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {},
}));

console.log('Test environment setup complete');

// Mock prisma for tests
const mockPrisma = {
  property: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  roomType: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  booking: {
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
};

// Export test utilities
export { mockPrisma as prisma };

// Test helper functions
export const createTestProperty = async (overrides: any = {}) => {
  return mockPrisma.property.create({
=======
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { PrismaClient } from '../generated/prisma-client';
import { redisClient } from '@/lib/redis';

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
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
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
  overrides: Record<string, any> = {}
) => {
<<<<<<< HEAD
  return mockPrisma.roomType.create({
=======
  return prisma.roomType.create({
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
    data: {
      propertyId,
      name: 'Standard Room',
      description: 'A comfortable standard room',
      category: 'standard',
      maxOccupancy: 2,
<<<<<<< HEAD
      maxAdults: 2,
      maxChildren: 1,
      bedConfiguration: [{ type: 'queen', quantity: 1 }],
      roomSize: 25,
      roomSizeUnit: 'sqm',
      amenities: ['wifi', 'tv', 'air_conditioning'],
      totalRooms: 10,
      baseRate: 100,
      currency: 'USD',
      images: [],
=======
      bedConfiguration: JSON.stringify([{ bedType: 'queen', quantity: 1 }]),
      roomSize: 25,
      roomSizeUnit: 'sqm',
      amenities: JSON.stringify(['wifi', 'tv', 'air_conditioning']),
      totalRooms: 10,
      baseRate: 100,
      currency: 'USD',
      images: JSON.stringify([]),
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
      isActive: true,
      ...overrides,
    },
  });
};

export const createTestBooking = async (
  propertyId: string,
  overrides: Record<string, any> = {}
) => {
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 1);
  const checkOutDate = new Date();
  checkOutDate.setDate(checkOutDate.getDate() + 3);

<<<<<<< HEAD
  return mockPrisma.booking.create({
=======
  return prisma.booking.create({
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
    data: {
      confirmationNumber: 'TEST123456',
      propertyId,
      guestId: 'test-guest-id',
<<<<<<< HEAD
      guestName: 'John Doe',
      guestEmail: 'john.doe@example.com',
      guestPhone: '+1234567890',
      additionalGuests: [],
      checkInDate,
      checkOutDate,
      nights: 2,
      subtotal: 200,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 200,
      currency: 'USD',
      pricingDetails: {
=======
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
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        roomTotal: 200,
        taxes: [],
        fees: [],
        discounts: [],
        subtotal: 200,
        total: 200,
<<<<<<< HEAD
      },
      status: 'confirmed',
      bookingSource: 'direct',
      preferences: {},
      paymentStatus: 'paid',
      noShowPolicy: 'charge_first_night',
=======
      }),
      totalAmount: 200,
      currency: 'USD',
      status: 'confirmed',
      bookingSource: 'direct',
      preferences: JSON.stringify({}),
      paymentStatus: 'paid',
      cancellationPolicy: 'moderate',
      noShowPolicy: 'charge_first_night',
      additionalGuests: JSON.stringify([]),
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
      bookedAt: new Date(),
      ...overrides,
    },
  });
};

export const cleanupTestData = async () => {
  // Clean up in reverse order of dependencies
<<<<<<< HEAD
  await mockPrisma.booking.deleteMany({});
  await mockPrisma.roomType.deleteMany({});
  await mockPrisma.property.deleteMany({});
=======
  await prisma.booking.deleteMany({});
  await prisma.roomType.deleteMany({});
  await prisma.property.deleteMany({});

  // Clear Redis
  if (redisClient.isOpen) {
    await redisClient.flushAll();
  }
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
};
