import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';
import { Decimal } from '../lib/decimal';
import { CurrencyConversionService } from '../services/currency-conversion.service';
import { CurrencyReportingService } from '../services/currency-reporting.service';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { MultiCurrencySettlementService } from '../services/multi-currency-settlement.service';
import { CurrencySettings } from '../types/currency.types';

const router = Router();

// Initialize currency settings
const currencySettings: CurrencySettings = {
  defaultCurrency: 'USD',
  supportedCurrencies: [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CAD',
    'AUD',
    'CHF',
    'CNY',
    'INR',
    'NGN',
    'ZAR',
    'KES',
    'GHS',
    'EGP',
    'MAD',
    'TND',
    'UGX',
    'TZS',
  ],
  autoConversion: true,
  conversionFeePercentage: new Decimal(0.5), // 0.5%
  rateUpdateInterval: 60, // 60 minutes
  rateExpiryTime: 120, // 120 minutes
  fallbackProvider: 'mock',
};

// Initialize services
const exchangeRateService = new ExchangeRateService(currencySettings);
const conversionService = new CurrencyConversionService(
  exchangeRateService,
  currencySettings
);
const settlementService = new MultiCurrencySettlementService(
  conversionService,
  currencySettings
);
const reportingService = new CurrencyReportingService(
  conversionService,
  settlementService,
  currencySettings
);

// Initialize controller
const currencyController = new CurrencyController(
  exchangeRateService,
  conversionService,
  settlementService,
  reportingService
);

/**
 * @swagger
 * /api/v1/currency/supported:
 *   get:
 *     summary: Get supported currencies
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: List of supported currencies
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
 *                     currencies:
 *                       type: array
 *                       items:
 *                         type: string
 *                     count:
 *                       type: number
 */
router.get(
  '/supported',
  currencyController.getSupportedCurrencies.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/exchange-rate/{fromCurrency}/{toCurrency}:
 *   get:
 *     summary: Get exchange rate between two currencies
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: fromCurrency
 *         required: true
 *         schema:
 *           type: string
 *         description: Source currency code (e.g., USD)
 *       - in: path
 *         name: toCurrency
 *         required: true
 *         schema:
 *           type: string
 *         description: Target currency code (e.g., EUR)
 *     responses:
 *       200:
 *         description: Exchange rate information
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
 *                     fromCurrency:
 *                       type: string
 *                     toCurrency:
 *                       type: string
 *                     rate:
 *                       type: string
 *                     provider:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 */
router.get(
  '/exchange-rate/:fromCurrency/:toCurrency',
  currencyController.getExchangeRate.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/exchange-rates/{baseCurrency}:
 *   post:
 *     summary: Get multiple exchange rates for a base currency
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: baseCurrency
 *         required: true
 *         schema:
 *           type: string
 *         description: Base currency code (e.g., USD)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetCurrencies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of target currency codes
 *             required:
 *               - targetCurrencies
 *     responses:
 *       200:
 *         description: Multiple exchange rates
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
 *                     baseCurrency:
 *                       type: string
 *                     rates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           toCurrency:
 *                             type: string
 *                           rate:
 *                             type: string
 *                           provider:
 *                             type: string
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                           expiresAt:
 *                             type: string
 *                             format: date-time
 */
router.post(
  '/exchange-rates/:baseCurrency',
  currencyController.getMultipleExchangeRates.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/convert/preview:
 *   post:
 *     summary: Preview currency conversion without executing it
 *     tags: [Currency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to convert
 *               fromCurrency:
 *                 type: string
 *                 description: Source currency code
 *               toCurrency:
 *                 type: string
 *                 description: Target currency code
 *             required:
 *               - amount
 *               - fromCurrency
 *               - toCurrency
 *     responses:
 *       200:
 *         description: Conversion preview
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
 *                       type: number
 *                     fromCurrency:
 *                       type: string
 *                     convertedAmount:
 *                       type: string
 *                     toCurrency:
 *                       type: string
 *                     exchangeRate:
 *                       type: string
 *                     fee:
 *                       type: string
 *                     feePercentage:
 *                       type: string
 *                     provider:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 */
router.post(
  '/convert/preview',
  currencyController.previewConversion.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/convert:
 *   post:
 *     summary: Execute currency conversion
 *     tags: [Currency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to convert
 *               fromCurrency:
 *                 type: string
 *                 description: Source currency code
 *               toCurrency:
 *                 type: string
 *                 description: Target currency code
 *               transactionId:
 *                 type: string
 *                 description: Optional transaction ID to associate with conversion
 *               merchantId:
 *                 type: string
 *                 description: Optional merchant ID
 *             required:
 *               - amount
 *               - fromCurrency
 *               - toCurrency
 *     responses:
 *       200:
 *         description: Conversion result
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
 *                     conversionId:
 *                       type: string
 *                     originalAmount:
 *                       type: number
 *                     fromCurrency:
 *                       type: string
 *                     convertedAmount:
 *                       type: string
 *                     toCurrency:
 *                       type: string
 *                     exchangeRate:
 *                       type: string
 *                     fee:
 *                       type: string
 *                     feePercentage:
 *                       type: string
 *                     provider:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 */
router.post(
  '/convert',
  currencyController.convertCurrency.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/conversions:
 *   get:
 *     summary: Get conversion history
 *     tags: [Currency]
 *     parameters:
 *       - in: query
 *         name: transactionId
 *         schema:
 *           type: string
 *         description: Filter by transaction ID
 *     responses:
 *       200:
 *         description: Conversion history
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
 *                     conversions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fromAmount:
 *                             type: string
 *                           fromCurrency:
 *                             type: string
 *                           toAmount:
 *                             type: string
 *                           toCurrency:
 *                             type: string
 *                           exchangeRate:
 *                             type: string
 *                           fee:
 *                             type: string
 *                           provider:
 *                             type: string
 *                           convertedAt:
 *                             type: string
 *                             format: date-time
 *                           transactionId:
 *                             type: string
 *                     count:
 *                       type: number
 */
router.get(
  '/conversions',
  currencyController.getConversionHistory.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/settlements:
 *   post:
 *     summary: Create multi-currency settlement
 *     tags: [Currency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchantId:
 *                 type: string
 *                 description: Merchant ID
 *               transactionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of transaction IDs to settle
 *               preferredCurrency:
 *                 type: string
 *                 description: Preferred settlement currency (optional)
 *             required:
 *               - merchantId
 *               - transactionIds
 *     responses:
 *       200:
 *         description: Settlement created
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
 *                     settlementId:
 *                       type: string
 *                     merchantId:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     amount:
 *                       type: string
 *                     originalAmount:
 *                       type: string
 *                     originalCurrency:
 *                       type: string
 *                     exchangeRate:
 *                       type: string
 *                     conversionFee:
 *                       type: string
 *                     status:
 *                       type: string
 *                     scheduledAt:
 *                       type: string
 *                       format: date-time
 *                     transactionIds:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.post(
  '/settlements',
  currencyController.createSettlement.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/settlements/{settlementId}:
 *   get:
 *     summary: Get settlement details
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: settlementId
 *         required: true
 *         schema:
 *           type: string
 *         description: Settlement ID
 *     responses:
 *       200:
 *         description: Settlement details
 *       404:
 *         description: Settlement not found
 */
router.get(
  '/settlements/:settlementId',
  currencyController.getSettlement.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/settlements/{settlementId}/process:
 *   post:
 *     summary: Process settlement
 *     tags: [Currency]
 *     parameters:
 *       - in: path
 *         name: settlementId
 *         required: true
 *         schema:
 *           type: string
 *         description: Settlement ID
 *     responses:
 *       200:
 *         description: Settlement processed
 *       400:
 *         description: Settlement cannot be processed
 */
router.post(
  '/settlements/:settlementId/process',
  currencyController.processSettlement.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/reports:
 *   get:
 *     summary: Generate currency report
 *     tags: [Currency]
 *     parameters:
 *       - in: query
 *         name: merchantId
 *         schema:
 *           type: string
 *         description: Filter by merchant ID
 *       - in: query
 *         name: currencies
 *         schema:
 *           type: string
 *         description: Comma-separated list of currencies to include
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
 *         name: includeConversions
 *         schema:
 *           type: boolean
 *         description: Include conversion data
 *       - in: query
 *         name: includeSettlements
 *         schema:
 *           type: boolean
 *         description: Include settlement data
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *           default: json
 *         description: Report format
 *     responses:
 *       200:
 *         description: Currency report
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
 *                     reports:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           currency:
 *                             type: string
 *                           totalTransactions:
 *                             type: number
 *                           totalVolume:
 *                             type: string
 *                           averageTransactionAmount:
 *                             type: string
 *                           conversionVolume:
 *                             type: string
 *                           conversionFees:
 *                             type: string
 *                           period:
 *                             type: object
 *                             properties:
 *                               start:
 *                                 type: string
 *                                 format: date-time
 *                               end:
 *                                 type: string
 *                                 format: date-time
 *                     filters:
 *                       type: object
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get(
  '/reports',
  currencyController.getCurrencyReport.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/exchange-rates/update:
 *   post:
 *     summary: Manually update exchange rates
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: Exchange rates updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.post(
  '/exchange-rates/update',
  currencyController.updateExchangeRates.bind(currencyController)
);

/**
 * @swagger
 * /api/v1/currency/exchange-rates/cache:
 *   get:
 *     summary: Get exchange rate cache statistics
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: Cache statistics
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
 *                     size:
 *                       type: number
 *                     keys:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get(
  '/exchange-rates/cache',
  currencyController.getExchangeRateCache.bind(currencyController)
);

export default router;
