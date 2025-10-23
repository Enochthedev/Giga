import { Decimal } from 'decimal.js';
import { logger } from '../lib/logger';
import {
  LocalizationSettings,
  RegionalPaymentMethod,
} from '../types/localization.types';

export class RegionalPaymentMethodsService {
  private settings: LocalizationSettings;
  private regionalMethods: Map<string, RegionalPaymentMethod> = new Map();

  constructor(settings: LocalizationSettings) {
    this.settings = settings;
    this.initializeRegionalPaymentMethods();
  }

  private initializeRegionalPaymentMethods(): void {
    const regionalMethods: RegionalPaymentMethod[] = [
      {
        region: 'US',
        paymentMethods: [
          {
            type: 'CARD',
            name: 'Credit/Debit Cards',
            localName: 'Credit/Debit Cards',
            description: 'Visa, MasterCard, American Express, Discover',
            isPopular: true,
            supportedCurrencies: ['USD'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(2.9),
              fixed: new Decimal(0.3),
            },
            requirements: ['Valid card number', 'CVV', 'Expiry date'],
            restrictions: [],
          },
          {
            type: 'DIGITAL_WALLET',
            name: 'PayPal',
            localName: 'PayPal',
            description: 'PayPal digital wallet',
            isPopular: true,
            supportedCurrencies: ['USD'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(2.9),
              fixed: new Decimal(0.3),
            },
            requirements: ['PayPal account'],
            restrictions: [],
          },
          {
            type: 'DIGITAL_WALLET',
            name: 'Apple Pay',
            localName: 'Apple Pay',
            description: 'Apple Pay mobile wallet',
            isPopular: true,
            supportedCurrencies: ['USD'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(2.9),
              fixed: new Decimal(0.3),
            },
            requirements: ['iOS device', 'Touch ID or Face ID'],
            restrictions: ['iOS only'],
          },
          {
            type: 'BANK_ACCOUNT',
            name: 'ACH Bank Transfer',
            localName: 'Bank Transfer',
            description: 'Direct bank account transfer via ACH',
            isPopular: false,
            supportedCurrencies: ['USD'],
            processingTime: '1-3 business days',
            fees: {
              fixed: new Decimal(0.8),
            },
            requirements: ['Bank account number', 'Routing number'],
            restrictions: ['US bank accounts only'],
          },
        ],
      },
      {
        region: 'GB',
        paymentMethods: [
          {
            type: 'CARD',
            name: 'Credit/Debit Cards',
            localName: 'Credit/Debit Cards',
            description: 'Visa, MasterCard, Maestro',
            isPopular: true,
            supportedCurrencies: ['GBP', 'EUR'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.4),
              fixed: new Decimal(0.2),
            },
            requirements: ['Valid card number', 'CVV', 'Expiry date'],
            restrictions: [],
          },
          {
            type: 'BANK_ACCOUNT',
            name: 'Bank Transfer',
            localName: 'Bank Transfer',
            description: 'Direct bank transfer via Faster Payments',
            isPopular: true,
            supportedCurrencies: ['GBP'],
            processingTime: 'Instant',
            fees: {
              fixed: new Decimal(0.35),
            },
            requirements: ['Sort code', 'Account number'],
            restrictions: ['UK bank accounts only'],
          },
          {
            type: 'DIGITAL_WALLET',
            name: 'PayPal',
            localName: 'PayPal',
            description: 'PayPal digital wallet',
            isPopular: true,
            supportedCurrencies: ['GBP', 'EUR'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(3.4),
              fixed: new Decimal(0.35),
            },
            requirements: ['PayPal account'],
            restrictions: [],
          },
        ],
      },
      {
        region: 'NG',
        paymentMethods: [
          {
            type: 'CARD',
            name: 'Debit Cards',
            localName: 'Debit Cards',
            description: 'Verve, Visa, MasterCard',
            isPopular: true,
            supportedCurrencies: ['NGN'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.5),
            },
            requirements: ['Valid card number', 'PIN'],
            restrictions: [],
          },
          {
            type: 'BANK_ACCOUNT',
            name: 'Bank Transfer',
            localName: 'Bank Transfer',
            description: 'Direct bank transfer',
            isPopular: true,
            supportedCurrencies: ['NGN'],
            processingTime: 'Instant to 24 hours',
            fees: {
              fixed: new Decimal(50), // NGN 50
            },
            requirements: ['Account number', 'Bank code'],
            restrictions: ['Nigerian bank accounts only'],
          },
          {
            type: 'USSD',
            name: 'USSD',
            localName: 'USSD',
            description: 'Mobile banking via USSD codes',
            isPopular: true,
            supportedCurrencies: ['NGN'],
            processingTime: 'Instant',
            fees: {
              fixed: new Decimal(20), // NGN 20
            },
            requirements: ['Mobile phone', 'Bank account'],
            restrictions: ['Nigerian mobile networks only'],
          },
          {
            type: 'MOBILE_MONEY',
            name: 'Mobile Money',
            localName: 'Mobile Money',
            description: 'Mobile wallet payments',
            isPopular: false,
            supportedCurrencies: ['NGN'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.0),
            },
            requirements: ['Mobile wallet account'],
            restrictions: [],
          },
        ],
      },
      {
        region: 'KE',
        paymentMethods: [
          {
            type: 'MOBILE_MONEY',
            name: 'M-Pesa',
            localName: 'M-Pesa',
            description: 'Safaricom M-Pesa mobile money',
            isPopular: true,
            supportedCurrencies: ['KES'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.0),
              minimum: new Decimal(10), // KES 10
            },
            requirements: ['M-Pesa account', 'Mobile phone'],
            restrictions: ['Safaricom network only'],
          },
          {
            type: 'MOBILE_MONEY',
            name: 'Airtel Money',
            localName: 'Airtel Money',
            description: 'Airtel mobile money service',
            isPopular: true,
            supportedCurrencies: ['KES'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.0),
              minimum: new Decimal(10), // KES 10
            },
            requirements: ['Airtel Money account', 'Mobile phone'],
            restrictions: ['Airtel network only'],
          },
          {
            type: 'CARD',
            name: 'Debit Cards',
            localName: 'Debit Cards',
            description: 'Visa, MasterCard debit cards',
            isPopular: false,
            supportedCurrencies: ['KES', 'USD'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(3.5),
            },
            requirements: ['Valid card number', 'PIN'],
            restrictions: [],
          },
        ],
      },
      {
        region: 'IN',
        paymentMethods: [
          {
            type: 'UPI',
            name: 'UPI',
            localName: 'UPI',
            description: 'Unified Payments Interface',
            isPopular: true,
            supportedCurrencies: ['INR'],
            processingTime: 'Instant',
            fees: {
              fixed: new Decimal(0), // Free for consumers
            },
            requirements: ['UPI ID', 'Mobile phone'],
            restrictions: ['Indian bank accounts only'],
          },
          {
            type: 'DIGITAL_WALLET',
            name: 'Paytm',
            localName: 'Paytm',
            description: 'Paytm digital wallet',
            isPopular: true,
            supportedCurrencies: ['INR'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(2.0),
            },
            requirements: ['Paytm account'],
            restrictions: [],
          },
          {
            type: 'CARD',
            name: 'Credit/Debit Cards',
            localName: 'Credit/Debit Cards',
            description: 'Visa, MasterCard, RuPay',
            isPopular: true,
            supportedCurrencies: ['INR'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(2.0),
            },
            requirements: ['Valid card number', 'CVV', 'OTP'],
            restrictions: [],
          },
          {
            type: 'NET_BANKING',
            name: 'Net Banking',
            localName: 'Net Banking',
            description: 'Direct bank account payment',
            isPopular: true,
            supportedCurrencies: ['INR'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.0),
            },
            requirements: ['Online banking credentials'],
            restrictions: ['Indian bank accounts only'],
          },
        ],
      },
      {
        region: 'DE',
        paymentMethods: [
          {
            type: 'BANK_ACCOUNT',
            name: 'SEPA Direct Debit',
            localName: 'SEPA Lastschrift',
            description: 'SEPA Direct Debit',
            isPopular: true,
            supportedCurrencies: ['EUR'],
            processingTime: '1-3 business days',
            fees: {
              fixed: new Decimal(0.35),
            },
            requirements: ['IBAN', 'SEPA mandate'],
            restrictions: ['SEPA countries only'],
          },
          {
            type: 'BANK_ACCOUNT',
            name: 'SOFORT',
            localName: 'SOFORT',
            description: 'Instant bank transfer',
            isPopular: true,
            supportedCurrencies: ['EUR'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.4),
            },
            requirements: ['Online banking credentials'],
            restrictions: ['German bank accounts only'],
          },
          {
            type: 'CARD',
            name: 'Credit/Debit Cards',
            localName: 'Kreditkarten',
            description: 'Visa, MasterCard, Maestro',
            isPopular: true,
            supportedCurrencies: ['EUR'],
            processingTime: 'Instant',
            fees: {
              percentage: new Decimal(1.4),
              fixed: new Decimal(0.25),
            },
            requirements: ['Valid card number', 'CVV'],
            restrictions: [],
          },
        ],
      },
    ];

    for (const regional of regionalMethods) {
      this.regionalMethods.set(regional.region, regional);
    }

    logger.info('Regional payment methods initialized', {
      regionsCount: this.regionalMethods.size,
      supportedRegions: Array.from(this.regionalMethods.keys()),
    });
  }

  async getPaymentMethodsForRegion(
    region: string
  ): Promise<RegionalPaymentMethod | null> {
    if (!this.settings.regionalPaymentMethodsEnabled) {
      logger.debug('Regional payment methods disabled');
      return null;
    }

    const methods = this.regionalMethods.get(region);
    if (!methods) {
      logger.warn('No payment methods configured for region', { region });
      return null;
    }

    logger.debug('Retrieved payment methods for region', {
      region,
      methodsCount: methods.paymentMethods.length,
    });

    return methods;
  }

  async getPopularPaymentMethods(
    region: string
  ): Promise<RegionalPaymentMethod['paymentMethods'] | null> {
    const regionalMethods = await this.getPaymentMethodsForRegion(region);
    if (!regionalMethods) {
      return null;
    }

    return regionalMethods.paymentMethods.filter(method => method.isPopular);
  }

  async getPaymentMethodsByType(
    region: string,
    type: string
  ): Promise<RegionalPaymentMethod['paymentMethods'] | null> {
    const regionalMethods = await this.getPaymentMethodsForRegion(region);
    if (!regionalMethods) {
      return null;
    }

    return regionalMethods.paymentMethods.filter(
      method => method.type === type
    );
  }

  async validatePaymentMethodForRegion(
    region: string,
    paymentMethodType: string,
    amount: Decimal,
    currency: string
  ): Promise<{
    isSupported: boolean;
    method?: RegionalPaymentMethod['paymentMethods'][0];
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const regionalMethods = await this.getPaymentMethodsForRegion(region);
    if (!regionalMethods) {
      errors.push(`No payment methods configured for region ${region}`);
      return { isSupported: false, errors, warnings };
    }

    const method = regionalMethods.paymentMethods.find(
      m => m.type === paymentMethodType
    );
    if (!method) {
      errors.push(
        `Payment method ${paymentMethodType} not supported in region ${region}`
      );
      return { isSupported: false, errors, warnings };
    }

    // Check currency support
    if (!method.supportedCurrencies.includes(currency)) {
      errors.push(
        `Currency ${currency} not supported for ${paymentMethodType} in region ${region}`
      );
    }

    // Check amount limits
    if (method.fees.minimum && amount.lt(method.fees.minimum)) {
      errors.push(
        `Amount ${amount} is below minimum ${method.fees.minimum} for ${paymentMethodType}`
      );
    }

    if (method.fees.maximum && amount.gt(method.fees.maximum)) {
      errors.push(
        `Amount ${amount} exceeds maximum ${method.fees.maximum} for ${paymentMethodType}`
      );
    }

    // Add warnings for non-popular methods
    if (!method.isPopular) {
      warnings.push(
        `${paymentMethodType} is not a popular payment method in ${region}`
      );
    }

    // Add processing time warnings
    if (method.processingTime !== 'Instant') {
      warnings.push(
        `${paymentMethodType} processing time: ${method.processingTime}`
      );
    }

    const isSupported = errors.length === 0;

    logger.debug('Payment method validation', {
      region,
      paymentMethodType,
      amount: amount.toString(),
      currency,
      isSupported,
      errorsCount: errors.length,
      warningsCount: warnings.length,
    });

    return {
      isSupported,
      method: isSupported ? method : undefined,
      errors,
      warnings,
    };
  }

  async calculatePaymentMethodFees(
    region: string,
    paymentMethodType: string,
    amount: Decimal
  ): Promise<{
    totalFee: Decimal;
    breakdown: Array<{
      type: 'fixed' | 'percentage' | 'minimum' | 'maximum';
      amount: Decimal;
      description: string;
    }>;
  } | null> {
    const regionalMethods = await this.getPaymentMethodsForRegion(region);
    if (!regionalMethods) {
      return null;
    }

    const method = regionalMethods.paymentMethods.find(
      m => m.type === paymentMethodType
    );
    if (!method) {
      return null;
    }

    const breakdown: Array<{
      type: 'fixed' | 'percentage' | 'minimum' | 'maximum';
      amount: Decimal;
      description: string;
    }> = [];

    let totalFee = new Decimal(0);

    // Fixed fee
    if (method.fees.fixed) {
      breakdown.push({
        type: 'fixed',
        amount: method.fees.fixed,
        description: 'Fixed processing fee',
      });
      totalFee = totalFee.add(method.fees.fixed);
    }

    // Percentage fee
    if (method.fees.percentage) {
      const percentageFee = amount.mul(method.fees.percentage.div(100));
      breakdown.push({
        type: 'percentage',
        amount: percentageFee,
        description: `${method.fees.percentage}% processing fee`,
      });
      totalFee = totalFee.add(percentageFee);
    }

    // Apply minimum fee if specified
    if (method.fees.minimum && totalFee.lt(method.fees.minimum)) {
      const minimumAdjustment = method.fees.minimum.sub(totalFee);
      breakdown.push({
        type: 'minimum',
        amount: minimumAdjustment,
        description: 'Minimum fee adjustment',
      });
      totalFee = method.fees.minimum;
    }

    // Apply maximum fee if specified
    if (method.fees.maximum && totalFee.gt(method.fees.maximum)) {
      const maximumAdjustment = totalFee.sub(method.fees.maximum);
      breakdown.push({
        type: 'maximum',
        amount: maximumAdjustment.neg(),
        description: 'Maximum fee cap',
      });
      totalFee = method.fees.maximum;
    }

    logger.debug('Payment method fees calculated', {
      region,
      paymentMethodType,
      amount: amount.toString(),
      totalFee: totalFee.toString(),
      breakdownCount: breakdown.length,
    });

    return {
      totalFee,
      breakdown,
    };
  }

  async getSupportedRegions(): Promise<string[]> {
    return Array.from(this.regionalMethods.keys());
  }

  async getAllRegionalPaymentMethods(): Promise<RegionalPaymentMethod[]> {
    return Array.from(this.regionalMethods.values());
  }
}
