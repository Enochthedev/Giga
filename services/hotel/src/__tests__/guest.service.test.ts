/**
 * Unit tests for Guest Service
 */

import { GuestService } from '@/services/guest.service';
import {
  ActivityType,
  CommunicationMethod,
  CreateGuestProfileRequest,
  Gender,
  GuestSearchCriteria,
  UpdateGuestProfileRequest,
} from '@/types/guest.types';
import { ConflictError, NotFoundError, ValidationError } from '@/utils/errors';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
const mockPrisma = {
  guestProfile: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  guestActivityLog: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    deleteMany: vi.fn(),
  },
};

const mockAuthClient = {
  getUserInfo: vi.fn(),
  validateToken: vi.fn(),
  getUserPermissions: vi.fn(),
  checkUserPermission: vi.fn(),
  getUsersByIds: vi.fn(),
  validateUserAccess: vi.fn(),
  healthCheck: vi.fn(),
};

// Mock the auth client
vi.mock('@/lib/auth-client', () => ({
  getAuthClient: () => mockAuthClient,
}));

describe('GuestService', () => {
  let guestService: GuestService;

  beforeEach(() => {
    guestService = new GuestService(mockPrisma as any);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createGuestProfile', () => {
    const validCreateRequest: CreateGuestProfileRequest = {
      _guestId: 'user-123',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Mr.',
        dateOfBirth: new Date('1990-01-01'),
        nationality: 'US',
        gender: Gender.MALE,
      },
      contactInfo: {
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postalCode: '10001',
        },
      },
      preferences: {
        roomPreferences: {
          smokingPreference: 'non_smoking' as any,
          quietRoom: true,
          accessibleRoom: false,
        },
        servicePreferences: {
          earlyCheckIn: true,
          lateCheckOut: false,
        },
        communicationLanguage: 'en',
        currency: 'USD',
        timezone: 'America/New_York',
      },
    };

    it('should create a guest profile successfully', async () => {
      const mockUserInfo = {
        id: 'user-123',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
        permissions: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const mockCreatedProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        personalInfo: validCreateRequest.personalInfo,
        contactInfo: validCreateRequest.contactInfo,
        preferences: validCreateRequest.preferences,
        bookingHistory: [],
        loyaltyPoints: 0,
        communicationPreferences: {
          preferredMethod: CommunicationMethod.EMAIL,
          marketingEmails: true,
          promotionalSms: false,
          bookingNotifications: true,
          loyaltyUpdates: true,
          surveyParticipation: false,
          language: 'en',
          timezone: 'UTC',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(null);
      mockAuthClient.getUserInfo.mockResolvedValue(mockUserInfo);
      mockPrisma.guestProfile.create.mockResolvedValue(mockCreatedProfile);
      mockPrisma.guestActivityLog.create.mockResolvedValue({});

      const result = await guestService.createGuestProfile(validCreateRequest);

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { guestId: 'user-123' },
      });
      expect(mockAuthClient.getUserInfo).toHaveBeenCalledWith('user-123');
      expect(mockPrisma.guestProfile.create).toHaveBeenCalled();
      expect(mockPrisma.guestActivityLog.create).toHaveBeenCalledWith({
        data: {
          guestId: 'guest-123',
          activityType: ActivityType.PROFILE_CREATED,
          description: 'Guest profile created',
          metadata: {},
        },
      });
      expect(result.id).toBe('guest-123');
      expect(result._userId).toBe('user-123');
    });

    it('should throw ConflictError if guest profile already exists', async () => {
      const existingProfile = {
        id: 'existing-guest-123',
        guestId: 'user-123',
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(existingProfile);

      await expect(
        guestService.createGuestProfile(validCreateRequest)
      ).rejects.toThrow(ConflictError);

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { guestId: 'user-123' },
      });
      expect(mockAuthClient.getUserInfo).not.toHaveBeenCalled();
    });

    it('should throw ValidationError if user does not exist in Auth Service', async () => {
      mockPrisma.guestProfile.findUnique.mockResolvedValue(null);
      mockAuthClient.getUserInfo.mockRejectedValue(new Error('User not found'));

      await expect(
        guestService.createGuestProfile(validCreateRequest)
      ).rejects.toThrow(ValidationError);

      expect(mockAuthClient.getUserInfo).toHaveBeenCalledWith('user-123');
    });

    it('should throw ValidationError for missing required fields', async () => {
      const invalidRequest = {
        ...validCreateRequest,
        personalInfo: {
          ...validCreateRequest.personalInfo,
          firstName: '',
        },
      };

      await expect(
        guestService.createGuestProfile(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid email format', async () => {
      const invalidRequest = {
        ...validCreateRequest,
        contactInfo: {
          ...validCreateRequest.contactInfo,
          email: 'invalid-email',
        },
      };

      await expect(
        guestService.createGuestProfile(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('getGuestProfile', () => {
    it('should return guest profile by ID', async () => {
      const mockProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        personalInfo: { firstName: 'John', lastName: 'Doe' },
        contactInfo: { email: 'john@example.com', phone: '+1234567890' },
        preferences: {},
        bookingHistory: [],
        loyaltyPoints: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await guestService.getGuestProfile('guest-123');

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
      });
      expect(result.id).toBe('guest-123');
      expect(result._userId).toBe('user-123');
    });

    it('should throw NotFoundError if guest profile does not exist', async () => {
      mockPrisma.guestProfile.findUnique.mockResolvedValue(null);

      await expect(
        guestService.getGuestProfile('nonexistent-id')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getGuestProfileByUserId', () => {
    it('should return guest profile by user ID', async () => {
      const mockProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        personalInfo: { firstName: 'John', lastName: 'Doe' },
        contactInfo: { email: 'john@example.com', phone: '+1234567890' },
        preferences: {},
        bookingHistory: [],
        loyaltyPoints: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(mockProfile);

      const result = await guestService.getGuestProfileByUserId('user-123');

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { guestId: 'user-123' },
      });
      expect(result.id).toBe('guest-123');
      expect(result._userId).toBe('user-123');
    });

    it('should throw NotFoundError if guest profile does not exist', async () => {
      mockPrisma.guestProfile.findUnique.mockResolvedValue(null);

      await expect(
        guestService.getGuestProfileByUserId('nonexistent-user')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateGuestProfile', () => {
    const updateRequest: UpdateGuestProfileRequest = {
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
      preferences: {
        roomPreferences: {
          smokingPreference: 'smoking' as any,
          quietRoom: false,
          accessibleRoom: true,
        },
      },
    };

    it('should update guest profile successfully', async () => {
      const existingProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        personalInfo: { firstName: 'John', lastName: 'Doe' },
        contactInfo: { email: 'john@example.com', phone: '+1234567890' },
        preferences: { roomPreferences: { quietRoom: true } },
        communicationPreferences: { language: 'en' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProfile = {
        ...existingProfile,
        personalInfo: { firstName: 'Jane', lastName: 'Smith' },
        preferences: updateRequest.preferences,
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(existingProfile);
      mockPrisma.guestProfile.update.mockResolvedValue(updatedProfile);
      mockPrisma.guestActivityLog.create.mockResolvedValue({});

      const result = await guestService.updateGuestProfile(
        'guest-123',
        updateRequest
      );

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
      });
      expect(mockPrisma.guestProfile.update).toHaveBeenCalled();
      expect(mockPrisma.guestActivityLog.create).toHaveBeenCalledWith({
        data: {
          guestId: 'guest-123',
          activityType: ActivityType.PROFILE_UPDATED,
          description: 'Guest profile updated',
          metadata: {},
        },
      });
      expect(result.personalInfo.firstName).toBe('Jane');
    });

    it('should throw NotFoundError if guest profile does not exist', async () => {
      mockPrisma.guestProfile.findUnique.mockResolvedValue(null);

      await expect(
        guestService.updateGuestProfile('nonexistent-id', updateRequest)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('searchGuestProfiles', () => {
    it('should search guest profiles with criteria', async () => {
      const criteria: GuestSearchCriteria = {
        name: 'John',
        email: 'john@example.com',
        sortBy: 'name' as any,
        sortOrder: 'asc',
      };

      const mockProfiles = [
        {
          id: 'guest-1',
          userId: 'user-1',
          personalInfo: { firstName: 'John', lastName: 'Doe' },
          contactInfo: { email: 'john@example.com' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.guestProfile.findMany.mockResolvedValue(mockProfiles);
      mockPrisma.guestProfile.count.mockResolvedValue(1);

      const result = await guestService.searchGuestProfiles(criteria, {
        page: 1,
        limit: 20,
      });

      expect(mockPrisma.guestProfile.findMany).toHaveBeenCalled();
      expect(mockPrisma.guestProfile.count).toHaveBeenCalled();
      expect(result.guests).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('updateBookingHistory', () => {
    it('should update guest booking history', async () => {
      const bookingHistory = {
        bookingId: 'booking-123',
        propertyId: 'property-123',
        propertyName: 'Test Hotel',
        checkInDate: new Date('2023-12-01'),
        checkOutDate: new Date('2023-12-03'),
        totalAmount: 200,
        currency: 'USD',
        status: 'completed',
      };

      const existingProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        bookingHistory: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(existingProfile);
      mockPrisma.guestProfile.update.mockResolvedValue({});
      mockPrisma.guestActivityLog.create.mockResolvedValue({});

      await guestService.updateBookingHistory('guest-123', bookingHistory);

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
      });
      expect(mockPrisma.guestProfile.update).toHaveBeenCalled();
      expect(mockPrisma.guestActivityLog.create).toHaveBeenCalledWith({
        data: {
          guestId: 'guest-123',
          activityType: ActivityType.BOOKING_CREATED,
          description: 'Booking booking-123 added to history',
          metadata: {},
        },
      });
    });

    it('should throw NotFoundError if guest profile does not exist', async () => {
      const bookingHistory = {
        bookingId: 'booking-123',
        propertyId: 'property-123',
        propertyName: 'Test Hotel',
        checkInDate: new Date('2023-12-01'),
        checkOutDate: new Date('2023-12-03'),
        totalAmount: 200,
        currency: 'USD',
        status: 'completed',
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(null);

      await expect(
        guestService.updateBookingHistory('nonexistent-id', bookingHistory)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateLoyaltyPoints', () => {
    it('should update guest loyalty points', async () => {
      const existingProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        loyaltyPoints: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(existingProfile);
      mockPrisma.guestProfile.update.mockResolvedValue({});
      mockPrisma.guestActivityLog.create.mockResolvedValue({});

      await guestService.updateLoyaltyPoints('guest-123', 50, 'Booking reward');

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
      });
      expect(mockPrisma.guestProfile.update).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
        data: { loyaltyPoints: 150 },
      });
      expect(mockPrisma.guestActivityLog.create).toHaveBeenCalledWith({
        data: {
          guestId: 'guest-123',
          activityType: ActivityType.LOYALTY_POINTS_EARNED,
          description: 'Booking reward',
          metadata: { points: 50, newTotal: 150 },
        },
      });
    });

    it('should not allow negative loyalty points', async () => {
      const existingProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        loyaltyPoints: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(existingProfile);
      mockPrisma.guestProfile.update.mockResolvedValue({});
      mockPrisma.guestActivityLog.create.mockResolvedValue({});

      await guestService.updateLoyaltyPoints(
        'guest-123',
        -100,
        'Point redemption'
      );

      expect(mockPrisma.guestProfile.update).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
        data: { loyaltyPoints: 0 },
      });
    });
  });

  describe('getGuestActivityLog', () => {
    it('should return guest activity log', async () => {
      const mockActivities = [
        {
          id: 'activity-1',
          guestId: 'guest-123',
          activityType: ActivityType.PROFILE_CREATED,
          description: 'Profile created',
          metadata: {},
          timestamp: new Date(),
        },
      ];

      mockPrisma.guestActivityLog.findMany.mockResolvedValue(mockActivities);
      mockPrisma.guestActivityLog.count.mockResolvedValue(1);

      const result = await guestService.getGuestActivityLog('guest-123', {
        page: 1,
        limit: 50,
      });

      expect(mockPrisma.guestActivityLog.findMany).toHaveBeenCalledWith({
        where: { guestId: 'guest-123' },
        orderBy: { timestamp: 'desc' },
        skip: 0,
        take: 50,
      });
      expect(result.activities).toHaveLength(1);
      expect(result.totalCount).toBe(1);
      expect(result.hasMore).toBe(false);
    });
  });

  describe('deleteGuestProfile', () => {
    it('should delete guest profile and activity logs', async () => {
      const existingProfile = {
        id: 'guest-123',
        guestId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.guestProfile.findUnique.mockResolvedValue(existingProfile);
      mockPrisma.guestActivityLog.deleteMany.mockResolvedValue({});
      mockPrisma.guestProfile.delete.mockResolvedValue({});

      await guestService.deleteGuestProfile('guest-123');

      expect(mockPrisma.guestProfile.findUnique).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
      });
      expect(mockPrisma.guestActivityLog.deleteMany).toHaveBeenCalledWith({
        where: { guestId: 'guest-123' },
      });
      expect(mockPrisma.guestProfile.delete).toHaveBeenCalledWith({
        where: { id: 'guest-123' },
      });
    });

    it('should throw NotFoundError if guest profile does not exist', async () => {
      mockPrisma.guestProfile.findUnique.mockResolvedValue(null);

      await expect(
        guestService.deleteGuestProfile('nonexistent-id')
      ).rejects.toThrow(NotFoundError);
    });
  });
});
