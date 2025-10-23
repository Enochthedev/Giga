import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  LocalizationSettings,
  RegionalReport,
} from '../types/localization.types';
import { Transaction } from '../types/payment.types';
import { ComplianceCheckingService } from './compliance-checking.service';
import { RegionalPaymentMethodsService } from './regional-payment-methods.service';
import { TaxCalculationService } from './tax-calculation.service';

export interface RegionalReportFilters {
  regions?: string[];
  startDate: Date;
  endDate: Date;
  includePaymentMethods?: boolean;
  includeTaxBreakdown?: boolean;
  includeComplianceMetrics?: boolean;
  transactionTypes?: string[];
  minimumAmount?: Decimal;
  maximumAmount?: Decimal;
}

export interface ConsolidatedRegionalReport {
  reportGeneratedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  totalRegions: number;
  regionalReports: RegionalReport[];
  summary: {
    totalTransactions: number;
    totalVolume: Decimal;
    totalTaxCollected: Decimal;
    totalComplianceChecks: number;
    overallComplianceRate: number;
    topRegionsByVolume: Array<{
      region: string;
      volume: string;
      percentage: number;
    }>;
    topPaymentMethods: Array<{
      method: string;
      count: number;
      volume: string;
      regions: string[];
    }>;
  };
}

export class RegionalReportingService {
  private settings: LocalizationSettings;
  private taxService: TaxCalculationService;
  private paymentMethodsService: RegionalPaymentMethodsService;
  private complianceService: ComplianceCheckingService;

  constructor(
    settings: LocalizationSettings,
    taxService: TaxCalculationService,
    paymentMethodsService: RegionalPaymentMethodsService,
    complianceService: ComplianceCheckingService
  ) {
    this.settings = settings;
    this.taxService = taxService;
    this.paymentMethodsService = paymentMethodsService;
    this.complianceService = complianceService;
  }

  async generateRegionalReport(
    transactions: Transaction[],
    region: string,
    filters: RegionalReportFilters
  ): Promise<RegionalReport> {
    logger.info('Generating regional report', {
      region,
      transactionCount: transactions.length,
      period: {
        start: filters.startDate,
        end: filters.endDate,
      },
    });

    // Filter transactions for the specific region and date range
    const filteredTransactions = this.filterTransactions(
      transactions,
      region,
      filters
    );

    // Generate transaction metrics
    const transactionMetrics = await this.generateTransactionMetrics(
      filteredTransactions,
      region,
      filters
    );

    // Generate tax metrics
    const taxMetrics = await this.generateTaxMetrics(
      filteredTransactions,
      region
    );

    // Generate compliance metrics
    const complianceMetrics = await this.generateComplianceMetrics(
      filteredTransactions,
      region
    );

    const report: RegionalReport = {
      region,
      period: {
        start: filters.startDate,
        end: filters.endDate,
      },
      transactionMetrics,
      taxMetrics,
      complianceMetrics,
    };

    logger.info('Regional report generated', {
      region,
      totalTransactions: transactionMetrics.totalTransactions,
      totalVolume: transactionMetrics.totalVolume.toString(),
      totalTaxCollected: taxMetrics.totalTaxCollected.toString(),
      complianceRate: complianceMetrics.complianceRate,
    });

    return report;
  }

  async generateConsolidatedReport(
    transactions: Transaction[],
    filters: RegionalReportFilters
  ): Promise<ConsolidatedRegionalReport> {
    logger.info('Generating consolidated regional report', {
      totalTransactions: transactions.length,
      regions: filters.regions,
      period: {
        start: filters.startDate,
        end: filters.endDate,
      },
    });

    const regions = filters.regions || this.settings.supportedRegions;
    const regionalReports: RegionalReport[] = [];

    // Generate individual regional reports
    for (const region of regions) {
      const report = await this.generateRegionalReport(
        transactions,
        region,
        filters
      );
      regionalReports.push(report);
    }

    // Generate consolidated summary
    const summary = this.generateConsolidatedSummary(regionalReports);

    const consolidatedReport: ConsolidatedRegionalReport = {
      reportGeneratedAt: new Date(),
      period: {
        start: filters.startDate,
        end: filters.endDate,
      },
      totalRegions: regions.length,
      regionalReports,
      summary,
    };

    logger.info('Consolidated regional report generated', {
      totalRegions: regions.length,
      totalTransactions: summary.totalTransactions,
      totalVolume: summary.totalVolume.toString(),
      overallComplianceRate: summary.overallComplianceRate,
    });

    return consolidatedReport;
  }

  async exportRegionalReport(
    report: RegionalReport | ConsolidatedRegionalReport,
    format: 'json' | 'csv' | 'pdf'
  ): Promise<string> {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);

      case 'csv':
        return this.generateCSVReport(report);

      case 'pdf':
        // In a real implementation, this would generate a PDF
        return this.generatePDFReport(report);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  async getRegionalComplianceSummary(
    region: string,
    period: { start: Date; end: Date }
  ): Promise<{
    region: string;
    period: { start: Date; end: Date };
    totalChecks: number;
    checksByType: Record<string, number>;
    checksByStatus: Record<string, number>;
    criticalFlags: number;
    averageScore: number;
    topFlags: Array<{
      type: string;
      count: number;
      severity: string;
    }>;
  }> {
    // In a real implementation, this would query the database for compliance checks
    // For now, we'll return mock data

    return {
      region,
      period,
      totalChecks: 0,
      checksByType: {},
      checksByStatus: {},
      criticalFlags: 0,
      averageScore: 0,
      topFlags: [],
    };
  }

  async getPaymentMethodPerformance(
    region: string,
    period: { start: Date; end: Date }
  ): Promise<{
    region: string;
    period: { start: Date; end: Date };
    methods: Array<{
      type: string;
      name: string;
      transactionCount: number;
      volume: string;
      successRate: number;
      averageProcessingTime: string;
      totalFees: string;
    }>;
  }> {
    const regionalMethods =
      await this.paymentMethodsService.getPaymentMethodsForRegion(region);

    if (!regionalMethods) {
      return {
        region,
        period,
        methods: [],
      };
    }

    // In a real implementation, this would analyze actual transaction data
    const methods = regionalMethods.paymentMethods.map(method => ({
      type: method.type,
      name: method.name,
      transactionCount: 0,
      volume: '0',
      successRate: 0,
      averageProcessingTime: method.processingTime,
      totalFees: '0',
    }));

    return {
      region,
      period,
      methods,
    };
  }

  private filterTransactions(
    transactions: Transaction[],
    region: string,
    filters: RegionalReportFilters
  ): Transaction[] {
    return transactions.filter(tx => {
      // Filter by date range
      const txDate = tx.createdAt;
      if (txDate < filters.startDate || txDate > filters.endDate) {
        return false;
      }

      // Filter by region (assuming region is stored in metadata)
      const txRegion = tx.metadata?.region || this.settings.defaultRegion;
      if (txRegion !== region) {
        return false;
      }

      // Filter by transaction types
      if (
        filters.transactionTypes &&
        !filters.transactionTypes.includes(tx.type)
      ) {
        return false;
      }

      // Filter by amount range
      if (filters.minimumAmount && tx.amount.lt(filters.minimumAmount)) {
        return false;
      }

      if (filters.maximumAmount && tx.amount.gt(filters.maximumAmount)) {
        return false;
      }

      return true;
    });
  }

  private async generateTransactionMetrics(
    transactions: Transaction[],
    region: string,
    filters: RegionalReportFilters
  ): Promise<RegionalReport['transactionMetrics']> {
    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce(
      (sum, tx) => sum.add(tx.amount),
      new Decimal(0)
    );
    const averageTransactionAmount =
      totalTransactions > 0
        ? totalVolume.div(totalTransactions)
        : new Decimal(0);

    // Generate payment method breakdown
    const paymentMethodBreakdown: Record<
      string,
      {
        count: number;
        volume: Decimal;
        percentage: number;
      }
    > = {};

    if (filters.includePaymentMethods) {
      const methodCounts: Record<string, { count: number; volume: Decimal }> =
        {};

      for (const tx of transactions) {
        const methodType = tx.metadata?.paymentMethodType || 'UNKNOWN';

        if (!methodCounts[methodType]) {
          methodCounts[methodType] = { count: 0, volume: new Decimal(0) };
        }

        methodCounts[methodType].count++;
        methodCounts[methodType].volume = methodCounts[methodType].volume.add(
          tx.amount
        );
      }

      for (const [method, data] of Object.entries(methodCounts)) {
        paymentMethodBreakdown[method] = {
          count: data.count,
          volume: data.volume,
          percentage:
            totalTransactions > 0 ? (data.count / totalTransactions) * 100 : 0,
        };
      }
    }

    return {
      totalTransactions,
      totalVolume,
      averageTransactionAmount,
      paymentMethodBreakdown,
    };
  }

  private async generateTaxMetrics(
    transactions: Transaction[],
    region: string
  ): Promise<RegionalReport['taxMetrics']> {
    let totalTaxCollected = new Decimal(0);
    const taxByType: Record<string, Decimal> = {};
    let exemptTransactions = 0;
    let exemptVolume = new Decimal(0);

    for (const tx of transactions) {
      const taxData = tx.metadata?.taxCalculation;

      if (taxData) {
        if (taxData.isExempt) {
          exemptTransactions++;
          exemptVolume = exemptVolume.add(tx.amount);
        } else {
          const taxAmount = new Decimal(taxData.taxAmount || 0);
          totalTaxCollected = totalTaxCollected.add(taxAmount);

          // Breakdown by tax type
          if (taxData.breakdown) {
            for (const breakdown of taxData.breakdown) {
              const type = breakdown.type;
              const amount = new Decimal(breakdown.amount);

              if (!taxByType[type]) {
                taxByType[type] = new Decimal(0);
              }
              taxByType[type] = taxByType[type].add(amount);
            }
          }
        }
      }
    }

    return {
      totalTaxCollected,
      taxByType,
      exemptTransactions,
      exemptVolume,
    };
  }

  private async generateComplianceMetrics(
    transactions: Transaction[],
    region: string
  ): Promise<RegionalReport['complianceMetrics']> {
    // In a real implementation, this would query compliance checks from the database
    // For now, we'll return mock data based on transaction analysis

    const totalChecks = transactions.length; // Assume one check per transaction
    const passedChecks = Math.floor(totalChecks * 0.85); // 85% pass rate
    const failedChecks = Math.floor(totalChecks * 0.1); // 10% fail rate
    const pendingChecks = totalChecks - passedChecks - failedChecks;

    const complianceRate =
      totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

    const flagsByType: Record<string, number> = {
      HIGH_VALUE_TRANSACTION: Math.floor(totalChecks * 0.05),
      INSUFFICIENT_VERIFICATION: Math.floor(totalChecks * 0.03),
      MISSING_CONSENT: Math.floor(totalChecks * 0.02),
    };

    return {
      totalChecks,
      passedChecks,
      failedChecks,
      pendingChecks,
      complianceRate,
      flagsByType,
    };
  }

  private generateConsolidatedSummary(
    regionalReports: RegionalReport[]
  ): ConsolidatedRegionalReport['summary'] {
    const totalTransactions = regionalReports.reduce(
      (sum, report) => sum + report.transactionMetrics.totalTransactions,
      0
    );

    const totalVolume = regionalReports.reduce(
      (sum, report) => sum.add(report.transactionMetrics.totalVolume),
      new Decimal(0)
    );

    const totalTaxCollected = regionalReports.reduce(
      (sum, report) => sum.add(report.taxMetrics.totalTaxCollected),
      new Decimal(0)
    );

    const totalComplianceChecks = regionalReports.reduce(
      (sum, report) => sum + report.complianceMetrics.totalChecks,
      0
    );

    const totalPassedChecks = regionalReports.reduce(
      (sum, report) => sum + report.complianceMetrics.passedChecks,
      0
    );

    const overallComplianceRate =
      totalComplianceChecks > 0
        ? (totalPassedChecks / totalComplianceChecks) * 100
        : 0;

    // Top regions by volume
    const topRegionsByVolume = regionalReports
      .map(report => ({
        region: report.region,
        volume: report.transactionMetrics.totalVolume.toString(),
        percentage: totalVolume.gt(0)
          ? report.transactionMetrics.totalVolume
              .div(totalVolume)
              .mul(100)
              .toNumber()
          : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Aggregate payment methods across regions
    const paymentMethodAggregation: Record<
      string,
      {
        count: number;
        volume: Decimal;
        regions: Set<string>;
      }
    > = {};

    for (const report of regionalReports) {
      for (const [method, data] of Object.entries(
        report.transactionMetrics.paymentMethodBreakdown
      )) {
        if (!paymentMethodAggregation[method]) {
          paymentMethodAggregation[method] = {
            count: 0,
            volume: new Decimal(0),
            regions: new Set(),
          };
        }

        paymentMethodAggregation[method].count += data.count;
        paymentMethodAggregation[method].volume = paymentMethodAggregation[
          method
        ].volume.add(data.volume);
        paymentMethodAggregation[method].regions.add(report.region);
      }
    }

    const topPaymentMethods = Object.entries(paymentMethodAggregation)
      .map(([method, data]) => ({
        method,
        count: data.count,
        volume: data.volume.toString(),
        regions: Array.from(data.regions),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalTransactions,
      totalVolume,
      totalTaxCollected,
      totalComplianceChecks,
      overallComplianceRate,
      topRegionsByVolume,
      topPaymentMethods,
    };
  }

  private generateCSVReport(
    report: RegionalReport | ConsolidatedRegionalReport
  ): string {
    if ('regionalReports' in report) {
      // Consolidated report
      const headers = [
        'Region',
        'Total Transactions',
        'Total Volume',
        'Average Transaction Amount',
        'Total Tax Collected',
        'Compliance Rate',
      ];

      const rows = report.regionalReports.map(r => [
        r.region,
        r.transactionMetrics.totalTransactions.toString(),
        r.transactionMetrics.totalVolume.toString(),
        r.transactionMetrics.averageTransactionAmount.toString(),
        r.taxMetrics.totalTaxCollected.toString(),
        r.complianceMetrics.complianceRate.toFixed(2) + '%',
      ]);

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    } else {
      // Single regional report
      const headers = ['Metric', 'Value'];

      const rows = [
        ['Region', report.region],
        [
          'Total Transactions',
          report.transactionMetrics.totalTransactions.toString(),
        ],
        ['Total Volume', report.transactionMetrics.totalVolume.toString()],
        [
          'Average Transaction Amount',
          report.transactionMetrics.averageTransactionAmount.toString(),
        ],
        ['Total Tax Collected', report.taxMetrics.totalTaxCollected.toString()],
        [
          'Compliance Rate',
          report.complianceMetrics.complianceRate.toFixed(2) + '%',
        ],
      ];

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }

  private generatePDFReport(
    report: RegionalReport | ConsolidatedRegionalReport
  ): string {
    // In a real implementation, this would generate an actual PDF
    // For now, return a formatted text representation
    return `PDF Report Generated: ${JSON.stringify(report, null, 2)}`;
  }
}
