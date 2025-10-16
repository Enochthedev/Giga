import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { prisma } from '@/lib/prisma';

// Global test setup
beforeAll(async () => {
  // Setup test database connection
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup and disconnect
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up database before each test
  // Add any necessary cleanup logic here
});

afterEach(async () => {
  // Clean up after each test
  // Add any necessary cleanup logic here
});

// Mock external services for testing
export const mockAuthService = {
  validateUser: vi.fn(),
  getUserProfile: vi.fn(),
};

export const mockPaymentService = {
  processPayment: vi.fn(),
  refundPayment: vi.fn(),
};

export const mockNotificationService = {
  sendNotification: vi.fn(),
  sendBulkNotification: vi.fn(),
};

export const mockUploadService = {
  uploadFile: vi.fn(),
  getFileUrl: vi.fn(),
  deleteFile: vi.fn(),
};

// Test utilities
export const createTestRide = (overrides = {}) => ({
  id: 'test-ride-id',
  passengerId: 'test-passenger-id',
  pickupLocation: {
    latitude: 40.7128,
    longitude: -74.006,
    timestamp: new Date(),
  },
  dropoffLocation: {
    latitude: 40.7589,
    longitude: -73.9851,
    timestamp: new Date(),
  },
  vehicleType: 'economy',
  passengerCount: 1,
  status: 'requested',
  estimatedFare: {
    baseFare: 2.5,
    distanceFare: 5.0,
    timeFare: 2.0,
    surgeFare: 0,
    tolls: 0,
    fees: [],
    discounts: [],
    tips: 0,
    taxes: 0.95,
    total: 10.45,
    currency: 'USD',
  },
  safetyFeatures: [],
  requestedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestDriver = (overrides = {}) => ({
  id: 'test-driver-id',
  userId: 'test-user-id',
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    phoneNumber: '+1234567890',
    email: 'john.doe@example.com',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
    emergencyContact: {
      name: 'Jane Doe',
      phoneNumber: '+1234567891',
      relationship: 'spouse',
    },
    languages: ['en'],
  },
  verification: {
    licenseNumber: 'DL123456789',
    licenseExpiry: new Date('2025-12-31'),
    licenseClass: 'Class C',
    licenseVerified: true,
    insuranceVerified: true,
    insuranceExpiry: new Date('2025-12-31'),
    backgroundCheckStatus: 'approved',
    verificationLevel: 'standard',
  },
  documents: [],
  vehicles: [],
  status: 'active',
  availability: {
    isOnline: true,
    acceptingRides: true,
    workingHours: {},
    preferredAreas: [],
    maxDistance: 10,
    vehicleTypes: ['economy'],
  },
  metrics: {
    totalRides: 0,
    completedRides: 0,
    cancelledRides: 0,
    averageRating: 5.0,
    totalRatings: 0,
    acceptanceRate: 1.0,
    completionRate: 1.0,
    responseTime: 30,
    onTimePercentage: 1.0,
    totalDistance: 0,
    totalDrivingTime: 0,
  },
  earnings: {
    totalEarnings: 0,
    currentWeekEarnings: 0,
    currentMonthEarnings: 0,
    pendingPayouts: 0,
    totalPayouts: 0,
    earningsBreakdown: {
      baseFares: 0,
      tips: 0,
      bonuses: 0,
      surgeEarnings: 0,
      referralBonuses: 0,
      commissionDeducted: 0,
    },
  },
  payoutInfo: {
    preferredMethod: 'bank_transfer',
    payoutSchedule: 'weekly',
    minimumPayout: 50,
  },
  safetyScore: 100,
  backgroundCheck: 'approved',
  preferences: {
    notifications: {
      rideRequests: true,
      earnings: true,
      promotions: false,
      safetyAlerts: true,
      systemUpdates: true,
      preferredChannels: ['push'],
    },
    ridePreferences: {
      maxRideDistance: 50,
      preferredVehicleTypes: ['economy'],
      acceptPoolRides: true,
      acceptScheduledRides: true,
      minimumFare: 5,
      avoidTolls: false,
    },
    paymentPreferences: {
      autoPayoutEnabled: true,
      payoutThreshold: 100,
      taxDocumentDelivery: 'email',
    },
    privacySettings: {
      shareLocationWithPassengers: true,
      allowRatingComments: true,
      profileVisibility: 'public',
    },
  },
  registeredAt: new Date(),
  lastActiveAt: new Date(),
  ...overrides,
});

export const createTestVehicle = (overrides = {}) => ({
  id: 'test-vehicle-id',
  driverId: 'test-driver-id',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  color: 'Silver',
  licensePlate: 'ABC123',
  type: 'economy',
  category: 'sedan',
  capacity: 4,
  registration: {
    registrationNumber: 'REG123456',
    registrationExpiry: new Date('2025-12-31'),
    registeredOwner: 'John Doe',
    registrationState: 'NY',
    verified: true,
  },
  insurance: {
    policyNumber: 'INS123456',
    provider: 'State Farm',
    policyExpiry: new Date('2025-12-31'),
    coverageAmount: 100000,
    verified: true,
  },
  inspection: {
    inspectionDate: new Date(),
    inspectionExpiry: new Date('2025-12-31'),
    passed: true,
    nextInspectionDue: new Date('2025-12-31'),
  },
  features: [],
  accessibility: [],
  status: 'approved',
  isActive: true,
  condition: {
    overall: 'excellent',
    exterior: 'excellent',
    interior: 'excellent',
    mechanical: 'excellent',
    cleanliness: 'excellent',
    lastAssessedAt: new Date(),
  },
  photos: [],
  addedAt: new Date(),
  ...overrides,
});

// Global test configuration
export const testConfig = {
  database: {
    url:
      process.env.TEST_DATABASE_URL ||
      'postgresql://test:test@localhost:5432/taxi_service_test',
  },
  redis: {
    url: process.env.TEST_REDIS_URL || 'redis://localhost:6379/1',
  },
  services: {
    auth: process.env.TEST_AUTH_SERVICE_URL || 'http://localhost:3001',
    payment: process.env.TEST_PAYMENT_SERVICE_URL || 'http://localhost:3003',
    notification:
      process.env.TEST_NOTIFICATION_SERVICE_URL || 'http://localhost:3004',
    upload: process.env.TEST_UPLOAD_SERVICE_URL || 'http://localhost:3006',
  },
};
