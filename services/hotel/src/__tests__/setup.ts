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
  return mockPrisma.roomType.create({
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
      images: JSON.stringify([]),
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

  return mockPrisma.booking.create({
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
      additionalGuests: JSON.stringify([]),
      bookedAt: new Date(),
      ...overrides,
    },
  });
};

export const cleanupTestData = async () => {
  // Clean up in reverse order of dependencies
  await mockPrisma.booking.deleteMany({});
  await mockPrisma.roomType.deleteMany({});
  await mockPrisma.property.deleteMany({});
};
