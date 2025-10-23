/**
 * Cross-Property Transfer Service - Handles transfers between properties
 */

import { PrismaClient } from '@/generated/prisma-client';
import {
  CreateTransferRequest,
  CrossPropertyTransfer,
  TransferStatus,
  TransferType,
} from '@/types';
import logger from '@/utils/logger';

// Error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class CrossPropertyTransferService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new cross-property transfer request
   */
  async createTransfer(
    request: CreateTransferRequest
  ): Promise<CrossPropertyTransfer> {
    try {
      logger.info('Creating cross-property transfer', {
        fromPropertyId: request.fromPropertyId,
        toPropertyId: request.toPropertyId,
        transferType: request.transferType,
      });

      // Validate transfer request
      await this.validateTransferRequest(request);

      const transfer = await this.prisma.crossPropertyTransfer.create({
        data: {
          fromPropertyId: request.fromPropertyId,
          toPropertyId: request.toPropertyId,
          transferType: request.transferType,
          entityId: request.entityId,
          entityType: request.entityType,
          reason: request.reason,
          notes: request.notes,
          transferData: request.transferData as any,
          status: TransferStatus.PENDING,
        },
      });

      logger.info('Cross-property transfer created successfully', {
        transferId: transfer.id,
      });

      return transfer as unknown as CrossPropertyTransfer;
    } catch (error) {
      logger.error('Error creating cross-property transfer', {
        error,
        request,
      });
      throw error;
    }
  }

  /**
   * Get transfer by ID
   */
  async getTransfer(id: string): Promise<CrossPropertyTransfer> {
    const transfer = await this.prisma.crossPropertyTransfer.findUnique({
      where: { id },
    });

    if (!transfer) {
      throw new NotFoundError('Transfer', id);
    }

    return transfer as unknown as CrossPropertyTransfer;
  }

  /**
   * Get transfers for a property
   */
  async getTransfersForProperty(
    propertyId: string,
    options: {
      direction?: 'incoming' | 'outgoing' | 'both';
      status?: TransferStatus;
      transferType?: TransferType;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const {
      direction = 'both',
      status,
      transferType,
      page = 1,
      limit = 20,
    } = options;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (direction === 'incoming') {
      where.toPropertyId = propertyId;
    } else if (direction === 'outgoing') {
      where.fromPropertyId = propertyId;
    } else {
      where.OR = [{ fromPropertyId: propertyId }, { toPropertyId: propertyId }];
    }

    if (status) {
      where.status = status;
    }

    if (transferType) {
      where.transferType = transferType;
    }

    const [transfers, total] = await Promise.all([
      this.prisma.crossPropertyTransfer.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.crossPropertyTransfer.count({ where }),
    ]);

    return {
      transfers: transfers as unknown as CrossPropertyTransfer[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } /*
   *
   * Approve a transfer request
   */
  async approveTransfer(
    id: string,
    approvedBy: string
  ): Promise<CrossPropertyTransfer> {
    try {
      logger.info('Approving transfer', { transferId: id, approvedBy });

      const transfer = await this.getTransfer(id);

      if (transfer.status !== TransferStatus.PENDING) {
        throw new ConflictError('Transfer is not in pending status');
      }

      const updatedTransfer = await this.prisma.crossPropertyTransfer.update({
        where: { id },
        data: {
          status: TransferStatus.APPROVED,
          approvedBy,
          approvedAt: new Date(),
        },
      });

      logger.info('Transfer approved successfully', { transferId: id });

      return updatedTransfer as unknown as CrossPropertyTransfer;
    } catch (error) {
      logger.error('Error approving transfer', { error, transferId: id });
      throw error;
    }
  }

  /**
   * Complete a transfer (execute the actual transfer)
   */
  async completeTransfer(id: string): Promise<CrossPropertyTransfer> {
    try {
      logger.info('Completing transfer', { transferId: id });

      const transfer = await this.getTransfer(id);

      if (transfer.status !== TransferStatus.APPROVED) {
        throw new ConflictError('Transfer must be approved before completion');
      }

      // Execute the transfer based on type
      await this.executeTransfer(transfer);

      const updatedTransfer = await this.prisma.crossPropertyTransfer.update({
        where: { id },
        data: {
          status: TransferStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      logger.info('Transfer completed successfully', { transferId: id });

      return updatedTransfer as unknown as CrossPropertyTransfer;
    } catch (error) {
      logger.error('Error completing transfer', { error, transferId: id });
      throw error;
    }
  }

  /**
   * Cancel a transfer request
   */
  async cancelTransfer(
    id: string,
    reason?: string
  ): Promise<CrossPropertyTransfer> {
    try {
      logger.info('Cancelling transfer', { transferId: id });

      const transfer = await this.getTransfer(id);

      if (transfer.status === TransferStatus.COMPLETED) {
        throw new ConflictError('Cannot cancel completed transfer');
      }

      const updatedTransfer = await this.prisma.crossPropertyTransfer.update({
        where: { id },
        data: {
          status: TransferStatus.CANCELLED,
          notes: reason
            ? `${transfer.notes || ''}\nCancellation reason: ${reason}`
            : transfer.notes,
        },
      });

      logger.info('Transfer cancelled successfully', { transferId: id });

      return updatedTransfer as unknown as CrossPropertyTransfer;
    } catch (error) {
      logger.error('Error cancelling transfer', { error, transferId: id });
      throw error;
    }
  }

  /**
   * Execute the actual transfer based on type
   */
  private async executeTransfer(
    transfer: CrossPropertyTransfer
  ): Promise<void> {
    switch (transfer.transferType) {
      case TransferType.BOOKING:
        await this.executeBookingTransfer(transfer);
        break;
      case TransferType.INVENTORY:
        await this.executeInventoryTransfer(transfer);
        break;
      case TransferType.GUEST:
        await this.executeGuestTransfer(transfer);
        break;
      default:
        throw new ValidationError(
          `Unsupported transfer type: ${transfer.transferType}`
        );
    }
  }

  /**
   * Execute booking transfer
   */
  private async executeBookingTransfer(
    transfer: CrossPropertyTransfer
  ): Promise<void> {
    // Update booking property
    await this.prisma.booking.update({
      where: { id: transfer.entityId },
      data: {
        propertyId: transfer.toPropertyId,
      },
    });

    // Log the transfer in booking history
    await this.prisma.bookingHistory.create({
      data: {
        bookingId: transfer.entityId,
        action: 'property_transfer',
        changedBy: transfer.approvedBy || 'system',
        changeType: 'property_change',
        oldValue: { propertyId: transfer.fromPropertyId },
        newValue: { propertyId: transfer.toPropertyId },
        description: `Booking transferred from property ${transfer.fromPropertyId} to ${transfer.toPropertyId}. Reason: ${transfer.reason}`,
      },
    });
  }

  /**
   * Execute inventory transfer
   */
  private async executeInventoryTransfer(
    transfer: CrossPropertyTransfer
  ): Promise<void> {
    const transferData = transfer.transferData as any;
    const { roomTypeId, date, quantity } = transferData.originalData;

    // Reduce inventory from source property
    await this.prisma.inventoryRecord.updateMany({
      where: {
        propertyId: transfer.fromPropertyId,
        roomTypeId,
        date,
      },
      data: {
        availableRooms: {
          decrement: quantity,
        },
      },
    });

    // Increase inventory at destination property
    await this.prisma.inventoryRecord.updateMany({
      where: {
        propertyId: transfer.toPropertyId,
        roomTypeId,
        date,
      },
      data: {
        availableRooms: {
          increment: quantity,
        },
      },
    });
  }

  /**
   * Execute guest transfer
   */
  private async executeGuestTransfer(
    transfer: CrossPropertyTransfer
  ): Promise<void> {
    // Update guest profile with new preferred property
    const transferData = transfer.transferData as any;
    const guestId = transfer.entityId;

    await this.prisma.guestProfile.update({
      where: { guestId },
      data: {
        preferences: {
          ...transferData.originalData.preferences,
          preferredProperty: transfer.toPropertyId,
        },
      },
    });
  }

  /**
   * Validate transfer request
   */
  private async validateTransferRequest(
    request: CreateTransferRequest
  ): Promise<void> {
    if (!request.fromPropertyId) {
      throw new ValidationError('Source property ID is required');
    }

    if (!request.toPropertyId) {
      throw new ValidationError('Destination property ID is required');
    }

    if (request.fromPropertyId === request.toPropertyId) {
      throw new ValidationError(
        'Source and destination properties cannot be the same'
      );
    }

    if (!request.transferType) {
      throw new ValidationError('Transfer type is required');
    }

    if (!request.entityId) {
      throw new ValidationError('Entity ID is required');
    }

    if (!request.reason || request.reason.trim().length === 0) {
      throw new ValidationError('Transfer reason is required');
    }

    // Verify properties exist and are active
    const [fromProperty, toProperty] = await Promise.all([
      this.prisma.property.findUnique({
        where: { id: request.fromPropertyId },
      }),
      this.prisma.property.findUnique({
        where: { id: request.toPropertyId },
      }),
    ]);

    if (!fromProperty) {
      throw new ValidationError('Source property not found');
    }

    if (!toProperty) {
      throw new ValidationError('Destination property not found');
    }

    if (fromProperty.status !== 'active') {
      throw new ValidationError('Source property is not active');
    }

    if (toProperty.status !== 'active') {
      throw new ValidationError('Destination property is not active');
    }

    // Verify entity exists based on transfer type
    await this.validateEntityExists(request.transferType, request.entityId);
  }

  /**
   * Validate that the entity exists for the transfer type
   */
  private async validateEntityExists(
    transferType: TransferType,
    entityId: string
  ): Promise<void> {
    switch (transferType) {
      case TransferType.BOOKING:
        const booking = await this.prisma.booking.findUnique({
          where: { id: entityId },
        });
        if (!booking) {
          throw new ValidationError('Booking not found');
        }
        break;

      case TransferType.GUEST:
        const guest = await this.prisma.guestProfile.findUnique({
          where: { guestId: entityId },
        });
        if (!guest) {
          throw new ValidationError('Guest profile not found');
        }
        break;

      case TransferType.INVENTORY:
        // For inventory transfers, entityId might be a composite key
        // Additional validation would be needed based on the specific implementation
        break;

      default:
        throw new ValidationError(`Unsupported transfer type: ${transferType}`);
    }
  }
}
