/**
 * Multi-Property Report Routes - API routes for consolidated reporting
 */

import { MultiPropertyReportController } from '@/controllers/multi-property-report.controller';
import { PrismaClient } from '@/generated/prisma-client';
import { MultiPropertyReportService } from '@/services/multi-property-report.service';
import { Router, Request, Response } from 'express';

const router: any = Router();
const prisma = new PrismaClient();
const reportService = new MultiPropertyReportService(prisma);
const reportController = new MultiPropertyReportController(reportService);

/**
 * @swagger
 * /api/reports/templates:
 *   get:
 *     summary: Get available report templates
 *     tags: [Multi-Property Reports]
 *     responses:
 *       200:
 *         description: List of available report templates
 */
router.get('/templates', (req, res) =>
  reportController.getReportTemplates(req, res)
);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a scheduled multi-property report
 *     tags: [Multi-Property Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - reportType
 *               - properties
 *               - dateRange
 *               - metrics
 *               - createdBy
 *             properties:
 *               name:
 *                 type: string
 *                 description: Report name
 *               description:
 *                 type: string
 *                 description: Report description
 *               reportType:
 *                 type: string
 *                 enum: [occupancy, revenue, performance, guest_satisfaction, operational, custom]
 *                 description: Type of report
 *               properties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of property IDs to include
 *               dateRange:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date
 *                   end:
 *                     type: string
 *                     format: date
 *               metrics:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     aggregation:
 *                       type: string
 *               isScheduled:
 *                 type: boolean
 *                 description: Whether this is a scheduled report
 *               schedule:
 *                 type: object
 *                 description: Schedule configuration if isScheduled is true
 *               createdBy:
 *                 type: string
 *                 description: User ID who created the report
 *     responses:
 *       201:
 *         description: Report created successfully
 *       400:
 *         description: Invalid request data
 */
router.post('/', (req, res) =>
  reportController.createScheduledReport(req, res)
);

/**
 * @swagger
 * /api/reports/{reportId}/generate:
 *   post:
 *     summary: Generate a multi-property report
 *     tags: [Multi-Property Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report generated successfully
 *       404:
 *         description: Report not found
 */
router.post('/:reportId/generate', (req, res) =>
  reportController.generateReport(req, res)
);

export default router;
