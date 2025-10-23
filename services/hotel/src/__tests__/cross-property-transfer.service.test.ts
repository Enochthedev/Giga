/**
 * Cross-Property Transfer Service Unit Tests
 */

import { PrismaClient } from '@/generated/prisma-client';
import { CrossPropertyTransferService } from '@/services/cross-property-transfer.service';
import {
  ConflictError,
  TransferStatus,
  TransferType,
  ValidationError,
} from '@/types';

// Mock Prisma Client
jest.mock('@/generated/prisma-client');
const mockPrisma = {
  crossPropertyTransfer: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
  property: {
    findUnique: jest.fn(),
  },
  booking: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  guestProfile: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  bookingHistory: {
    create: jest.fn(),
  },
  inventoryRecord: {
    updateMany: jest.fn(),
  },
} as unknown as PrismaClient;

describe('CrossPropertyTransferService', () => {
  let transferService: CrossPropertyTransferService;

  beforeEach(() => {
    transferService = new CrossPropertyTransferService(mockPrisma);
    jest.clearAllMocks();
  });

  describe('createTransfer', () => {
    const validTransferRequest = {
      fromPropertyId: 'property-1',
      toPropertyId: 'property-2',
      transferType: TransferType.BOOKING,
      entityId: 'booking-1',
      entityType: 'booking',
      reason: 'Guest requested property change',
      transferData: {
        originalData: { bookingId: 'booking-1' },
        transferredData: { newPropertyId: 'property-2' },
      },
    };

    const mockFromProperty = {
      id: 'property-1',
      status: 'active',
    };

    const mockToProperty = {
      id: 'property-2',
      status: 'active',
    };

    const mockBooking = {
      id: 'booking-1',
      propertyId: 'property-1',
    };

    it('should create transfer successfully', async () => {
      const mockTransfer = {
        id: 'transfer-1',
        ...validTransferRequest,
        status: TransferStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.property.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockFromProperty)
        .mockResolvedValueOnce(mockToProperty);
      (mockPrisma.booking.findUnique as jest.Mock).mockResolvedValue(
        mockBooking
      );
      (mockPrisma.crossPropertyTransfer.create as jest.Mock).mockResolvedValue(
        mockTransfer
      );

      const result = await transferService.createTransfer(validTransferRequest);

      expect(result).toEqual(mockTransfer);
      expect(mockPrisma.crossPropertyTransfer.create).toHaveBeenCalledWith({
        data: {
          fromPropertyId: validTransferRequest.fromPropertyId,
          toPropertyId: validTransferRequest.toPropertyId,
          transferType: validTransferRequest.transferType,
          entityId: validTransferRequest.entityId,
          entityType: validTransferRequest.entityType,
          reason: validTransferRequest.reason,
          notes: undefined,
          transferData: validTransferRequest.transferData,
          status: TransferStatus.PENDING,
        },
      });
    });

    it('should throw ValidationError for same source and destination', async () => {
      const invalidRequest = {
        ...validTransferRequest,
        toPropertyId: 'property-1', // Same as fromPropertyId
      };

      await expect(
        transferService.createTransfer(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for missing reason', async () => {
      const invalidRequest = {
        ...validTransferRequest,
        reason: '',
      };

      await expect(
        transferService.createTransfer(invalidRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for non-existent source property', async () => {
      (mockPrisma.property.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockToProperty);

      await expect(
        transferService.createTransfer(validTransferRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for inactive property', async () => {
      const inactiveProperty = { ...mockFromProperty, status: 'inactive' };

      (mockPrisma.property.findUnique as jest.Mock)
        .mockResolvedValueOnce(inactiveProperty)
        .mockResolvedValueOnce(mockToProperty);

      await expect(
        transferService.createTransfer(validTransferRequest)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for non-existent booking', async () => {
      (mockPrisma.property.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockFromProperty)
        .mockResolvedValueOnce(mockToProperty);
      (mockPrisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        transferService.createTransfer(validTransferRequest)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('approveTransfer', () => {
    const mockTransfer = {
      id: 'transfer-1',
      status: TransferStatus.PENDING,
    };

    it('should approve transfer successfully', async () => {
      const approvedTransfer = {
        ...mockTransfer,
        status: TransferStatus.APPROVED,
        approvedBy: 'user-1',
        approvedAt: new Date(),
      };

      (
        mockPrisma.crossPropertyTransfer.findUnique as jest.Mock
      ).mockResolvedValue(mockTransfer);
      (mockPrisma.crossPropertyTransfer.update as jest.Mock).mockResolvedValue(
        approvedTransfer
      );

      const result = await transferService.approveTransfer(
        'transfer-1',
        'user-1'
      );

      expect(result).toEqual(approvedTransfer);
      expect(mockPrisma.crossPropertyTransfer.update).toHaveBeenCalledWith({
        where: { id: 'transfer-1' },
        data: {
          status: TransferStatus.APPROVED,
          approvedBy: 'user-1',
          approvedAt: expect.any(Date),
        },
      });
    });

    it('should throw ConflictError for non-pending transfer', async () => {
      const approvedTransfer = {
        ...mockTransfer,
        status: TransferStatus.APPROVED,
      };

      (
        mockPrisma.crossPropertyTransfer.findUnique as jest.Mock
      ).mockResolvedValue(approvedTransfer);

      await expect(
        transferService.approveTransfer('transfer-1', 'user-1')
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('completeTransfer', () => {
    const mockTransfer = {
      id: 'transfer-1',
      fromPropertyId: 'property-1',
      toPropertyId: 'property-2',
      transferType: TransferType.BOOKING,
      entityId: 'booking-1',
      status: TransferStatus.APPROVED,
      approvedBy: 'user-1',
    };

    it('should complete booking transfer successfully', async () => {
      const completedTransfer = {
        ...mockTransfer,
        status: TransferStatus.COMPLETED,
        completedAt: new Date(),
      };

      (
        mockPrisma.crossPropertyTransfer.findUnique as jest.Mock
      ).mockResolvedValue(mockTransfer);
      (mockPrisma.booking.update as jest.Mock).mockResolvedValue({});
      (mockPrisma.bookingHistory.create as jest.Mock).mockResolvedValue({});
      (mockPrisma.crossPropertyTransfer.update as jest.Mock).mockResolvedValue(
        completedTransfer
      );

      const result = await transferService.completeTransfer('transfer-1');

      expect(result).toEqual(completedTransfer);
      expect(mockPrisma.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: { propertyId: 'property-2' },
      });
      expect(mockPrisma.bookingHistory.create).toHaveBeenCalled();
    });

    it('should throw ConflictError for non-approved transfer', async () => {
      const pendingTransfer = {
        ...mockTransfer,
        status: TransferStatus.PENDING,
      };

      (
        mockPrisma.crossPropertyTransfer.findUnique as jest.Mock
      ).mockResolvedValue(pendingTransfer);

      await expect(
        transferService.completeTransfer('transfer-1')
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('cancelTransfer', () => {
    const mockTransfer = {
      id: 'transfer-1',
      status: TransferStatus.PENDING,
      notes: 'Original notes',
    };

    it('should cancel transfer successfully', async () => {
      const cancelledTransfer = {
        ...mockTransfer,
        status: TransferStatus.CANCELLED,
        notes: 'Original notes\nCancellation reason: No longer needed',
      };

      (
        mockPrisma.crossPropertyTransfer.findUnique as jest.Mock
      ).mockResolvedValue(mockTransfer);
      (mockPrisma.crossPropertyTransfer.update as jest.Mock).mockResolvedValue(
        cancelledTransfer
      );

      const result = await transferService.cancelTransfer(
        'transfer-1',
        'No longer needed'
      );

      expect(result).toEqual(cancelledTransfer);
      expect(mockPrisma.crossPropertyTransfer.update).toHaveBeenCalledWith({
        where: { id: 'transfer-1' },
        data: {
          status: TransferStatus.CANCELLED,
          notes: 'Original notes\nCancellation reason: No longer needed',
        },
      });
    });

    it('should throw ConflictError for completed transfer', async () => {
      const completedTransfer = {
        ...mockTransfer,
        status: TransferStatus.COMPLETED,
      };

      (
        mockPrisma.crossPropertyTransfer.findUnique as jest.Mock
      ).mockResolvedValue(completedTransfer);

      await expect(
        transferService.cancelTransfer('transfer-1', 'Reason')
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('getTransfersForProperty', () => {
    const mockTransfers = [
      {
        id: 'transfer-1',
        fromPropertyId: 'property-1',
        toPropertyId: 'property-2',
        status: TransferStatus.PENDING,
      },
      {
        id: 'transfer-2',
        fromPropertyId: 'property-2',
        toPropertyId: 'property-1',
        status: TransferStatus.APPROVED,
      },
    ];

    it('should return transfers for property', async () => {
      (
        mockPrisma.crossPropertyTransfer.findMany as jest.Mock
      ).mockResolvedValue(mockTransfers);
      (mockPrisma.crossPropertyTransfer.count as jest.Mock).mockResolvedValue(
        2
      );

      const result =
        await transferService.getTransfersForProperty('property-1');

      expect(result.transfers).toEqual(mockTransfers);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        pages: 1,
      });
    });

    it('should filter by direction', async () => {
      (
        mockPrisma.crossPropertyTransfer.findMany as jest.Mock
      ).mockResolvedValue([mockTransfers[0]]);
      (mockPrisma.crossPropertyTransfer.count as jest.Mock).mockResolvedValue(
        1
      );

      await transferService.getTransfersForProperty('property-1', {
        direction: 'outgoing',
      });

      expect(mockPrisma.crossPropertyTransfer.findMany).toHaveBeenCalledWith({
        where: { fromPropertyId: 'property-1' },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });
  });
});
