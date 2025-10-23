/**
 * Inventory Controller - Handles inventory management API endpoints
 */

import { PrismaClient } from '@/generated/prisma-client';
import { InventoryService } from '@/services/inventory.service';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export class InventoryController {
  private inventoryService: InventoryService;

  constructor(prisma: PrismaClient) {
    this.inventoryService = new InventoryService(prisma);
  }

  /**
   * Update inventory for a specific date
   */
  async updateInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const inventory = await this.inventoryService.updateInventory({
        ...req.body,
        date: new Date(req.body.date),
      });

      res.json({
        success: true,
        data: inventory,
        message: 'Inventory updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk update inventory for a date range
   */
  async bulkUpdateInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { propertyId, roomTypeId, startDate, endDate, updates } = req.body;

      const results = await this.inventoryService.bulkUpdateInventory({
        propertyId,
        roomTypeId,
        updates,
      });

      res.json({
        success: true,
        data: results,
        message: 'Bulk inventory update completed successfully',
        count: results.length,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reserve inventory for a booking
   */
  async reserveInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const {
        propertyId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        roomQuantity,
        bookingId,
        expiresAt,
      } = req.body;

      const result = await this.inventoryService.reserveInventory({
        propertyId,
        roomTypeId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        roomQuantity,
        bookingId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Inventory reserved successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Release inventory reservation
   */
  async releaseInventoryReservation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { reservationId } = req.params;
      const result =
        await this.inventoryService.releaseInventoryReservation(reservationId);

      res.json({
        success: true,
        data: result,
        message: 'Inventory reservation released successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create inventory lock
   */
  async createInventoryLock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const {
        propertyId,
        roomTypeId,
        checkInDate,
        checkOutDate,
        quantity,
        lockedBy,
        expiresAt,
      } = req.body;

      const lock = await this.inventoryService.createInventoryLock({
        propertyId,
        roomTypeId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        quantity,
        lockedBy,
        expiresAt: new Date(expiresAt),
      });

      res.status(201).json({
        success: true,
        data: lock,
        message: 'Inventory lock created successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Release inventory lock
   */
  async releaseInventoryLock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
      }

      const { lockId } = req.params;
      await this.inventoryService.releaseInventoryLock(lockId);

      res.json({
        success: true,
        message: 'Inventory lock released successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get inventory status for a date range
   */
  async getInventoryStatus(
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

      const status = await this.inventoryService.getInventoryStatus(
        propertyId,
        roomTypeId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json({
        success: true,
        data: status,
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clean up expired locks and reservations
   */
  async cleanupExpiredItems(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.inventoryService.cleanupExpiredItems();

      res.json({
        success: true,
        data: result,
        message: 'Cleanup completed successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware
export const inventoryValidation = {
  updateInventory: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('totalRooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Total rooms must be non-negative'),
    body('availableRooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Available rooms must be non-negative'),
    body('reservedRooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Reserved rooms must be non-negative'),
    body('blockedRooms')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Blocked rooms must be non-negative'),
    body('minimumStay')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Minimum stay must be at least 1'),
    body('maximumStay')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Maximum stay must be at least 1'),
    body('closedToArrival')
      .optional()
      .isBoolean()
      .withMessage('Closed to arrival must be boolean'),
    body('closedToDeparture')
      .optional()
      .isBoolean()
      .withMessage('Closed to departure must be boolean'),
    body('stopSell')
      .optional()
      .isBoolean()
      .withMessage('Stop sell must be boolean'),
  ],

  bulkUpdateInventory: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('updates').isObject().withMessage('Updates object is required'),
  ],

  reserveInventory: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('checkInDate')
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    body('roomQuantity')
      .isInt({ min: 1 })
      .withMessage('Room quantity must be at least 1'),
    body('bookingId')
      .optional()
      .isString()
      .withMessage('Booking ID must be a string'),
    body('expiresAt')
      .optional()
      .isISO8601()
      .withMessage('Valid expiration date required'),
  ],

  createInventoryLock: [
    body('propertyId')
      .isString()
      .notEmpty()
      .withMessage('Property ID is required'),
    body('roomTypeId')
      .isString()
      .notEmpty()
      .withMessage('Room type ID is required'),
    body('checkInDate')
      .isISO8601()
      .withMessage('Valid check-in date is required'),
    body('checkOutDate')
      .isISO8601()
      .withMessage('Valid check-out date is required'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    body('lockedBy')
      .isString()
      .notEmpty()
      .withMessage('Locked by identifier is required'),
    body('expiresAt')
      .isISO8601()
      .withMessage('Valid expiration date is required'),
  ],

  releaseInventoryReservation: [
    param('reservationId')
      .isString()
      .notEmpty()
      .withMessage('Reservation ID is required'),
  ],

  releaseInventoryLock: [
    param('lockId').isString().notEmpty().withMessage('Lock ID is required'),
  ],

  getInventoryStatus: [
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
