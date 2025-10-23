import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  ConversionRequest,
  ConversionResponse,
  CurrencyConversion,
  CurrencySettings,
  CurrencyValidationResult,
} from '../types/currency.types';
import { ExchangeRateService } from './exchange-rate.service';

export class CurrencyConversionService {
  private exchangeRateService: ExchangeRateService;
  private settings: CurrencySettings;
  private conversionHistory: Map<string, CurrencyConversion> = new Map();

  constructor(
    exchangeRateService: ExchangeRateService,
    settings: CurrencySettings
  ) {
    this.exchangeRateService = exchangeRateService;
    this.settings = settings;
  }

  async convertCurrency(
    request: ConversionRequest
  ): Promise<ConversionResponse> {
    // Validate currencies
    const validation = await this.validateCurrencies(
      request.fromCurrency,
      request.toCurrency
    );
    if (!validation.isValid) {
      throw new Error(
        `Currency validation failed: ${validation.errors.join(', ')}`
      );
    }

    // Get exchange rate
    const exchangeRate = await this.exchangeRateService.getExchangeRate(
      request.fromCurrency,
      request.toCurrency
    );

    // Calculate converted amount
    const convertedAmount = request.amount.mul(exchangeRate.rate);

    // Calculate conversion fee
    const fee = this.calculateConversionFee(
      request.amount,
      request.fromCurrency
    );
    const feePercentage = this.settings.conversionFeePercentage;

    // Create conversion record
    const conversionId = this.generateConversionId();
    const conversion: CurrencyConversion = {
      id: conversionId,
      fromAmount: request.amount,
      fromCurrency: request.fromCurrency,
      toAmount: convertedAmount,
      toCurrency: request.toCurrency,
      exchangeRate: exchangeRate.rate,
      provider: exchangeRate.provider,
      fee,
      feePercentage,
      convertedAt: new Date(),
      transactionId: request.transactionId,
    };

    // Store conversion history
    this.conversionHistory.set(conversionId, conversion);

    logger.info('Currency conversion completed', {
      conversionId,
      fromAmount: request.amount.toString(),
      fromCurrency: request.fromCurrency,
      toAmount: convertedAmount.toString(),
      toCurrency: request.toCurrency,
      exchangeRate: exchangeRate.rate.toString(),
      fee: fee.toString(),
      provider: exchangeRate.provider,
    });

    return {
      convertedAmount,
      exchangeRate: exchangeRate.rate,
      fee,
      feePercentage,
      provider: exchangeRate.provider,
      expiresAt: exchangeRate.expiresAt,
      conversionId,
    };
  }

  async getConversionHistory(
    transactionId?: string
  ): Promise<CurrencyConversion[]> {
    const conversions = Array.from(this.conversionHistory.values());

    if (transactionId) {
      return conversions.filter(c => c.transactionId === transactionId);
    }

    return conversions;
  }

  async getConversion(
    conversionId: string
  ): Promise<CurrencyConversion | null> {
    return this.conversionHistory.get(conversionId) || null;
  }

  async validateCurrencies(
    fromCurrency: string,
    toCurrency: string
  ): Promise<CurrencyValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if currencies are supported
    const supportedCurrencies =
      await this.exchangeRateService.getSupportedCurrencies();

    if (!supportedCurrencies.includes(fromCurrency)) {
      errors.push(`Source currency ${fromCurrency} is not supported`);
    }

    if (!supportedCurrencies.includes(toCurrency)) {
      errors.push(`Target currency ${toCurrency} is not supported`);
    }

    // Check currency format (ISO 4217)
    const currencyRegex = /^[A-Z]{3}$/;
    if (!currencyRegex.test(fromCurrency)) {
      errors.push(`Invalid source currency format: ${fromCurrency}`);
    }

    if (!currencyRegex.test(toCurrency)) {
      errors.push(`Invalid target currency format: ${toCurrency}`);
    }

    // Add warnings for exotic currency pairs
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];
    if (
      !majorCurrencies.includes(fromCurrency) &&
      !majorCurrencies.includes(toCurrency)
    ) {
      warnings.push(
        'Converting between two non-major currencies may have higher fees and less accurate rates'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async calculateConversionFee(
    amount: Decimal,
    currency: string
  ): Promise<Decimal> {
    // Base conversion fee percentage
    let feePercentage = this.settings.conversionFeePercentage;

    // Minimum fee (e.g., $0.50 equivalent)
    const minimumFeeInUSD = new Decimal(0.5);
    let minimumFee = minimumFeeInUSD;

    // Convert minimum fee to the transaction currency if not USD
    if (currency !== 'USD') {
      try {
        const conversion = await this.exchangeRateService.convertAmount(
          minimumFeeInUSD,
          'USD',
          currency
        );
        minimumFee = conversion.convertedAmount;
      } catch (error) {
        logger.warn('Failed to convert minimum fee to transaction currency', {
          currency,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Calculate percentage-based fee
    const percentageFee = amount.mul(feePercentage.div(100));

    // Use the higher of percentage fee or minimum fee
    return Decimal.max(percentageFee, minimumFee);
  }

  async getConversionRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<Decimal> {
    const exchangeRate = await this.exchangeRateService.getExchangeRate(
      fromCurrency,
      toCurrency
    );
    return exchangeRate.rate;
  }

  async getSupportedCurrencies(): Promise<string[]> {
    return this.exchangeRateService.getSupportedCurrencies();
  }

  async previewConversion(
    request: ConversionRequest
  ): Promise<ConversionResponse> {
    // Same as convertCurrency but without storing the conversion
    const validation = await this.validateCurrencies(
      request.fromCurrency,
      request.toCurrency
    );
    if (!validation.isValid) {
      throw new Error(
        `Currency validation failed: ${validation.errors.join(', ')}`
      );
    }

    const exchangeRate = await this.exchangeRateService.getExchangeRate(
      request.fromCurrency,
      request.toCurrency
    );

    const convertedAmount = request.amount.mul(exchangeRate.rate);
    const fee = await this.calculateConversionFee(
      request.amount,
      request.fromCurrency
    );
    const feePercentage = this.settings.conversionFeePercentage;

    return {
      convertedAmount,
      exchangeRate: exchangeRate.rate,
      fee,
      feePercentage,
      provider: exchangeRate.provider,
      expiresAt: exchangeRate.expiresAt,
      conversionId: 'preview-' + Date.now(),
    };
  }

  private generateConversionId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods for common currency operations
  async convertToBaseCurrency(
    amount: Decimal,
    fromCurrency: string
  ): Promise<Decimal> {
    if (fromCurrency === this.settings.defaultCurrency) {
      return amount;
    }

    const conversion = await this.convertCurrency({
      amount,
      fromCurrency,
      toCurrency: this.settings.defaultCurrency,
    });

    return conversion.convertedAmount;
  }

  async convertFromBaseCurrency(
    amount: Decimal,
    toCurrency: string
  ): Promise<Decimal> {
    if (toCurrency === this.settings.defaultCurrency) {
      return amount;
    }

    const conversion = await this.convertCurrency({
      amount,
      fromCurrency: this.settings.defaultCurrency,
      toCurrency,
    });

    return conversion.convertedAmount;
  }

  async normalizeAmountToBaseCurrency(
    amount: Decimal,
    currency: string
  ): Promise<{ normalizedAmount: Decimal; exchangeRate: Decimal }> {
    if (currency === this.settings.defaultCurrency) {
      return {
        normalizedAmount: amount,
        exchangeRate: new Decimal(1),
      };
    }

    const exchangeRate = await this.exchangeRateService.getExchangeRate(
      currency,
      this.settings.defaultCurrency
    );

    return {
      normalizedAmount: amount.mul(exchangeRate.rate),
      exchangeRate: exchangeRate.rate,
    };
  }
}
