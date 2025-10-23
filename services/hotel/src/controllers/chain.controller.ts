/**
 * Chain Controller - Handles HTTP requests for hotel chain management
 */

import { ChainService } from '@/services/chain.service';
import { ChainSearchCriteria, CreateChainRequest } from '@/types';
import logger from '@/utils/logger';
import { Request, Response } from 'express';

export class ChainController {
  constructor(private chainService: ChainService) {}

  /**
   * Create a new hotel chain
   */
  async createChain(req: Request, res: Response): Promise<void> {
    try {
      const chainData: CreateChainRequest = req.body;
      const chain = await this.chainService.createChain(chainData);

      res.status(201).json({
        success: true,
        data: chain,
        message: 'Chain created successfully',
      });
    } catch (error) {
      logger.error('Error in createChain controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get chain by ID
   */
  async getChain(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const chain = await this.chainService.getChain(id);

      res.json({
        success: true,
        data: chain,
      });
    } catch (error) {
      logger.error('Error in getChain controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get all chains with filtering and pagination
   */
  async getChains(req: Request, res: Response): Promise<void> {
    try {
      const criteria: ChainSearchCriteria = {
        query: req.query.query as string,
        isActive: req.query.isActive
          ? req.query.isActive === 'true'
          : undefined,
        country: req.query.country as string,
      };

      const options = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      };

      const result = await this.chainService.getChains(criteria, options);

      res.json({
        success: true,
        data: result.chains,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error in getChains controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } /**

   * Update chain
   */
  async updateChain(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const chain = await this.chainService.updateChain(id, updateData);

      res.json({
        success: true,
        data: chain,
        message: 'Chain updated successfully',
      });
    } catch (error) {
      logger.error('Error in updateChain controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Delete chain
   */
  async deleteChain(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.chainService.deleteChain(id);

      res.json({
        success: true,
        message: 'Chain deleted successfully',
      });
    } catch (error) {
      logger.error('Error in deleteChain controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
