import { Router } from 'express';
import { LocalizationController } from '../controllers/localization.controller';
import { ComplianceCheckingService } from '../services/compliance-checking.service';
import { RegionalPaymentMethodsService } from '../services/regional-payment-methods.service';
import { RegionalReportingService } from '../services/regional-reporting.service';
import { TaxCalculationService } from '../services/tax-calculation.service';
import { LocalizationSettings } from '../types/localization.types';

const router = Router();

// Initialize localization settings
const localizationSettings: LocalizationSettings = {
  defaultRegion: 'US',
  supportedRegions: [
    'US',
    'GB',
    'DE',
    'CA',
    'NG',
    'KE',
    'IN',
    'ZA',
    'GH',
    'EG',
  ],
  autoDetectRegion: true,
  fallbackRegion: 'US',
  taxCalculationEnabled: true,
  complianceCheckingEnabled: true,
  regionalPaymentMethodsEnabled: true,
  dataLocalizationEnabled: true,
};

// Initialize services
const taxService = new TaxCalculationService(localizationSettings);
const paymentMethodsService = new RegionalPaymentMethodsService(
  localizationSettings
);
const complianceService = new ComplianceCheckingService(localizationSettings);
const reportingService = new RegionalReportingService(
  localizationSettings,
  taxService,
  paymentMethodsService,
  complianceService
);

// Initialize controller
const localizationController = new LocalizationController(
  taxService,
  paymentMethodsService,
  complianceService,
  reportingService
);

/**
 * @swagger
 * /api/v1/localization/regions:
 *   get:
 *     summary: Get supported regions
 *     tags: [Localization]
 *     responses:
 *       200:
 *         description: List of supported regions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     regions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     count:
 *                       type: number
 */
router.get(
  '/regions',
  localizationController.getSupportedRegions.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/regions/{regionCode}:
 *   get:
 *     summary: Get region information
 *     tags: [Localization]
 *     parameters:
 *       - in: path
 *         name: regionCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Region code (e.g., US, GB, DE)
 *     responses:
 *       200:
 *         description: Region information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     name:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     timezone:
 *                       type: string
 *                     locale:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     taxConfiguration:
 *                       type: object
 *                       properties:
 *                         vatRate:
 *                           type: string
 *                         salesTaxRate:
 *                           type: string
 *                         witholdingTaxRate:
 *                           type: string
 *                         taxInclusivePricing:
 *                           type: boolean
 *                         taxCalculationMethod:
 *                           type: string
 *                         taxIdRequired:
 *                           type: boolean
 *                         reverseChargeApplicable:
 *                           type: boolean
 *       404:
 *         description: Region not found
 */
router.get(
  '/regions/:regionCode',
  localizationController.getRegionInfo.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/tax/calculate:
 *   post:
 *     summary: Calculate tax for a transaction
 *     tags: [Localization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *               currency:
 *                 type: string
 *                 description: Currency code
 *               region:
 *                 type: string
 *                 description: Region code
 *               transactionType:
 *                 type: string
 *                 description: Type of transaction
 *               merchantCategory:
 *                 type: string
 *                 description: Merchant category (optional)
 *               customerType:
 *                 type: string
 *                 enum: [individual, business]
 *                 description: Customer type (optional)
 *               customerTaxId:
 *                 type: string
 *                 description: Customer tax ID (optional)
 *               merchantTaxId:
 *                 type: string
 *                 description: Merchant tax ID (optional)
 *               isExempt:
 *                 type: boolean
 *                 description: Whether transaction is tax exempt (optional)
 *               exemptionReason:
 *                 type: string
 *                 description: Reason for tax exemption (optional)
 *             required:
 *               - amount
 *               - currency
 *               - region
 *               - transactionType
 *     responses:
 *       200:
 *         description: Tax calculation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     originalAmount:
 *                       type: string
 *                     taxAmount:
 *                       type: string
 *                     totalAmount:
 *                       type: string
 *                     taxRate:
 *                       type: string
 *                     taxType:
 *                       type: string
 *                     isExempt:
 *                       type: boolean
 *                     exemptionReason:
 *                       type: string
 *                     breakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           rate:
 *                             type: string
 *                           amount:
 *                             type: string
 *                           description:
 *                             type: string
 *                     calculatedAt:
 *                       type: string
 *                       format: date-time
 */
router.post(
  '/tax/calculate',
  localizationController.calculateTax.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/tax/validate-id:
 *   post:
 *     summary: Validate tax ID for a region
 *     tags: [Localization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxId:
 *                 type: string
 *                 description: Tax ID to validate
 *               region:
 *                 type: string
 *                 description: Region code
 *               customerType:
 *                 type: string
 *                 enum: [individual, business]
 *                 description: Customer type
 *             required:
 *               - taxId
 *               - region
 *               - customerType
 *     responses:
 *       200:
 *         description: Tax ID validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     taxId:
 *                       type: string
 *                       description: Masked tax ID
 *                     region:
 *                       type: string
 *                     customerType:
 *                       type: string
 *                     isValid:
 *                       type: boolean
 */
router.post(
  '/tax/validate-id',
  localizationController.validateTaxId.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/payment-methods/{region}:
 *   get:
 *     summary: Get payment methods for a region
 *     tags: [Localization]
 *     parameters:
 *       - in: path
 *         name: region
 *         required: true
 *         schema:
 *           type: string
 *         description: Region code
 *       - in: query
 *         name: popularOnly
 *         schema:
 *           type: boolean
 *         description: Return only popular payment methods
 *     responses:
 *       200:
 *         description: Regional payment methods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     region:
 *                       type: string
 *                     paymentMethods:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           name:
 *                             type: string
 *                           localName:
 *                             type: string
 *                           description:
 *                             type: string
 *                           isPopular:
 *                             type: boolean
 *                           supportedCurrencies:
 *                             type: array
 *                             items:
 *                               type: string
 *                           processingTime:
 *                             type: string
 *                           fees:
 *                             type: object
 *                             properties:
 *                               fixed:
 *                                 type: string
 *                               percentage:
 *                                 type: string
 *                               minimum:
 *                                 type: string
 *                               maximum:
 *                                 type: string
 *                           requirements:
 *                             type: array
 *                             items:
 *                               type: string
 *                           restrictions:
 *                             type: array
 *                             items:
 *                               type: string
 *                     count:
 *                       type: number
 *       404:
 *         description: No payment methods found for region
 */
router.get(
  '/payment-methods/:region',
  localizationController.getRegionalPaymentMethods.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/payment-methods/validate:
 *   post:
 *     summary: Validate payment method for region and amount
 *     tags: [Localization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 description: Region code
 *               paymentMethodType:
 *                 type: string
 *                 description: Payment method type
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *               currency:
 *                 type: string
 *                 description: Currency code
 *             required:
 *               - region
 *               - paymentMethodType
 *               - amount
 *               - currency
 *     responses:
 *       200:
 *         description: Payment method validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     region:
 *                       type: string
 *                     paymentMethodType:
 *                       type: string
 *                     amount:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     isSupported:
 *                       type: boolean
 *                     method:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         localName:
 *                           type: string
 *                         description:
 *                           type: string
 *                         processingTime:
 *                           type: string
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 *                     warnings:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post(
  '/payment-methods/validate',
  localizationController.validatePaymentMethod.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/payment-methods/fees:
 *   post:
 *     summary: Calculate payment method fees
 *     tags: [Localization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 description: Region code
 *               paymentMethodType:
 *                 type: string
 *                 description: Payment method type
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *             required:
 *               - region
 *               - paymentMethodType
 *               - amount
 *     responses:
 *       200:
 *         description: Payment method fee calculation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     region:
 *                       type: string
 *                     paymentMethodType:
 *                       type: string
 *                     amount:
 *                       type: string
 *                     totalFee:
 *                       type: string
 *                     breakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           amount:
 *                             type: string
 *                           description:
 *                             type: string
 *       404:
 *         description: Payment method not found for region
 */
router.post(
  '/payment-methods/fees',
  localizationController.calculatePaymentMethodFees.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/compliance/{region}:
 *   get:
 *     summary: Get compliance requirements for a region
 *     tags: [Localization]
 *     parameters:
 *       - in: path
 *         name: region
 *         required: true
 *         schema:
 *           type: string
 *         description: Region code
 *     responses:
 *       200:
 *         description: Compliance requirements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     region:
 *                       type: string
 *                     requirements:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           description:
 *                             type: string
 *                           isRequired:
 *                             type: boolean
 *                           applicableTransactionTypes:
 *                             type: array
 *                             items:
 *                               type: string
 *                           minimumAmount:
 *                             type: string
 *                           maximumAmount:
 *                             type: string
 *                           documentationRequired:
 *                             type: array
 *                             items:
 *                               type: string
 *                           reportingFrequency:
 *                             type: string
 *                           retentionPeriod:
 *                             type: number
 *                     count:
 *                       type: number
 */
router.get(
  '/compliance/:region',
  localizationController.getComplianceRequirements.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/reports:
 *   get:
 *     summary: Generate regional report
 *     tags: [Localization]
 *     parameters:
 *       - in: query
 *         name: regions
 *         schema:
 *           type: string
 *         description: Comma-separated list of regions
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Report start date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Report end date
 *       - in: query
 *         name: includePaymentMethods
 *         schema:
 *           type: boolean
 *         description: Include payment method breakdown
 *       - in: query
 *         name: includeTaxBreakdown
 *         schema:
 *           type: boolean
 *         description: Include tax breakdown
 *       - in: query
 *         name: includeComplianceMetrics
 *         schema:
 *           type: boolean
 *         description: Include compliance metrics
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, pdf]
 *           default: json
 *         description: Report format
 *     responses:
 *       200:
 *         description: Regional report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     reportGeneratedAt:
 *                       type: string
 *                       format: date-time
 *                     period:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date-time
 *                         end:
 *                           type: string
 *                           format: date-time
 *                     totalRegions:
 *                       type: number
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: number
 *                         totalVolume:
 *                           type: string
 *                         totalTaxCollected:
 *                           type: string
 *                         totalComplianceChecks:
 *                           type: number
 *                         overallComplianceRate:
 *                           type: number
 *                         topRegionsByVolume:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               region:
 *                                 type: string
 *                               volume:
 *                                 type: string
 *                               percentage:
 *                                 type: number
 *                         topPaymentMethods:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               method:
 *                                 type: string
 *                               count:
 *                                 type: number
 *                               volume:
 *                                 type: string
 *                               regions:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                     regionalReports:
 *                       type: array
 *                       items:
 *                         type: object
 *                     filters:
 *                       type: object
 *           text/csv:
 *             schema:
 *               type: string
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  '/reports',
  localizationController.generateRegionalReport.bind(localizationController)
);

/**
 * @swagger
 * /api/v1/localization/payment-methods/{region}/performance:
 *   get:
 *     summary: Get payment method performance for a region
 *     tags: [Localization]
 *     parameters:
 *       - in: path
 *         name: region
 *         required: true
 *         schema:
 *           type: string
 *         description: Region code
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date
 *     responses:
 *       200:
 *         description: Payment method performance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     region:
 *                       type: string
 *                     period:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date-time
 *                         end:
 *                           type: string
 *                           format: date-time
 *                     methods:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           name:
 *                             type: string
 *                           transactionCount:
 *                             type: number
 *                           volume:
 *                             type: string
 *                           successRate:
 *                             type: number
 *                           averageProcessingTime:
 *                             type: string
 *                           totalFees:
 *                             type: string
 */
router.get(
  '/payment-methods/:region/performance',
  localizationController.getPaymentMethodPerformance.bind(
    localizationController
  )
);

export default router;
