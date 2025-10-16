import { v4 as uuidv4 } from 'uuid';
import { IPaymentService } from '../interfaces/payment.interface';
import { Decimal } from '../lib/decimal';
import { logger } from '../lib/logger';
import {
  FilterParams,
  PaginatedResponse,
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Refund,
  Transaction,
} from '../types';
import {
  RefundError,
  TransactionNotFoundError,
  ValidationError,
} from '../utils/errors';
import {
  validateAmount,
  validateCurrency,
  validatePaymentRequest,
} from '../utils/validation';
import { GatewayManager } from './gateway-manager.service';
import { TransactionService } from './transaction.service';

export class PaymentService implements IPaymentService {
  private transactionService: TransactionService;
  private gatewayManager: GatewayManager;

  constructor() {
    this.transactionService = new TransactionService();
    this.gatewayManager = new GatewayManager();
    this.initializeGateways();
  }

  private async initializeGateways(): Promise<void> {
    try {
      // Initialize Stripe gateway
      const { StripeGateway } = await import(
        './gateways/stripe-gateway.service'
      );

      const stripeConfig = {
        id: 'stripe',
        type: 'stripe' as const,
        name: 'Stripe Gateway',
        status: 'active' as const,
        priority: 1,
        credentials: {
          secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_default',
          publishableKey:
            process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_default',
          webhookSecret:
            process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_default',
        },
        settings: {
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
          supportedCountries: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES'],
          supportedPaymentMethods: ['card', 'bank_account'],
          minAmount: 0.5,
          maxAmount: 999999,
        },
        healthCheck: {
          interval: 60000,
          timeout: 5000,
          retries: 3,
        },
        rateLimit: {
          requestsPerSecond: 100,
          burstLimit: 200,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const stripeGateway = new StripeGateway(stripeConfig);
      this.gatewayManager.registerGateway(stripeGateway);

      // Initialize Paystack gateway
      if (process.env.PAYSTACK_SECRET_KEY) {
        const { PaystackGateway } = await import(
          './gateways/paystack-gateway.service'
        );

        const paystackConfig = {
          id: 'paystack',
          type: 'paystack' as const,
          name: 'Paystack Gateway',
          status: 'active' as const,
          priority: 2,
          credentials: {
            secretKey: process.env.PAYSTACK_SECRET_KEY,
            publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
            webhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || '',
          },
          settings: {
            supportedCurrencies: ['NGN', 'USD', 'GHS', 'ZAR', 'KES'],
            supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
            supportedPaymentMethods: ['card', 'bank_account', 'ussd', 'qr'],
            minAmount: 1,
            maxAmount: 10000000,
          },
          healthCheck: {
            interval: 60000,
            timeout: 5000,
            retries: 3,
          },
          rateLimit: {
            requestsPerSecond: 50,
            burstLimit: 100,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const paystackGateway = new PaystackGateway(paystackConfig);
        this.gatewayManager.registerGateway(paystackGateway);
        logger.info('Paystack gateway initialized successfully');
      }

      // Initialize Flutterwave gateway
      if (
        process.env.FLUTTERWAVE_SECRET_KEY &&
        process.env.FLUTTERWAVE_PUBLIC_KEY
      ) {
        const { FlutterwaveGateway } = await import(
          './gateways/flutterwave-gateway.service'
        );

        const flutterwaveConfig = {
          id: 'flutterwave',
          type: 'flutterwave' as const,
          name: 'Flutterwave Gateway',
          status: 'active' as const,
          priority: 3,
          credentials: {
            secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
            publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
            webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET || '',
          },
          settings: {
            supportedCurrencies: [
              'NGN',
              'USD',
              'EUR',
              'GBP',
              'GHS',
              'KES',
              'UGX',
              'ZAR',
            ],
            supportedCountries: [
              'NG',
              'GH',
              'KE',
              'UG',
              'ZA',
              'US',
              'GB',
              'CA',
            ],
            supportedPaymentMethods: [
              'card',
              'bank_account',
              'mobile_money',
              'ussd',
            ],
            minAmount: 1,
            maxAmount: 10000000,
          },
          healthCheck: {
            interval: 60000,
            timeout: 5000,
            retries: 3,
          },
          rateLimit: {
            requestsPerSecond: 50,
            burstLimit: 100,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const flutterwaveGateway = new FlutterwaveGateway(flutterwaveConfig);
        this.gatewayManager.registerGateway(flutterwaveGateway);
        logger.info('Flutterwave gateway initialized successfully');
      }

      // Set up failover chains for high availability
      await this.setupFailoverChains();

      logger.info('Payment gateways initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize payment gateways', { error });
      // Don't throw here to allow service to start even if gateways fail to initialize
    }
  }

  private async setupFailoverChains(): Promise<void> {
    try {
      const activeGateways = this.gatewayManager.getActiveGateways();

      if (activeGateways.length < 2) {
        logger.warn('Insufficient gateways for failover setup', {
          gatewayCount: activeGateways.length,
        });
        return;
      }

      // Set up failover chains based on priority and capabilities
      for (const gateway of activeGateways) {
        const gatewayId = gateway.getId();

        // Find suitable fallback gateways
        const fallbacks = activeGateways
          .filter(g => g.getId() !== gatewayId)
          .sort((a, b) => {
            const aConfig = a.getConfig();
            const bConfig = b.getConfig();
            return bConfig.priority - aConfig.priority; // Higher priority first
          })
          .slice(0, 3) // Limit to 3 fallbacks
          .map(g => g.getId());

        if (fallbacks.length > 0) {
          // Set failover chain through gateway manager
          const failoverManager = (this.gatewayManager as any).failoverManager;
          failoverManager.setFailoverChain(gatewayId, fallbacks);

          // Enable failover for this gateway
          await this.gatewayManager.enableFailover(gatewayId);

          logger.info('Failover chain configured', {
            primary: gatewayId,
            fallbacks,
          });
        }
      }

      logger.info('Failover chains setup completed');
    } catch (error) {
      logger.error('Failed to setup failover chains', { error });
    }
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      logger.info('Processing payment request', {
        amount: request.amount,
        currency: request.currency,
        userId: request.userId,
      });

      // Validate the payment request
      const validatedRequest = validatePaymentRequest(request);

      // Validate currency
      if (!validateCurrency(validatedRequest.currency)) {
        throw new ValidationError(
          `Unsupported currency: ${validatedRequest.currency}`
        );
      }

      // Validate amount
      if (!validateAmount(validatedRequest.amount, validatedRequest.currency)) {
        throw new ValidationError(
          `Amount ${validatedRequest.amount} ${validatedRequest.currency} is below minimum threshold`
        );
      }

      // Check for duplicate transaction
      if (validatedRequest.internalReference) {
        await this.checkDuplicateTransaction(
          validatedRequest.internalReference
        );
      }

      // Generate internal reference if not provided
      const internalReference = validatedRequest.internalReference || uuidv4();

      // Select optimal gateway for this payment
      const gateway = await this.gatewayManager.selectBestGateway(
        validatedRequest.amount,
        validatedRequest.currency
      );

      // Create transaction record
      const transaction = await this.transactionService.create({
        type: 'payment',
        status: 'pending',
        amount: new Decimal(validatedRequest.amount),
        currency: validatedRequest.currency.toUpperCase(),
        description: validatedRequest.description,
        userId: validatedRequest.userId,
        merchantId: validatedRequest.merchantId,
        paymentMethodId: validatedRequest.paymentMethodId,
        gatewayId: gateway.getId(),
        internalReference,
        externalReference: validatedRequest.externalReference,
        metadata: validatedRequest.metadata || {},
      });

      // Process payment splits if provided
      if (validatedRequest.splits && validatedRequest.splits.length > 0) {
        await this.processSplits(
          transaction.id,
          validatedRequest.splits,
          validatedRequest.currency
        );
      }

      // Process payment through selected gateway with failover support
      const paymentResult = await this.processPaymentWithFailover(
        gateway,
        validatedRequest,
        transaction.id
      );

      // Update transaction with gateway response
      await this.transactionService.update(transaction.id, {
        gatewayTransactionId: paymentResult.id,
        status: paymentResult.status,
        processedAt:
          paymentResult.status === 'succeeded' ? new Date() : undefined,
        gatewayId: paymentResult.gatewayId || gateway.getId(), // Update if failover occurred
      });

      logger.info('Payment processed successfully', {
        transactionId: transaction.id,
        status: paymentResult.status,
      });

      return {
        id: transaction.id,
        status: paymentResult.status,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        clientSecret: paymentResult.clientSecret,
        requiresAction: paymentResult.requiresAction,
        nextAction: paymentResult.nextAction,
        paymentMethod: paymentResult.paymentMethod,
        metadata: paymentResult.metadata || transaction.metadata,
        createdAt: paymentResult.createdAt || transaction.createdAt,
      } as PaymentResponse;
    } catch (error) {
      logger.error('Failed to process payment', { error, request });
      throw error;
    }
  }

  async capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      logger.info('Capturing payment', { transactionId, amount });

      const transaction = await this.transactionService.getById(transactionId);

      if (!['pending', 'processing'].includes(transaction.status)) {
        throw new ValidationError(
          `Cannot capture payment with status: ${transaction.status}`
        );
      }

      const captureAmount = amount ? new Decimal(amount) : transaction.amount;

      if (captureAmount.gt(transaction.amount)) {
        throw new ValidationError(
          'Capture amount cannot exceed original amount'
        );
      }

      // Get the gateway used for this transaction
      const gateway = this.gatewayManager.getGateway(transaction.gatewayId);
      if (!gateway) {
        throw new ValidationError(`Gateway ${transaction.gatewayId} not found`);
      }

      // Capture payment through gateway with failover support
      const captureResult = await this.executeGatewayOperationWithFailover(
        gateway,
        'capturePayment',
        [transaction.gatewayTransactionId || transactionId, amount],
        transactionId
      );

      // Update transaction status
      const updatedTransaction = await this.transactionService.updateStatus(
        transactionId,
        captureResult.status
      );

      logger.info('Payment captured successfully', { transactionId });

      return {
        id: updatedTransaction.id,
        status: captureResult.status,
        amount: captureResult.amount,
        currency: captureResult.currency,
        metadata: captureResult.metadata || updatedTransaction.metadata,
        createdAt: captureResult.createdAt || updatedTransaction.createdAt,
      };
    } catch (error) {
      logger.error('Failed to capture payment', {
        error,
        transactionId,
        amount,
      });
      throw error;
    }
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      logger.info('Canceling payment', { transactionId });

      const transaction = await this.transactionService.getById(transactionId);

      if (!['pending', 'processing'].includes(transaction.status)) {
        throw new ValidationError(
          `Cannot cancel payment with status: ${transaction.status}`
        );
      }

      // Get the gateway used for this transaction
      const gateway = this.gatewayManager.getGateway(transaction.gatewayId);
      if (!gateway) {
        throw new ValidationError(`Gateway ${transaction.gatewayId} not found`);
      }

      // Cancel payment through gateway with failover support
      const cancelResult = await this.executeGatewayOperationWithFailover(
        gateway,
        'cancelPayment',
        [transaction.gatewayTransactionId || transactionId],
        transactionId
      );

      // Update transaction status
      const updatedTransaction = await this.transactionService.updateStatus(
        transactionId,
        cancelResult.status
      );

      logger.info('Payment canceled successfully', { transactionId });

      return {
        id: updatedTransaction.id,
        status: cancelResult.status,
        amount: cancelResult.amount,
        currency: cancelResult.currency,
        metadata: cancelResult.metadata || updatedTransaction.metadata,
        createdAt: cancelResult.createdAt || updatedTransaction.createdAt,
      };
    } catch (error) {
      logger.error('Failed to cancel payment', { error, transactionId });
      throw error;
    }
  }

  async refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
    try {
      logger.info('Processing refund', { transactionId, amount, reason });

      const transaction = await this.transactionService.getById(transactionId);

      if (transaction.status !== 'succeeded') {
        throw new RefundError(
          `Cannot refund payment with status: ${transaction.status}`
        );
      }

      const refundAmount = amount ? new Decimal(amount) : transaction.amount;

      if (refundAmount.gt(transaction.amount)) {
        throw new ValidationError(
          'Refund amount cannot exceed original amount'
        );
      }

      // Check existing refunds
      const existingRefunds = transaction.refunds || [];
      const totalRefunded = existingRefunds.reduce(
        (sum, refund) => sum.plus(refund.amount),
        new Decimal(0)
      );

      if (totalRefunded.plus(refundAmount).gt(transaction.amount)) {
        throw new ValidationError(
          'Total refund amount would exceed original amount'
        );
      }

      // Get the gateway used for this transaction
      const gateway = this.gatewayManager.getGateway(transaction.gatewayId);
      if (!gateway) {
        throw new ValidationError(`Gateway ${transaction.gatewayId} not found`);
      }

      // Process refund through gateway with failover support
      const gatewayRefund = await this.executeGatewayOperationWithFailover(
        gateway,
        'refundPayment',
        [
          transaction.gatewayTransactionId || transactionId,
          refundAmount.toNumber(),
          reason,
        ],
        transactionId
      );

      // Update transaction status if fully refunded
      const newTotalRefunded = totalRefunded.plus(refundAmount);
      if (newTotalRefunded.equals(transaction.amount)) {
        await this.transactionService.updateStatus(transactionId, 'refunded');
      } else if (newTotalRefunded.gt(new Decimal(0))) {
        await this.transactionService.updateStatus(
          transactionId,
          'partially_refunded'
        );
      }

      logger.info('Refund processed successfully', {
        transactionId,
        refundId: gatewayRefund.id,
      });

      return gatewayRefund;
    } catch (error) {
      logger.error('Failed to process refund', {
        error,
        transactionId,
        amount,
        reason,
      });
      throw error;
    }
  }

  async getRefund(refundId: string): Promise<Refund> {
    // This would be implemented with actual refund storage
    throw new Error('Method not implemented');
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    return this.transactionService.getById(transactionId);
  }

  async getTransactions(
    filters: FilterParams
  ): Promise<PaginatedResponse<Transaction>> {
    return this.transactionService.getByFilters(filters);
  }

  async updateTransactionStatus(
    transactionId: string,
    status: PaymentStatus
  ): Promise<Transaction> {
    return this.transactionService.updateStatus(transactionId, status);
  }

  // Payment method management methods
  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    try {
      logger.info('Creating payment method', {
        userId: data.userId,
        type: data.type,
      });

      // For now, use Stripe as the default gateway for payment methods
      // In a real implementation, this could be configurable per user/merchant
      const gateway = this.gatewayManager.getGateway('stripe');
      if (!gateway) {
        throw new ValidationError('Stripe gateway not available');
      }

      const paymentMethod = await gateway.createPaymentMethod(data);

      logger.info('Payment method created successfully', {
        paymentMethodId: paymentMethod.id,
        userId: data.userId,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('Failed to create payment method', {
        error,
        userId: data.userId,
      });
      throw error;
    }
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    try {
      logger.info('Retrieving payment method', { paymentMethodId: id });

      // For now, use Stripe as the default gateway
      const gateway = this.gatewayManager.getGateway('stripe');
      if (!gateway) {
        throw new ValidationError('Stripe gateway not available');
      }

      const paymentMethod = await gateway.getPaymentMethod(id);

      logger.info('Payment method retrieved successfully', {
        paymentMethodId: id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('Failed to retrieve payment method', {
        error,
        paymentMethodId: id,
      });
      throw error;
    }
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    try {
      logger.info('Updating payment method', { paymentMethodId: id });

      // For now, use Stripe as the default gateway
      const gateway = this.gatewayManager.getGateway('stripe');
      if (!gateway) {
        throw new ValidationError('Stripe gateway not available');
      }

      const paymentMethod = await gateway.updatePaymentMethod(id, data);

      logger.info('Payment method updated successfully', {
        paymentMethodId: id,
      });

      return paymentMethod;
    } catch (error) {
      logger.error('Failed to update payment method', {
        error,
        paymentMethodId: id,
      });
      throw error;
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    try {
      logger.info('Deleting payment method', { paymentMethodId: id });

      // For now, use Stripe as the default gateway
      const gateway = this.gatewayManager.getGateway('stripe');
      if (!gateway) {
        throw new ValidationError('Stripe gateway not available');
      }

      await gateway.deletePaymentMethod(id);

      logger.info('Payment method deleted successfully', {
        paymentMethodId: id,
      });
    } catch (error) {
      logger.error('Failed to delete payment method', {
        error,
        paymentMethodId: id,
      });
      throw error;
    }
  }

  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // This would require storing payment method associations in our database
    // For now, return empty array as this requires additional database schema
    logger.info('Getting user payment methods', { userId });
    return [];
  }

  // Private helper methods
  private async processPaymentWithFailover(
    primaryGateway: any,
    request: PaymentRequest,
    transactionId: string
  ): Promise<any> {
    return this.executeGatewayOperationWithFailover(
      primaryGateway,
      'processPayment',
      [request],
      transactionId
    );
  }

  private async executeGatewayOperationWithFailover(
    primaryGateway: any,
    operation: string,
    args: any[],
    transactionId: string
  ): Promise<any> {
    const currentGateway = primaryGateway;
    let lastError: Error | null = null;
    const startTime = Date.now();

    try {
      // Attempt operation with primary gateway
      const result = await currentGateway[operation](...args);
      const responseTime = Date.now() - startTime;

      // Record successful metrics
      await this.gatewayManager.recordMetrics(currentGateway.getId(), {
        transactionCount: 1,
        successRate: 1.0,
        errorRate: 0.0,
        responseTime,
      });

      return {
        ...result,
        gatewayId: currentGateway.getId(),
      };
    } catch (error) {
      lastError = error as Error;
      const responseTime = Date.now() - startTime;

      logger.warn('Primary gateway operation failed, attempting failover', {
        operation,
        primaryGateway: currentGateway.getId(),
        error: lastError.message,
        transactionId,
        responseTime,
      });

      // Record failure metrics
      await this.gatewayManager.recordMetrics(currentGateway.getId(), {
        transactionCount: 1,
        successRate: 0.0,
        errorRate: 1.0,
        responseTime,
      });

      // Attempt failover
      const fallbackGateway = await this.gatewayManager.handleGatewayFailure(
        currentGateway.getId(),
        lastError
      );

      if (!fallbackGateway) {
        logger.error('No fallback gateway available', {
          operation,
          primaryGateway: currentGateway.getId(),
          transactionId,
        });
        throw lastError;
      }

      try {
        // Retry with fallback gateway
        const fallbackStartTime = Date.now();
<<<<<<< HEAD
        const result = await (fallbackGateway as any)[operation](...args);
=======
        const result = await fallbackGateway[operation](...args);
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
        const fallbackResponseTime = Date.now() - fallbackStartTime;

        // Record successful failover metrics
        await this.gatewayManager.recordMetrics(fallbackGateway.getId(), {
          transactionCount: 1,
          successRate: 1.0,
          errorRate: 0.0,
          responseTime: fallbackResponseTime,
        });

        logger.info('Operation processed successfully via failover', {
          operation,
          primaryGateway: currentGateway.getId(),
          fallbackGateway: fallbackGateway.getId(),
          transactionId,
          fallbackResponseTime,
        });

        return {
          ...result,
          gatewayId: fallbackGateway.getId(),
        };
      } catch (failoverError) {
        const fallbackResponseTime = Date.now() - startTime;

        logger.error('Failover gateway operation also failed', {
          operation,
          primaryGateway: currentGateway.getId(),
          fallbackGateway: fallbackGateway.getId(),
          error: (failoverError as Error).message,
          transactionId,
          fallbackResponseTime,
        });

        // Record failover failure metrics
        await this.gatewayManager.recordMetrics(fallbackGateway.getId(), {
          transactionCount: 1,
          successRate: 0.0,
          errorRate: 1.0,
          responseTime: fallbackResponseTime,
        });

        throw failoverError;
      }
    }
  }

  private async checkDuplicateTransaction(
    internalReference: string
  ): Promise<void> {
    try {
      const existingTransaction = await this.transactionService.getByFilters({
        page: 1,
        limit: 1,
      });

      // In a real implementation, this would check the internalReference field
      // For now, we'll skip the actual duplicate check
    } catch (error) {
      // If transaction not found, that's good - no duplicate
      if (!(error instanceof TransactionNotFoundError)) {
        throw error;
      }
    }
  }

  private async processSplits(
    transactionId: string,
    splits: any[],
    currency: string
  ): Promise<void> {
    for (const split of splits) {
      const splitAmount = split.amount || 0;
      await this.transactionService.addSplit(transactionId, {
        recipientId: split.recipientId,
        amount: splitAmount,
        currency,
        type: split.amount ? 'FIXED' : 'PERCENTAGE',
        description: split.description,
      });
    }
  }
}
