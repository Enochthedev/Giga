/**
 * Multi-Property Report Controller - Handles HTTP requests for consolidated reporting
 */

import { MultiPropertyReportService } from '@/services/multi-property-report.service';
import logger from '@/utils/logger';
import { Request, Response } from 'express';

export class MultiPropertyReportController {
  constructor(private reportService: MultiPropertyReportService) {}

  /**
   * Generate a multi-property report
   */
  async generateReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportId } = req.params;
      const reportData = await this.reportService.generateReport(reportId);

      res.json({
        success: true,
        data: reportData,
        message: 'Report generated successfully',
      });
    } catch (error) {
      logger.error('Error in generateReport controller', { error });
      const statusCode =
        error instanceof Error && error.name === 'NotFoundError' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get available report templates
   */
  async getReportTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await this.reportService.getReportTemplates();

      res.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      logger.error('Error in getReportTemplates controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Create a scheduled report
   */
  async createScheduledReport(req: Request, res: Response): Promise<void> {
    try {
      const reportConfig = req.body;
      const report =
        await this.reportService.createScheduledReport(reportConfig);

      res.status(201).json({
        success: true,
        data: report,
        message: 'Scheduled report created successfully',
      });
    } catch (error) {
      logger.error('Error in createScheduledReport controller', { error });
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
