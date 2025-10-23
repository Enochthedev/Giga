/**
 * Brand Controller - Handles HTTP requests for hotel brand management
 */

import { BrandService } from '@/services/brand.service';
import {
  BrandSearchCriteria,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@/types';
import logger from '@/utils/logger';
import { Request, Response } from 'express';

export class BrandController {
  constructor(private brandService: BrandService) {}

  /**
   * Create a new hotel brand
   */
  async createBrand(req: Request, res: Response): Promise<void> {
    try {
      const brandData: CreateBrandRequest = req.body;
      const brand = await this.brandService.createBrand(brandData);

      res.status(201).json({
        success: true,
        data: brand,
        message: 'Brand created successfully',
      });
    } catch (error) {
      logger.error('Error in createBrand controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get brand by ID
   */
  async getBrand(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const brand = await this.brandService.getBrand(id);

      res.json({
        success: true,
        data: brand,
      });
    } catch (error) {
      logger.error('Error in getBrand controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get all brands with filtering and pagination
   */
  async getBrands(req: Request, res: Response): Promise<void> {
    try {
      const criteria: BrandSearchCriteria = {
        query: req.query.query as string,
        chainId: req.query.chainId as string,
        isActive: req.query.isActive
          ? req.query.isActive === 'true'
          : undefined,
      };

      const options = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const result = await this.brandService.getBrands(criteria, options);

      res.json({
        success: true,
        data: result.brands,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error in getBrands controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get brands by chain ID
   */
  async getBrandsByChain(req: Request, res: Response): Promise<void> {
    try {
      const { chainId } = req.params;
      const brands = await this.brandService.getBrandsByChain(chainId);

      res.json({
        success: true,
        data: brands,
      });
    } catch (error) {
      logger.error('Error in getBrandsByChain controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Update brand
   */
  async updateBrand(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateBrandRequest = req.body;

      const brand = await this.brandService.updateBrand(id, updateData);

      res.json({
        success: true,
        data: brand,
        message: 'Brand updated successfully',
      });
    } catch (error) {
      logger.error('Error in updateBrand controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Delete brand
   */
  async deleteBrand(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.brandService.deleteBrand(id);

      res.json({
        success: true,
        message: 'Brand deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteBrand controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
