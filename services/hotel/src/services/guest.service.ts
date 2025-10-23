/**
 * Guest Service - Handles guest profile management operations
 */

import { PrismaClient } from '@/generated/prisma-client';
import { UserInfo, getAuthClient } from '@/lib/auth-client';
import {
  ActivityType,
  BookingHistorySummary,
  CreateGuestProfileRequest,
  GuestActivityLog,
  GuestProfile,
  GuestSearchCriteria,
  GuestSearchResult,
  GuestSortBy,
  UpdateGuestProfileRequest,
} from '@/types/guest.types';
import { ConflictError, NotFoundError, ValidationError } from '@/utils/errors';
import logger from '@/utils/logger';

export class GuestService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new guest profile
   */
  async createGuestProfile(
    request: CreateGuestProfileRequest
  ): Promise<GuestProfile> {
    try {
      logger.info('Creating guest profile', { userId: request._userId });

      // Validate request
      await this.validateCreateGuestRequest(request);

      // Check if guest profile already exists
      const existingProfile = await this.prisma.guestProfile.findUnique({
        where: { guestId: request._userId },
      });

      if (existingProfile) {
        throw new ConflictError(
          `Guest profile already exists for user ${request._userId}`
        );
      }

      // Verify user exists in Auth Service
      const authClient = getAuthClient();
      let userInfo: UserInfo;
      try {
        userInfo = await authClient.getUserInfo(request._userId);
      } catch (error) {
        logger.error('Failed to verify user in Auth Service', {
          userId: request._userId,
          error,
        });
        throw new ValidationError(
          'Invalid user ID or user not found in Auth Service'
        );
      }

      // Create guest profile
      const guestProfile = await this.prisma.guestProfile.create({
        data: {
          guestId: request._userId,
          userId: request._userId,
          personalInfo: request.personalInfo as any,
          contactInfo: request.contactInfo as any,
          preferences: (request.preferences || {}) as any,
          bookingHistory: [],
          loyaltyPoints: 0,
          communicationPreferences: (request.communicationPreferences || {
            preferredMethod: 'email',
            marketingEmails: true,
            promotionalSms: false,
            bookingNotifications: true,
            loyaltyUpdates: true,
            surveyParticipation: false,
            language: 'en',
            timezone: 'UTC',
          }) as any,
        },
      });

      // Log activity
      await this.logGuestActivity(
        guestProfile.id,
        ActivityType.PROFILE_CREATED,
        'Guest profile created'
      );

      logger.info('Guest profile created successfully', {
        guestId: guestProfile.id,
        userId: request._userId,
      });

      return this.mapToGuestProfile(guestProfile);
    } catch (error) {
      logger.error('Error creating guest profile', { error, request });
      throw error;
    }
  }

  /**
   * Get guest profile by user ID
   */
  async getGuestProfileByUserId(userId: string): Promise<GuestProfile> {
    const guestProfile = await this.prisma.guestProfile.findUnique({
      where: { guestId: userId },
    });

    if (!guestProfile) {
      throw new NotFoundError('Guest profile', `userId: ${userId}`);
    }

    return this.mapToGuestProfile(guestProfile);
  }

  /**
   * Get guest profile by ID
   */
  async getGuestProfile(id: string): Promise<GuestProfile> {
    const guestProfile = await this.prisma.guestProfile.findUnique({
      where: { id },
    });

    if (!guestProfile) {
      throw new NotFoundError('Guest profile', id);
    }

    return this.mapToGuestProfile(guestProfile);
  }

  /**
   * Update guest profile
   */
  async updateGuestProfile(
    id: string,
    request: UpdateGuestProfileRequest
  ): Promise<GuestProfile> {
    try {
      logger.info('Updating guest profile', { guestId: id });

      // Check if guest profile exists
      const existingProfile = await this.prisma.guestProfile.findUnique({
        where: { id },
      });

      if (!existingProfile) {
        throw new NotFoundError('Guest profile', id);
      }

      // Build update data
      const updateData: any = {};

      if (request.personalInfo) {
        updateData.personalInfo = {
          ...(existingProfile.personalInfo as any),
          ...request.personalInfo,
        };
      }

      if (request.contactInfo) {
        updateData.contactInfo = {
          ...(existingProfile.contactInfo as any),
          ...request.contactInfo,
        };
      }

      if (request.preferences) {
        updateData.preferences = {
          ...(existingProfile.preferences as any),
          ...request.preferences,
        };
      }

      if (request.communicationPreferences) {
        updateData.communicationPreferences = {
          ...(existingProfile.communicationPreferences as any),
          ...request.communicationPreferences,
        };
      }

      if (request.accessibility) {
        updateData.accessibility = request.accessibility;
      }

      if (request.dietaryRestrictions) {
        updateData.dietaryRestrictions = request.dietaryRestrictions;
      }

      const updatedProfile = await this.prisma.guestProfile.update({
        where: { id },
        data: updateData,
      });

      // Log activity
      await this.logGuestActivity(
        id,
        ActivityType.PROFILE_UPDATED,
        'Guest profile updated'
      );

      logger.info('Guest profile updated successfully', { guestId: id });

      return this.mapToGuestProfile(updatedProfile);
    } catch (error) {
      logger.error('Error updating guest profile', { error, guestId: id });
      throw error;
    }
  }

  /**
   * Search guest profiles
   */
  async searchGuestProfiles(
    criteria: GuestSearchCriteria,
    options: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<GuestSearchResult> {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (criteria.name) {
      where.OR = [
        {
          personalInfo: {
            path: ['firstName'],
            string_contains: criteria.name,
          },
        },
        {
          personalInfo: {
            path: ['lastName'],
            string_contains: criteria.name,
          },
        },
      ];
    }

    if (criteria.email) {
      where.contactInfo = {
        path: ['email'],
        string_contains: criteria.email,
      };
    }

    if (criteria.phone) {
      where.contactInfo = {
        path: ['phone'],
        string_contains: criteria.phone,
      };
    }

    if (criteria.nationality) {
      where.personalInfo = {
        path: ['nationality'],
        equals: criteria.nationality,
      };
    }

    if (criteria.registrationDateFrom || criteria.registrationDateTo) {
      where.createdAt = {};
      if (criteria.registrationDateFrom) {
        where.createdAt.gte = criteria.registrationDateFrom;
      }
      if (criteria.registrationDateTo) {
        where.createdAt.lte = criteria.registrationDateTo;
      }
    }

    if (criteria.lastBookingDateFrom || criteria.lastBookingDateTo) {
      where.lastBookingDate = {};
      if (criteria.lastBookingDateFrom) {
        where.lastBookingDate.gte = criteria.lastBookingDateFrom;
      }
      if (criteria.lastBookingDateTo) {
        where.lastBookingDate.lte = criteria.lastBookingDateTo;
      }
    }

    // Build order by
    const orderBy: any = {};
    const sortBy = criteria.sortBy || GuestSortBy.REGISTRATION_DATE;
    const sortOrder = criteria.sortOrder || 'desc';

    switch (sortBy) {
      case GuestSortBy.NAME:
        orderBy.personalInfo = { path: ['firstName'], sort: sortOrder };
        break;
      case GuestSortBy.LAST_BOOKING_DATE:
        orderBy.lastBookingDate = sortOrder;
        break;
      case GuestSortBy.LOYALTY_POINTS:
        orderBy.loyaltyPoints = sortOrder;
        break;
      default:
        orderBy.createdAt = sortOrder;
    }

    const [guestProfiles, total] = await Promise.all([
      this.prisma.guestProfile.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.guestProfile.count({ where }),
    ]);

    const guests = guestProfiles.map(profile =>
      this.mapToGuestProfile(profile)
    );

    return {
      guests,
      totalCount: total,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Update guest booking history
   */
  async updateBookingHistory(
    guestId: string,
    bookingHistory: BookingHistorySummary
  ): Promise<void> {
    try {
      logger.info('Updating guest booking history', {
        guestId,
        bookingId: bookingHistory.bookingId,
      });

      const guestProfile = await this.prisma.guestProfile.findUnique({
        where: { id: guestId },
      });

      if (!guestProfile) {
        throw new NotFoundError('Guest profile', guestId);
      }

      const currentHistory =
        (guestProfile.bookingHistory as any as BookingHistorySummary[]) || [];

      // Check if booking already exists in history
      const existingIndex = currentHistory.findIndex(
        booking => booking.bookingId === bookingHistory.bookingId
      );

      let updatedHistory: BookingHistorySummary[];
      if (existingIndex >= 0) {
        // Update existing booking
        updatedHistory = [...currentHistory];
        updatedHistory[existingIndex] = bookingHistory;
      } else {
        // Add new booking
        updatedHistory = [...currentHistory, bookingHistory];
      }

      // Sort by check-in date (most recent first)
      updatedHistory.sort(
        (a, b) =>
          new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
      );

      await this.prisma.guestProfile.update({
        where: { id: guestId },
        data: {
          bookingHistory: updatedHistory as any,
          lastBookingDate: new Date(bookingHistory.checkInDate),
        },
      });

      // Log activity
      await this.logGuestActivity(
        guestId,
        ActivityType.BOOKING_CREATED,
        `Booking ${bookingHistory.bookingId} added to history`
      );

      logger.info('Guest booking history updated successfully', { guestId });
    } catch (error) {
      logger.error('Error updating guest booking history', { error, guestId });
      throw error;
    }
  }

  /**
   * Update loyalty points
   */
  async updateLoyaltyPoints(
    guestId: string,
    points: number,
    reason: string
  ): Promise<void> {
    try {
      logger.info('Updating guest loyalty points', { guestId, points, reason });

      const guestProfile = await this.prisma.guestProfile.findUnique({
        where: { id: guestId },
      });

      if (!guestProfile) {
        throw new NotFoundError('Guest profile', guestId);
      }

      const currentPoints = guestProfile.loyaltyPoints || 0;
      const newPoints = Math.max(0, currentPoints + points);

      await this.prisma.guestProfile.update({
        where: { id: guestId },
        data: {
          loyaltyPoints: newPoints,
        },
      });

      // Log activity
      const activityType =
        points > 0
          ? ActivityType.LOYALTY_POINTS_EARNED
          : ActivityType.LOYALTY_POINTS_REDEEMED;
      await this.logGuestActivity(guestId, activityType, reason, {
        points,
        newTotal: newPoints,
      });

      logger.info('Guest loyalty points updated successfully', {
        guestId,
        oldPoints: currentPoints,
        newPoints,
      });
    } catch (error) {
      logger.error('Error updating guest loyalty points', { error, guestId });
      throw error;
    }
  }

  /**
   * Get guest activity log
   */
  async getGuestActivityLog(
    guestId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{
    activities: GuestActivityLog[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const { page = 1, limit = 50 } = options;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.prisma.guestActivityLog.findMany({
        where: { guestId },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.guestActivityLog.count({ where: { guestId } }),
    ]);

    return {
      activities: activities.map(activity => ({
        id: activity.id,
        guestId: activity.guestId,
        activityType: activity.activityType as ActivityType,
        description: activity.description,
        metadata: activity.metadata as Record<string, any> | undefined,
        timestamp: activity.timestamp,
      })),
      totalCount: total,
      hasMore: skip + limit < total,
    };
  }

  /**
   * Delete guest profile
   */
  async deleteGuestProfile(id: string): Promise<void> {
    try {
      logger.info('Deleting guest profile', { guestId: id });

      const guestProfile = await this.prisma.guestProfile.findUnique({
        where: { id },
      });

      if (!guestProfile) {
        throw new NotFoundError('Guest profile', id);
      }

      // Delete activity logs first
      await this.prisma.guestActivityLog.deleteMany({
        where: { guestId: id },
      });

      // Delete guest profile
      await this.prisma.guestProfile.delete({
        where: { id },
      });

      logger.info('Guest profile deleted successfully', { guestId: id });
    } catch (error) {
      logger.error('Error deleting guest profile', { error, guestId: id });
      throw error;
    }
  }

  /**
   * Log guest activity
   */
  private async logGuestActivity(
    guestId: string,
    activityType: ActivityType,
    description: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.prisma.guestActivityLog.create({
        data: {
          guestId,
          activityType,
          description,
          metadata: metadata || {},
        },
      });
    } catch (error) {
      logger.error('Error logging guest activity', {
        error,
        guestId,
        activityType,
      });
      // Don't throw error for logging failures
    }
  }

  /**
   * Validate create guest request
   */
  private async validateCreateGuestRequest(
    request: CreateGuestProfileRequest
  ): Promise<void> {
    if (!request._userId || request._userId.trim().length === 0) {
      throw new ValidationError('User ID is required');
    }

    if (!request.personalInfo) {
      throw new ValidationError('Personal information is required');
    }

    if (
      !request.personalInfo.firstName ||
      request.personalInfo.firstName.trim().length === 0
    ) {
      throw new ValidationError('First name is required');
    }

    if (
      !request.personalInfo.lastName ||
      request.personalInfo.lastName.trim().length === 0
    ) {
      throw new ValidationError('Last name is required');
    }

    if (!request.contactInfo) {
      throw new ValidationError('Contact information is required');
    }

    if (
      !request.contactInfo.email ||
      request.contactInfo.email.trim().length === 0
    ) {
      throw new ValidationError('Email is required');
    }

    if (
      !request.contactInfo.phone ||
      request.contactInfo.phone.trim().length === 0
    ) {
      throw new ValidationError('Phone number is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.contactInfo.email)) {
      throw new ValidationError('Invalid email format');
    }
  }

  /**
   * Map database record to GuestProfile type
   */
  private mapToGuestProfile(record: any): GuestProfile {
    return {
      id: record.id,
      _userId: record.userId,
      personalInfo: record.personalInfo as any,
      contactInfo: record.contactInfo as any,
      preferences: record.preferences as any,
      bookingHistory: (record.bookingHistory as BookingHistorySummary[]) || [],
      loyaltyStatus: record.loyaltyStatus as any,
      loyaltyPoints: record.loyaltyPoints || 0,
      accessibility: record.accessibility as any,
      dietaryRestrictions: record.dietaryRestrictions as string[],
      communicationPreferences: record.communicationPreferences as any,
      vipStatus: record.vipStatus as any,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      lastBookingDate: record.lastBookingDate,
      lastLoginDate: record.lastLoginDate,
    };
  }
}
