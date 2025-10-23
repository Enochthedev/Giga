/**
 * Booking Controller Unit Tests
 */

import { BookingController } from '@/controllers/booking.controller';
import { BookingService } from '@/services/booking.service';
import { BookingSource, BookingStatus, PaymentMethod } from '@/types';
import { NotFoundError, ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
  body: vi.fn(() => ({
    isString: vi.fn().mockReturnThis(),
    notEmpty: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
    isEmail: vi.fn().mockReturnThis(),
    isISO8601: vi.fn().mockReturnThis(),
    isArray: vi.fn().mockReturnThis(),
    isInt: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    optional: vi.fn().mockReturnThis(),
  })),
  param: vi.fn(() => ({
    isString: vi.fn().mockReturnThis(),
    notEmpty: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
  })),
  query: vi.fn(() => ({
    optional: vi.fn().mockReturnThis(),
    isIn: vi.fn().mockReturnThis(),
    isInt: vi.fn().mockReturnThis(),
    withMessage: vi.fn().mockReturnThis(),
  })),
}));

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

const mockBookingService = {
  createBooking: vi.fn(),
  getBooking: vi.fn(),
  updateBooking: vi.fn(),
  cancelBooking: vi.fn(),
  getUserBookings: vi.fn(),
  confirmBooking: vi.fn(),
  validateBookingRequest: vi.fn(),
  addSpecialRequests: vi.fn(),
  processBookingConfirmation: vi.fn(),
  updateBookingStatus: vi.fn(),
} as unknown as BookingService;

describe('BookingController', () => {
  let bookingController: BookingController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    bookingController = new BookingController({} as any);
    (bookingController as any).bookingService = mockBookingService;

    mockRequest = {
      body: {},
      params: {},
      query: {},
    };

    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();

    // Mock validation result to return no errors by default
    (validationResult as any).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
  });

  describe('createBooking', () => {
    const validBookingData = {
      propertyId: 'property-1',
      checkInDate: '2024-12-01',
      checkOutDate: '2024-12-03',
      rooms: [
        {
          roomTypeId: 'room-type-1',
          quantity: 1,
          guestCount: 2,
          guests: [
            {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
          ],
        },
      ],
      primaryGuest: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
      },
      paymentMethod: PaymentMethod.CREDIT_CARD,
      bookingSource: BookingSource.DIRECT,
    };

    const mockBookingResult = {
      booking: {
        id: 'booking-1',
        confirmationNumber: 'BK123456',
        status: BookingStatus.PENDING,
      },
      confirmationNumber: 'BK123456',
    };

    it('should create booking successfully', async () => {
      mockRequest.body = validBookingData;
      mockBookingService.createBooking = vi
        .fn()
        .mockResolvedValue(mockBookingResult);

      await bookingController.createBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.createBooking).toHaveBeenCalledWith({
        ...validBookingData,
        checkInDate: new Date('2024-12-01'),
        checkOutDate: new Date('2024-12-03'),
      });

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBookingResult,
        message:
          'Booking created successfully. Please proceed with confirmation.',
        timestamp: expect.any(Date),
      });
    });

    it('should handle validation errors', async () => {
      (validationResult as any).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Property ID is required' }],
      });

      await bookingController.createBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should handle service errors', async () => {
      mockRequest.body = validBookingData;
      const error = new Error('Service error');
      mockBookingService.createBooking = vi.fn().mockRejectedValue(error);

      await bookingController.createBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('processBookingConfirmation', () => {
    const mockConfirmationResult = {
      booking: {
        id: 'booking-1',
        status: BookingStatus.CONFIRMED,
      },
      confirmationNumber: 'BK123456',
      paymentResult: {
        success: true,
        transactionId: 'txn_123',
      },
    };

    it('should confirm booking successfully', async () => {
      mockRequest.params = { bookingId: 'booking-1' };
      mockBookingService.processBookingConfirmation = vi
        .fn()
        .mockResolvedValue(mockConfirmationResult);

      await bookingController.processBookingConfirmation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(
        mockBookingService.processBookingConfirmation
      ).toHaveBeenCalledWith('booking-1');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockConfirmationResult,
        message: 'Booking confirmed successfully',
        timestamp: expect.any(Date),
      });
    });

    it('should handle booking not found', async () => {
      mockRequest.params = { bookingId: 'non-existent' };
      const error = new NotFoundError('Booking', 'non-existent');
      mockBookingService.processBookingConfirmation = vi
        .fn()
        .mockRejectedValue(error);

      await bookingController.processBookingConfirmation(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateBookingStatus', () => {
    it('should update booking status successfully', async () => {
      mockRequest.params = { bookingId: 'booking-1' };
      mockRequest.body = {
        status: BookingStatus.CONFIRMED,
        changedBy: 'user-1',
      };

      mockBookingService.updateBookingStatus = vi
        .fn()
        .mockResolvedValue(undefined);

      await bookingController.updateBookingStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.updateBookingStatus).toHaveBeenCalledWith(
        'booking-1',
        BookingStatus.CONFIRMED,
        'user-1'
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Booking status updated successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('getBooking', () => {
    const mockBooking = {
      id: 'booking-1',
      confirmationNumber: 'BK123456',
      status: BookingStatus.CONFIRMED,
      property: {
        name: 'Test Hotel',
      },
    };

    it('should get booking successfully', async () => {
      mockRequest.params = { bookingId: 'booking-1' };
      mockBookingService.getBooking = vi.fn().mockResolvedValue(mockBooking);

      await bookingController.getBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.getBooking).toHaveBeenCalledWith('booking-1');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockBooking,
        timestamp: expect.any(Date),
      });
    });
  });

  describe('updateBooking', () => {
    const mockUpdatedBooking = {
      id: 'booking-1',
      guestName: 'John Smith',
    };

    it('should update booking successfully', async () => {
      mockRequest.params = { bookingId: 'booking-1' };
      mockRequest.body = { guestName: 'John Smith' };
      mockBookingService.updateBooking = vi
        .fn()
        .mockResolvedValue(mockUpdatedBooking);

      await bookingController.updateBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.updateBooking).toHaveBeenCalledWith(
        'booking-1',
        {
          guestName: 'John Smith',
        }
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedBooking,
        message: 'Booking updated successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('cancelBooking', () => {
    const mockCancellationResult = {
      booking: {
        id: 'booking-1',
        status: BookingStatus.CANCELLED,
      },
      refundAmount: 110,
      refundEligible: true,
    };

    it('should cancel booking successfully', async () => {
      mockRequest.params = { bookingId: 'booking-1' };
      mockRequest.body = { reason: 'Customer request' };
      mockBookingService.cancelBooking = vi
        .fn()
        .mockResolvedValue(mockCancellationResult);

      await bookingController.cancelBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.cancelBooking).toHaveBeenCalledWith(
        'booking-1',
        'Customer request'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCancellationResult,
        message: 'Booking cancelled successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('getUserBookings', () => {
    const mockUserBookings = {
      bookings: [
        {
          id: 'booking-1',
          status: BookingStatus.CONFIRMED,
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      },
    };

    it('should get user bookings successfully', async () => {
      mockRequest.params = { userId: 'user-1' };
      mockRequest.query = { status: 'confirmed', page: '1', limit: '20' };
      mockBookingService.getUserBookings = vi
        .fn()
        .mockResolvedValue(mockUserBookings);

      await bookingController.getUserBookings(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.getUserBookings).toHaveBeenCalledWith(
        { guestId: 'user-1', status: ['confirmed'] },
        { page: 1, limit: 20 }
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUserBookings.bookings,
        pagination: mockUserBookings.pagination,
        timestamp: expect.any(Date),
      });
    });
  });

  describe('confirmBooking', () => {
    const mockConfirmedBooking = {
      id: 'booking-1',
      status: BookingStatus.CONFIRMED,
    };

    it('should confirm booking successfully', async () => {
      mockRequest.params = { bookingId: 'booking-1' };
      mockBookingService.confirmBooking = vi
        .fn()
        .mockResolvedValue(mockConfirmedBooking);

      await bookingController.confirmBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.confirmBooking).toHaveBeenCalledWith(
        'booking-1'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockConfirmedBooking,
        message: 'Booking confirmed successfully',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('validateBooking', () => {
    const mockValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    it('should validate booking successfully', async () => {
      mockRequest.body = {
        propertyId: 'property-1',
        checkInDate: '2024-12-01',
        checkOutDate: '2024-12-03',
      };
      mockBookingService.validateBookingRequest = vi
        .fn()
        .mockResolvedValue(mockValidationResult);

      await bookingController.validateBooking(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.validateBookingRequest).toHaveBeenCalledWith(
        mockRequest.body
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockValidationResult,
        timestamp: expect.any(Date),
      });
    });
  });

  describe('addSpecialRequests', () => {
    const mockUpdatedBooking = {
      id: 'booking-1',
      specialRequests: 'Late check-in; Extra towels',
    };

    it('should add special requests successfully', async () => {
      mockRequest.params = { bookingId: 'booking-1' };
      mockRequest.body = { requests: ['Late check-in', 'Extra towels'] };
      mockBookingService.addSpecialRequests = vi
        .fn()
        .mockResolvedValue(mockUpdatedBooking);

      await bookingController.addSpecialRequests(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockBookingService.addSpecialRequests).toHaveBeenCalledWith(
        'booking-1',
        ['Late check-in', 'Extra towels']
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedBooking,
        message: 'Special requests added successfully',
        timestamp: expect.any(Date),
      });
    });
  });
});
