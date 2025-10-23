/**
 * Guest Controller - Handles guest profile management HTTP requests
 */

import { PrismaClient } from '@/generated/prisma-client';
import { GuestService } from '@/services/guest.service';
import {
  CreateGuestProfileRequest,
  GuestSearchCriteria,
  GuestSortBy,
  UpdateGuestProfileRequest,
} from '@/types/guest.types';
import { NotFoundError, ValidationError } from '@/utils/errors';
import logger from '@/utils/logger';
import { Request, Response } from 'express';

export class GuestController {
  private guestService: GuestService;

  constructor(prisma: PrismaClient) {
    this.guestService = new GuestService(prisma);
  }

  /**
   * Create a new guest profile
   */
  async createGuestProfile(req: Request, res: Response): Promise<void> {
    try {
      const request: CreateGuestProfileRequest = req.body;

      // Validate required fields
      if (!request._userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'User ID is required',
          },
        });
        return;
      }

      const guestProfile = await this.guestService.createGuestProfile(request);

      res.status(201).json({
        success: true,
        data: guestProfile,
        message: 'Guest profile created successfully',
      });
    } catch (error: any) {
      logger.error('Error in createGuestProfile controller', { error });

      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
      } else if (error.message?.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create guest profile',
          },
        });
      }
    }
  }

  /**
   * Get guest profile by ID
   */
  async getGuestProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Guest profile ID is required',
          },
        });
        return;
      }

      const guestProfile = await this.guestService.getGuestProfile(id);

      res.json({
        success: true,
        data: guestProfile,
      });
    } catch (error: any) {
      logger.error('Error in getGuestProfile controller', {
        error,
        guestId: req.params.id,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get guest profile',
          },
        });
      }
    }
  }

  /**
   * Get guest profile by user ID
   */
  async getGuestProfileByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'User ID is required',
          },
        });
        return;
      }

      const guestProfile =
        await this.guestService.getGuestProfileByUserId(userId);

      res.json({
        success: true,
        data: guestProfile,
      });
    } catch (error: any) {
      logger.error('Error in getGuestProfileByUserId controller', {
        error,
        userId: req.params.userId,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to get guest profile',
          },
        });
      }
    }
  }

  /**
   * Update guest profile
   */
  async updateGuestProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request: UpdateGuestProfileRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Guest profile ID is required',
          },
        });
        return;
      }

      const guestProfile = await this.guestService.updateGuestProfile(
        id,
        request
      );

      res.json({
        success: true,
        data: guestProfile,
        message: 'Guest profile updated successfully',
      });
    } catch (error: any) {
      logger.error('Error in updateGuestProfile controller', {
        error,
        guestId: req.params.id,
      });

      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update guest profile',
          },
        });
      }
    }
  }

  /**
   * Search guest profiles
   */
  async searchGuestProfiles(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        phone,
        loyaltyTier,
        vipLevel,
        nationality,
        registrationDateFrom,
        registrationDateTo,
        lastBookingDateFrom,
        lastBookingDateTo,
        totalBookings,
        totalSpent,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      const criteria: GuestSearchCriteria = {};

      if (name) criteria.name = name as string;
      if (email) criteria.email = email as string;
      if (phone) criteria.phone = phone as string;
      if (nationality) criteria.nationality = nationality as string;
      if (registrationDateFrom) {
        criteria.registrationDateFrom = new Date(
          registrationDateFrom as string
        );
      }
      if (registrationDateTo) {
        criteria.registrationDateTo = new Date(registrationDateTo as string);
      }
      if (lastBookingDateFrom) {
        criteria.lastBookingDateFrom = new Date(lastBookingDateFrom as string);
      }
      if (lastBookingDateTo) {
        criteria.lastBookingDateTo = new Date(lastBookingDateTo as string);
      }
      if (totalBookings)
        criteria.totalBookings = parseInt(totalBookings as string, 10);
      if (totalSpent) criteria.totalSpent = parseFloat(totalSpent as string);
      if (
        sortBy &&
        Object.values(GuestSortBy).includes(sortBy as GuestSortBy)
      ) {
        criteria.sortBy = sortBy as GuestSortBy;
      }
      if (sortOrder && ['asc', 'desc'].includes(sortOrder as string)) {
        criteria.sortOrder = sortOrder as 'asc' | 'desc';
      }

      const options = {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      };

      const result = await this.guestService.searchGuestProfiles(
        criteria,
        options
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Error in searchGuestProfiles controller', { error });

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to search guest profiles',
        },
      });
    }
  }

  /**
   * Update guest booking history
   */
  async updateBookingHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const bookingHistory = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Guest profile ID is required',
          },
        });
        return;
      }

      if (!bookingHistory.bookingId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Booking ID is required',
          },
        });
        return;
      }

      await this.guestService.updateBookingHistory(id, bookingHistory);

      res.json({
        success: true,
        message: 'Booking history updated successfully',
      });
    } catch (error: any) {
      logger.error('Error in updateBookingHistory controller', {
        error,
        guestId: req.params.id,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update booking history',
          },
        });
      }
    }
  }

  /**
   * Update loyalty points
   */
  async updateLoyaltyPoints(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { points, reason } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Guest profile ID is required',
          },
        });
        return;
      }

      if (typeof points !== 'number') {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Points must be a number',
          },
        });
        return;
      }

      if (!reason) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Reason is required',
          },
        });
        return;
      }

      await this.guestService.updateLoyaltyPoints(id, points, reason);

      res.json({
        success: true,
        message: 'Loyalty points updated successfully',
      });
    } catch (error: any) {
      logger.error('Error in updateLoyaltyPoints controller', {
        error,
        guestId: req.params.id,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update loyalty points',
          },
        });
      }
    }
  }

  /**
   * Get guest activity log
   */
  async getGuestActivityLog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;

      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Guest profile ID is required',
          },
        });
        return;
      }

      const options = {
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
      };

      const result = await this.guestService.getGuestActivityLog(id, options);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Error in getGuestActivityLog controller', {
        error,
        guestId: req.params.id,
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get guest activity log',
        },
      });
    }
  }

  /**
   * Delete guest profile
   */
  async deleteGuestProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Guest profile ID is required',
          },
        });
        return;
      }

      await this.guestService.deleteGuestProfile(id);

      res.json({
        success: true,
        message: 'Guest profile deleted successfully',
      });
    } catch (error: any) {
      logger.error('Error in deleteGuestProfile controller', {
        error,
        guestId: req.params.id,
      });

      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to delete guest profile',
          },
        });
      }
    }
  }
}
