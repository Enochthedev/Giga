/**
 * Search Service Unit Tests
 */

import { PrismaClient } from '@/generated/prisma-client';
import { SearchRequest, SearchService } from '@/services/search.service';
import { PropertyAmenity, PropertyCategory } from '@/types';
import { ValidationError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Prisma Client
const mockPrisma = {
  property: {
    count: vi.fn(),
    findMany: vi.fn(),
    groupBy: vi.fn(),
  },
  roomType: {
    findMany: vi.fn(),
  },
} as unknown as PrismaClient;

describe('SearchService', () => {
  let searchService: SearchService;

  beforeEach(() => {
    searchService = new SearchService(mockPrisma);
    vi.clearAllMocks();
  });

  describe('searchHotels', () => {
    const mockProperties = [
      {
        id: 'prop1',
        slug: 'luxury-hotel',
        name: 'Luxury Hotel',
        description: 'A luxury hotel in the city center',
        category: PropertyCategory.HOTEL,
        starRating: 5,
        address: { city: 'New York', country: 'USA' },
        coordinates: { latitude: 40.7128, longitude: -74.006 },
        images: [],
        amenities: [PropertyAmenity.WIFI, PropertyAmenity.POOL],
        currency: 'USD',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        roomTypes: [
          {
            id: 'room1',
            name: 'Deluxe Room',
            category: 'deluxe',
            maxOccupancy: 2,
            baseRate: 200,
            currency: 'USD',
            totalRooms: 10,
          },
        ],
        _count: { roomTypes: 1, bookings: 50 },
      },
    ];

    beforeEach(() => {
      (mockPrisma.property.count as any).mockResolvedValue(1);
      (mockPrisma.property.findMany as any).mockResolvedValue(mockProperties);
      (mockPrisma.property.groupBy as any).mockResolvedValue([
        { category: PropertyCategory.HOTEL, _count: 1 },
      ]);
    });

    it('should search hotels with basic query', async () => {
      const request: SearchRequest = {
        query: 'luxury',
        page: 1,
        limit: 10,
      };

      const result = await searchService.searchHotels(request);

      expect(result).toBeDefined();
      expect(result.properties).toHaveLength(1);
      expect(result.searchMetadata.query).toBe('luxury');
      expect(result.searchMetadata.totalResults).toBe(1);
      expect(result.pagination.totalCount).toBe(1);
    });

    it('should validate search request parameters', async () => {
      const invalidRequest: SearchRequest = {
        checkInDate: new Date('2024-12-03'),
        checkOutDate: new Date('2024-12-01'), // Before check-in
      };

      await expect(searchService.searchHotels(invalidRequest)).rejects.toThrow(
        ValidationError
      );
    });

    it('should handle empty results', async () => {
      (mockPrisma.property.count as any).mockResolvedValue(0);
      (mockPrisma.property.findMany as any).mockResolvedValue([]);

      const request: SearchRequest = {
        query: 'nonexistent',
      };

      const result = await searchService.searchHotels(request);

      expect(result.properties).toHaveLength(0);
      expect(result.searchMetadata.totalResults).toBe(0);
    });
  });

  describe('getSearchSuggestions', () => {
    beforeEach(() => {
      (mockPrisma.property.findMany as any).mockResolvedValue([
        {
          name: 'Luxury Hotel New York',
          address: { city: 'New York', country: 'USA' },
        },
      ]);
    });

    it('should return search suggestions', async () => {
      const suggestions = await searchService.getSearchSuggestions('new york');

      expect(suggestions).toBeDefined();
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should return empty array for short queries', async () => {
      const suggestions = await searchService.getSearchSuggestions('n');

      expect(suggestions).toEqual([]);
    });
  });

  describe('getPopularSearches', () => {
    it('should return popular search terms', async () => {
      const popularSearches = await searchService.getPopularSearches();

      expect(popularSearches).toBeDefined();
      expect(Array.isArray(popularSearches)).toBe(true);
      expect(popularSearches.length).toBeGreaterThan(0);
    });
  });
});
