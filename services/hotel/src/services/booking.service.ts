/**
 * Booking Service - Handles booking/reservation business logic
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  BookingModificationRequest,
  BookingResult,
  BookingSource,
  BookingStatus,
  CancellationRequest,
  CancellationResult,
  CreateBookingRequest,
  ModificationResult,
  PaymentMethod,
  PaymentStatus,
  UpdateBookingRequest,
} from '@/types';
import { ConflictError, NotFoundError, ValidationError } from '@/utils/errors';
import logger from '@/utils/logger';
import { validateSchema } from '@/utils/validation';
import { z } from 'zod';
import { BookingModificationService } from './booking-modification.service';
import { CancellationPolicyService } from './cancellation-policy.service';

// Validation schemas
const guestDetailsSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  nationality: z.string().optional(),
  passportNumber: z.string().optional(),
  specialRequests: z.string().optional(),
});

const bookingRoomRequestSchema = z.object({
  roomTypeId: z.string().min(1),
  quantity: z.number().min(1).max(10),
  guestCount: z.number().min(1).max(20),
  guests: z.array(guestDetailsSchema),
});

const createBookingRequestSchema = z
  .object({
    propertyId: z.string().min(1),
    checkInDate: z.date(),
    checkOutDate: z.date(),
    rooms: z.array(bookingRoomRequestSchema).min(1),
    primaryGuest: guestDetailsSchema,
    additionalGuests: z.array(guestDetailsSchema).optional(),
    specialRequests: z.string().optional(),
    preferences: z.record(z.unknown()).optional(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    bookingSource: z.nativeEnum(BookingSource),
    promotionCodes: z.array(z.string()).optional(),
    corporateCode: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .refine(data => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

const updateBookingRequestSchema = z.object({
  checkInDate: z.date().optional(),
  checkOutDate: z.date().optional(),
  rooms: z.array(bookingRoomRequestSchema).optional(),
  specialRequests: z.string().optional(),
  preferences: z.record(z.unknown()).optional(),
  status: z.nativeEnum(BookingStatus).optional(),
});

export interface BookingFilters {
  guestId?: string;
  propertyId?: string;
  status?: BookingStatus[];
  bookingSource?: BookingSource[];
  checkInDateFrom?: Date;
  checkInDateTo?: Date;
  checkOutDateFrom?: Date;
  checkOutDateTo?: Date;
  bookedDateFrom?: Date;
  bookedDateTo?: Date;
}

export class BookingService {
  private modificationService: BookingModificationService;
  private cancellationPolicyService: CancellationPolicyService;

  constructor(private prisma: PrismaClient) {
    this.modificationService = new BookingModificationService(this.prisma);
    this.cancellationPolicyService = new CancellationPolicyService(this.prisma);
  }

  /**
   * Create a new booking with comprehensive validation and workflow
   */
  async createBooking(request: CreateBookingRequest): Promise<BookingResult> {
    try {
      logger.info('Creating booking', {
        propertyId: request.propertyId,
        guestEmail: request.primaryGuest.email,
        checkInDate: request.checkInDate,
        checkOutDate: request.checkOutDate,
      });

      // Validate request structure
      const validation = validateSchema(createBookingRequestSchema, request);
      if (!validation.isValid) {
        throw new ValidationError('Invalid booking request', validation.errors);
      }

      // Validate business rules
      await this.validateBookingBusinessRules(request);

      // Check availability
      await this.validateAvailability(request);

      // Calculate pricing
      const pricingDetails = await this.calculateBookingPricing(request);

      // Generate confirmation number
      const confirmationNumber = this.generateConfirmationNumber();

      // Create booking in transaction
      const booking = await this.prisma.$transaction(async tx => {
        // Create the booking
        const newBooking = await tx.booking.create({
          data: {
            confirmationNumber,
            propertyId: request.propertyId,
            guestId: request.primaryGuest.email, // Use email as guest ID for now
            guestName: `${request.primaryGuest.firstName} ${request.primaryGuest.lastName}`,
            guestEmail: request.primaryGuest.email,
            guestPhone: request.primaryGuest.phone || '',
            additionalGuests: (request.additionalGuests || []) as any,
            checkInDate: request.checkInDate,
            checkOutDate: request.checkOutDate,
            primaryGuest: request.primaryGuest as any,
            nights: this.calculateNights(
              request.checkInDate,
              request.checkOutDate
            ),
            rooms: request.rooms as any,
            pricing: pricingDetails as any,
            totalAmount: pricingDetails.totalAmount,
            currency: pricingDetails.currency,
            status: BookingStatus.PENDING,
            bookingSource: request.bookingSource,
            paymentStatus: PaymentStatus.PENDING,
            paymentMethod: request.paymentMethod,
            specialRequests: request.specialRequests,
            preferences: (request.preferences as any) || {},
            cancellationPolicy: 'moderate',
            noShowPolicy: 'charge_first_night',
            metadata: (request.metadata as any) || {},
          },
        });

        // Create booked rooms
        for (const room of request.rooms) {
          const roomTotal = await this.calculateRoomTotal(
            room,
            newBooking.nights
          );

          await tx.bookedRoom.create({
            data: {
              bookingId: newBooking.id,
              roomTypeId: room.roomTypeId,
              quantity: room.quantity,
              guestCount: room.guestCount,
              rate: roomTotal.ratePerNight,
              ratePerNight: roomTotal.ratePerNight,
              // nights: newBooking.nights, // Field not in schema
              // subtotal: roomTotal.subtotal, // Field not in schema
              // taxAmount: roomTotal.taxAmount, // Field not in schema
              totalPrice: roomTotal.totalPrice,
              guests: room.guests as any,
            },
          });
        }

        // Create booking history entry
        await tx.bookingHistory.create({
          data: {
            bookingId: newBooking.id,
            action: 'created',
            changedBy: newBooking.guestId,
            changeType: 'status_change',
            newValue: { status: BookingStatus.PENDING },
            description: 'Booking created and awaiting confirmation',
          },
        });

        return newBooking;
      });

      logger.info('Booking created successfully', {
        bookingId: booking.id,
        confirmationNumber: booking.confirmationNumber,
      });

      const bookingDetails = await this.getBookingWithDetails(booking.id);

      return {
        booking: bookingDetails as any,
        confirmationNumber: booking.confirmationNumber,
      };
    } catch (error) {
      logger.error('Error creating booking', { error, request });
      throw error;
    }
  }

  /**
   * Get booking by ID with full details
   */
  async getBooking(id: string) {
    return this.getBookingWithDetails(id);
  }

  /**
   * Update booking
   */
  async updateBooking(id: string, request: UpdateBookingRequest) {
    try {
      logger.info('Updating booking', { bookingId: id });

      // Check if booking exists and can be modified
      const existingBooking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!existingBooking) {
        throw new NotFoundError('Booking', id);
      }

      // Check if booking can be modified
      if (!this.canModifyBooking(existingBooking.status)) {
        throw new ConflictError(
          `Cannot modify booking with status: ${existingBooking.status}`
        );
      }

      // Update booking
      const updatedBooking = await this.prisma.$transaction(async tx => {
        const booking = await tx.booking.update({
          where: { id },
          data: {
            // Note: Guest details updates would need to be handled differently
            // as the current schema stores them as separate fields
            ...(request.specialRequests !== undefined && {
              specialRequests: request.specialRequests,
            }),
            ...(request.preferences && {
              preferences: request.preferences as any,
            }),
          },
        });

        // Create history entry
        await tx.bookingHistory.create({
          data: {
            bookingId: id,
            action: 'modified',
            changedBy: existingBooking.guestId,
            changeType: 'modification',
            oldValue: {
              guestName: existingBooking.guestName,
              guestEmail: existingBooking.guestEmail,
              guestPhone: existingBooking.guestPhone,
            },
            newValue: request as any,
            description: 'Booking details updated',
          },
        });

        return booking;
      });

      logger.info('Booking updated successfully', { bookingId: id });

      return this.getBookingWithDetails(updatedBooking.id);
    } catch (error) {
      logger.error('Error updating booking', { error, bookingId: id });
      throw error;
    }
  }

  /**
   * Cancel booking with enhanced policy enforcement
   */
  async cancelBooking(
    id: string,
    cancellationRequest: CancellationRequest
  ): Promise<CancellationResult> {
    try {
      logger.info('Cancelling booking with policy enforcement', {
        bookingId: id,
        request: cancellationRequest,
      });

      const existingBooking = await this.prisma.booking.findUnique({
        where: { id },
        include: {
          property: {
            select: { id: true, name: true },
          },
        },
      });

      if (!existingBooking) {
        throw new NotFoundError('Booking', id);
      }

      // Validate cancellation eligibility
      const validation =
        await this.cancellationPolicyService.validateCancellation(id);

      if (!validation.canCancel) {
        throw new ConflictError(
          validation.reason || 'Booking cannot be cancelled'
        );
      }

      // Calculate refund based on policy
      const refundCalculation =
        await this.cancellationPolicyService.calculateRefund(id, {
          reason: 'User cancellation',
          requestedBy: 'user',
        });

      const result = await this.prisma.$transaction(async tx => {
        // Update booking status
        const cancelledBooking = await tx.booking.update({
          where: { id },
          data: {
            status: BookingStatus.CANCELLED,
            cancelledAt: new Date(),
            // Store refund details in metadata
            metadata: {
              ...((existingBooking.metadata as object) || {}),
              cancellation: {
                reason: cancellationRequest.reason,
                requestedBy: cancellationRequest.requestedBy,
                refundCalculation: JSON.parse(
                  JSON.stringify(refundCalculation)
                ),
                processedAt: new Date().toISOString(),
              },
            },
          },
        });

        // Create detailed history entry
        await tx.bookingHistory.create({
          data: {
            bookingId: id,
            action: 'cancelled',
            changedBy: cancellationRequest.requestedBy,
            changeType: 'cancellation',
            oldValue: {
              status: existingBooking.status,
              totalAmount: existingBooking.totalAmount,
            },
            newValue: {
              status: BookingStatus.CANCELLED,
              reason: cancellationRequest.reason,
              refundAmount: refundCalculation.refundableAmount,
            },
            description: `Booking cancelled: ${cancellationRequest.reason}. Refund: $${refundCalculation.refundableAmount}`,
          },
        });

        // Release inventory (TODO: integrate with inventory service)
        await this.releaseBookingInventory(tx, id);

        return {
          booking: cancelledBooking,
          refundAmount: refundCalculation.refundableAmount,
          refundStatus:
            refundCalculation.refundableAmount > 0
              ? 'pending'
              : 'not_applicable',
          cancellationFee: refundCalculation.cancellationFee,
          refundCalculation,
        };
      });

      // Process refund if applicable (integrate with payment service)
      if (result.refundAmount > 0) {
        await this.processRefund(result.booking, result.refundAmount);
      }

      // Send cancellation confirmation
      await this.sendCancellationConfirmation(
        result.booking,
        refundCalculation
      );

      logger.info('Booking cancelled successfully with policy enforcement', {
        bookingId: id,
        refundAmount: result.refundAmount,
      });

      return {
        booking: result.booking as any,
        refundAmount: result.refundAmount,
        refundStatus: result.refundStatus,
        cancellationFee: result.cancellationFee,
      };
    } catch (error) {
      logger.error('Error cancelling booking', { error, bookingId: id });
      throw error;
    }
  }

  /**
   * Modify booking with comprehensive validation
   */
  async modifyBooking(
    id: string,
    modificationRequest: BookingModificationRequest
  ): Promise<ModificationResult> {
    try {
      logger.info('Modifying booking', {
        bookingId: id,
        modification: modificationRequest,
      });

      return await this.modificationService.modifyBooking(
        id,
        modificationRequest
      );
    } catch (error) {
      logger.error('Error modifying booking', { error, bookingId: id });
      throw error;
    }
  }

  /**
   * Validate booking modification
   */
  async validateBookingModification(
    id: string,
    modificationRequest: BookingModificationRequest
  ) {
    return await this.modificationService.validateModification(
      id,
      modificationRequest
    );
  }

  /**
   * Get modification options for a booking
   */
  async getBookingModificationOptions(id: string) {
    return await this.modificationService.getModificationOptions(id);
  }

  /**
   * Get cancellation policy and refund calculation
   */
  async getCancellationInfo(id: string) {
    try {
      const validation =
        await this.cancellationPolicyService.validateCancellation(id);

      if (!validation.canCancel) {
        return {
          canCancel: false,
          reason: validation.reason,
        };
      }

      const refundCalculation =
        await this.cancellationPolicyService.calculateRefund(id, {
          reason: 'User cancellation',
          requestedBy: 'user',
        });

      return {
        canCancel: true,
        refundCalculation,
        policy: refundCalculation.policyApplied,
      };
    } catch (error) {
      logger.error('Error getting cancellation info', { error, bookingId: id });
      throw error;
    }
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(
    filters: BookingFilters,
    options: { page?: number; limit?: number } = {}
  ) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters.guestId) where.guestId = filters.guestId;
    if (filters.propertyId) where.propertyId = filters.propertyId;
    if (filters.status) where.status = filters.status;
    if (filters.checkInDateFrom) {
      where.checkInDate = { gte: filters.checkInDateFrom };
    }
    if (filters.checkOutDateTo) {
      where.checkOutDate = { lte: filters.checkOutDateTo };
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
              address: true,
            },
          },
          bookedRooms: {
            include: {
              roomType: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Confirm booking
   */
  async confirmBooking(id: string) {
    try {
      logger.info('Confirming booking', { bookingId: id });

      const existingBooking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!existingBooking) {
        throw new NotFoundError('Booking', id);
      }

      if (existingBooking.status !== 'pending') {
        throw new ConflictError(
          `Cannot confirm booking with status: ${existingBooking.status}`
        );
      }

      const confirmedBooking = await this.prisma.$transaction(async tx => {
        const booking = await tx.booking.update({
          where: { id },
          data: {
            status: 'confirmed',
            paymentStatus: 'paid', // Assuming payment is processed
          },
        });

        // Create history entry
        await tx.bookingHistory.create({
          data: {
            bookingId: id,
            action: 'confirmed',
            changedBy: existingBooking.guestId,
            changeType: 'status_change',
            oldValue: { status: 'pending' },
            newValue: { status: 'confirmed' },
            description: 'Booking confirmed and payment processed',
          },
        });

        return booking;
      });

      logger.info('Booking confirmed successfully', { bookingId: id });

      return this.getBookingWithDetails(confirmedBooking.id);
    } catch (error) {
      logger.error('Error confirming booking', { error, bookingId: id });
      throw error;
    }
  }

  /**
   * Validate booking request (public method)
   */
  async validateBookingRequest(request: Partial<CreateBookingRequest>) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate property exists
    if (request.propertyId) {
      const property = await this.prisma.property.findUnique({
        where: { id: request.propertyId },
      });
      if (!property) {
        errors.push('Property not found');
      } else if (property.status !== 'active') {
        errors.push('Property is not available for booking');
      }
    }

    // Validate dates
    if (request.checkInDate && request.checkOutDate) {
      const checkIn = new Date(request.checkInDate);
      const checkOut = new Date(request.checkOutDate);
      const now = new Date();

      if (checkIn <= now) {
        errors.push('Check-in date must be in the future');
      }
      if (checkOut <= checkIn) {
        errors.push('Check-out date must be after check-in date');
      }
      if (checkIn > new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) {
        warnings.push('Check-in date is more than a year in advance');
      }
    }

    // Validate room availability (simplified)
    // TODO: Implement proper availability checking

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Add special requests to booking
   */
  async addSpecialRequests(bookingId: string, requests: string[]) {
    const existingBooking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      throw new NotFoundError('Booking', bookingId);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        specialRequests: requests.join('; '),
      },
    });

    return this.getBookingWithDetails(updatedBooking.id);
  }

  /**
   * Process booking confirmation workflow
   */
  async processBookingConfirmation(bookingId: string): Promise<BookingResult> {
    try {
      logger.info('Processing booking confirmation', { bookingId });

      const booking = await this.getBookingWithDetails(bookingId);

      if (booking.status !== BookingStatus.PENDING) {
        throw new ConflictError(
          `Cannot confirm booking with status: ${booking.status}`
        );
      }

      // Simulate payment processing (in real implementation, integrate with payment service)
      const paymentResult = await this.processPayment(booking);

      // Update booking status
      const confirmedBooking = await this.prisma.$transaction(async tx => {
        const updated = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.CONFIRMED,
            paymentStatus: paymentResult.success
              ? PaymentStatus.PAID
              : PaymentStatus.FAILED,
          },
        });

        // Create history entry
        await tx.bookingHistory.create({
          data: {
            bookingId,
            action: 'confirmed',
            changedBy: booking.guestId,
            changeType: 'status_change',
            oldValue: { status: BookingStatus.PENDING },
            newValue: { status: BookingStatus.CONFIRMED },
            description: 'Booking confirmed and payment processed',
          },
        });

        return updated;
      });

      // Send confirmation notification (integrate with notification service)
      await this.sendBookingConfirmation(confirmedBooking);

      logger.info('Booking confirmation processed successfully', { bookingId });

      return {
        booking: (await this.getBookingWithDetails(bookingId)) as any,
        confirmationNumber: confirmedBooking.confirmationNumber,
        paymentResult,
      };
    } catch (error) {
      logger.error('Error processing booking confirmation', {
        error,
        bookingId,
      });
      throw error;
    }
  }

  /**
   * Handle booking status transitions
   */
  async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    changedBy: string
  ): Promise<void> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundError('Booking', bookingId);
    }

    // Validate status transition
    if (
      !this.isValidStatusTransition(booking.status as BookingStatus, newStatus)
    ) {
      throw new ConflictError(
        `Invalid status transition from ${booking.status} to ${newStatus}`
      );
    }

    await this.prisma.$transaction(async tx => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: newStatus },
      });

      await tx.bookingHistory.create({
        data: {
          bookingId,
          action: 'status_changed',
          changedBy,
          changeType: 'status_change',
          oldValue: { status: booking.status },
          newValue: { status: newStatus },
          description: `Status changed from ${booking.status} to ${newStatus}`,
        },
      });
    });

    logger.info('Booking status updated', {
      bookingId,
      oldStatus: booking.status,
      newStatus,
    });
  }

  // Private helper methods

  private async validateBookingBusinessRules(
    request: CreateBookingRequest
  ): Promise<void> {
    // Validate dates
    const now = new Date();
    const checkIn = new Date(request.checkInDate);
    const checkOut = new Date(request.checkOutDate);

    if (checkIn <= now) {
      throw new ValidationError('Check-in date must be in the future');
    }

    if (checkOut <= checkIn) {
      throw new ValidationError('Check-out date must be after check-in date');
    }

    // Validate maximum advance booking (e.g., 2 years)
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 2);

    if (checkIn > maxAdvanceDate) {
      throw new ValidationError(
        'Check-in date cannot be more than 2 years in advance'
      );
    }

    // Validate minimum stay (if required)
    const nights = this.calculateNights(checkIn, checkOut);
    if (nights < 1) {
      throw new ValidationError('Minimum stay is 1 night');
    }

    // Validate guest counts
    for (const room of request.rooms) {
      if (room.guests.length !== room.guestCount) {
        throw new ValidationError(
          `Guest count mismatch for room type ${room.roomTypeId}`
        );
      }
    }
  }

  private async validateAvailability(
    request: CreateBookingRequest
  ): Promise<void> {
    // Check if property exists and is active
    const property = await this.prisma.property.findUnique({
      where: { id: request.propertyId },
    });

    if (!property) {
      throw new NotFoundError('Property', request.propertyId);
    }

    if (property.status !== 'active') {
      throw new ValidationError('Property is not available for booking');
    }

    // Validate room types and availability
    for (const room of request.rooms) {
      const roomType = await this.prisma.roomType.findUnique({
        where: { id: room.roomTypeId },
      });

      if (!roomType) {
        throw new NotFoundError('Room type', room.roomTypeId);
      }

      if (roomType.propertyId !== request.propertyId) {
        throw new ValidationError(
          `Room type ${room.roomTypeId} does not belong to property ${request.propertyId}`
        );
      }

      if (!roomType.isActive) {
        throw new ValidationError(
          `Room type ${roomType.name} is not available`
        );
      }

      // Check room capacity
      if (room.guestCount > roomType.maxOccupancy) {
        throw new ValidationError(
          `Guest count exceeds maximum occupancy for room type ${roomType.name}`
        );
      }

      // TODO: Check actual availability in inventory
      // This would integrate with the availability service
    }
  }

  private async calculateRoomTotal(room: any, nights: number) {
    // Get room type for base rate
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: room.roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundError('Room type', room.roomTypeId);
    }

    const ratePerNight = roomType.baseRate;
    const subtotal = ratePerNight * room.quantity * nights;
    const taxAmount = subtotal * 0.1; // 10% tax (simplified)
    const totalPrice = subtotal + taxAmount;

    return {
      ratePerNight,
      subtotal,
      taxAmount,
      totalPrice,
    };
  }

  private async processPayment(
    booking: any
  ): Promise<{ success: boolean; transactionId?: string }> {
    // Simulate payment processing
    // In real implementation, integrate with payment service
    logger.info('Processing payment for booking', {
      bookingId: booking.id,
      amount: booking.totalAmount,
    });

    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate

    return {
      success,
      transactionId: success ? `txn_${Date.now()}` : undefined,
    };
  }

  private async sendBookingConfirmation(booking: any): Promise<void> {
    // Integrate with notification service to send confirmation
    logger.info('Sending booking confirmation', {
      bookingId: booking.id,
      guestEmail: booking.guestEmail,
      confirmationNumber: booking.confirmationNumber,
    });

    try {
      const { HotelNotificationService } = await import(
        './notification.service'
      );
      const notificationService = new HotelNotificationService(this.prisma);
      await notificationService.sendBookingConfirmation(booking.id);
    } catch (error) {
      logger.error('Failed to send booking confirmation notification', {
        error,
        bookingId: booking.id,
      });
      // Don't throw error as booking creation should still succeed
    }
  }

  private isValidStatusTransition(
    currentStatus: BookingStatus,
    newStatus: BookingStatus
  ): boolean {
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
        BookingStatus.EXPIRED,
      ],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.CHECKED_IN,
        BookingStatus.CANCELLED,
        BookingStatus.NO_SHOW,
      ],
      [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
      [BookingStatus.CHECKED_OUT]: [], // Terminal state
      [BookingStatus.CANCELLED]: [], // Terminal state
      [BookingStatus.NO_SHOW]: [], // Terminal state
      [BookingStatus.MODIFIED]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.EXPIRED]: [], // Terminal state
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  private async getBookingWithDetails(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            images: true,
            // checkInTime: true, // Field doesn't exist in schema
            checkOutTime: true,
            phone: true,
            email: true,
          },
        },
        bookedRooms: {
          include: {
            roomType: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                maxOccupancy: true,
                maxAdults: true,
                maxChildren: true,
                amenities: true,
                images: true,
              },
            },
          },
        },
        // guestProfile: { // Relation doesn't exist
        //   select: {
        //     id: true,
        //     firstName: true,
        //     lastName: true,
        //     email: true,
        //     phone: true,
        //   },
        // },
        bookingHistory: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });

    if (!booking) {
      throw new NotFoundError('Booking', id);
    }

    return booking;
  }

  private async validateCreateBookingRequest(request: CreateBookingRequest) {
    // Validate property exists and is active
    const property = await this.prisma.property.findUnique({
      where: { id: request.propertyId },
    });

    if (!property) {
      throw new NotFoundError('Property', request.propertyId);
    }

    if (property.status !== 'active') {
      throw new ValidationError('Property is not available for booking');
    }

    // Validate dates
    const checkIn = new Date(request.checkInDate);
    const checkOut = new Date(request.checkOutDate);
    const now = new Date();

    if (checkIn <= now) {
      throw new ValidationError('Check-in date must be in the future');
    }

    if (checkOut <= checkIn) {
      throw new ValidationError('Check-out date must be after check-in date');
    }

    // Validate room types exist
    for (const room of request.rooms) {
      const roomType = await this.prisma.roomType.findUnique({
        where: { id: room.roomTypeId },
      });

      if (!roomType) {
        throw new NotFoundError('Room type', room.roomTypeId);
      }

      if (roomType.propertyId !== request.propertyId) {
        throw new ValidationError(
          `Room type ${room.roomTypeId} does not belong to property ${request.propertyId}`
        );
      }

      if (!roomType.isActive) {
        throw new ValidationError(
          `Room type ${roomType.name} is not available`
        );
      }
    }
  }

  private async calculateBookingPricing(request: CreateBookingRequest) {
    // Simplified pricing calculation
    // TODO: Implement proper pricing with taxes, discounts, etc.

    let subtotal = 0;
    const nights = this.calculateNights(
      request.checkInDate,
      request.checkOutDate
    );

    for (const room of request.rooms) {
      const roomType = await this.prisma.roomType.findUnique({
        where: { id: room.roomTypeId },
      });
      const ratePerNight = roomType?.baseRate || 100;
      subtotal += ratePerNight * room.quantity * nights;
    }

    const taxAmount = subtotal * 0.1; // 10% tax (simplified)
    const discountAmount = 0; // TODO: Apply promotions
    const totalAmount = subtotal + taxAmount - discountAmount;

    return {
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      currency: 'USD', // TODO: Get from property
      breakdown: {
        roomCharges: subtotal,
        taxes: taxAmount,
        discounts: discountAmount,
        total: totalAmount,
      },
    };
  }

  private calculateNights(checkIn: Date, checkOut: Date): number {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private generateConfirmationNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `BK${timestamp}${random}`.toUpperCase();
  }

  private canModifyBooking(status: string): boolean {
    return ['pending', 'confirmed'].includes(status);
  }

  private canCancelBooking(status: string): boolean {
    return ['pending', 'confirmed'].includes(status);
  }

  private async releaseBookingInventory(
    tx: any,
    bookingId: string
  ): Promise<void> {
    // TODO: Integrate with inventory service to release reserved rooms
    logger.info('Releasing inventory for cancelled booking', { bookingId });

    // This would typically:
    // 1. Find all booked rooms for this booking
    // 2. Update inventory records to make rooms available again
    // 3. Remove any inventory locks or reservations
  }

  private async processRefund(
    booking: any,
    refundAmount: number
  ): Promise<void> {
    try {
      // TODO: Integrate with payment service for actual refund processing
      logger.info('Processing refund', {
        bookingId: booking.id,
        refundAmount,
        originalAmount: booking.totalAmount,
      });

      // This would typically:
      // 1. Call payment service to process refund
      // 2. Update booking with refund transaction details
      // 3. Send refund confirmation to guest
    } catch (error) {
      logger.error('Error processing refund', { error, bookingId: booking.id });
      // Don't throw error here as cancellation should still succeed
    }
  }

  private async sendCancellationConfirmation(
    booking: any,
    refundCalculation: any
  ): Promise<void> {
    try {
      logger.info('Sending cancellation confirmation', {
        bookingId: booking.id,
        guestEmail: booking.guestEmail,
        refundAmount: refundCalculation.refundableAmount,
      });

      const { HotelNotificationService } = await import(
        './notification.service'
      );
      const notificationService = new HotelNotificationService(this.prisma);
      await notificationService.sendBookingUpdate(
        booking.id,
        'cancellation',
        { reason: 'Booking cancelled' },
        refundCalculation.refundableAmount
      );
    } catch (error) {
      logger.error('Error sending cancellation confirmation', { error });
      // Don't throw error as cancellation should still succeed
    }
  }
}
