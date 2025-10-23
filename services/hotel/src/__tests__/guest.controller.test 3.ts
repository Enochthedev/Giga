/**
 * Unit tests for Guest Controller
 */

import { GuestController } from '@/controllers/guest.controller';
import {
  ActivityType,
  CommunicationMethod,
  CreateGuestProfileRequest,
  Gender,
  GuestProfile,
  UpdateGuestProfileRequest,
} from '@/types/guest.types';
import { NotFoundError, ValidationError } from '@/utils/errors';
import { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the GuestService
const mockGuestService = {
  createGuestProfile: vi.fn(),
  getGuestProfile: vi.fn(),
  getGuestProfileByUserId: vi.fn(),
  updateGuestProfile: vi.fn(),
  searchGuestProfiles: vi.fn(),
  updateBookingHistory: vi.fn(),
  updateLoyaltyPoints: vi.fn(),
  getGuestActivityLog: vi.fn(),
  deleteGuestProfile: vi.fn(),
};

// Mock Prisma
const mockPrisma = {};

// Mock the constructor to return our mock service
vi.mock('@/services/guest.service', () => ({
  GuestService: vi.fn().mockImplementation(() => mockGuestService),
}));

describe('GuestController', () => {
  let guestController: GuestController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: ReturnType<typeof vi.fn>;
  let mockStatus: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    guestController = new GuestController(mockPrisma as any);
    // Directly assign the mock service to the controller
    (guestController as any).guestService = mockGuestService;

    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createGuestProfile', () => {
    const validCreateRequest: CreateGuestProfileRequest = {
      _userId: 'user-123',
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
    };

    it('should create guest profile successfully', async () => {
      const mockCreatedProfile: GuestProfile = {
        id: 'guest-123',
        _userId: 'user-123',
        personalInfo: validCreateRequest.personalInfo,
        contactInfo: validCreateRequest.contactInfo,
        preferences: {
          roomPreferences: {
            smokingPreference: 'non_smoking' as any,
            quietRoom: false,
            accessibleRoom: false,
          },
          servicePreferences: {},
          communicationLanguage: 'en',
          currency: 'USD',
          timezone: 'UTC',
        },
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

      mockRequest.body = validCreateRequest;
      mockGuestService.createGuestProfile.mockResolvedValue(mockCreatedProfile);

      await guestController.createGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.createGuestProfile).toHaveBeenCalledWith(
        validCreateRequest
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedProfile,
        message: 'Guest profile created successfully',
      });
    });

    it('should return 400 for missing user ID', async () => {
      mockRequest.body = { ...validCreateRequest, _userId: undefined };

      await guestController.createGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.createGuestProfile).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'User ID is required',
        },
      });
    });

    it('should return 400 for validation error', async () => {
      mockRequest.body = validCreateRequest;
      mockGuestService.createGuestProfile.mockRejectedValue(
        new ValidationError('First name is required')
      );

      await guestController.createGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'First name is required',
        },
      });
    });

    it('should return 409 for conflict error', async () => {
      mockRequest.body = validCreateRequest;
      mockGuestService.createGuestProfile.mockRejectedValue(
        new Error('Guest profile already exists for user user-123')
      );

      await guestController.createGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(409);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'Guest profile already exists for user user-123',
        },
      });
    });

    it('should return 500 for internal error', async () => {
      mockRequest.body = validCreateRequest;
      mockGuestService.createGuestProfile.mockRejectedValue(
        new Error('Database error')
      );

      await guestController.createGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create guest profile',
        },
      });
    });
  });

  describe('getGuestProfile', () => {
    it('should get guest profile successfully', async () => {
      const mockProfile: GuestProfile = {
        id: 'guest-123',
        _userId: 'user-123',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
        },
        contactInfo: {
          email: 'john@example.com',
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
            quietRoom: false,
            accessibleRoom: false,
          },
          servicePreferences: {},
          communicationLanguage: 'en',
          currency: 'USD',
          timezone: 'UTC',
        },
        bookingHistory: [],
        loyaltyPoints: 100,
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

      mockRequest.params = { id: 'guest-123' };
      mockGuestService.getGuestProfile.mockResolvedValue(mockProfile);

      await guestController.getGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.getGuestProfile).toHaveBeenCalledWith(
        'guest-123'
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockProfile,
      });
    });

    it('should return 400 for missing ID', async () => {
      mockRequest.params = {};

      await guestController.getGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.getGuestProfile).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Guest profile ID is required',
        },
      });
    });

    it('should return 404 for not found error', async () => {
      mockRequest.params = { id: 'nonexistent-id' };
      mockGuestService.getGuestProfile.mockRejectedValue(
        new NotFoundError('Guest profile', 'nonexistent-id')
      );

      await guestController.getGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: "Guest profile with identifier 'nonexistent-id' not found",
        },
      });
    });
  });

  describe('updateGuestProfile', () => {
    const updateRequest: UpdateGuestProfileRequest = {
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
    };

    it('should update guest profile successfully', async () => {
      const mockUpdatedProfile: GuestProfile = {
        id: 'guest-123',
        _userId: 'user-123',
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
        },
        contactInfo: {
          email: 'jane@example.com',
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
            quietRoom: false,
            accessibleRoom: false,
          },
          servicePreferences: {},
          communicationLanguage: 'en',
          currency: 'USD',
          timezone: 'UTC',
        },
        bookingHistory: [],
        loyaltyPoints: 100,
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

      mockRequest.params = { id: 'guest-123' };
      mockRequest.body = updateRequest;
      mockGuestService.updateGuestProfile.mockResolvedValue(mockUpdatedProfile);

      await guestController.updateGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.updateGuestProfile).toHaveBeenCalledWith(
        'guest-123',
        updateRequest
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedProfile,
        message: 'Guest profile updated successfully',
      });
    });

    it('should return 400 for missing ID', async () => {
      mockRequest.params = {};
      mockRequest.body = updateRequest;

      await guestController.updateGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.updateGuestProfile).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });
  });

  describe('updateBookingHistory', () => {
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

    it('should update booking history successfully', async () => {
      mockRequest.params = { id: 'guest-123' };
      mockRequest.body = bookingHistory;
      mockGuestService.updateBookingHistory.mockResolvedValue(undefined);

      await guestController.updateBookingHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.updateBookingHistory).toHaveBeenCalledWith(
        'guest-123',
        bookingHistory
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Booking history updated successfully',
      });
    });

    it('should return 400 for missing booking ID', async () => {
      mockRequest.params = { id: 'guest-123' };
      mockRequest.body = { ...bookingHistory, bookingId: undefined };

      await guestController.updateBookingHistory(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.updateBookingHistory).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Booking ID is required',
        },
      });
    });
  });

  describe('updateLoyaltyPoints', () => {
    it('should update loyalty points successfully', async () => {
      mockRequest.params = { id: 'guest-123' };
      mockRequest.body = { points: 50, reason: 'Booking reward' };
      mockGuestService.updateLoyaltyPoints.mockResolvedValue(undefined);

      await guestController.updateLoyaltyPoints(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.updateLoyaltyPoints).toHaveBeenCalledWith(
        'guest-123',
        50,
        'Booking reward'
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Loyalty points updated successfully',
      });
    });

    it('should return 400 for invalid points', async () => {
      mockRequest.params = { id: 'guest-123' };
      mockRequest.body = { points: 'invalid', reason: 'Booking reward' };

      await guestController.updateLoyaltyPoints(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.updateLoyaltyPoints).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Points must be a number',
        },
      });
    });

    it('should return 400 for missing reason', async () => {
      mockRequest.params = { id: 'guest-123' };
      mockRequest.body = { points: 50 };

      await guestController.updateLoyaltyPoints(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.updateLoyaltyPoints).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Reason is required',
        },
      });
    });
  });

  describe('searchGuestProfiles', () => {
    it('should search guest profiles successfully', async () => {
      const mockSearchResult = {
        guests: [
          {
            id: 'guest-1',
            _userId: 'user-1',
            personalInfo: { firstName: 'John', lastName: 'Doe' },
            contactInfo: { email: 'john@example.com', phone: '+1234567890' },
            preferences: {},
            bookingHistory: [],
            loyaltyPoints: 100,
            communicationPreferences: {},
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        totalCount: 1,
        hasMore: false,
      };

      mockRequest.query = {
        name: 'John',
        email: 'john@example.com',
        page: '1',
        limit: '20',
      };
      mockGuestService.searchGuestProfiles.mockResolvedValue(mockSearchResult);

      await guestController.searchGuestProfiles(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.searchGuestProfiles).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockSearchResult,
      });
    });
  });

  describe('getGuestActivityLog', () => {
    it('should get guest activity log successfully', async () => {
      const mockActivityLog = {
        activities: [
          {
            id: 'activity-1',
            guestId: 'guest-123',
            activityType: ActivityType.PROFILE_CREATED,
            description: 'Profile created',
            metadata: {},
            timestamp: new Date(),
          },
        ],
        totalCount: 1,
        hasMore: false,
      };

      mockRequest.params = { id: 'guest-123' };
      mockRequest.query = { page: '1', limit: '50' };
      mockGuestService.getGuestActivityLog.mockResolvedValue(mockActivityLog);

      await guestController.getGuestActivityLog(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.getGuestActivityLog).toHaveBeenCalledWith(
        'guest-123',
        { page: 1, limit: 50 }
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockActivityLog,
      });
    });
  });

  describe('deleteGuestProfile', () => {
    it('should delete guest profile successfully', async () => {
      mockRequest.params = { id: 'guest-123' };
      mockGuestService.deleteGuestProfile.mockResolvedValue(undefined);

      await guestController.deleteGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.deleteGuestProfile).toHaveBeenCalledWith(
        'guest-123'
      );
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Guest profile deleted successfully',
      });
    });

    it('should return 400 for missing ID', async () => {
      mockRequest.params = {};

      await guestController.deleteGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockGuestService.deleteGuestProfile).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
    });

    it('should return 404 for not found error', async () => {
      mockRequest.params = { id: 'nonexistent-id' };
      mockGuestService.deleteGuestProfile.mockRejectedValue(
        new NotFoundError('Guest profile', 'nonexistent-id')
      );

      await guestController.deleteGuestProfile(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
    });
  });
});
