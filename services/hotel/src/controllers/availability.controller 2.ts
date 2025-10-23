/**
 * Availability Controller - Handles room availability checking
 */

import { PrismaClient } from '@/generated/prisma-client';
import { AvailabilityService } from '@/services/availability.service';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';

export class AvailabilityController {
  private availabilityService: AvailabilityService;

  constructor(prisma: PrismaClient) {
    this.availabilityService = new AvailabilityService(prisma);
  }

  /**
   * Check room availability for dates
   * GET /api/hotels/{hotelId}/availability
   */
  async checkAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { hotelId } = req.params;
      const { checkIn, checkOut, rooms, adults, children } = req.query;

      const request = {
        propertyId: hotelId,
        checkInDate: new Date(checkIn as string),
        checkOutDate: new Date(checkOut as string),
        rooms: rooms ? parseInt(rooms as string) : 1,
        adults: adults ? parseInt(adults as string) : 2,
        children: children ? parseInt(children as string) : 0,
      };

      const availability =
        await this.availabilityService.checkAvailability(request);

      res.json({
        success: true,
        data: availability,
        searchParams: {
          hotelId,
          checkIn,
          checkOut,
          rooms: request.rooms,
          adults: request.adults,
          children: request.children,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get room packages with pricing
   * GET /api/rooms/packages
   */
  async getRoomPackages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId, checkIn, checkOut, rooms, adults, children } =
        req.query;

      if (!propertyId || !checkIn || !checkOut) {
        throw new ValidationError(
          'Property ID, check-in and check-out dates are required'
        );
      }

      const request = {
        propertyId: propertyId as string,
        checkInDate: new Date(checkIn as string),
        checkOutDate: new Date(checkOut as string),
        rooms: rooms ? parseInt(rooms as string) : 1,
        adults: adults ? parseInt(adults as string) : 2,
        children: children ? parseInt(children as string) : 0,
      };

      const packages = await this.availabilityService.getRoomPackages(request);

      res.json({
        success: true,
        data: packages,
        searchParams: request,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific room details with availability
   * GET /api/rooms/{roomId}
   */
  async getRoomDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { roomId } = req.params;
      const { checkIn, checkOut } = req.query;

      const roomDetails = await this.availabilityService.getRoomDetails(
        roomId,
        checkIn ? new Date(checkIn as string) : undefined,
        checkOut ? new Date(checkOut as string) : undefined
      );

      res.json({
        success: true,
        data: roomDetails,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get room pricing details
   * GET /api/rooms/{roomId}/pricing
   */
  async getRoomPricing(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { roomId } = req.params;
      const { checkIn, checkOut, nights } = req.query;

      const pricing = await this.availabilityService.getRoomPricing(
        roomId,
        checkIn ? new Date(checkIn as string) : new Date(),
        checkOut
          ? new Date(checkOut as string)
          : new Date(Date.now() + 24 * 60 * 60 * 1000),
        nights ? parseInt(nights as string) : 1
      );

      res.json({
        success: true,
        data: pricing,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check bulk availability for all room types
   * POST /api/availability/check-bulk
   */
  async checkBulkAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId, checkIn, checkOut, rooms, adults, children } =
        req.query;

      const request = {
        propertyId: propertyId as string,
        checkInDate: new Date(checkIn as string),
        checkOutDate: new Date(checkOut as string),
        roomQuantity: rooms ? parseInt(rooms as string) : 1,
        guestCount:
          (adults ? parseInt(adults as string) : 2) +
          (children ? parseInt(children as string) : 0),
      };

      const availability =
        await this.availabilityService.checkBulkAvailability(request);

      res.json({
        success: true,
        data: availability,
        searchParams: request,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get availability calendar
   * GET /api/availability/calendar/{propertyId}/{roomTypeId}
   */
  async getAvailabilityCalendar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId, roomTypeId } = req.params;
      const { startDate, endDate } = req.query;

      const calendar = await this.availabilityService.getAvailabilityCalendar(
        propertyId,
        roomTypeId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: calendar,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const availabilityValidation = {
  checkAvailability: [
    param('hotelId').isString().notEmpty().withMessage('Hotel ID is required'),
    query('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    query('checkOut')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    query('rooms')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Rooms must be 1-10'),
    query('adults')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Adults must be 1-20'),
    query('children')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Children must be 0-10'),
  ],

  getRoomPackages: [
    query('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    query('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    query('checkOut')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    query('rooms')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Rooms must be 1-10'),
    query('adults')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Adults must be 1-20'),
    query('children')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Children must be 0-10'),
  ],

  getRoomDetails: [
    param('roomId').isString().notEmpty().withMessage('Room ID is required'),
    query('checkIn')
      .optional()
      .isISO8601()
      .withMessage('Valid check-in date required'),
    query('checkOut')
      .optional()
      .isISO8601()
      .withMessage('Valid check-out date required'),
  ],

  getRoomPricing: [
    param('roomId').isString().notEmpty().withMessage('Room ID is required'),
    query('checkIn')
      .optional()
      .isISO8601()
      .withMessage('Valid check-in date required'),
    query('checkOut')
      .optional()
      .isISO8601()
      .withMessage('Valid check-out date required'),
    query('nights')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Nights must be 1-365'),
  ],

  checkBulkAvailability: [
    query('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    query('checkIn').isISO8601().withMessage('Valid check-in date is required'),
    query('checkOut')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    query('rooms')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Rooms must be 1-10'),
    query('adults')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Adults must be 1-20'),
    query('children')
      .optional()
      .isInt({ min: 0, max: 10 })
      .withMessage('Children must be 0-10'),
  ],

  getAvailabilityCalendar: [
    param('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    param('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    query('startDate').isISO8601().withMessage('Valid start date is required'),
    query('endDate').isISO8601().withMessage('Valid end date is required'),
  ],
};
