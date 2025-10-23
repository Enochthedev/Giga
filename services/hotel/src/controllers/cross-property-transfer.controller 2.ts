/**
 * Cross-Property Transfer Controller - Handles HTTP requests for property transfers
 */

import { CrossPropertyTransferService } from '@/services/cross-property-transfer.service';
import { CreateTransferRequest, TransferStatus, TransferType } from '@/types';
import logger from '@/utils/logger';
import { Request, Response } from 'express';

export class CrossPropertyTransferController {
  constructor(private transferService: CrossPropertyTransferService) {}

  /**
   * Create a new cross-property transfer request
   */
  async createTransfer(req: Request, res: Response): Promise<void> {
    try {
      const transferData: CreateTransferRequest = req.body;
      const transfer = await this.transferService.createTransfer(transferData);

      res.status(201).json({
        success: true,
        data: transfer,
        message: 'Transfer request created successfully',
      });
    } catch (error) {
      logger.error('Error in createTransfer controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get transfer by ID
   */
  async getTransfer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const transfer = await this.transferService.getTransfer(id);

      res.json({
        success: true,
        data: transfer,
      });
    } catch (error) {
      logger.error('Error in getTransfer controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get transfers for a property
   */
  async getTransfersForProperty(req: Request, res: Response): Promise<void> {
    try {
      const { propertyId } = req.params;
      const options = {
        direction: req.query.direction as 'incoming' | 'outgoing' | 'both',
        status: req.query.status as TransferStatus,
        transferType: req.query.transferType as TransferType,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await this.transferService.getTransfersForProperty(
        propertyId,
        options
      );

      res.json({
        success: true,
        data: result.transfers,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error in getTransfersForProperty controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Approve a transfer request
   */
  async approveTransfer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { approvedBy } = req.body;

      if (!approvedBy) {
        res.status(400).json({
          success: false,
          error: 'Approved by user ID is required',
        });
        return;
      }

      const transfer = await this.transferService.approveTransfer(
        id,
        approvedBy
      );

      res.json({
        success: true,
        data: transfer,
        message: 'Transfer approved successfully',
      });
    } catch (error) {
      logger.error('Error in approveTransfer controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Complete a transfer (execute the actual transfer)
   */
  async completeTransfer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const transfer = await this.transferService.completeTransfer(id);

      res.json({
        success: true,
        data: transfer,
        message: 'Transfer completed successfully',
      });
    } catch (error) {
      logger.error('Error in completeTransfer controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Cancel a transfer request
   */
  async cancelTransfer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const transfer = await this.transferService.cancelTransfer(id, reason);

      res.json({
        success: true,
        data: transfer,
        message: 'Transfer cancelled successfully',
      });
    } catch (error) {
      logger.error('Error in cancelTransfer controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
