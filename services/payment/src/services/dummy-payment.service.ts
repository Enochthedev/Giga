import { v4 as uuidv4 } from 'uuid';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'requires_action'
    | 'processing'
    | 'succeeded'
    | 'canceled';
  metadata: Record<string, string>;
  created: number;
  customerId: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'wallet';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  created: number;
}

export interface PaymentConfirmationResult {
  success: boolean;
  paymentIntentId: string;
  status: string;
  transactionId?: string;
  paymentMethodId?: string;
  error?: string;
}

/**
 * Dummy Payment Service for frontend integration and testing
 * This simulates a real payment processor like Stripe
 */
export class DummyPaymentService {
  private paymentIntents: Map<string, PaymentIntent> = new Map();
  private paymentMethods: Map<string, PaymentMethod> = new Map();

  constructor() {
    // Initialize with some dummy payment methods
    this.initializeDummyPaymentMethods();
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId: string,
    metadata: Record<string, string> = {}
  ): Promise<PaymentIntent> {
    const paymentIntent: PaymentIntent = {
      id: `pi_${uuidv4().replace(/-/g, '')}`,
      clientSecret: `pi_${uuidv4().replace(/-/g, '')}_secret_${uuidv4().substring(0, 8)}`,
      amount,
      currency,
      status: 'requires_payment_method',
      metadata,
      created: Math.floor(Date.now() / 1000),
      customerId,
    };

    this.paymentIntents.set(paymentIntent.id, paymentIntent);

    // Simulate async processing
    await this.simulateDelay(100, 300);

    return paymentIntent;
  }

  /**
   * Get payment intent by ID
   */
  async getPaymentIntent(
    paymentIntentId: string
  ): Promise<PaymentIntent | null> {
    await this.simulateDelay(50, 150);
    return this.paymentIntents.get(paymentIntentId) || null;
  }

  /**
   * Update payment intent
   */
  async updatePaymentIntent(
    paymentIntentId: string,
    updates: Partial<PaymentIntent>
  ): Promise<PaymentIntent | null> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      return null;
    }

    const updatedPaymentIntent = { ...paymentIntent, ...updates };
    this.paymentIntents.set(paymentIntentId, updatedPaymentIntent);

    await this.simulateDelay(50, 150);
    return updatedPaymentIntent;
  }

  /**
   * Confirm payment intent (simulate payment processing)
   */
  async confirmPaymentIntent(
    paymentIntentId: string
  ): Promise<PaymentConfirmationResult> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      return {
        success: false,
        paymentIntentId,
        status: 'failed',
        error: 'Payment intent not found',
      };
    }

    // Simulate payment processing time
    await this.simulateDelay(1000, 3000);

    // Simulate different payment outcomes (90% success rate)
    const isSuccessful = Math.random() > 0.1;

    if (isSuccessful) {
      paymentIntent.status = 'succeeded';
      this.paymentIntents.set(paymentIntentId, paymentIntent);

      return {
        success: true,
        paymentIntentId,
        status: 'succeeded',
        transactionId: `txn_${uuidv4().substring(0, 16)}`,
        paymentMethodId: this.getRandomPaymentMethodId(),
      };
    } else {
      paymentIntent.status = 'requires_payment_method';
      this.paymentIntents.set(paymentIntentId, paymentIntent);

      // Simulate different failure reasons
      const failureReasons = [
        'Your card was declined.',
        'Insufficient funds.',
        'Your card has expired.',
        'The payment was blocked by your bank.',
        'Invalid payment method.',
      ];

      const randomIndex = Math.floor(Math.random() * failureReasons.length);
      const errorMessage = failureReasons[randomIndex] || 'Payment failed';

      return {
        success: false,
        paymentIntentId,
        status: 'requires_payment_method',
        error: errorMessage,
      };
    }
  }

  /**
   * Cancel payment intent
   */
  async cancelPaymentIntent(
    paymentIntentId: string
  ): Promise<{ success: boolean; error?: string }> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      return {
        success: false,
        error: 'Payment intent not found',
      };
    }

    if (paymentIntent.status === 'succeeded') {
      return {
        success: false,
        error: 'Cannot cancel a succeeded payment',
      };
    }

    paymentIntent.status = 'canceled';
    this.paymentIntents.set(paymentIntentId, paymentIntent);

    await this.simulateDelay(100, 300);

    return { success: true };
  }

  /**
   * Create a payment method (for testing)
   */
  async createPaymentMethod(
    type: 'card' | 'bank_account' | 'wallet',
    details: any
  ): Promise<PaymentMethod> {
    const paymentMethod: PaymentMethod = {
      id: `pm_${uuidv4().replace(/-/g, '')}`,
      type,
      created: Math.floor(Date.now() / 1000),
    };

    if (type === 'card' && details.card) {
      paymentMethod.card = {
        brand: details.card.brand || 'visa',
        last4: details.card.number?.slice(-4) || '4242',
        exp_month: details.card.exp_month || 12,
        exp_year: details.card.exp_year || 2025,
      };
    }

    this.paymentMethods.set(paymentMethod.id, paymentMethod);

    await this.simulateDelay(100, 300);
    return paymentMethod;
  }

  /**
   * Get payment method by ID
   */
  async getPaymentMethod(
    paymentMethodId: string
  ): Promise<PaymentMethod | null> {
    await this.simulateDelay(50, 150);
    return this.paymentMethods.get(paymentMethodId) || null;
  }

  /**
   * List payment methods for customer
   */
  async listPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    await this.simulateDelay(100, 300);

    // Return some dummy payment methods for testing
    return Array.from(this.paymentMethods.values()).slice(0, 3);
  }

  /**
   * Process refund (simulate)
   */
  async processRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{
    success: boolean;
    refundId?: string;
    amount?: number;
    status?: string;
    error?: string;
  }> {
    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    if (!paymentIntent) {
      return {
        success: false,
        error: 'Payment intent not found',
      };
    }

    if (paymentIntent.status !== 'succeeded') {
      return {
        success: false,
        error: 'Can only refund succeeded payments',
      };
    }

    // Simulate refund processing
    await this.simulateDelay(500, 1500);

    const refundAmount = amount || paymentIntent.amount;
    const isSuccessful = Math.random() > 0.05; // 95% success rate

    if (isSuccessful) {
      return {
        success: true,
        refundId: `re_${uuidv4().substring(0, 16)}`,
        amount: refundAmount,
        status: 'succeeded',
      };
    } else {
      return {
        success: false,
        error: 'Refund failed. Please try again later.',
      };
    }
  }

  /**
   * Get payment statistics (for admin/monitoring)
   */
  async getPaymentStatistics(): Promise<{
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    totalAmount: number;
    averageAmount: number;
    serviceBreakdown: Record<
      string,
      {
        count: number;
        amount: number;
        successRate: number;
      }
    >;
  }> {
    await this.simulateDelay(200, 500);

    const allPayments = Array.from(this.paymentIntents.values());
    const successfulPayments = allPayments.filter(
      p => p.status === 'succeeded'
    );
    const failedPayments = allPayments.filter(
      p => p.status === 'requires_payment_method'
    );
    const totalAmount = successfulPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // Calculate service breakdown
    const serviceBreakdown: Record<
      string,
      {
        count: number;
        amount: number;
        successRate: number;
      }
    > = {};

    allPayments.forEach(payment => {
      const service = payment.metadata?.service || 'unknown';

      if (!serviceBreakdown[service]) {
        serviceBreakdown[service] = {
          count: 0,
          amount: 0,
          successRate: 0,
        };
      }

      serviceBreakdown[service].count++;
      if (payment.status === 'succeeded') {
        serviceBreakdown[service].amount += payment.amount;
      }
    });

    // Calculate success rates
    Object.keys(serviceBreakdown).forEach(service => {
      const servicePayments = allPayments.filter(
        p => (p.metadata?.service || 'unknown') === service
      );
      const serviceSuccessful = servicePayments.filter(
        p => p.status === 'succeeded'
      );
      serviceBreakdown[service].successRate =
        servicePayments.length > 0
          ? (serviceSuccessful.length / servicePayments.length) * 100
          : 0;
    });

    return {
      totalPayments: allPayments.length,
      successfulPayments: successfulPayments.length,
      failedPayments: failedPayments.length,
      totalAmount,
      averageAmount:
        successfulPayments.length > 0
          ? totalAmount / successfulPayments.length
          : 0,
      serviceBreakdown,
    };
  }

  /**
   * Initialize dummy payment methods for testing
   */
  private initializeDummyPaymentMethods(): void {
    const dummyMethods = [
      {
        type: 'card' as const,
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025,
        },
      },
      {
        type: 'card' as const,
        card: {
          brand: 'mastercard',
          last4: '5555',
          exp_month: 10,
          exp_year: 2026,
        },
      },
      {
        type: 'card' as const,
        card: {
          brand: 'amex',
          last4: '0005',
          exp_month: 8,
          exp_year: 2024,
        },
      },
    ];

    dummyMethods.forEach(method => {
      const paymentMethod: PaymentMethod = {
        id: `pm_${uuidv4().replace(/-/g, '')}`,
        type: method.type,
        card: method.card,
        created: Math.floor(Date.now() / 1000),
      };
      this.paymentMethods.set(paymentMethod.id, paymentMethod);
    });
  }

  /**
   * Get a random payment method ID for testing
   */
  private getRandomPaymentMethodId(): string {
    const methods = Array.from(this.paymentMethods.keys());
    if (methods.length === 0) {
      return 'pm_default';
    }
    const randomIndex = Math.floor(Math.random() * methods.length);
    return methods[randomIndex] || 'pm_default';
  }

  /**
   * Simulate network delay for realistic testing
   */
  private async simulateDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Clear all data (for testing)
   */
  clearAllData(): void {
    this.paymentIntents.clear();
    this.paymentMethods.clear();
    this.initializeDummyPaymentMethods();
  }

  /**
   * Get all payment intents (for debugging)
   */
  getAllPaymentIntents(): PaymentIntent[] {
    return Array.from(this.paymentIntents.values());
  }

  /**
   * Get all payment methods (for debugging)
   */
  getAllPaymentMethods(): PaymentMethod[] {
    return Array.from(this.paymentMethods.values());
  }
}
