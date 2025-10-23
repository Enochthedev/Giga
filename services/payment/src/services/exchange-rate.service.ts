import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  CurrencySettings,
  ExchangeRate,
  ExchangeRateProvider,
} from '../types/currency.types';

export class ExchangeRateService {
  private providers: Map<string, ExchangeRateProvider> = new Map();
  private rateCache: Map<string, ExchangeRate> = new Map();
  private settings: CurrencySettings;

  constructor(settings: CurrencySettings) {
    this.settings = settings;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize with mock provider for now
    // Real providers (like Fixer.io, CurrencyAPI, etc.) can be added later
    this.providers.set('mock', new MockExchangeRateProvider());

    // Start rate update scheduler
    this.startRateUpdateScheduler();
  }

  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<ExchangeRate> {
    if (fromCurrency === toCurrency) {
      return {
        id: `${fromCurrency}-${toCurrency}-${Date.now()}`,
        fromCurrency,
        toCurrency,
        rate: new Decimal(1),
        provider: 'internal',
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
    }

    const cacheKey = `${fromCurrency}-${toCurrency}`;
    const cachedRate = this.rateCache.get(cacheKey);

    if (cachedRate && cachedRate.expiresAt > new Date()) {
      logger.debug('Using cached exchange rate', {
        fromCurrency,
        toCurrency,
        rate: cachedRate.rate,
      });
      return cachedRate;
    }

    // Try primary provider first
    for (const [providerName, provider] of this.providers) {
      try {
        const rate = await provider.getRate(fromCurrency, toCurrency);
        this.rateCache.set(cacheKey, rate);

        logger.info('Retrieved exchange rate', {
          fromCurrency,
          toCurrency,
          rate: rate.rate,
          provider: providerName,
        });

        return rate;
      } catch (error) {
        logger.warn('Exchange rate provider failed', {
          provider: providerName,
          fromCurrency,
          toCurrency,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    throw new Error(
      `Unable to get exchange rate for ${fromCurrency} to ${toCurrency}`
    );
  }

  async getMultipleRates(
    baseCurrency: string,
    targetCurrencies: string[]
  ): Promise<ExchangeRate[]> {
    const rates: ExchangeRate[] = [];

    for (const targetCurrency of targetCurrencies) {
      try {
        const rate = await this.getExchangeRate(baseCurrency, targetCurrency);
        rates.push(rate);
      } catch (error) {
        logger.error('Failed to get exchange rate', {
          baseCurrency,
          targetCurrency,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return rates;
  }

  async convertAmount(
    amount: Decimal,
    fromCurrency: string,
    toCurrency: string
  ): Promise<{
    convertedAmount: Decimal;
    exchangeRate: Decimal;
    provider: string;
  }> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount.mul(rate.rate);

    return {
      convertedAmount,
      exchangeRate: rate.rate,
      provider: rate.provider,
    };
  }

  async getSupportedCurrencies(): Promise<string[]> {
    return this.settings.supportedCurrencies;
  }

  async updateRates(): Promise<void> {
    logger.info('Updating exchange rates');

    const baseCurrency = this.settings.defaultCurrency;
    const targetCurrencies = this.settings.supportedCurrencies.filter(
      c => c !== baseCurrency
    );

    for (const [providerName, provider] of this.providers) {
      try {
        const rates = await provider.getRates(baseCurrency, targetCurrencies);

        for (const rate of rates) {
          const cacheKey = `${rate.fromCurrency}-${rate.toCurrency}`;
          this.rateCache.set(cacheKey, rate);
        }

        logger.info('Updated exchange rates', {
          provider: providerName,
          ratesCount: rates.length,
        });
      } catch (error) {
        logger.error('Failed to update rates from provider', {
          provider: providerName,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  private startRateUpdateScheduler(): void {
    const intervalMs = this.settings.rateUpdateInterval * 60 * 1000;

    setInterval(async () => {
      try {
        await this.updateRates();
      } catch (error) {
        logger.error('Scheduled rate update failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }, intervalMs);

    // Initial update
    this.updateRates().catch(error => {
      logger.error('Initial rate update failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
  }

  clearCache(): void {
    this.rateCache.clear();
    logger.info('Exchange rate cache cleared');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.rateCache.size,
      keys: Array.from(this.rateCache.keys()),
    };
  }
}

// Mock provider for development and testing
class MockExchangeRateProvider implements ExchangeRateProvider {
  name = 'mock';

  private mockRates: Record<string, Decimal> = {
    'USD-EUR': new Decimal(0.85),
    'USD-GBP': new Decimal(0.73),
    'USD-JPY': new Decimal(110.0),
    'USD-CAD': new Decimal(1.25),
    'USD-AUD': new Decimal(1.35),
    'USD-CHF': new Decimal(0.92),
    'USD-CNY': new Decimal(6.45),
    'USD-INR': new Decimal(74.5),
    'USD-NGN': new Decimal(411.0),
    'USD-ZAR': new Decimal(14.8),
    'USD-KES': new Decimal(108.0),
    'USD-GHS': new Decimal(6.1),
    'EUR-GBP': new Decimal(0.86),
    'EUR-JPY': new Decimal(129.4),
    'GBP-JPY': new Decimal(150.7),
  };

  async getRates(
    baseCurrency: string,
    targetCurrencies: string[]
  ): Promise<ExchangeRate[]> {
    const rates: ExchangeRate[] = [];

    for (const targetCurrency of targetCurrencies) {
      const rate = await this.getRate(baseCurrency, targetCurrency);
      rates.push(rate);
    }

    return rates;
  }

  async getRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<ExchangeRate> {
    if (fromCurrency === toCurrency) {
      return this.createRate(fromCurrency, toCurrency, new Decimal(1));
    }

    const pairKey = `${fromCurrency}-${toCurrency}`;
    const reversePairKey = `${toCurrency}-${fromCurrency}`;

    let rate: Decimal;

    if (this.mockRates[pairKey]) {
      rate = this.mockRates[pairKey];
    } else if (this.mockRates[reversePairKey]) {
      rate = new Decimal(1).div(this.mockRates[reversePairKey]);
    } else {
      // Generate a mock rate with some randomness
      const baseRate = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation
      rate = new Decimal(baseRate);
    }

    return this.createRate(fromCurrency, toCurrency, rate);
  }

  async getSupportedCurrencies(): Promise<string[]> {
    const currencies = new Set<string>();

    for (const pair of Object.keys(this.mockRates)) {
      const [from, to] = pair.split('-');
      currencies.add(from);
      currencies.add(to);
    }

    return Array.from(currencies);
  }

  async isHealthy(): Promise<boolean> {
    return true;
  }

  private createRate(
    fromCurrency: string,
    toCurrency: string,
    rate: Decimal
  ): ExchangeRate {
    return {
      id: `mock-${fromCurrency}-${toCurrency}-${Date.now()}`,
      fromCurrency,
      toCurrency,
      rate,
      provider: this.name,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    };
  }
}
