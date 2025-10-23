import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  CurrencyReport,
  CurrencySettings,
  Settlement,
} from '../types/currency.types';
import { Transaction } from '../types/payment.types';
import { CurrencyConversionService } from './currency-conversion.service';
import { MultiCurrencySettlementService } from './multi-currency-settlement.service';

export interface CurrencyReportFilters {
  merchantId?: string;
  currencies?: string[];
  startDate: Date;
  endDate: Date;
  includeConversions?: boolean;
  includeSettlements?: boolean;
}

export interface ConversionAnalytics {
  totalConversions: number;
  totalConversionVolume: Decimal;
  totalConversionFees: Decimal;
  averageConversionFee: Decimal;
  conversionsByPair: Record<
    string,
    {
      count: number;
      volume: Decimal;
      fees: Decimal;
      averageRate: Decimal;
    }
  >;
  topConversionPairs: Array<{
    pair: string;
    count: number;
    volume: string;
    fees: string;
  }>;
}

export interface SettlementAnalytics {
  totalSettlements: number;
  totalSettlementVolume: Decimal;
  totalConversionFees: Decimal;
  settlementsByCurrency: Record<
    string,
    {
      count: number;
      volume: Decimal;
      fees: Decimal;
    }
  >;
  averageSettlementAmount: Decimal;
  settlementsByStatus: Record<string, number>;
}

export interface CurrencyPerformanceReport {
  currency: string;
  transactionMetrics: {
    totalTransactions: number;
    totalVolume: Decimal;
    averageTransactionAmount: Decimal;
    successRate: number;
  };
  conversionMetrics: {
    totalConversions: number;
    totalConversionVolume: Decimal;
    totalConversionFees: Decimal;
    averageConversionRate: Decimal;
  };
  settlementMetrics: {
    totalSettlements: number;
    totalSettlementVolume: Decimal;
    averageSettlementAmount: Decimal;
  };
  period: {
    start: Date;
    end: Date;
  };
}

export class CurrencyReportingService {
  private conversionService: CurrencyConversionService;
  private settlementService: MultiCurrencySettlementService;
  private settings: CurrencySettings;

  constructor(
    conversionService: CurrencyConversionService,
    settlementService: MultiCurrencySettlementService,
    settings: CurrencySettings
  ) {
    this.conversionService = conversionService;
    this.settlementService = settlementService;
    this.settings = settings;
  }

  async generateCurrencyReport(
    transactions: Transaction[],
    filters: CurrencyReportFilters
  ): Promise<CurrencyReport[]> {
    logger.info('Generating currency report', {
      transactionCount: transactions.length,
      filters,
    });

    // Filter transactions by date range and merchant
    const filteredTransactions = transactions.filter(tx => {
      const txDate = tx.createdAt;
      const inDateRange =
        txDate >= filters.startDate && txDate <= filters.endDate;
      const matchesMerchant =
        !filters.merchantId || tx.merchantId === filters.merchantId;
      const matchesCurrency =
        !filters.currencies || filters.currencies.includes(tx.currency);

      return inDateRange && matchesMerchant && matchesCurrency;
    });

    // Group transactions by currency
    const transactionsByCurrency =
      this.groupTransactionsByCurrency(filteredTransactions);

    const reports: CurrencyReport[] = [];

    for (const [currency, currencyTransactions] of transactionsByCurrency) {
      const report = await this.generateCurrencySpecificReport(
        currency,
        currencyTransactions,
        filters
      );
      reports.push(report);
    }

    // Sort by total volume descending
    reports.sort((a, b) => b.totalVolume.cmp(a.totalVolume));

    logger.info('Currency report generated', {
      currenciesCount: reports.length,
      totalTransactions: filteredTransactions.length,
    });

    return reports;
  }

  async generateConversionAnalytics(
    filters: CurrencyReportFilters
  ): Promise<ConversionAnalytics> {
    const conversions = await this.conversionService.getConversionHistory();

    const filteredConversions = conversions.filter(conv => {
      const convDate = conv.convertedAt;
      return convDate >= filters.startDate && convDate <= filters.endDate;
    });

    const totalConversions = filteredConversions.length;
    const totalConversionVolume = filteredConversions.reduce(
      (sum, conv) => sum.add(conv.fromAmount),
      new Decimal(0)
    );
    const totalConversionFees = filteredConversions.reduce(
      (sum, conv) => sum.add(conv.fee || new Decimal(0)),
      new Decimal(0)
    );

    const averageConversionFee =
      totalConversions > 0
        ? totalConversionFees.div(totalConversions)
        : new Decimal(0);

    // Group by currency pair
    const conversionsByPair: Record<
      string,
      {
        count: number;
        volume: Decimal;
        fees: Decimal;
        rates: Decimal[];
      }
    > = {};

    for (const conversion of filteredConversions) {
      const pair = `${conversion.fromCurrency}-${conversion.toCurrency}`;

      if (!conversionsByPair[pair]) {
        conversionsByPair[pair] = {
          count: 0,
          volume: new Decimal(0),
          fees: new Decimal(0),
          rates: [],
        };
      }

      conversionsByPair[pair].count++;
      conversionsByPair[pair].volume = conversionsByPair[pair].volume.add(
        conversion.fromAmount
      );
      conversionsByPair[pair].fees = conversionsByPair[pair].fees.add(
        conversion.fee || new Decimal(0)
      );
      conversionsByPair[pair].rates.push(conversion.exchangeRate);
    }

    // Calculate average rates and format for response
    const formattedConversionsByPair: Record<
      string,
      {
        count: number;
        volume: Decimal;
        fees: Decimal;
        averageRate: Decimal;
      }
    > = {};

    for (const [pair, data] of Object.entries(conversionsByPair)) {
      const averageRate =
        data.rates.length > 0
          ? data.rates
              .reduce((sum, rate) => sum.add(rate), new Decimal(0))
              .div(data.rates.length)
          : new Decimal(0);

      formattedConversionsByPair[pair] = {
        count: data.count,
        volume: data.volume,
        fees: data.fees,
        averageRate,
      };
    }

    // Get top conversion pairs by volume
    const topConversionPairs = Object.entries(formattedConversionsByPair)
      .sort(([, a], [, b]) => b.volume.cmp(a.volume))
      .slice(0, 10)
      .map(([pair, data]) => ({
        pair,
        count: data.count,
        volume: data.volume.toString(),
        fees: data.fees.toString(),
      }));

    return {
      totalConversions,
      totalConversionVolume,
      totalConversionFees,
      averageConversionFee,
      conversionsByPair: formattedConversionsByPair,
      topConversionPairs,
    };
  }

  async generateSettlementAnalytics(
    filters: CurrencyReportFilters
  ): Promise<SettlementAnalytics> {
    // Get all settlements (in a real implementation, this would query the database)
    const allSettlements: Settlement[] = [];

    // Filter settlements by date range and merchant
    const filteredSettlements = allSettlements.filter(settlement => {
      const settlementDate = settlement.scheduledAt;
      const inDateRange =
        settlementDate >= filters.startDate &&
        settlementDate <= filters.endDate;
      const matchesMerchant =
        !filters.merchantId || settlement.merchantId === filters.merchantId;

      return inDateRange && matchesMerchant;
    });

    const totalSettlements = filteredSettlements.length;
    const totalSettlementVolume = filteredSettlements.reduce(
      (sum, settlement) => sum.add(settlement.amount),
      new Decimal(0)
    );
    const totalConversionFees = filteredSettlements.reduce(
      (sum, settlement) => sum.add(settlement.conversionFee || new Decimal(0)),
      new Decimal(0)
    );

    const averageSettlementAmount =
      totalSettlements > 0
        ? totalSettlementVolume.div(totalSettlements)
        : new Decimal(0);

    // Group by currency
    const settlementsByCurrency: Record<
      string,
      {
        count: number;
        volume: Decimal;
        fees: Decimal;
      }
    > = {};

    for (const settlement of filteredSettlements) {
      const currency = settlement.currency;

      if (!settlementsByCurrency[currency]) {
        settlementsByCurrency[currency] = {
          count: 0,
          volume: new Decimal(0),
          fees: new Decimal(0),
        };
      }

      settlementsByCurrency[currency].count++;
      settlementsByCurrency[currency].volume = settlementsByCurrency[
        currency
      ].volume.add(settlement.amount);
      settlementsByCurrency[currency].fees = settlementsByCurrency[
        currency
      ].fees.add(settlement.conversionFee || new Decimal(0));
    }

    // Group by status
    const settlementsByStatus: Record<string, number> = {};
    for (const settlement of filteredSettlements) {
      const status = settlement.status;
      settlementsByStatus[status] = (settlementsByStatus[status] || 0) + 1;
    }

    return {
      totalSettlements,
      totalSettlementVolume,
      totalConversionFees,
      settlementsByCurrency,
      averageSettlementAmount,
      settlementsByStatus,
    };
  }

  async generateCurrencyPerformanceReport(
    currency: string,
    transactions: Transaction[],
    filters: CurrencyReportFilters
  ): Promise<CurrencyPerformanceReport> {
    // Filter transactions for the specific currency
    const currencyTransactions = transactions.filter(
      tx =>
        tx.currency === currency &&
        tx.createdAt >= filters.startDate &&
        tx.createdAt <= filters.endDate &&
        (!filters.merchantId || tx.merchantId === filters.merchantId)
    );

    // Transaction metrics
    const totalTransactions = currencyTransactions.length;
    const totalVolume = currencyTransactions.reduce(
      (sum, tx) => sum.add(tx.amount),
      new Decimal(0)
    );
    const averageTransactionAmount =
      totalTransactions > 0
        ? totalVolume.div(totalTransactions)
        : new Decimal(0);

    const successfulTransactions = currencyTransactions.filter(
      tx => tx.status === 'SUCCEEDED'
    );
    const successRate =
      totalTransactions > 0
        ? successfulTransactions.length / totalTransactions
        : 0;

    // Conversion metrics
    const conversions = await this.conversionService.getConversionHistory();
    const currencyConversions = conversions.filter(
      conv =>
        (conv.fromCurrency === currency || conv.toCurrency === currency) &&
        conv.convertedAt >= filters.startDate &&
        conv.convertedAt <= filters.endDate
    );

    const totalConversions = currencyConversions.length;
    const totalConversionVolume = currencyConversions.reduce(
      (sum, conv) => sum.add(conv.fromAmount),
      new Decimal(0)
    );
    const totalConversionFees = currencyConversions.reduce(
      (sum, conv) => sum.add(conv.fee || new Decimal(0)),
      new Decimal(0)
    );
    const averageConversionRate =
      totalConversions > 0
        ? currencyConversions
            .reduce((sum, conv) => sum.add(conv.exchangeRate), new Decimal(0))
            .div(totalConversions)
        : new Decimal(0);

    // Settlement metrics (placeholder - would need actual settlement data)
    const totalSettlements = 0;
    const totalSettlementVolume = new Decimal(0);
    const averageSettlementAmount = new Decimal(0);

    return {
      currency,
      transactionMetrics: {
        totalTransactions,
        totalVolume,
        averageTransactionAmount,
        successRate,
      },
      conversionMetrics: {
        totalConversions,
        totalConversionVolume,
        totalConversionFees,
        averageConversionRate,
      },
      settlementMetrics: {
        totalSettlements,
        totalSettlementVolume,
        averageSettlementAmount,
      },
      period: {
        start: filters.startDate,
        end: filters.endDate,
      },
    };
  }

  async exportCurrencyReport(
    reports: CurrencyReport[],
    format: 'json' | 'csv'
  ): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(reports, null, 2);
    }

    if (format === 'csv') {
      const headers = [
        'Currency',
        'Total Transactions',
        'Total Volume',
        'Average Transaction Amount',
        'Conversion Volume',
        'Conversion Fees',
        'Period Start',
        'Period End',
      ];

      const rows = reports.map(report => [
        report.currency,
        report.totalTransactions.toString(),
        report.totalVolume.toString(),
        report.averageTransactionAmount.toString(),
        report.conversionVolume?.toString() || '0',
        report.conversionFees?.toString() || '0',
        report.period.start.toISOString(),
        report.period.end.toISOString(),
      ]);

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    throw new Error(`Unsupported export format: ${format}`);
  }

  private async generateCurrencySpecificReport(
    currency: string,
    transactions: Transaction[],
    filters: CurrencyReportFilters
  ): Promise<CurrencyReport> {
    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce(
      (sum, tx) => sum.add(tx.amount),
      new Decimal(0)
    );
    const averageTransactionAmount =
      totalTransactions > 0
        ? totalVolume.div(totalTransactions)
        : new Decimal(0);

    let conversionVolume: Decimal | undefined;
    let conversionFees: Decimal | undefined;

    if (filters.includeConversions) {
      const conversions = await this.conversionService.getConversionHistory();
      const currencyConversions = conversions.filter(
        conv =>
          (conv.fromCurrency === currency || conv.toCurrency === currency) &&
          conv.convertedAt >= filters.startDate &&
          conv.convertedAt <= filters.endDate
      );

      conversionVolume = currencyConversions.reduce(
        (sum, conv) => sum.add(conv.fromAmount),
        new Decimal(0)
      );
      conversionFees = currencyConversions.reduce(
        (sum, conv) => sum.add(conv.fee || new Decimal(0)),
        new Decimal(0)
      );
    }

    return {
      currency,
      totalTransactions,
      totalVolume,
      averageTransactionAmount,
      conversionVolume,
      conversionFees,
      period: {
        start: filters.startDate,
        end: filters.endDate,
      },
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
}
