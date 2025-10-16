/**
 * Booking Controller - Handles hotel booking/reservation operations
 */

import { PrismaClient } from '@/generated/prisma-client';
import { BookingService } from '@/services/booking.service';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export class BookingController {
  private bookingService: BookingService;

  constructor(prisma: PrismaClient) {
    this.bookingService = new BookingService(prisma);
  }

  /**
   * Create new booking/reservation
   * POST /api/bookings
   */
  async createBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      // Convert date strings to Date objects
      const bookingData = {
        ...req.body,
        checkInDate: new Date(req.body.checkInDate),
        checkOutDate: new Date(req.body.checkOutDate),
      };

      const result = await this.bookingService.createBooking(bookingData);

      res.status(201).json({
        success: true,
        data: result,
        message:
          'Booking created successfully. Please proceed with confirmation.',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirm booking and process payment
   * POST /api/bookings/{bookingId}/confirm
   */
  async processBookingConfirmation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const result =
        await this.bookingService.processBookingConfirmation(bookingId);

      res.json({
        success: true,
        data: result,
        message: 'Booking confirmed successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update booking status
   * PUT /api/bookings/{bookingId}/status
   */
  async updateBookingStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const { status, changedBy } = req.body;

      await this.bookingService.updateBookingStatus(
        bookingId,
        status,
        changedBy
      );

      res.json({
        success: true,
        message: 'Booking status updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get booking details
   * GET /api/bookings/{bookingId}
   */
  async getBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const booking = await this.bookingService.getBooking(bookingId);

      res.json({
        success: true,
        data: booking,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update booking
   * PUT /api/bookings/{bookingId}
   */
  async updateBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const booking = await this.bookingService.updateBooking(
        bookingId,
        req.body
      );

      res.json({
        success: true,
        data: booking,
        message: 'Booking updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel booking
   * DELETE /api/bookings/{bookingId}
   */
  async cancelBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const { reason } = req.body;

      const result = await this.bookingService.cancelBooking(bookingId, reason);

      res.json({
        success: true,
        data: result,
        message: 'Booking cancelled successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's bookings
   * GET /api/users/{userId}/bookings
   */
  async getUserBookings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { userId } = req.params;
      const { status, page, limit } = req.query;

      const filters = {
        guestId: userId,
        ...(status && { status: [status as any] }),
      };

      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      };

      const result = await this.bookingService.getUserBookings(
        filters,
        options
      );

      res.json({
        success: true,
        data: result.bookings,
        pagination: result.pagination,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Confirm/finalize booking
   * PUT /api/bookings/{bookingId}/confirm
   */
  async confirmBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const booking = await this.bookingService.confirmBooking(bookingId);

      res.json({
        success: true,
        data: booking,
        message: 'Booking confirmed successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate booking details before confirmation
   * POST /api/bookings/validate
   */
  async validateBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const validation = await this.bookingService.validateBookingRequest(
        req.body
      );

      res.json({
        success: true,
        data: validation,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add special requests to booking
   * POST /api/bookings/{bookingId}/special-requests
   */
  async addSpecialRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { bookingId } = req.params;
      const { requests } = req.body;

      const booking = await this.bookingService.addSpecialRequests(
        bookingId,
        requests
      );

      res.json({
        success: true,
        data: booking,
        message: 'Special requests added successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const bookingValidation = {
  createBooking: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('primaryGuest.firstName')
      .isString()
      .notEmpty()
      .withMessage('Primary guest first name is required'),
    body('primaryGuest.lastName')
      .isString()
      .notEmpty()
      .withMessage('Primary guest last name is required'),
    body('primaryGuest.email').isEmail().withMessage('Valid email is required'),
    body('checkInDate')
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    body('rooms')
      .isArray({ min: 1 })
      .withMessage('At least one room is required'),
    body('rooms.*.roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('rooms.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Room quantity must be at least 1'),
    body('rooms.*.guestCount')
      .isInt({ min: 1 })
      .withMessage('Guest count must be at least 1'),
    body('rooms.*.guests').isArray().withMessage('Guest details are required'),
    body('paymentMethod')
      .isIn(['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash'])
      .withMessage('Valid payment method is required'),
    body('bookingSource')
      .isIn([
        'direct',
        'ota',
        'phone',
        'walk_in',
        'corporate',
        'group',
        'travel_agent',
        'mobile_app',
        'partner',
      ])
      .withMessage('Valid booking source is required'),
  ],

  processBookingConfirmation: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
  ],

  updateBookingStatus: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
    body('status')
      .isIn([
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
        'no_show',
        'modified',
        'expired',
      ])
      .withMessage('Valid status is required'),
    body('changedBy')
      .isString()
      .notEmpty()
      .withMessage('Changed by is required'),
  ],

  updateBooking: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
    body('guestName')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Guest name cannot be empty'),
    body('guestEmail')
      .optional()
      .isEmail()
      .withMessage('Valid email is required'),
    body('guestPhone')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
  ],

  getBooking: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
  ],

  cancelBooking: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
    body('reason')
      .optional()
      .isString()
      .withMessage('Cancellation reason must be a string'),
  ],

  getUserBookings: [
    param('userId').isString().notEmpty().withMessage('User ID is required'),
    query('status')
      .optional()
      .isIn([
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
        'no_show',
      ])
      .withMessage('Invalid status'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be 1-100'),
  ],

  confirmBooking: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
  ],

  validateBooking: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('checkInDate')
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    body('rooms')
      .isArray({ min: 1 })
      .withMessage('At least one room is required'),
  ],

  addSpecialRequests: [
    param('bookingId')
      .isString()
      .notEmpty()
      .withMessage('Booking ID is required'),
    body('requests').isArray().withMessage('Requests must be an array'),
  ],
};
