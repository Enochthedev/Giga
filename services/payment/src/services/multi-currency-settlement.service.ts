import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  CurrencySettings,
  Settlement,
  SettlementStatus,
} from '../types/currency.types';
import { Transaction } from '../types/payment.types';
import { CurrencyConversionService } from './currency-conversion.service';

export class MultiCurrencySettlementService {
  private conversionService: CurrencyConversionService;
  private settings: CurrencySettings;
  private settlements: Map<string, Settlement> = new Map();

  constructor(
    conversionService: CurrencyConversionService,
    settings: CurrencySettings
  ) {
    this.conversionService = conversionService;
    this.settings = settings;
  }

  async createSettlement(
    merchantId: string,
    transactions: Transaction[],
    preferredCurrency?: string
  ): Promise<Settlement> {
    const settlementId = this.generateSettlementId();
    const settlementCurrency =
      preferredCurrency || this.settings.defaultCurrency;

    logger.info('Creating multi-currency settlement', {
      settlementId,
      merchantId,
      transactionCount: transactions.length,
      settlementCurrency,
    });

    // Group transactions by currency
    const transactionsByCurrency =
      this.groupTransactionsByCurrency(transactions);

    // Calculate total settlement amount
    let totalAmount = new Decimal(0);
    let totalOriginalAmount = new Decimal(0);
    let totalConversionFees = new Decimal(0);
    const conversionDetails: Array<{
      currency: string;
      amount: Decimal;
      convertedAmount: Decimal;
      exchangeRate: Decimal;
      conversionFee: Decimal;
    }> = [];

    for (const [currency, currencyTransactions] of transactionsByCurrency) {
      const currencyTotal = currencyTransactions.reduce(
        (sum, tx) => sum.add(tx.amount),
        new Decimal(0)
      );

      totalOriginalAmount = totalOriginalAmount.add(currencyTotal);

      if (currency === settlementCurrency) {
        // No conversion needed
        totalAmount = totalAmount.add(currencyTotal);
        conversionDetails.push({
          currency,
          amount: currencyTotal,
          convertedAmount: currencyTotal,
          exchangeRate: new Decimal(1),
          conversionFee: new Decimal(0),
        });
      } else {
        // Convert to settlement currency
        const conversion = await this.conversionService.convertCurrency({
          amount: currencyTotal,
          fromCurrency: currency,
          toCurrency: settlementCurrency,
          merchantId,
        });

        totalAmount = totalAmount.add(conversion.convertedAmount);
        totalConversionFees = totalConversionFees.add(conversion.fee);

        conversionDetails.push({
          currency,
          amount: currencyTotal,
          convertedAmount: conversion.convertedAmount,
          exchangeRate: conversion.exchangeRate,
          conversionFee: conversion.fee,
        });

        logger.info('Currency conversion for settlement', {
          settlementId,
          fromCurrency: currency,
          toCurrency: settlementCurrency,
          originalAmount: currencyTotal.toString(),
          convertedAmount: conversion.convertedAmount.toString(),
          exchangeRate: conversion.exchangeRate.toString(),
          conversionFee: conversion.fee.toString(),
        });
      }
    }

    // Subtract total conversion fees from settlement amount
    const finalSettlementAmount = totalAmount.sub(totalConversionFees);

    const settlement: Settlement = {
      id: settlementId,
      merchantId,
      currency: settlementCurrency,
      amount: finalSettlementAmount,
      originalAmount: totalOriginalAmount,
      originalCurrency: this.getMixedCurrencyLabel(transactionsByCurrency),
      exchangeRate: this.calculateWeightedAverageRate(conversionDetails),
      conversionFee: totalConversionFees,
      status: SettlementStatus.PENDING,
      scheduledAt: new Date(),
      gatewayId: 'multi-currency-settlement',
      transactionIds: transactions.map(tx => tx.id),
      metadata: {
        conversionDetails,
        transactionsByCurrency: Object.fromEntries(
          Array.from(transactionsByCurrency.entries()).map(
            ([currency, txs]) => [
              currency,
              {
                count: txs.length,
                totalAmount: txs
                  .reduce((sum, tx) => sum.add(tx.amount), new Decimal(0))
                  .toString(),
              },
            ]
          )
        ),
      },
    };

    this.settlements.set(settlementId, settlement);

    logger.info('Multi-currency settlement created', {
      settlementId,
      merchantId,
      finalAmount: finalSettlementAmount.toString(),
      currency: settlementCurrency,
      totalConversionFees: totalConversionFees.toString(),
      transactionCount: transactions.length,
    });

    return settlement;
  }

  async processSettlement(settlementId: string): Promise<Settlement> {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) {
      throw new Error(`Settlement ${settlementId} not found`);
    }

    if (settlement.status !== SettlementStatus.PENDING) {
      throw new Error(`Settlement ${settlementId} is not in pending status`);
    }

    logger.info('Processing multi-currency settlement', {
      settlementId,
      merchantId: settlement.merchantId,
      amount: settlement.amount.toString(),
      currency: settlement.currency,
    });

    try {
      // Update status to processing
      settlement.status = SettlementStatus.PROCESSING;
      settlement.processedAt = new Date();

      // Simulate settlement processing
      // In a real implementation, this would integrate with banking/payment systems
      await this.simulateSettlementProcessing(settlement);

      // Mark as completed
      settlement.status = SettlementStatus.COMPLETED;
      settlement.settledAt = new Date();

      logger.info('Multi-currency settlement completed', {
        settlementId,
        merchantId: settlement.merchantId,
        settledAmount: settlement.amount.toString(),
        currency: settlement.currency,
      });

      return settlement;
    } catch (error) {
      settlement.status = SettlementStatus.FAILED;

      logger.error('Multi-currency settlement failed', {
        settlementId,
        merchantId: settlement.merchantId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  async getSettlement(settlementId: string): Promise<Settlement | null> {
    return this.settlements.get(settlementId) || null;
  }

  async getSettlementsByMerchant(merchantId: string): Promise<Settlement[]> {
    return Array.from(this.settlements.values()).filter(
      s => s.merchantId === merchantId
    );
  }

  async getSettlementsByStatus(
    status: SettlementStatus
  ): Promise<Settlement[]> {
    return Array.from(this.settlements.values()).filter(
      s => s.status === status
    );
  }

  async cancelSettlement(
    settlementId: string,
    reason: string
  ): Promise<Settlement> {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) {
      throw new Error(`Settlement ${settlementId} not found`);
    }

    if (settlement.status === SettlementStatus.COMPLETED) {
      throw new Error(`Cannot cancel completed settlement ${settlementId}`);
    }

    settlement.status = SettlementStatus.CANCELLED;
    settlement.metadata = {
      ...settlement.metadata,
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
    };

    logger.info('Multi-currency settlement cancelled', {
      settlementId,
      merchantId: settlement.merchantId,
      reason,
    });

    return settlement;
  }

  async getSettlementSummary(
    merchantId: string,
    period: { start: Date; end: Date }
  ) {
    const settlements = this.getSettlementsByMerchant(merchantId).then(
      settlements =>
        settlements.filter(
          s => s.scheduledAt >= period.start && s.scheduledAt <= period.end
        )
    );

    const settlementsArray = await settlements;
    const totalSettlements = settlementsArray.length;
    const completedSettlements = settlementsArray.filter(
      s => s.status === SettlementStatus.COMPLETED
    );

    const totalAmount = completedSettlements.reduce(
      (sum, s) => sum.add(s.amount),
      new Decimal(0)
    );

    const totalConversionFees = completedSettlements.reduce(
      (sum, s) => sum.add(s.conversionFee || new Decimal(0)),
      new Decimal(0)
    );

    const currencyBreakdown = completedSettlements.reduce(
      (acc, s) => {
        const currency = s.currency;
        if (!acc[currency]) {
          acc[currency] = {
            count: 0,
            totalAmount: new Decimal(0),
          };
        }
        acc[currency].count++;
        acc[currency].totalAmount = acc[currency].totalAmount.add(s.amount);
        return acc;
      },
      {} as Record<string, { count: number; totalAmount: Decimal }>
    );

    return {
      merchantId,
      period,
      totalSettlements,
      completedSettlements: completedSettlements.length,
      totalAmount: totalAmount.toString(),
      totalConversionFees: totalConversionFees.toString(),
      currencyBreakdown: Object.fromEntries(
        Object.entries(currencyBreakdown).map(([currency, data]) => [
          currency,
          {
            count: data.count,
            totalAmount: data.totalAmount.toString(),
          },
        ])
      ),
    };
  }

  private groupTransactionsByCurrency(
    transactions: Transaction[]
  ): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>();

    for (const transaction of transactions) {
      const currency = transaction.currency;
      if (!groups.has(currency)) {
        groups.set(currency, []);
      }
      groups.get(currency)!.push(transaction);
    }

    return groups;
  }

  private getMixedCurrencyLabel(
    transactionsByCurrency: Map<string, Transaction[]>
  ): string {
    const currencies = Array.from(transactionsByCurrency.keys());
    if (currencies.length === 1) {
      return currencies[0];
    }
    return `MIXED(${currencies.join(',')})`;
  }

  private calculateWeightedAverageRate(
    conversionDetails: Array<{
      currency: string;
      amount: Decimal;
      convertedAmount: Decimal;
      exchangeRate: Decimal;
      conversionFee: Decimal;
    }>
  ): Decimal {
    if (conversionDetails.length === 0) {
      return new Decimal(1);
    }

    let totalWeight = new Decimal(0);
    let weightedSum = new Decimal(0);

    for (const detail of conversionDetails) {
      const weight = detail.amount;
      totalWeight = totalWeight.add(weight);
      weightedSum = weightedSum.add(detail.exchangeRate.mul(weight));
    }

    return totalWeight.isZero() ? new Decimal(1) : weightedSum.div(totalWeight);
  }

  private async simulateSettlementProcessing(
    settlement: Settlement
  ): Promise<void> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would:
    // 1. Validate merchant account details
    // 2. Initiate bank transfer or payment gateway settlement
    // 3. Handle any settlement failures or retries
    // 4. Update settlement status based on external system responses

    logger.debug('Settlement processing simulation completed', {
      settlementId: settlement.id,
      amount: settlement.amount.toString(),
      currency: settlement.currency,
    });
  }

  private generateSettlementId(): string {
    return `settle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
