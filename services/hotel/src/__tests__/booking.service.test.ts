/**
 * Booking Service Unit Tests
 */

import { PrismaClient } from '@/generated/prisma-client';
import { BookingService } from '@/services/booking.service';
import { BookingSource, BookingStatus, PaymentMethod } from '@/types';
import { ConflictError, NotFoundError, ValidationError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Redis and other dependencies
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

// Mock Prisma Client
const mockPrisma = {
  property: {
    findUnique: vi.fn(),
  },
  roomType: {
    findUnique: vi.fn(),
  },
  booking: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },
  bookedRoom: {
    create: vi.fn(),
  },
  bookingHistory: {
    create: vi.fn(),
  },
  guestProfile: {
    select: vi.fn(),
  },
  $transaction: vi.fn(),
} as unknown as PrismaClient;

describe('BookingService', () => {
  let bookingService: BookingService;

  beforeEach(() => {
    vi.clearAllMocks();
    bookingService = new BookingService(mockPrisma);
  });

  describe('createBooking', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

    const validBookingRequest = {
      propertyId: 'property-1',
      checkInDate: tomorrow,
      checkOutDate: dayAfterTomorrow,
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
            {
              firstName: 'Jane',
              lastName: 'Doe',
              email: 'jane.doe@example.com',
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

    const mockProperty = {
      id: 'property-1',
      name: 'Test Hotel',
      status: 'active',
    };

    const mockRoomType = {
      id: 'room-type-1',
      propertyId: 'property-1',
      name: 'Standard Room',
      isActive: true,
      maxOccupancy: 4,
      baseRate: 100,
    };

    const mockBooking = {
      id: 'booking-1',
      confirmationNumber: 'BK123456',
      status: BookingStatus.PENDING,
      totalAmount: 220, // 2 nights * $100 + 10% tax
    };

    it('should create a booking successfully', async () => {
      // Setup mocks
      mockPrisma.property.findUnique = vi.fn().mockResolvedValue(mockProperty);
      mockPrisma.roomType.findUnique = vi.fn().mockResolvedValue(mockRoomType);
      mockPrisma.$transaction = vi.fn().mockImplementation(async callback => {
        const tx = {
          booking: {
            create: vi.fn().mockResolvedValue(mockBooking),
          },
          bookedRoom: {
            create: vi.fn().mockResolvedValue({}),
          },
          bookingHistory: {
            create: vi.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      // Mock getBookingWithDetails
      const mockBookingDetails = { ...mockBooking, property: mockProperty };
      vi.spyOn(
        bookingService as any,
        'getBookingWithDetails'
      ).mockResolvedValue(mockBookingDetails);

      const result = await bookingService.createBooking(validBookingRequest);

      expect(result).toEqual({
        booking: mockBookingDetails,
        confirmationNumber: mockBooking.confirmationNumber,
      });

      expect(mockPrisma.property.findUnique).toHaveBeenCalledWith({
        where: { id: 'property-1' },
      });

      expect(mockPrisma.roomType.findUnique).toHaveBeenCalledWith({
        where: { id: 'room-type-1' },
      });
    });

    it('should throw ValidationError for invalid dates', async () => {
      const invalidRequest = {
        ...validBookingRequest,
        checkInDate: new Date('2024-12-03'),
        checkOutDate: new Date('2024-12-01'), // Check-out before check-in
      };

      await expect(
        bookingService.createBooking(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for past check-in date', async () => {
      const invalidRequest = {
        ...validBookingRequest,
        checkInDate: new Date('2020-01-01'), // Past date
      };

      await expect(
        bookingService.createBooking(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw NotFoundError for non-existent property', async () => {
      mockPrisma.property.findUnique = vi.fn().mockResolvedValue(null);

      await expect(
        bookingService.createBooking(validBookingRequest)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError for inactive property', async () => {
      const inactiveProperty = { ...mockProperty, status: 'inactive' };
      mockPrisma.property.findUnique = vi
        .fn()
        .mockResolvedValue(inactiveProperty);

      await expect(
        bookingService.createBooking(validBookingRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw NotFoundError for non-existent room type', async () => {
      mockPrisma.property.findUnique = vi.fn().mockResolvedValue(mockProperty);
      mockPrisma.roomType.findUnique = vi.fn().mockResolvedValue(null);

      await expect(
        bookingService.createBooking(validBookingRequest)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError for room type from different property', async () => {
      const wrongRoomType = {
        ...mockRoomType,
        propertyId: 'different-property',
      };
      mockPrisma.property.findUnique = vi.fn().mockResolvedValue(mockProperty);
      mockPrisma.roomType.findUnique = vi.fn().mockResolvedValue(wrongRoomType);

      await expect(
        bookingService.createBooking(validBookingRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for guest count exceeding room capacity', async () => {
      const smallRoomType = { ...mockRoomType, maxOccupancy: 1 };
      const requestWithTooManyGuests = {
        ...validBookingRequest,
        rooms: [
          {
            ...validBookingRequest.rooms[0],
            guestCount: 2, // Exceeds capacity of 1
          },
        ],
      };

      mockPrisma.property.findUnique = vi.fn().mockResolvedValue(mockProperty);
      mockPrisma.roomType.findUnique = vi.fn().mockResolvedValue(smallRoomType);

      await expect(
        bookingService.createBooking(requestWithTooManyGuests)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('processBookingConfirmation', () => {
    const mockBooking = {
      id: 'booking-1',
      confirmationNumber: 'BK123456',
      status: BookingStatus.PENDING,
      guestId: 'guest-1',
      totalAmount: 220,
    };

    it('should confirm booking successfully', async () => {
      // Mock getBookingWithDetails
      vi.spyOn(bookingService as any, 'getBookingWithDetails')
        .mockResolvedValueOnce(mockBooking) // First call for validation
        .mockResolvedValueOnce({
          ...mockBooking,
          status: BookingStatus.CONFIRMED,
        }); // Second call for result

      // Mock processPayment
      vi.spyOn(bookingService as any, 'processPayment').mockResolvedValue({
        success: true,
        transactionId: 'txn_123',
      });

      // Mock sendBookingConfirmation
      vi.spyOn(
        bookingService as any,
        'sendBookingConfirmation'
      ).mockResolvedValue(undefined);

      mockPrisma.$transaction = vi.fn().mockImplementation(async callback => {
        const tx = {
          booking: {
            update: vi.fn().mockResolvedValue({
              ...mockBooking,
              status: BookingStatus.CONFIRMED,
            }),
          },
          bookingHistory: {
            create: vi.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      const result =
        await bookingService.processBookingConfirmation('booking-1');

      expect(result.booking.status).toBe(BookingStatus.CONFIRMED);
      expect(result.confirmationNumber).toBe('BK123456');
      expect(result.paymentResult.success).toBe(true);
    });

    it('should throw ConflictError for non-pending booking', async () => {
      const confirmedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };
      vi.spyOn(
        bookingService as any,
        'getBookingWithDetails'
      ).mockResolvedValue(confirmedBooking);

      await expect(
        bookingService.processBookingConfirmation('booking-1')
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('updateBookingStatus', () => {
    const mockBooking = {
      id: 'booking-1',
      status: BookingStatus.PENDING,
    };

    it('should update booking status successfully', async () => {
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(mockBooking);
      mockPrisma.$transaction = vi.fn().mockImplementation(async callback => {
        const tx = {
          booking: {
            update: vi.fn().mockResolvedValue({}),
          },
          bookingHistory: {
            create: vi.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      await bookingService.updateBookingStatus(
        'booking-1',
        BookingStatus.CONFIRMED,
        'user-1'
      );

      expect(mockPrisma.booking.findUnique).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
      });
    });

    it('should throw NotFoundError for non-existent booking', async () => {
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(null);

      await expect(
        bookingService.updateBookingStatus(
          'booking-1',
          BookingStatus.CONFIRMED,
          'user-1'
        )
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError for invalid status transition', async () => {
      const checkedOutBooking = {
        ...mockBooking,
        status: BookingStatus.CHECKED_OUT,
      };
      mockPrisma.booking.findUnique = vi
        .fn()
        .mockResolvedValue(checkedOutBooking);

      await expect(
        bookingService.updateBookingStatus(
          'booking-1',
          BookingStatus.PENDING,
          'user-1'
        )
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('validateBookingRequest', () => {
    it('should validate booking request successfully', async () => {
      const mockProperty = {
        id: 'property-1',
        status: 'active',
      };

      mockPrisma.property.findUnique = vi.fn().mockResolvedValue(mockProperty);

      const request = {
        propertyId: 'property-1',
        checkInDate: new Date('2024-12-01'),
        checkOutDate: new Date('2024-12-03'),
      };

      const result = await bookingService.validateBookingRequest(request);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return validation errors for invalid request', async () => {
      mockPrisma.property.findUnique = vi.fn().mockResolvedValue(null);

      const request = {
        propertyId: 'non-existent',
        checkInDate: new Date('2020-01-01'), // Past date
        checkOutDate: new Date('2024-12-03'),
      };

      const result = await bookingService.validateBookingRequest(request);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('cancelBooking', () => {
    const mockBooking = {
      id: 'booking-1',
      status: BookingStatus.CONFIRMED,
      totalAmount: 220,
      checkInDate: new Date('2024-12-01'),
      guestId: 'guest-1',
    };

    it('should cancel booking successfully', async () => {
      mockPrisma.booking.findUnique = vi.fn().mockResolvedValue(mockBooking);

      // Mock calculateRefundAmount
      vi.spyOn(
        bookingService as any,
        'calculateRefundAmount'
      ).mockResolvedValue(110);

      mockPrisma.$transaction = vi.fn().mockImplementation(async callback => {
        const tx = {
          booking: {
            update: vi.fn().mockResolvedValue({
              ...mockBooking,
              status: BookingStatus.CANCELLED,
            }),
          },
          bookingHistory: {
            create: vi.fn().mockResolvedValue({}),
          },
        };
        return callback(tx);
      });

      const result = await bookingService.cancelBooking(
        'booking-1',
        'Customer request'
      );

      expect(result.booking.status).toBe(BookingStatus.CANCELLED);
      expect(result.refundAmount).toBe(110);
      expect(result.refundEligible).toBe(true);
    });

    it('should throw ConflictError for non-cancellable booking', async () => {
      const checkedOutBooking = {
        ...mockBooking,
        status: BookingStatus.CHECKED_OUT,
      };
      mockPrisma.booking.findUnique = vi
        .fn()
        .mockResolvedValue(checkedOutBooking);

      await expect(bookingService.cancelBooking('booking-1')).rejects.toThrow(
        ConflictError
      );
    });
  });

  describe('getUserBookings', () => {
    it('should get user bookings successfully', async () => {
      const mockBookings = [
        {
          id: 'booking-1',
          guestId: 'user-1',
          status: BookingStatus.CONFIRMED,
        },
      ];

      mockPrisma.booking.findMany = vi.fn().mockResolvedValue(mockBookings);
      mockPrisma.booking.count = vi.fn().mockResolvedValue(1);

      const result = await bookingService.getUserBookings(
        { guestId: 'user-1' },
        { page: 1, limit: 20 }
      );

      expect(result.bookings).toEqual(mockBookings);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
    });
  });

  describe('Helper Methods', () => {
    it('should calculate nights correctly', () => {
      const checkIn = new Date('2024-12-01');
      const checkOut = new Date('2024-12-03');

      const nights = (bookingService as any).calculateNights(checkIn, checkOut);

      expect(nights).toBe(2);
    });

    it('should generate confirmation number', () => {
      const confirmationNumber = (
        bookingService as any
      ).generateConfirmationNumber();

      expect(confirmationNumber).toMatch(/^BK[A-Z0-9]+$/);
      expect(confirmationNumber.length).toBeGreaterThan(5);
    });

    it('should validate status transitions correctly', () => {
      const service = bookingService as any;

      // Valid transitions
      expect(
        service.isValidStatusTransition(
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED
        )
      ).toBe(true);
      expect(
        service.isValidStatusTransition(
          BookingStatus.CONFIRMED,
          BookingStatus.CHECKED_IN
        )
      ).toBe(true);
      expect(
        service.isValidStatusTransition(
          BookingStatus.CHECKED_IN,
          BookingStatus.CHECKED_OUT
        )
      ).toBe(true);

      // Invalid transitions
      expect(
        service.isValidStatusTransition(
          BookingStatus.CHECKED_OUT,
          BookingStatus.PENDING
        )
      ).toBe(false);
      expect(
        service.isValidStatusTransition(
          BookingStatus.CANCELLED,
          BookingStatus.CONFIRMED
        )
      ).toBe(false);
    });
  });
});
