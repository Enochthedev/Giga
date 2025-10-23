/**
 * Search Controller Unit Tests
 */

import { SearchController } from '@/controllers/search.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock express-validator
vi.mock('express-validator', () => ({
  validationResult: vi.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

const mockPrisma = {} as PrismaClient;

describe('SearchController', () => {
  let searchController: SearchController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    searchController = new SearchController(mockPrisma);

    mockRequest = {
      query: {},
      body: {},
    };

    mockResponse = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();

    vi.clearAllMocks();
  });

  describe('getPopularSearches', () => {
    it('should get popular searches', async () => {
      mockRequest.query = {
        limit: '5',
      };

      await searchController.getPopularSearches(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
        timestamp: expect.any(Date),
      });
    });
  });

  describe('getSearchSuggestions', () => {
    it('should handle missing query parameter', async () => {
      mockRequest.query = {};

      await searchController.getSearchSuggestions(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(ValidationError));
    });
  });
});
