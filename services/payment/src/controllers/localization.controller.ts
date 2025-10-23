import { Decimal } from 'decimal.js';
import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { ComplianceCheckingService } from '../services/compliance-checking.service';
import { RegionalPaymentMethodsService } from '../services/regional-payment-methods.service';
import { RegionalReportingService } from '../services/regional-reporting.service';
import { TaxCalculationService } from '../services/tax-calculation.service';
import { TaxCalculationRequest } from '../types/localization.types';

export class LocalizationController {
  constructor(
    private taxService: TaxCalculationService,
    private paymentMethodsService: RegionalPaymentMethodsService,
    private complianceService: ComplianceCheckingService,
    private reportingService: RegionalReportingService
  ) {}

  async getSupportedRegions(req: Request, res: Response): Promise<void> {
    try {
      const regions = await this.taxService.getSupportedRegions();

      res.json({
        success: true,
        data: {
          regions,
          count: regions.length,
        },
      });
    } catch (error) {
      logger.error('Failed to get supported regions', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve supported regions',
      });
    }
  }

  async getRegionInfo(req: Request, res: Response): Promise<void> {
    try {
      const { regionCode } = req.params;

      if (!regionCode) {
        res.status(400).json({
          success: false,
          error: 'Region code is required',
        });
        return;
      }

      const regionInfo = await this.taxService.getRegionInfo(
        regionCode.toUpperCase()
      );

      if (!regionInfo) {
        res.status(404).json({
          success: false,
          error: 'Region not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          code: regionInfo.code,
          name: regionInfo.name,
          currency: regionInfo.currency,
          timezone: regionInfo.timezone,
          locale: regionInfo.locale,
          isActive: regionInfo.isActive,
          taxConfiguration: {
            vatRate: regionInfo.taxConfiguration.vatRate?.toString(),
            salesTaxRate: regionInfo.taxConfiguration.salesTaxRate?.toString(),
            witholdingTaxRate:
              regionInfo.taxConfiguration.witholdingTaxRate?.toString(),
            taxInclusivePricing:
              regionInfo.taxConfiguration.taxInclusivePricing,
            taxCalculationMethod:
              regionInfo.taxConfiguration.taxCalculationMethod,
            taxIdRequired: regionInfo.taxConfiguration.taxIdRequired,
            reverseChargeApplicable:
              regionInfo.taxConfiguration.reverseChargeApplicable,
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get region info', {
        regionCode: req.params.regionCode,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve region information',
      });
    }
  }

  async calculateTax(req: Request, res: Response): Promise<void> {
    try {
      const {
        amount,
        currency,
        region,
        transactionType,
        merchantCategory,
        customerType,
        customerTaxId,
        merchantTaxId,
        isExempt,
        exemptionReason,
      } = req.body;

      if (!amount || !currency || !region || !transactionType) {
        res.status(400).json({
          success: false,
          error: 'Amount, currency, region, and transaction type are required',
        });
        return;
      }

      const taxRequest: TaxCalculationRequest = {
        amount: new Decimal(amount),
        currency: currency.toUpperCase(),
        region: region.toUpperCase(),
        transactionType,
        merchantCategory,
        customerType,
        customerTaxId,
        merchantTaxId,
        isExempt,
        exemptionReason,
      };

      const taxResult = await this.taxService.calculateTax(taxRequest);

      res.json({
        success: true,
        data: {
          originalAmount: taxResult.originalAmount.toString(),
          taxAmount: taxResult.taxAmount.toString(),
          totalAmount: taxResult.totalAmount.toString(),
          taxRate: taxResult.taxRate.toString(),
          taxType: taxResult.taxType,
          isExempt: taxResult.isExempt,
          exemptionReason: taxResult.exemptionReason,
          breakdown: taxResult.breakdown.map(b => ({
            type: b.type,
            rate: b.rate.toString(),
            amount: b.amount.toString(),
            description: b.description,
          })),
          calculatedAt: taxResult.calculatedAt,
        },
      });
    } catch (error) {
      logger.error('Failed to calculate tax', {
        amount: req.body.amount,
        currency: req.body.currency,
        region: req.body.region,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to calculate tax',
      });
    }
  }

  async validateTaxId(req: Request, res: Response): Promise<void> {
    try {
      const { taxId, region, customerType } = req.body;

      if (!taxId || !region || !customerType) {
        res.status(400).json({
          success: false,
          error: 'Tax ID, region, and customer type are required',
        });
        return;
      }

      const isValid = await this.taxService.validateTaxId(
        taxId,
        region.toUpperCase(),
        customerType
      );

      res.json({
        success: true,
        data: {
          taxId: taxId.substring(0, 4) + '****', // Mask for security
          region: region.toUpperCase(),
          customerType,
          isValid,
        },
      });
    } catch (error) {
      logger.error('Failed to validate tax ID', {
        region: req.body.region,
        customerType: req.body.customerType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error: 'Failed to validate tax ID',
      });
    }
  }

  async getRegionalPaymentMethods(req: Request, res: Response): Promise<void> {
    try {
      const { region } = req.params;
      const { popularOnly } = req.query;

      if (!region) {
        res.status(400).json({
          success: false,
          error: 'Region is required',
        });
        return;
      }

      let paymentMethods;

      if (popularOnly === 'true') {
        paymentMethods =
          await this.paymentMethodsService.getPopularPaymentMethods(
            region.toUpperCase()
          );
      } else {
        const regionalMethods =
          await this.paymentMethodsService.getPaymentMethodsForRegion(
            region.toUpperCase()
          );
        paymentMethods = regionalMethods?.paymentMethods || null;
      }

      if (!paymentMethods) {
        res.status(404).json({
          success: false,
          error: 'No payment methods found for region',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          region: region.toUpperCase(),
          paymentMethods: paymentMethods.map(method => ({
            type: method.type,
            name: method.name,
            localName: method.localName,
            description: method.description,
            isPopular: method.isPopular,
            supportedCurrencies: method.supportedCurrencies,
            processingTime: method.processingTime,
            fees: {
              fixed: method.fees.fixed?.toString(),
              percentage: method.fees.percentage?.toString(),
              minimum: method.fees.minimum?.toString(),
              maximum: method.fees.maximum?.toString(),
            },
            requirements: method.requirements,
            restrictions: method.restrictions,
          })),
          count: paymentMethods.length,
        },
      });
    } catch (error) {
      logger.error('Failed to get regional payment methods', {
        region: req.params.region,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve regional payment methods',
      });
    }
  }

  async validatePaymentMethod(req: Request, res: Response): Promise<void> {
    try {
      const { region, paymentMethodType, amount, currency } = req.body;

      if (!region || !paymentMethodType || !amount || !currency) {
        res.status(400).json({
          success: false,
          error:
            'Region, payment method type, amount, and currency are required',
        });
        return;
      }

      const validation =
        await this.paymentMethodsService.validatePaymentMethodForRegion(
          region.toUpperCase(),
          paymentMethodType,
          new Decimal(amount),
          currency.toUpperCase()
        );

      res.json({
        success: true,
        data: {
          region: region.toUpperCase(),
          paymentMethodType,
          amount: amount.toString(),
          currency: currency.toUpperCase(),
          isSupported: validation.isSupported,
          method: validation.method
            ? {
                name: validation.method.name,
                localName: validation.method.localName,
                description: validation.method.description,
                processingTime: validation.method.processingTime,
              }
            : undefined,
          errors: validation.errors,
          warnings: validation.warnings,
        },
      });
    } catch (error) {
      logger.error('Failed to validate payment method', {
        region: req.body.region,
        paymentMethodType: req.body.paymentMethodType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error: 'Failed to validate payment method',
      });
    }
  }

  async calculatePaymentMethodFees(req: Request, res: Response): Promise<void> {
    try {
      const { region, paymentMethodType, amount } = req.body;

      if (!region || !paymentMethodType || !amount) {
        res.status(400).json({
          success: false,
          error: 'Region, payment method type, and amount are required',
        });
        return;
      }

      const feeCalculation =
        await this.paymentMethodsService.calculatePaymentMethodFees(
          region.toUpperCase(),
          paymentMethodType,
          new Decimal(amount)
        );

      if (!feeCalculation) {
        res.status(404).json({
          success: false,
          error: 'Payment method not found for region',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          region: region.toUpperCase(),
          paymentMethodType,
          amount: amount.toString(),
          totalFee: feeCalculation.totalFee.toString(),
          breakdown: feeCalculation.breakdown.map(b => ({
            type: b.type,
            amount: b.amount.toString(),
            description: b.description,
          })),
        },
      });
    } catch (error) {
      logger.error('Failed to calculate payment method fees', {
        region: req.body.region,
        paymentMethodType: req.body.paymentMethodType,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error: 'Failed to calculate payment method fees',
      });
    }
  }

  async getComplianceRequirements(req: Request, res: Response): Promise<void> {
    try {
      const { region } = req.params;

      if (!region) {
        res.status(400).json({
          success: false,
          error: 'Region is required',
        });
        return;
      }

      const requirements =
        await this.complianceService.getComplianceRequirements(
          region.toUpperCase()
        );

      res.json({
        success: true,
        data: {
          region: region.toUpperCase(),
          requirements: requirements.map(req => ({
            type: req.type,
            description: req.description,
            isRequired: req.isRequired,
            applicableTransactionTypes: req.applicableTransactionTypes,
            minimumAmount: req.minimumAmount?.toString(),
            maximumAmount: req.maximumAmount?.toString(),
            documentationRequired: req.documentationRequired,
            reportingFrequency: req.reportingFrequency,
            retentionPeriod: req.retentionPeriod,
          })),
          count: requirements.length,
        },
      });
    } catch (error) {
      logger.error('Failed to get compliance requirements', {
        region: req.params.region,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve compliance requirements',
      });
    }
  }

  async generateRegionalReport(req: Request, res: Response): Promise<void> {
    try {
      const {
        regions,
        startDate,
        endDate,
        includePaymentMethods,
        includeTaxBreakdown,
        includeComplianceMetrics,
        format = 'json',
      } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required',
        });
        return;
      }

      const filters = {
        regions: regions ? (regions as string).split(',') : undefined,
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        includePaymentMethods: includePaymentMethods === 'true',
        includeTaxBreakdown: includeTaxBreakdown === 'true',
        includeComplianceMetrics: includeComplianceMetrics === 'true',
      };

      // In a real implementation, you would fetch transactions from the database
      const mockTransactions: any[] = [];

      const report = await this.reportingService.generateConsolidatedReport(
        mockTransactions,
        filters
      );

      if (format === 'csv') {
        const csvData = await this.reportingService.exportRegionalReport(
          report,
          'csv'
        );
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=regional-report.csv'
        );
        res.send(csvData);
        return;
      }

      if (format === 'pdf') {
        const pdfData = await this.reportingService.exportRegionalReport(
          report,
          'pdf'
        );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=regional-report.pdf'
        );
        res.send(pdfData);
        return;
      }

      res.json({
        success: true,
        data: {
          reportGeneratedAt: report.reportGeneratedAt,
          period: report.period,
          totalRegions: report.totalRegions,
          summary: {
            totalTransactions: report.summary.totalTransactions,
            totalVolume: report.summary.totalVolume.toString(),
            totalTaxCollected: report.summary.totalTaxCollected.toString(),
            totalComplianceChecks: report.summary.totalComplianceChecks,
            overallComplianceRate: report.summary.overallComplianceRate,
            topRegionsByVolume: report.summary.topRegionsByVolume,
            topPaymentMethods: report.summary.topPaymentMethods,
          },
          regionalReports: report.regionalReports.map(r => ({
            region: r.region,
            period: r.period,
            transactionMetrics: {
              totalTransactions: r.transactionMetrics.totalTransactions,
              totalVolume: r.transactionMetrics.totalVolume.toString(),
              averageTransactionAmount:
                r.transactionMetrics.averageTransactionAmount.toString(),
              paymentMethodBreakdown: Object.fromEntries(
                Object.entries(r.transactionMetrics.paymentMethodBreakdown).map(
                  ([method, data]) => [
                    method,
                    {
                      count: data.count,
                      volume: data.volume.toString(),
                      percentage: data.percentage,
                    },
                  ]
                )
              ),
            },
            taxMetrics: {
              totalTaxCollected: r.taxMetrics.totalTaxCollected.toString(),
              taxByType: Object.fromEntries(
                Object.entries(r.taxMetrics.taxByType).map(([type, amount]) => [
                  type,
                  amount.toString(),
                ])
              ),
              exemptTransactions: r.taxMetrics.exemptTransactions,
              exemptVolume: r.taxMetrics.exemptVolume.toString(),
            },
            complianceMetrics: r.complianceMetrics,
          })),
          filters,
        },
      });
    } catch (error) {
      logger.error('Failed to generate regional report', {
        query: req.query,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate regional report',
      });
    }
  }

  async getPaymentMethodPerformance(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { region } = req.params;
      const { startDate, endDate } = req.query;

      if (!region) {
        res.status(400).json({
          success: false,
          error: 'Region is required',
        });
        return;
      }

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required',
        });
        return;
      }

      const performance =
        await this.reportingService.getPaymentMethodPerformance(
          region.toUpperCase(),
          {
            start: new Date(startDate as string),
            end: new Date(endDate as string),
          }
        );

      res.json({
        success: true,
        data: performance,
      });
    } catch (error) {
      logger.error('Failed to get payment method performance', {
        region: req.params.region,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve payment method performance',
      });
    }
  }
}
