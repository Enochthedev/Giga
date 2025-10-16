import { Decimal } from '../lib/decimal';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;

  // Regional info
  countries: string[];

  // Formatting
  symbolPosition: 'before' | 'after';
  thousandsSeparator: string;
  decimalSeparator: string;

  // Metadata
  metadata?: Record<string, any>;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: Decimal;
  source: string;

  // Validity
  validFrom: Date;
  validTo?: Date;

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrencyConversion {
  id: string;
  fromAmount: Decimal;
  fromCurrency: string;
  toAmount: Decimal;
  toCurrency: string;
  exchangeRate: Decimal;
  rateSource: string;

  // Fees
  conversionFee?: Decimal;
  conversionFeePercentage?: Decimal;

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  convertedAt: Date;
}

export interface CurrencyPair {
  base: string;
  quote: string;
  rate: Decimal;
  spread?: Decimal;
  lastUpdated: Date;
}

export interface CurrencySettings {
  defaultCurrency: string;
  supportedCurrencies: string[];

  // Auto-conversion
  autoConvert: boolean;
  conversionProvider: string;

  // Rate refresh
  rateRefreshInterval: number; // minutes
  rateValidityPeriod: number; // minutes

  // Fees
  conversionFeePercentage: Decimal;
  minimumConversionFee: Decimal;

  // Rounding
  roundingMode: 'up' | 'down' | 'nearest';

  // Metadata
  metadata?: Record<string, any>;
}

export interface CurrencyProvider {
  id: string;
  name: string;
  type: 'api' | 'manual' | 'calculated';

  // Configuration
  config: {
    apiUrl?: string;
    apiKey?: string;
    refreshInterval: number;
    timeout: number;
  };

  // Status
  isActive: boolean;
  lastSync?: Date;
  lastError?: string;

  // Supported currencies
  supportedCurrencies: string[];

  // Metadata
  metadata?: Record<string, unknown>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rateDate?: Date;
  includeFees?: boolean;
}

export interface CurrencyConversionResponse {
  originalAmount: Decimal;
  convertedAmount: Decimal;
  exchangeRate: Decimal;
  conversionFee?: Decimal;
  totalAmount: Decimal;
  rateSource: string;
  rateTimestamp: Date;
}
