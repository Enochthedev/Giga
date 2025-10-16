/**
 * Availability Service - Handles availability checking and calculations
 */

import { PrismaClient } from '@/generated/prisma-client';
import { NotFoundError, ValidationError } from '@/utils/errors';
import logger from '@/utils/logger';
import {
  addDays,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';

export interface AvailabilityRequest {
  propertyId: string;
  roomTypeId?: string;
  checkInDate: Date;
  checkOutDate: Date;
  roomQuantity?: number;
  guestCount?: number;
}

export interface AvailabilityResult {
  propertyId: string;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate: Date;
  isAvailable: boolean;
  availableRooms: number;
  totalRooms: number;
  restrictions: AvailabilityRestriction[];
  rates: DailyRate[];
}

export interface AvailabilityRestriction {
  date: Date;
  type:
    | 'minimum_stay'
    | 'maximum_stay'
    | 'closed_to_arrival'
    | 'closed_to_departure'
    | 'stop_sell';
  value?: number;
  reason: string;
}

export interface DailyRate {
  date: Date;
  rate: number;
  currency: string;
  restrictions: {
    minimumStay?: number;
    maximumStay?: number;
    closedToArrival?: boolean;
    closedToDeparture?: boolean;
  };
}

export interface BulkAvailabilityRequest {
  propertyId: string;
  checkInDate: Date;
  checkOutDate: Date;
  roomQuantity?: number;
  guestCount?: number;
}

export class AvailabilityService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get room packages with pricing
   */
  async getRoomPackages(request: {
    propertyId: string;
    checkInDate: Date;
    checkOutDate: Date;
    rooms: number;
    adults: number;
    children: number;
  }) {
    try {
      logger.info('Getting room packages', { request });

      // Get all active room types for the property
      const roomTypes = await this.prisma.roomType.findMany({
        where: {
          propertyId: request.propertyId,
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Check availability for each room type
      const packages = await Promise.all(
        roomTypes.map(async roomType => {
          const availability = await this.checkAvailability({
            propertyId: request.propertyId,
            roomTypeId: roomType.id,
            checkInDate: request.checkInDate,
            checkOutDate: request.checkOutDate,
            roomQuantity: request.rooms,
            guestCount: request.adults + request.children,
          });

          return {
            roomType,
            availability,
            pricing: {
              baseRate: 0, // TODO: Get from pricing service
              totalPrice: 0,
              currency: 'USD',
            },
          };
        })
      );

      return packages.filter(pkg => pkg.availability.isAvailable);
    } catch (error) {
      logger.error('Error getting room packages', { error, request });
      throw error;
    }
  }

  /**
   * Get room details with availability
   */
  async getRoomDetails(
    roomId: string,
    checkInDate?: Date,
    checkOutDate?: Date
  ) {
    try {
      logger.info('Getting room details', {
        roomId,
        checkInDate,
        checkOutDate,
      });

      const roomType = await this.prisma.roomType.findUnique({
        where: { id: roomId },
        include: {
          property: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      });

      if (!roomType) {
        throw new NotFoundError('Room type', roomId);
      }

      let availability = null;
      if (checkInDate && checkOutDate) {
        availability = await this.checkAvailability({
          propertyId: roomType.propertyId,
          roomTypeId: roomId,
          checkInDate,
          checkOutDate,
          roomQuantity: 1,
          guestCount: 2,
        });
      }

      return {
        roomType,
        availability,
        pricing: {
          baseRate: 0, // TODO: Get from pricing service
          currency: 'USD',
        },
      };
    } catch (error) {
      logger.error('Error getting room details', { error, roomId });
      throw error;
    }
  }

  /**
   * Get room pricing details
   */
  async getRoomPricing(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    nights: number
  ) {
    try {
      logger.info('Getting room pricing', {
        roomId,
        checkInDate,
        checkOutDate,
        nights,
      });

      const roomType = await this.prisma.roomType.findUnique({
        where: { id: roomId },
      });

      if (!roomType) {
        throw new NotFoundError('Room type', roomId);
      }

      // TODO: Implement proper pricing calculation
      const baseRate = 100; // Placeholder
      const subtotal = baseRate * nights;
      const taxes = subtotal * 0.1;
      const total = subtotal + taxes;

      return {
        roomType: {
          id: roomType.id,
          name: roomType.name,
          category: roomType.category,
        },
        pricing: {
          baseRate,
          nights,
          subtotal,
          taxes,
          total,
          currency: 'USD',
          breakdown: {
            roomCharges: subtotal,
            taxes,
            fees: 0,
            discounts: 0,
          },
        },
        dateRange: {
          checkIn: checkInDate,
          checkOut: checkOutDate,
        },
      };
    } catch (error) {
      logger.error('Error getting room pricing', { error, roomId });
      throw error;
    }
  }

  /**
   * Check availability for a specific room type
   */
  async checkAvailability(
    request: AvailabilityRequest
  ): Promise<AvailabilityResult> {
    try {
      logger.info('Checking availability', { request });

      // Validate request
      await this.validateAvailabilityRequest(request);

      // Verify property and room type exist
      await this.validatePropertyAndRoomType(
        request.propertyId,
        request.roomTypeId
      );

      // Get inventory records for the date range
      const inventoryRecords = await this.getInventoryRecords(
        request.propertyId,
        request.roomTypeId!,
        request.checkInDate,
        request.checkOutDate
      );

      // Check if all dates have inventory records
      const missingDates = this.findMissingInventoryDates(
        request.checkInDate,
        request.checkOutDate,
        inventoryRecords
      );

      if (missingDates.length > 0) {
        // Create missing inventory records with default values
        await this.createMissingInventoryRecords(
          request.propertyId,
          request.roomTypeId!,
          missingDates
        );

        // Re-fetch inventory records
        const updatedInventoryRecords = await this.getInventoryRecords(
          request.propertyId,
          request.roomTypeId!,
          request.checkInDate,
          request.checkOutDate
        );

        return this.calculateAvailability(request, updatedInventoryRecords);
      }

      return this.calculateAvailability(request, inventoryRecords);
    } catch (error) {
      logger.error('Error checking availability', { error, request });
      throw error;
    }
  }

  /**
   * Check availability for all room types in a property
   */
  async checkBulkAvailability(
    request: BulkAvailabilityRequest
  ): Promise<AvailabilityResult[]> {
    try {
      logger.info('Checking bulk availability', { request });

      // Validate request
      await this.validateBulkAvailabilityRequest(request);

      // Get all active room types for the property
      const roomTypes = await this.prisma.roomType.findMany({
        where: {
          propertyId: request.propertyId,
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      if (roomTypes.length === 0) {
        throw new NotFoundError(
          'No active room types found for property',
          request.propertyId
        );
      }

      // Check availability for each room type
      const availabilityResults = await Promise.all(
        roomTypes.map(roomType =>
          this.checkAvailability({
            propertyId: request.propertyId,
            roomTypeId: roomType.id,
            checkInDate: request.checkInDate,
            checkOutDate: request.checkOutDate,
            roomQuantity: request.roomQuantity,
            guestCount: request.guestCount,
          })
        )
      );

      return availabilityResults;
    } catch (error) {
      logger.error('Error checking bulk availability', { error, request });
      throw error;
    }
  }

  /**
   * Get availability calendar for a room type
   */
  async getAvailabilityCalendar(
    propertyId: string,
    roomTypeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    roomTypeId: string;
    calendar: Array<{
      date: Date;
      availableRooms: number;
      totalRooms: number;
      rate: number;
      currency: string;
      restrictions: AvailabilityRestriction[];
    }>;
  }> {
    try {
      logger.info('Getting availability calendar', {
        propertyId,
        roomTypeId,
        startDate,
        endDate,
      });

      // Validate inputs
      if (isAfter(startDate, endDate)) {
        throw new ValidationError('Start date must be before end date');
      }

      // Get inventory records
      const inventoryRecords = await this.getInventoryRecords(
        propertyId,
        roomTypeId,
        startDate,
        endDate
      );

      // Get rate records
      const rateRecords = await this.prisma.rateRecord.findMany({
        where: {
          propertyId,
          roomTypeId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      // Build calendar
      const calendar = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');

        const inventory = inventoryRecords.find(
          inv => format(inv.date, 'yyyy-MM-dd') === dateStr
        );

        const rate = rateRecords.find(
          r => format(r.date, 'yyyy-MM-dd') === dateStr
        );

        const restrictions: AvailabilityRestriction[] = [];

        if (inventory) {
          if (inventory.minimumStay && inventory.minimumStay > 1) {
            restrictions.push({
              date: currentDate,
              type: 'minimum_stay',
              value: inventory.minimumStay,
              reason: `Minimum stay of ${inventory.minimumStay} nights required`,
            });
          }

          if (inventory.maximumStay) {
            restrictions.push({
              date: currentDate,
              type: 'maximum_stay',
              value: inventory.maximumStay,
              reason: `Maximum stay of ${inventory.maximumStay} nights allowed`,
            });
          }

          if (inventory.closedToArrival) {
            restrictions.push({
              date: currentDate,
              type: 'closed_to_arrival',
              reason: 'Closed to arrival',
            });
          }

          if (inventory.closedToDeparture) {
            restrictions.push({
              date: currentDate,
              type: 'closed_to_departure',
              reason: 'Closed to departure',
            });
          }

          if (inventory.stopSell) {
            restrictions.push({
              date: currentDate,
              type: 'stop_sell',
              reason: 'Stop sell - no bookings allowed',
            });
          }
        }

        calendar.push({
          date: new Date(currentDate),
          availableRooms: inventory?.availableRooms || 0,
          totalRooms: inventory?.totalRooms || 0,
          rate: rate?.rate || 0,
          currency: rate?.currency || 'USD',
          restrictions,
        });

        currentDate = addDays(currentDate, 1);
      }

      return {
        roomTypeId,
        calendar,
      };
    } catch (error) {
      logger.error('Error getting availability calendar', {
        error,
        propertyId,
        roomTypeId,
      });
      throw error;
    }
  }

  /**
   * Calculate availability based on inventory records
   */
  private calculateAvailability(
    request: AvailabilityRequest,
    inventoryRecords: any[]
  ): AvailabilityResult {
    const roomQuantity = request.roomQuantity || 1;
    let isAvailable = true;
    let minAvailableRooms = Infinity;
    const restrictions: AvailabilityRestriction[] = [];
    const rates: DailyRate[] = [];

    // Check each date in the range
    let currentDate = new Date(request.checkInDate);
    while (currentDate < request.checkOutDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const inventory = inventoryRecords.find(
        inv => format(inv.date, 'yyyy-MM-dd') === dateStr
      );

      if (!inventory) {
        isAvailable = false;
        minAvailableRooms = 0;
        break;
      }

      // Check if stop sell is active
      if (inventory.stopSell) {
        isAvailable = false;
        restrictions.push({
          date: new Date(currentDate),
          type: 'stop_sell',
          reason: 'Stop sell active - no bookings allowed',
        });
      }

      // Check available rooms
      if (inventory.availableRooms < roomQuantity) {
        isAvailable = false;
      }

      minAvailableRooms = Math.min(minAvailableRooms, inventory.availableRooms);

      // Check arrival restrictions
      if (
        isEqual(currentDate, request.checkInDate) &&
        inventory.closedToArrival
      ) {
        isAvailable = false;
        restrictions.push({
          date: new Date(currentDate),
          type: 'closed_to_arrival',
          reason: 'Closed to arrival on this date',
        });
      }

      // Check departure restrictions
      if (
        isEqual(currentDate, addDays(request.checkOutDate, -1)) &&
        inventory.closedToDeparture
      ) {
        isAvailable = false;
        restrictions.push({
          date: new Date(currentDate),
          type: 'closed_to_departure',
          reason: 'Closed to departure on this date',
        });
      }

      // Check minimum stay
      const lengthOfStay = differenceInDays(
        request.checkOutDate,
        request.checkInDate
      );
      if (inventory.minimumStay && lengthOfStay < inventory.minimumStay) {
        isAvailable = false;
        restrictions.push({
          date: new Date(currentDate),
          type: 'minimum_stay',
          value: inventory.minimumStay,
          reason: `Minimum stay of ${inventory.minimumStay} nights required`,
        });
      }

      // Check maximum stay
      if (inventory.maximumStay && lengthOfStay > inventory.maximumStay) {
        isAvailable = false;
        restrictions.push({
          date: new Date(currentDate),
          type: 'maximum_stay',
          value: inventory.maximumStay,
          reason: `Maximum stay of ${inventory.maximumStay} nights exceeded`,
        });
      }

      // Add rate information (this would typically come from rate records)
      rates.push({
        date: new Date(currentDate),
        rate: 0, // This would be fetched from rate records
        currency: 'USD',
        restrictions: {
          minimumStay: inventory.minimumStay,
          maximumStay: inventory.maximumStay,
          closedToArrival: inventory.closedToArrival,
          closedToDeparture: inventory.closedToDeparture,
        },
      });

      currentDate = addDays(currentDate, 1);
    }

    return {
      propertyId: request.propertyId,
      roomTypeId: request.roomTypeId!,
      checkInDate: request.checkInDate,
      checkOutDate: request.checkOutDate,
      isAvailable,
      availableRooms: minAvailableRooms === Infinity ? 0 : minAvailableRooms,
      totalRooms: inventoryRecords[0]?.totalRooms || 0,
      restrictions,
      rates,
    };
  }

  /**
   * Get inventory records for date range
   */
  private async getInventoryRecords(
    propertyId: string,
    roomTypeId: string,
    checkInDate: Date,
    checkOutDate: Date
  ) {
    return this.prisma.inventoryRecord.findMany({
      where: {
        propertyId,
        roomTypeId,
        date: {
          gte: checkInDate,
          lt: checkOutDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  /**
   * Find missing inventory dates
   */
  private findMissingInventoryDates(
    checkInDate: Date,
    checkOutDate: Date,
    inventoryRecords: any[]
  ): Date[] {
    const missingDates: Date[] = [];
    let currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const hasInventory = inventoryRecords.some(
        inv => format(inv.date, 'yyyy-MM-dd') === dateStr
      );

      if (!hasInventory) {
        missingDates.push(new Date(currentDate));
      }

      currentDate = addDays(currentDate, 1);
    }

    return missingDates;
  }

  /**
   * Create missing inventory records
   */
  private async createMissingInventoryRecords(
    propertyId: string,
    roomTypeId: string,
    dates: Date[]
  ) {
    // Get room type to get total rooms
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundError('Room type', roomTypeId);
    }

    const inventoryData = dates.map(date => ({
      propertyId,
      roomTypeId,
      date,
      totalRooms: roomType.totalRooms,
      availableRooms: roomType.totalRooms,
      reservedRooms: 0,
      blockedRooms: 0,
      overbookingLimit: 0,
    }));

    await this.prisma.inventoryRecord.createMany({
      data: inventoryData,
      skipDuplicates: true,
    });

    logger.info('Created missing inventory records', {
      propertyId,
      roomTypeId,
      count: dates.length,
    });
  }

  /**
   * Validate availability request
   */
  private async validateAvailabilityRequest(request: AvailabilityRequest) {
    if (!request.propertyId) {
      throw new ValidationError('Property ID is required');
    }

    if (!request.roomTypeId) {
      throw new ValidationError('Room type ID is required');
    }

    if (!request.checkInDate || !request.checkOutDate) {
      throw new ValidationError('Check-in and check-out dates are required');
    }

    if (isAfter(request.checkInDate, request.checkOutDate)) {
      throw new ValidationError('Check-out date must be after check-in date');
    }

    if (isBefore(request.checkInDate, new Date())) {
      throw new ValidationError('Check-in date cannot be in the past');
    }

    if (request.roomQuantity && request.roomQuantity < 1) {
      throw new ValidationError('Room quantity must be at least 1');
    }

    if (request.guestCount && request.guestCount < 1) {
      throw new ValidationError('Guest count must be at least 1');
    }
  }

  /**
   * Validate bulk availability request
   */
  private async validateBulkAvailabilityRequest(
    request: BulkAvailabilityRequest
  ) {
    if (!request.propertyId) {
      throw new ValidationError('Property ID is required');
    }

    if (!request.checkInDate || !request.checkOutDate) {
      throw new ValidationError('Check-in and check-out dates are required');
    }

    if (isAfter(request.checkInDate, request.checkOutDate)) {
      throw new ValidationError('Check-out date must be after check-in date');
    }

    if (isBefore(request.checkInDate, new Date())) {
      throw new ValidationError('Check-in date cannot be in the past');
    }
  }

  /**
   * Validate property and room type exist
   */
  private async validatePropertyAndRoomType(
    propertyId: string,
    roomTypeId?: string
  ) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundError('Property', propertyId);
    }

    if (roomTypeId) {
      const roomType = await this.prisma.roomType.findUnique({
        where: { id: roomTypeId },
      });

      if (!roomType) {
        throw new NotFoundError('Room type', roomTypeId);
      }

      if (roomType.propertyId !== propertyId) {
        throw new ValidationError(
          'Room type does not belong to the specified property'
        );
      }
    }
  }
}
