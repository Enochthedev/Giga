/**
 * Brand Service Unit Tests
 */

import { PrismaClient } from '@/generated/prisma-client';
import { BrandService } from '@/services/brand.service';
import { ConflictError, NotFoundError, ValidationError } from '@/types';

// Mock Prisma Client
jest.mock('@/generated/prisma-client');
const mockPrisma = {
  brand: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  chain: {
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

describe('BrandService', () => {
  let brandService: BrandService;

  beforeEach(() => {
    brandService = new BrandService(mockPrisma);
    jest.clearAllMocks();
  });

  describe('createBrand', () => {
    const validBrandRequest = {
      chainId: 'chain-1',
      name: 'Test Brand',
      code: 'TB',
      description: 'A test hotel brand',
    };

    it('should create a brand successfully', async () => {
      const mockChain = {
        id: 'chain-1',
        isActive: true,
      };

      const mockBrand = {
        id: 'brand-1',
        ...validBrandRequest,
        code: 'TB',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        chain: mockChain,
        _count: { properties: 0 },
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(mockChain);
      (mockPrisma.brand.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.brand.create as jest.Mock).mockResolvedValue(mockBrand);

      const result = await brandService.createBrand(validBrandRequest);

      expect(result).toEqual(mockBrand);
      expect(mockPrisma.brand.create).toHaveBeenCalledWith({
        data: {
          chainId: validBrandRequest.chainId,
          name: validBrandRequest.name,
          description: validBrandRequest.description,
          code: 'TB',
          brandStandards: {},
          amenityRequirements: [],
          logo: undefined,
          colorScheme: undefined,
        },
        include: {
          chain: true,
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });
    });

    it('should throw ValidationError for missing name', async () => {
      const invalidRequest = { ...validBrandRequest, name: '' };

      await expect(brandService.createBrand(invalidRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError for missing code', async () => {
      const invalidRequest = { ...validBrandRequest, code: '' };

      await expect(brandService.createBrand(invalidRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError for invalid chain ID', async () => {
      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(brandService.createBrand(validBrandRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError for inactive chain', async () => {
      const inactiveChain = {
        id: 'chain-1',
        isActive: false,
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(
        inactiveChain
      );

      await expect(brandService.createBrand(validBrandRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ConflictError for duplicate code within chain', async () => {
      const mockChain = { id: 'chain-1', isActive: true };
      const existingBrand = {
        id: 'existing-brand',
        code: 'TB',
        chainId: 'chain-1',
      };

      (mockPrisma.chain.findUnique as jest.Mock).mockResolvedValue(mockChain);
      (mockPrisma.brand.findFirst as jest.Mock).mockResolvedValue(
        existingBrand
      );

      await expect(brandService.createBrand(validBrandRequest)).rejects.toThrow(
        ConflictError
      );
    });
  });

  describe('getBrand', () => {
    it('should return brand by ID', async () => {
      const mockBrand = {
        id: 'brand-1',
        name: 'Test Brand',
        code: 'TB',
        chain: { id: 'chain-1', name: 'Test Chain' },
        properties: [],
        _count: { properties: 0 },
      };

      (mockPrisma.brand.findUnique as jest.Mock).mockResolvedValue(mockBrand);

      const result = await brandService.getBrand('brand-1');

      expect(result).toEqual(mockBrand);
      expect(mockPrisma.brand.findUnique).toHaveBeenCalledWith({
        where: { id: 'brand-1' },
        include: {
          chain: true,
          properties: {
            where: { status: 'active' },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              properties: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundError for non-existent brand', async () => {
      (mockPrisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(brandService.getBrand('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('getBrandsByChain', () => {
    it('should return brands for a chain', async () => {
      const mockBrands = [
        {
          id: 'brand-1',
          name: 'Brand 1',
          chainId: 'chain-1',
          _count: { properties: 2 },
        },
        {
          id: 'brand-2',
          name: 'Brand 2',
          chainId: 'chain-1',
          _count: { properties: 1 },
        },
      ];

      (mockPrisma.brand.findMany as jest.Mock).mockResolvedValue(mockBrands);

      const result = await brandService.getBrandsByChain('chain-1');

      expect(result).toEqual(mockBrands);
      expect(mockPrisma.brand.findMany).toHaveBeenCalledWith({
        where: {
          chainId: 'chain-1',
          isActive: true,
        },
        include: {
          _count: {
            select: {
              properties: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });
  });

  describe('updateBrand', () => {
    const updateRequest = {
      name: 'Updated Brand Name',
      description: 'Updated description',
    };

    it('should update brand successfully', async () => {
      const existingBrand = {
        id: 'brand-1',
        name: 'Old Name',
        code: 'TB',
        chainId: 'chain-1',
        brandStandards: {},
      };

      const updatedBrand = {
        ...existingBrand,
        ...updateRequest,
      };

      (mockPrisma.brand.findUnique as jest.Mock).mockResolvedValue(
        existingBrand
      );
      (mockPrisma.brand.update as jest.Mock).mockResolvedValue(updatedBrand);

      const result = await brandService.updateBrand('brand-1', updateRequest);

      expect(result).toEqual(updatedBrand);
      expect(mockPrisma.brand.update).toHaveBeenCalledWith({
        where: { id: 'brand-1' },
        data: updateRequest,
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundError for non-existent brand', async () => {
      (mockPrisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        brandService.updateBrand('non-existent', updateRequest)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteBrand', () => {
    it('should delete brand successfully', async () => {
      const existingBrand = {
        id: 'brand-1',
        _count: { properties: 0 },
      };

      (mockPrisma.brand.findUnique as jest.Mock).mockResolvedValue(
        existingBrand
      );
      (mockPrisma.brand.update as jest.Mock).mockResolvedValue({});

      await brandService.deleteBrand('brand-1');

      expect(mockPrisma.brand.update).toHaveBeenCalledWith({
        where: { id: 'brand-1' },
        data: { isActive: false },
      });
    });

    it('should throw ConflictError for brand with active properties', async () => {
      const existingBrand = {
        id: 'brand-1',
        _count: { properties: 1 },
      };

      (mockPrisma.brand.findUnique as jest.Mock).mockResolvedValue(
        existingBrand
      );

      await expect(brandService.deleteBrand('brand-1')).rejects.toThrow(
        ConflictError
      );
    });

    it('should throw NotFoundError for non-existent brand', async () => {
      (mockPrisma.brand.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(brandService.deleteBrand('non-existent')).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
