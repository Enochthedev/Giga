/**
 * Chain Service Unit Tests
 */

import { PrismaClient } from '@/generated/prisma-client';
import { ChainService } from '@/services/chain.service';
import { ConflictError, NotFoundError, ValidationError } from '@/types';

// Mock Prisma Client
jest.mock('@/generated/prisma-client');
const mockPrisma = {
  chain: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
} as unknown as PrismaClient;

describe('ChainService', () => {
  let chainService: ChainService;

  beforeEach(() => {
    chainService = new ChainService(mockPrisma);
    jest.clearAllMocks();
  });

  describe('createChain', () => {
    const validChainRequest = {
      name: 'Test Chain',
      code: 'TC',
      contactInfo: {
        email: 'test@testchain.com',
        phone: '+1234567890',
      },
      description: 'A test hotel chain',
    };

    it('should create a chain successfully', async () => {
      const mockChain = {
        id: 'chain-1',
        ...validChainRequest,
        code: 'TC',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { brands: 0, properties: 0 },
      };

      (mockPrisma.chain.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.chain.create as jest.Mock).mockResolvedValue(mockChain);

      const result = await chainService.createChain(validChainRequest);

      expect(result).toEqual(mockChain);
      expect(mockPrisma.chain.create).toHaveBeenCalledWith({
        data: {
          name: validChainRequest.name,
          description: validChainRequest.description,
          code: 'TC',
          contactInfo: validChainRequest.contactInfo,
          defaultCurrency: 'USD',
          defaultTimezone: 'UTC',
          chainPolicies: {},
        },
        include: {
          _count: {
            select: {
              brands: true,
              properties: true,
            },
          },
        },
      });
    });

    it('should throw ValidationError for missing name', async () => {
      const invalidRequest = { ...validChainRequest, name: '' };

      await expect(chainService.createChain(invalidRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError for missing code', async () => {
      const invalidRequest = { ...validChainRequest, code: '' };

      await expect(chainService.createChain(invalidRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError for invalid email', async () => {
      const invalidRequest = {
        ...validChainRequest,
        contactInfo: {
          ...validChainRequest.contactInfo,
          email: 'invalid-email',
        },
      };

      await expect(chainService.createChain(invalidRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ConflictError for duplicate code', async () => {
      const existingChain = { id: 'existing-chain', code: 'TC' };
      (mockPrisma.chain.findFirst as jest.Mock).mockResolvedValue(
        existingChain
      );

      await expect(chainService.createChain(validChainRequest)).rejects.toThrow(
        ConflictError
      );
    });
  });

  describe('getChain', () => {
    it('should return chain by ID', async () => {
      const mockChain = {
        id: 'chain-1',
        name: 'Test Chain',
        code: 'TC',
        brands: [],
        properties: [],
        _count: { brands: 0, properties: 0 },
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(mockChain);

      const result = await chainService.getChain('chain-1');

      expect(result).toEqual(mockChain);
      expect(mockPrisma.chain.findUnique).toHaveBeenCalledWith({
        where: { id: 'chain-1' },
        include: {
          brands: {
            where: { isActive: true },
            orderBy: { name: 'asc' },
          },
          properties: {
            where: { status: 'active' },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              brands: true,
              properties: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundError for non-existent chain', async () => {
      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(chainService.getChain('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('updateChain', () => {
    const updateRequest = {
      name: 'Updated Chain Name',
      description: 'Updated description',
    };

    it('should update chain successfully', async () => {
      const existingChain = {
        id: 'chain-1',
        name: 'Old Name',
        code: 'TC',
        contactInfo: { email: 'old@test.com' },
        chainPolicies: {},
      };

      const updatedChain = {
        ...existingChain,
        ...updateRequest,
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(
        existingChain
      );
      (mockPrisma.chain.update as jest.Mock).mockResolvedValue(updatedChain);

      const result = await chainService.updateChain('chain-1', updateRequest);

      expect(result).toEqual(updatedChain);
      expect(mockPrisma.chain.update).toHaveBeenCalledWith({
        where: { id: 'chain-1' },
        data: updateRequest,
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundError for non-existent chain', async () => {
      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        chainService.updateChain('non-existent', updateRequest)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteChain', () => {
    it('should delete chain successfully', async () => {
      const existingChain = {
        id: 'chain-1',
        _count: { brands: 0, properties: 0 },
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(
        existingChain
      );
      (mockPrisma.chain.update as jest.Mock).mockResolvedValue({});

      await chainService.deleteChain('chain-1');

      expect(mockPrisma.chain.update).toHaveBeenCalledWith({
        where: { id: 'chain-1' },
        data: { isActive: false },
      });
    });

    it('should throw ConflictError for chain with active brands', async () => {
      const existingChain = {
        id: 'chain-1',
        _count: { brands: 1, properties: 0 },
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(
        existingChain
      );

      await expect(chainService.deleteChain('chain-1')).rejects.toThrow(
        ConflictError
      );
    });

    it('should throw NotFoundError for non-existent chain', async () => {
      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(chainService.deleteChain('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
