/**
 * Booking Modification Service Tests
 */

import { BookingModificationService } from '@/services/booking-modification.service';
import { BookingModificationRequest, BookingStatus } from '@/types';
import { NotFoundError } from '@/utils/errors';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma
vi.mock('@/generated/prisma-client');

describe('BookingModificationService', () => {
  let service: BookingModificationService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      booking: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      roomType: {
        findUnique: vi.fn(),
      },
      bookedRoom: {
        deleteMany: vi.fn(),
        create: vi.fn(),
      },
      bookingHistory: {
        create: vi.fn(),
      },
      $transaction: vi.fn(),
    };
    service = new BookingModificationService(mockPrisma);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('validateModification', () => {
    const futureDate1 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const futureDate2 = new Date(Date.now() + 32 * 24 * 60 * 60 * 1000); // 32 days from now

    const mockBooking = {
      id: 'booking-1',
      confirmationNumber: 'BK123456',
      propertyId: 'property-1',
      guestId: 'guest-1',
      checkInDate: futureDate1,
      checkOutDate: futureDate2,
      status: BookingStatus.CONFIRMED,
      totalAmount: 300,
      nights: 2,
      bookedRooms: [
        {
          id: 'room-1',
          roomTypeId: 'roomtype-1',
          quantity: 1,
          guestCount: 2,
          roomType: {
            id: 'roomtype-1',
            name: 'Standard Room',
            baseRate: 150,
            maxOccupancy: 4,
          },
        },
      ],
      property: {
        id: 'property-1',
        name: 'Test Hotel',
        checkInTime: '15:00',
        checkOutTime: '11:00',
      },
    };

    it('should validate successful date modification', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      mockPrisma.roomType.findUnique.mockResolvedValue({
        id: 'roomtype-1',
        propertyId: 'property-1',
        name: 'Standard Room',
        maxOccupancy: 4,
        isActive: true,
      } as any);

      const modificationRequest: BookingModificationRequest = {
        checkInDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000), // 31 days from now
        checkOutDate: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000), // 33 days from now
        reason: 'Change travel dates',
        requestedBy: 'guest-1',
      };

      const result = await service.validateModification(
        'booking-1',
        modificationRequest
      );

      expect(result.isValid).toBe(true);
      expect(result.canModify).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.pricingImpact).toBeDefined();
    });

    it('should reject modification for cancelled booking', async () => {
      const cancelledBooking = {
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      };

      mockPrisma.booking.findUnique.mockResolvedValue(cancelledBooking as any);

      const modificationRequest: BookingModificationRequest = {
        checkInDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
        reason: 'Change travel dates',
        requestedBy: 'guest-1',
      };

      const result = await service.validateModification(
        'booking-1',
        modificationRequest
      );

      expect(result.isValid).toBe(false);
      expect(result.canModify).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(e => e.code === 'INVALID_STATUS_FOR_MODIFICATION')
      ).toBe(true);
    });

    it('should reject invalid date modifications', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as any);

      const modificationRequest: BookingModificationRequest = {
        checkInDate: new Date('2020-11-01'), // Past date
        checkOutDate: new Date('2020-11-02'),
        reason: 'Change travel dates',
        requestedBy: 'guest-1',
      };

      const result = await service.validateModification(
        'booking-1',
        modificationRequest
      );

      expect(result.isValid).toBe(false);
      expect(result.canModify).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.code === 'INVALID_CHECK_IN_DATE')).toBe(
        true
      );
    });

    it('should validate room modifications', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      mockPrisma.roomType.findUnique.mockResolvedValue({
        id: 'roomtype-2',
        propertyId: 'property-1',
        name: 'Deluxe Room',
        maxOccupancy: 4,
        isActive: true,
      } as any);

      const modificationRequest: BookingModificationRequest = {
        rooms: [
          {
            roomTypeId: 'roomtype-2',
            quantity: 1,
            guestCount: 2,
            guests: [
              {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
              },
              {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
              },
            ],
          },
        ],
        reason: 'Upgrade room',
        requestedBy: 'guest-1',
      };

      const result = await service.validateModification(
        'booking-1',
        modificationRequest
      );

      expect(result.isValid).toBe(true);
      expect(result.availabilityImpact).toBeDefined();
      expect(result.availabilityImpact?.newRooms).toHaveLength(1);
    });

    it('should reject room modification with invalid room type', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as any);
      mockPrisma.roomType.findUnique.mockResolvedValue(null);

      const modificationRequest: BookingModificationRequest = {
        rooms: [
          {
            roomTypeId: 'invalid-roomtype',
            quantity: 1,
            guestCount: 2,
            guests: [],
          },
        ],
        reason: 'Change room',
        requestedBy: 'guest-1',
      };

      const result = await service.validateModification(
        'booking-1',
        modificationRequest
      );

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'ROOM_TYPE_NOT_FOUND')).toBe(
        true
      );
    });
  });

  describe('getModificationOptions', () => {
    it('should return modification options for valid booking', async () => {
      const futureBooking = {
        id: 'booking-1',
        status: BookingStatus.CONFIRMED,
        checkInDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      };

      mockPrisma.booking.findUnique.mockResolvedValue(futureBooking as any);

      const result = await service.getModificationOptions('booking-1');

      expect(result.canModifyDates).toBe(true);
      expect(result.canModifyRooms).toBe(true);
      expect(result.canModifyGuests).toBe(true);
      expect(result.restrictions).toHaveLength(0);
    });

    it('should restrict modifications for near check-in booking', async () => {
      const nearBooking = {
        id: 'booking-1',
        status: BookingStatus.CONFIRMED,
        checkInDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      };

      mockPrisma.booking.findUnique.mockResolvedValue(nearBooking as any);

      const result = await service.getModificationOptions('booking-1');

      expect(result.canModifyDates).toBe(false);
      expect(result.canModifyRooms).toBe(false);
      expect(result.canModifyGuests).toBe(true);
      expect(result.restrictions.length).toBeGreaterThan(0);
    });

    it('should throw error for non-existent booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.getModificationOptions('booking-1')).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
