import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  LocalizationSettings,
  Region,
  TaxBreakdown,
  TaxCalculationRequest,
  TaxCalculationResult,
  TaxConfiguration,
} from '../types/localization.types';

export class TaxCalculationService {
  private settings: LocalizationSettings;
  private regions: Map<string, Region> = new Map();

  constructor(settings: LocalizationSettings) {
    this.settings = settings;
    this.initializeRegions();
  }

  private initializeRegions(): void {
    // Initialize with common regions and their tax configurations
    const regions: Region[] = [
      {
        code: 'US',
        name: 'United States',
        currency: 'USD',
        timezone: 'America/New_York',
        locale: 'en-US',
        isActive: true,
        supportedPaymentMethods: [],
        taxConfiguration: {
          salesTaxRate: new Decimal(8.25), // Average US sales tax
          taxInclusivePricing: false,
          taxCalculationMethod: 'exclusive',
          taxIdRequired: false,
          reverseChargeApplicable: false,
        },
        complianceRequirements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'GB',
        name: 'United Kingdom',
        currency: 'GBP',
        timezone: 'Europe/London',
        locale: 'en-GB',
        isActive: true,
        supportedPaymentMethods: [],
        taxConfiguration: {
          vatRate: new Decimal(20), // UK VAT rate
          taxInclusivePricing: true,
          taxCalculationMethod: 'inclusive',
          taxIdRequired: true,
          reverseChargeApplicable: true,
        },
        complianceRequirements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'DE',
        name: 'Germany',
        currency: 'EUR',
        timezone: 'Europe/Berlin',
        locale: 'de-DE',
        isActive: true,
        supportedPaymentMethods: [],
        taxConfiguration: {
          vatRate: new Decimal(19), // German VAT rate
          taxInclusivePricing: true,
          taxCalculationMethod: 'inclusive',
          taxIdRequired: true,
          reverseChargeApplicable: true,
        },
        complianceRequirements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'CA',
        name: 'Canada',
        currency: 'CAD',
        timezone: 'America/Toronto',
        locale: 'en-CA',
        isActive: true,
        supportedPaymentMethods: [],
        taxConfiguration: {
          vatRate: new Decimal(13), // HST in Ontario
          salesTaxRate: new Decimal(5), // GST
          taxInclusivePricing: false,
          taxCalculationMethod: 'compound',
          taxIdRequired: false,
          reverseChargeApplicable: false,
        },
        complianceRequirements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'NG',
        name: 'Nigeria',
        currency: 'NGN',
        timezone: 'Africa/Lagos',
        locale: 'en-NG',
        isActive: true,
        supportedPaymentMethods: [],
        taxConfiguration: {
          vatRate: new Decimal(7.5), // Nigerian VAT rate
          witholdingTaxRate: new Decimal(5), // Withholding tax
          taxInclusivePricing: false,
          taxCalculationMethod: 'exclusive',
          taxIdRequired: true,
          reverseChargeApplicable: false,
        },
        complianceRequirements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'IN',
        name: 'India',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        locale: 'en-IN',
        isActive: true,
        supportedPaymentMethods: [],
        taxConfiguration: {
          vatRate: new Decimal(18), // GST rate
          taxInclusivePricing: true,
          taxCalculationMethod: 'inclusive',
          taxIdRequired: true,
          reverseChargeApplicable: true,
        },
        complianceRequirements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const region of regions) {
      this.regions.set(region.code, region);
    }

    logger.info('Tax calculation service initialized', {
      regionsCount: this.regions.size,
      supportedRegions: Array.from(this.regions.keys()),
    });
  }

  async calculateTax(
    request: TaxCalculationRequest
  ): Promise<TaxCalculationResult> {
    logger.debug('Calculating tax', {
      amount: request.amount.toString(),
      currency: request.currency,
      region: request.region,
      transactionType: request.transactionType,
    });

    if (!this.settings.taxCalculationEnabled) {
      return this.createNoTaxResult(request);
    }

    const region = this.regions.get(request.region);
    if (!region) {
      logger.warn('Region not found for tax calculation', {
        region: request.region,
      });
      return this.createNoTaxResult(request);
    }

    // Check for tax exemption
    if (request.isExempt) {
      return this.createExemptResult(request);
    }

    const taxConfig = region.taxConfiguration;
    const breakdown: TaxBreakdown[] = [];
    let totalTaxAmount = new Decimal(0);

    // Calculate VAT/GST
    if (taxConfig.vatRate && taxConfig.vatRate.gt(0)) {
      const vatAmount = this.calculateVAT(
        request.amount,
        taxConfig.vatRate,
        taxConfig.taxCalculationMethod
      );
      breakdown.push({
        type: 'VAT',
        rate: taxConfig.vatRate,
        amount: vatAmount,
        description: `VAT at ${taxConfig.vatRate}%`,
      });
      totalTaxAmount = totalTaxAmount.add(vatAmount);
    }

    // Calculate Sales Tax (US)
    if (taxConfig.salesTaxRate && taxConfig.salesTaxRate.gt(0)) {
      const salesTaxAmount = this.calculateSalesTax(
        request.amount,
        taxConfig.salesTaxRate
      );
      breakdown.push({
        type: 'SALES_TAX',
        rate: taxConfig.salesTaxRate,
        amount: salesTaxAmount,
        description: `Sales Tax at ${taxConfig.salesTaxRate}%`,
      });
      totalTaxAmount = totalTaxAmount.add(salesTaxAmount);
    }

    // Calculate Withholding Tax
    if (
      taxConfig.witholdingTaxRate &&
      taxConfig.witholdingTaxRate.gt(0) &&
      this.isWithholdingTaxApplicable(request)
    ) {
      const withholdingTaxAmount = this.calculateWithholdingTax(
        request.amount,
        taxConfig.witholdingTaxRate
      );
      breakdown.push({
        type: 'WITHHOLDING_TAX',
        rate: taxConfig.witholdingTaxRate,
        amount: withholdingTaxAmount,
        description: `Withholding Tax at ${taxConfig.witholdingTaxRate}%`,
      });
      totalTaxAmount = totalTaxAmount.add(withholdingTaxAmount);
    }

    // Handle compound tax calculation (Canada)
    if (taxConfig.taxCalculationMethod === 'compound' && breakdown.length > 1) {
      totalTaxAmount = this.calculateCompoundTax(request.amount, breakdown);
    }

    const totalAmount = taxConfig.taxInclusivePricing
      ? request.amount
      : request.amount.add(totalTaxAmount);

    const result: TaxCalculationResult = {
      originalAmount: request.amount,
      taxAmount: totalTaxAmount,
      totalAmount,
      taxRate: this.calculateEffectiveTaxRate(breakdown),
      taxType: this.determineTaxType(breakdown),
      breakdown,
      isExempt: false,
      calculatedAt: new Date(),
    };

    logger.info('Tax calculation completed', {
      region: request.region,
      originalAmount: request.amount.toString(),
      taxAmount: totalTaxAmount.toString(),
      totalAmount: totalAmount.toString(),
      effectiveTaxRate: result.taxRate.toString(),
    });

    return result;
  }

  async validateTaxId(
    taxId: string,
    region: string,
    customerType: 'individual' | 'business'
  ): Promise<boolean> {
    // In a real implementation, this would validate against regional tax authorities
    // For now, we'll do basic format validation

    const regionConfig = this.regions.get(region);
    if (!regionConfig || !regionConfig.taxConfiguration.taxIdRequired) {
      return true; // Tax ID not required for this region
    }

    // Basic validation patterns for different regions
    const validationPatterns: Record<string, RegExp> = {
      US: /^\d{2}-\d{7}$/, // EIN format
      GB: /^GB\d{9}$/, // UK VAT number
      DE: /^DE\d{9}$/, // German VAT number
      CA: /^\d{9}RT\d{4}$/, // Canadian GST/HST number
      NG: /^\d{8}-\d{4}$/, // Nigerian TIN
      IN: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, // Indian GSTIN
    };

    const pattern = validationPatterns[region];
    if (!pattern) {
      logger.warn('No tax ID validation pattern for region', { region });
      return true; // Allow if no pattern defined
    }

    const isValid = pattern.test(taxId);

    logger.debug('Tax ID validation', {
      taxId: taxId.substring(0, 4) + '****', // Mask for security
      region,
      customerType,
      isValid,
    });

    return isValid;
  }

  async getTaxConfiguration(region: string): Promise<TaxConfiguration | null> {
    const regionConfig = this.regions.get(region);
    return regionConfig?.taxConfiguration || null;
  }

  async getSupportedRegions(): Promise<string[]> {
    return Array.from(this.regions.keys()).filter(
      code => this.regions.get(code)?.isActive
    );
  }

  async getRegionInfo(regionCode: string): Promise<Region | null> {
    return this.regions.get(regionCode) || null;
  }

  private calculateVAT(
    amount: Decimal,
    vatRate: Decimal,
    method: string
  ): Decimal {
    if (method === 'inclusive') {
      // VAT = (Amount * VAT Rate) / (100 + VAT Rate)
      return amount.mul(vatRate).div(new Decimal(100).add(vatRate));
    } else {
      // VAT = Amount * (VAT Rate / 100)
      return amount.mul(vatRate.div(100));
    }
  }

  private calculateSalesTax(amount: Decimal, salesTaxRate: Decimal): Decimal {
    return amount.mul(salesTaxRate.div(100));
  }

  private calculateWithholdingTax(
    amount: Decimal,
    withholdingTaxRate: Decimal
  ): Decimal {
    return amount.mul(withholdingTaxRate.div(100));
  }

  private calculateCompoundTax(
    amount: Decimal,
    breakdown: TaxBreakdown[]
  ): Decimal {
    // For compound tax (like Canada GST + PST), calculate each tax on the base amount plus previous taxes
    let runningTotal = amount;
    let totalTax = new Decimal(0);

    for (const tax of breakdown) {
      const taxAmount = runningTotal.mul(tax.rate.div(100));
      totalTax = totalTax.add(taxAmount);
      runningTotal = runningTotal.add(taxAmount);

      // Update the breakdown with the compound calculation
      tax.amount = taxAmount;
    }

    return totalTax;
  }

  private calculateEffectiveTaxRate(breakdown: TaxBreakdown[]): Decimal {
    if (breakdown.length === 0) {
      return new Decimal(0);
    }

    // For multiple taxes, return the combined rate
    return breakdown.reduce((sum, tax) => sum.add(tax.rate), new Decimal(0));
  }

  private determineTaxType(breakdown: TaxBreakdown[]): string {
    if (breakdown.length === 0) {
      return 'NONE';
    }

    if (breakdown.length === 1) {
      return breakdown[0].type;
    }

    return 'COMPOSITE';
  }

  private isWithholdingTaxApplicable(request: TaxCalculationRequest): boolean {
    // Withholding tax typically applies to business transactions above certain thresholds
    return (
      request.customerType === 'business' &&
      request.amount.gte(new Decimal(1000))
    );
  }

  private createNoTaxResult(
    request: TaxCalculationRequest
  ): TaxCalculationResult {
    return {
      originalAmount: request.amount,
      taxAmount: new Decimal(0),
      totalAmount: request.amount,
      taxRate: new Decimal(0),
      taxType: 'NONE',
      breakdown: [],
      isExempt: false,
      calculatedAt: new Date(),
    };
  }

  private createExemptResult(
    request: TaxCalculationRequest
  ): TaxCalculationResult {
    return {
      originalAmount: request.amount,
      taxAmount: new Decimal(0),
      totalAmount: request.amount,
      taxRate: new Decimal(0),
      taxType: 'EXEMPT',
      breakdown: [],
      isExempt: true,
      exemptionReason: request.exemptionReason,
      calculatedAt: new Date(),
    };
  }
}
