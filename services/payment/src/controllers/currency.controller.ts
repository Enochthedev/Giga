import { Decimal } from 'decimal.js';
import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { CurrencyConversionService } from '../services/currency-conversion.service';
import { CurrencyReportingService } from '../services/currency-reporting.service';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { MultiCurrencySettlementService } from '../services/multi-currency-settlement.service';
import { ConversionRequest } from '../types/currency.types';

export class CurrencyController {
  constructor(
    private exchangeRateService: ExchangeRateService,
    private conversionService: CurrencyConversionService,
    private settlementService: MultiCurrencySettlementService,
    private reportingService: CurrencyReportingService
  ) {}

  async getSupportedCurrencies(req: Request, res: Response): Promise<void> {
    try {
      const currencies =
        await this.exchangeRateService.getSupportedCurrencies();

      res.json({
        success: true,
        data: {
          currencies,
          count: currencies.length,
        },
      });
    } catch (error) {
      logger.error('Failed to get supported currencies', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve supported currencies',
      });
    }
  }

  async getExchangeRate(req: Request, res: Response): Promise<void> {
    try {
      const { fromCurrency, toCurrency } = req.params;

      if (!fromCurrency || !toCurrency) {
        res.status(400).json({
          success: false,
          error: 'Both fromCurrency and toCurrency are required',
        });
        return;
      }

      const exchangeRate = await this.exchangeRateService.getExchangeRate(
        fromCurrency.toUpperCase(),
        toCurrency.toUpperCase()
      );

      res.json({
        success: true,
        data: {
          fromCurrency: exchangeRate.fromCurrency,
          toCurrency: exchangeRate.toCurrency,
          rate: exchangeRate.rate.toString(),
          provider: exchangeRate.provider,
          timestamp: exchangeRate.timestamp,
          expiresAt: exchangeRate.expiresAt,
        },
      });
    } catch (error) {
      logger.error('Failed to get exchange rate', {
        fromCurrency: req.params.fromCurrency,
        toCurrency: req.params.toCurrency,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve exchange rate',
      });
    }
  }

  async getMultipleExchangeRates(req: Request, res: Response): Promise<void> {
    try {
      const { baseCurrency } = req.params;
      const { targetCurrencies } = req.body;

      if (!baseCurrency) {
        res.status(400).json({
          success: false,
          error: 'Base currency is required',
        });
        return;
      }

      if (!Array.isArray(targetCurrencies) || targetCurrencies.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Target currencies array is required',
        });
        return;
      }

      const rates = await this.exchangeRateService.getMultipleRates(
        baseCurrency.toUpperCase(),
        targetCurrencies.map(c => c.toUpperCase())
      );

      res.json({
        success: true,
        data: {
          baseCurrency: baseCurrency.toUpperCase(),
          rates: rates.map(rate => ({
            toCurrency: rate.toCurrency,
            rate: rate.rate.toString(),
            provider: rate.provider,
            timestamp: rate.timestamp,
            expiresAt: rate.expiresAt,
          })),
        },
      });
    } catch (error) {
      logger.error('Failed to get multiple exchange rates', {
        baseCurrency: req.params.baseCurrency,
        targetCurrencies: req.body.targetCurrencies,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve exchange rates',
      });
    }
  }

  async previewConversion(req: Request, res: Response): Promise<void> {
    try {
      const { amount, fromCurrency, toCurrency } = req.body;

      if (!amount || !fromCurrency || !toCurrency) {
        res.status(400).json({
          success: false,
          error: 'Amount, fromCurrency, and toCurrency are required',
        });
        return;
      }

      const conversionRequest: ConversionRequest = {
        amount: new Decimal(amount),
        fromCurrency: fromCurrency.toUpperCase(),
        toCurrency: toCurrency.toUpperCase(),
      };

      const preview =
        await this.conversionService.previewConversion(conversionRequest);

      res.json({
        success: true,
        data: {
          originalAmount: amount,
          fromCurrency: fromCurrency.toUpperCase(),
          convertedAmount: preview.convertedAmount.toString(),
          toCurrency: toCurrency.toUpperCase(),
          exchangeRate: preview.exchangeRate.toString(),
          fee: preview.fee.toString(),
          feePercentage: preview.feePercentage.toString(),
          provider: preview.provider,
          expiresAt: preview.expiresAt,
        },
      });
    } catch (error) {
      logger.error('Failed to preview currency conversion', {
        amount: req.body.amount,
        fromCurrency: req.body.fromCurrency,
        toCurrency: req.body.toCurrency,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to preview conversion',
      });
    }
  }

  async convertCurrency(req: Request, res: Response): Promise<void> {
    try {
      const { amount, fromCurrency, toCurrency, transactionId, merchantId } =
        req.body;

      if (!amount || !fromCurrency || !toCurrency) {
        res.status(400).json({
          success: false,
          error: 'Amount, fromCurrency, and toCurrency are required',
        });
        return;
      }

      const conversionRequest: ConversionRequest = {
        amount: new Decimal(amount),
        fromCurrency: fromCurrency.toUpperCase(),
        toCurrency: toCurrency.toUpperCase(),
        transactionId,
        merchantId,
      };

      const conversion =
        await this.conversionService.convertCurrency(conversionRequest);

      res.json({
        success: true,
        data: {
          conversionId: conversion.conversionId,
          originalAmount: amount,
          fromCurrency: fromCurrency.toUpperCase(),
          convertedAmount: conversion.convertedAmount.toString(),
          toCurrency: toCurrency.toUpperCase(),
          exchangeRate: conversion.exchangeRate.toString(),
          fee: conversion.fee.toString(),
          feePercentage: conversion.feePercentage.toString(),
          provider: conversion.provider,
          expiresAt: conversion.expiresAt,
        },
      });
    } catch (error) {
      logger.error('Failed to convert currency', {
        amount: req.body.amount,
        fromCurrency: req.body.fromCurrency,
        toCurrency: req.body.toCurrency,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to convert currency',
      });
    }
  }

  async getConversionHistory(req: Request, res: Response): Promise<void> {
    try {
      const { transactionId } = req.query;

      const conversions = await this.conversionService.getConversionHistory(
        transactionId as string
      );

      res.json({
        success: true,
        data: {
          conversions: conversions.map(conv => ({
            id: conv.id,
            fromAmount: conv.fromAmount.toString(),
            fromCurrency: conv.fromCurrency,
            toAmount: conv.toAmount.toString(),
            toCurrency: conv.toCurrency,
            exchangeRate: conv.exchangeRate.toString(),
            fee: conv.fee?.toString(),
            feePercentage: conv.feePercentage?.toString(),
            provider: conv.provider,
            convertedAt: conv.convertedAt,
            transactionId: conv.transactionId,
          })),
          count: conversions.length,
        },
      });
    } catch (error) {
      logger.error('Failed to get conversion history', {
        transactionId: req.query.transactionId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve conversion history',
      });
    }
  }

  async createSettlement(req: Request, res: Response): Promise<void> {
    try {
      const { merchantId, transactionIds, preferredCurrency } = req.body;

      if (
        !merchantId ||
        !Array.isArray(transactionIds) ||
        transactionIds.length === 0
      ) {
        res.status(400).json({
          success: false,
          error: 'Merchant ID and transaction IDs array are required',
        });
        return;
      }

      // In a real implementation, you would fetch transactions from the database
      // For now, we'll create mock transactions
      const mockTransactions = transactionIds.map((id: string) => ({
        id,
        amount: new Decimal(Math.random() * 1000 + 100),
        currency: ['USD', 'EUR', 'GBP'][Math.floor(Math.random() * 3)],
        merchantId,
        createdAt: new Date(),
      }));

      const settlement = await this.settlementService.createSettlement(
        merchantId,
        mockTransactions as any,
        preferredCurrency?.toUpperCase()
      );

      res.json({
        success: true,
        data: {
          settlementId: settlement.id,
          merchantId: settlement.merchantId,
          currency: settlement.currency,
          amount: settlement.amount.toString(),
          originalAmount: settlement.originalAmount?.toString(),
          originalCurrency: settlement.originalCurrency,
          exchangeRate: settlement.exchangeRate?.toString(),
          conversionFee: settlement.conversionFee?.toString(),
          status: settlement.status,
          scheduledAt: settlement.scheduledAt,
          transactionIds: settlement.transactionIds,
        },
      });
    } catch (error) {
      logger.error('Failed to create settlement', {
        merchantId: req.body.merchantId,
        transactionIds: req.body.transactionIds,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create settlement',
      });
    }
  }

  async getSettlement(req: Request, res: Response): Promise<void> {
    try {
      const { settlementId } = req.params;

      const settlement =
        await this.settlementService.getSettlement(settlementId);

      if (!settlement) {
        res.status(404).json({
          success: false,
          error: 'Settlement not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          settlementId: settlement.id,
          merchantId: settlement.merchantId,
          currency: settlement.currency,
          amount: settlement.amount.toString(),
          originalAmount: settlement.originalAmount?.toString(),
          originalCurrency: settlement.originalCurrency,
          exchangeRate: settlement.exchangeRate?.toString(),
          conversionFee: settlement.conversionFee?.toString(),
          status: settlement.status,
          scheduledAt: settlement.scheduledAt,
          processedAt: settlement.processedAt,
          settledAt: settlement.settledAt,
          transactionIds: settlement.transactionIds,
          metadata: settlement.metadata,
        },
      });
    } catch (error) {
      logger.error('Failed to get settlement', {
        settlementId: req.params.settlementId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve settlement',
      });
    }
  }

  async processSettlement(req: Request, res: Response): Promise<void> {
    try {
      const { settlementId } = req.params;

      const settlement =
        await this.settlementService.processSettlement(settlementId);

      res.json({
        success: true,
        data: {
          settlementId: settlement.id,
          status: settlement.status,
          processedAt: settlement.processedAt,
          settledAt: settlement.settledAt,
          amount: settlement.amount.toString(),
          currency: settlement.currency,
        },
      });
    } catch (error) {
      logger.error('Failed to process settlement', {
        settlementId: req.params.settlementId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process settlement',
      });
    }
  }

  async getCurrencyReport(req: Request, res: Response): Promise<void> {
    try {
      const {
        merchantId,
        currencies,
        startDate,
        endDate,
        includeConversions,
        includeSettlements,
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
        merchantId: merchantId as string,
        currencies: currencies ? (currencies as string).split(',') : undefined,
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        includeConversions: includeConversions === 'true',
        includeSettlements: includeSettlements === 'true',
      };

      // In a real implementation, you would fetch transactions from the database
      const mockTransactions: any[] = [];

      const reports = await this.reportingService.generateCurrencyReport(
        mockTransactions,
        filters
      );

      if (format === 'csv') {
        const csvData = await this.reportingService.exportCurrencyReport(
          reports,
          'csv'
        );
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=currency-report.csv'
        );
        res.send(csvData);
        return;
      }

      res.json({
        success: true,
        data: {
          reports: reports.map(report => ({
            currency: report.currency,
            totalTransactions: report.totalTransactions,
            totalVolume: report.totalVolume.toString(),
            averageTransactionAmount:
              report.averageTransactionAmount.toString(),
            conversionVolume: report.conversionVolume?.toString(),
            conversionFees: report.conversionFees?.toString(),
            period: report.period,
          })),
          filters,
        },
      });
    } catch (error) {
      logger.error('Failed to generate currency report', {
        query: req.query,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate currency report',
      });
    }
  }

  async updateExchangeRates(req: Request, res: Response): Promise<void> {
    try {
      await this.exchangeRateService.updateRates();

      res.json({
        success: true,
        message: 'Exchange rates updated successfully',
        timestamp: new Date(),
      });
    } catch (error) {
      logger.error('Failed to update exchange rates', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to update exchange rates',
      });
    }
  }

  async getExchangeRateCache(req: Request, res: Response): Promise<void> {
    try {
      const cacheStats = this.exchangeRateService.getCacheStats();

      res.json({
        success: true,
        data: cacheStats,
      });
    } catch (error) {
      logger.error('Failed to get exchange rate cache stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve cache statistics',
      });
    }
  }
}
