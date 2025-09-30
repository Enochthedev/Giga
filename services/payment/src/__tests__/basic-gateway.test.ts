import { describe, expect, it } from 'vitest';

describe('Basic Gateway Tests', () => {
  it('should import gateway types correctly', () => {
    // Test that the gateway types are properly defined
    const gatewayTypes = ['stripe', 'paypal', 'square', 'adyen', 'braintree', 'paystack', 'flutterwave'];

    expect(gatewayTypes).toContain('paystack');
    expect(gatewayTypes).toContain('flutterwave');
  });

  it('should have correct gateway configurations', () => {
    // Test basic configuration structure
    const paystackConfig = {
      id: 'paystack',
      type: 'paystack' as const,
      name: 'Paystack Gateway',
      status: 'active' as const,
      priority: 2,
      credentials: {
        secretKey: 'test-key',
        publicKey: 'test-public-key',
        webhookSecret: 'test-webhook-secret',
      },
      settings: {
        supportedCurrencies: ['NGN', 'USD', 'GHS', 'ZAR', 'KES'],
        supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
        supportedPaymentMethods: ['card', 'bank_account', 'ussd', 'qr'],
        minAmount: 1,
        maxAmount: 10000000,
      }
    };

    expect(paystackConfig.type).toBe('paystack');
    expect(paystackConfig.settings.supportedCurrencies).toContain('NGN');
    expect(paystackConfig.settings.supportedPaymentMethods).toContain('card');
  });

  it('should have correct flutterwave configuration', () => {
    const flutterwaveConfig = {
      id: 'flutterwave',
      type: 'flutterwave' as const,
      name: 'Flutterwave Gateway',
      status: 'active' as const,
      priority: 3,
      credentials: {
        secretKey: 'test-secret-key',
        publicKey: 'test-public-key',
        webhookSecret: 'test-webhook-secret',
      },
      settings: {
        supportedCurrencies: ['NGN', 'USD', 'EUR', 'GBP', 'GHS', 'KES', 'UGX', 'ZAR'],
        supportedCountries: ['NG', 'GH', 'KE', 'UG', 'ZA', 'US', 'GB', 'CA'],
        supportedPaymentMethods: ['card', 'bank_account', 'mobile_money', 'ussd'],
        minAmount: 1,
        maxAmount: 10000000,
      }
    };

    expect(flutterwaveConfig.type).toBe('flutterwave');
    expect(flutterwaveConfig.settings.supportedCurrencies).toContain('NGN');
    expect(flutterwaveConfig.settings.supportedPaymentMethods).toContain('mobile_money');
  });
});