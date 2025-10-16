<<<<<<< HEAD
import { Decimal } from '../../lib/decimal';
import { logger } from '../../lib/logger';
import { GatewayConfig, WebhookEvent } from '../../types/gateway.types';
import {
  PaymentMethod,
=======
import Flutterwave from 'flutterwave-node-v3';
import { Decimal } from '../../lib/decimal';
import { logger } from '../../lib/logger';
import {
  GatewayConfig,
  GatewayStatus,
  WebhookEvent,
} from '../../types/gateway.types';
import {
  PaymentMethod,
  PaymentMethodType,
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  Refund,
} from '../../types/payment.types';
import { BaseGateway } from './base-gateway.service';

<<<<<<< HEAD
/**
 * Flutterwave Gateway Template - TODO: Implement actual Flutterwave integration
 */
export class FlutterwaveGateway extends BaseGateway {
  constructor(config: GatewayConfig) {
    super(config);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    logger.info('Flutterwave payment (TEMPLATE)', { amount: request.amount });

    return {
      id: `flw_template_${Date.now()}`,
      status: 'pending' as PaymentStatus,
      amount: new Decimal(request.amount),
      currency: request.currency.toUpperCase(),
      gatewayId: this.getId(),
      createdAt: new Date(),
    };
=======
export class FlutterwaveGateway extends BaseGateway {
  private flw: any;

  constructor(config: GatewayConfig) {
    super(config);

    // Initialize Flutterwave client
    const publicKey = config.credentials.publicKey;
    const secretKey = config.credentials.secretKey;

    if (!publicKey || !secretKey) {
      throw new Error('Flutterwave public and secret keys are required');
    }

    this.flw = new Flutterwave(publicKey, secretKey);

    logger.info('Flutterwave gateway initialized', {
      gatewayId: this.getId(),
    });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return this.executeWithRetry(async () => {
      this.validatePaymentRequest(request);

      this.logOperation('processPayment', {
        amount: request.amount,
        currency: request.currency,
        paymentMethodId: request.paymentMethodId,
      });

      try {
        // Create payment payload
        const payload = {
          tx_ref:
            request.internalReference ||
            `flw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: request.amount,
          currency: request.currency.toUpperCase(),
          redirect_url:
            request.metadata?.callbackUrl || 'https://example.com/callback',
          customer: {
            email:
              request.metadata?.customerEmail ||
              `customer-${request.userId}@example.com`,
            phonenumber: request.metadata?.customerPhone || '',
            name: request.metadata?.customerName || 'Customer',
          },
          customizations: {
            title: 'Payment',
            description: request.description || 'Payment for services',
            logo: request.metadata?.logo,
          },
          meta: {
            userId: request.userId || '',
            merchantId: request.merchantId || '',
            internalReference: request.internalReference || '',
            externalReference: request.externalReference || '',
            ...request.metadata,
          },
        };

        // Add payment options if specified
        if (request.metadata?.paymentOptions) {
          payload.payment_options = request.metadata.paymentOptions;
        }

        const response = await this.flw.StandardSubaccount.create(payload);

        if (response.status !== 'success') {
          throw new Error(response.message || 'Payment initialization failed');
        }

        const paymentResponse: PaymentResponse = {
          id: payload.tx_ref,
          status: 'pending' as PaymentStatus,
          amount: new Decimal(request.amount),
          currency: request.currency.toUpperCase(),
          clientSecret: response.data.link,
          requiresAction: true,
          nextAction: {
            type: 'redirect',
            redirectUrl: response.data.link,
          },
          metadata: {
            flutterwaveReference: payload.tx_ref,
            paymentLink: response.data.link,
            ...payload.meta,
          },
          createdAt: new Date(),
        };

        this.logOperation('processPayment completed', {
          paymentId: paymentResponse.id,
          status: paymentResponse.status,
          flutterwaveReference: payload.tx_ref,
        });

        return paymentResponse;
      } catch (error) {
        this.logError(
          'processPayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            amount: request.amount,
            currency: request.currency,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'processPayment'
        );
      }
    }, 'processPayment');
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  }

  async capturePayment(
    transactionId: string,
    amount?: number
  ): Promise<PaymentResponse> {
<<<<<<< HEAD
    logger.info('Flutterwave capture (TEMPLATE)', { transactionId });

    return {
      id: transactionId,
      status: 'succeeded' as PaymentStatus,
      amount: new Decimal(amount || 100),
      currency: 'USD',
      gatewayId: this.getId(),
      createdAt: new Date(),
    };
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    logger.info('Flutterwave cancel (TEMPLATE)', { transactionId });

    return {
      id: transactionId,
      status: 'cancelled' as PaymentStatus,
      amount: new Decimal(0),
      currency: 'USD',
      gatewayId: this.getId(),
      createdAt: new Date(),
    };
=======
    return this.executeWithRetry(async () => {
      this.logOperation('capturePayment', {
        transactionId,
        amount,
      });

      try {
        // Verify the transaction to get current status
        const response = await this.flw.Transaction.verify({
          id: transactionId,
        });

        if (response.status !== 'success') {
          throw new Error(
            response.message || 'Transaction verification failed'
          );
        }

        const transaction = response.data;

        const paymentResponse: PaymentResponse = {
          id: transaction.tx_ref,
          status: this.mapFlutterwaveStatus(transaction.status),
          amount: new Decimal(transaction.amount),
          currency: transaction.currency,
          metadata: {
            flutterwaveId: transaction.id,
            processor: transaction.processor,
            paymentType: transaction.payment_type,
            chargedAmount: transaction.charged_amount,
            appFee: transaction.app_fee,
            merchantFee: transaction.merchant_fee,
            processorResponse: transaction.processor_response,
            authModel: transaction.auth_model,
            ip: transaction.ip,
            narration: transaction.narration,
            createdAt: transaction.created_at,
          },
          createdAt: new Date(transaction.created_at),
        };

        this.logOperation('capturePayment completed', {
          transactionId,
          status: paymentResponse.status,
        });

        return paymentResponse;
      } catch (error) {
        this.logError(
          'capturePayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            transactionId,
            amount,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'capturePayment'
        );
      }
    }, 'capturePayment');
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    return this.executeWithRetry(async () => {
      this.logOperation('cancelPayment', {
        transactionId,
      });

      try {
        // Flutterwave doesn't have a direct cancel endpoint for pending transactions
        // We'll verify the transaction and return its current status as cancelled
        const response = await this.flw.Transaction.verify({
          id: transactionId,
        });

        if (response.status !== 'success') {
          throw new Error(
            response.message || 'Transaction verification failed'
          );
        }

        const transaction = response.data;

        const paymentResponse: PaymentResponse = {
          id: transaction.tx_ref,
          status: 'cancelled' as PaymentStatus,
          amount: new Decimal(transaction.amount),
          currency: transaction.currency,
          metadata: {
            flutterwaveId: transaction.id,
            originalStatus: transaction.status,
            cancelledAt: new Date().toISOString(),
          },
          createdAt: new Date(transaction.created_at),
        };

        this.logOperation('cancelPayment completed', {
          transactionId,
          status: paymentResponse.status,
        });

        return paymentResponse;
      } catch (error) {
        this.logError(
          'cancelPayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            transactionId,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'cancelPayment'
        );
      }
    }, 'cancelPayment');
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  }

  async refundPayment(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Refund> {
<<<<<<< HEAD
    logger.info('Flutterwave refund (TEMPLATE)', { transactionId });

    return {
      id: `flw_refund_${Date.now()}`,
      transactionId,
      amount: new Decimal(amount || 100),
      currency: 'USD',
      reason: reason || 'requested_by_customer',
      status: 'succeeded' as PaymentStatus,
      processedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    return {
      id: `flw_pm_${Date.now()}`,
      userId: data.userId || '',
      type: 'card',
      provider: 'flutterwave',
      token: `flw_token_${Date.now()}`,
      isDefault: false,
      isActive: true,
      metadata: { last4: '4187', brand: 'visa' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    return this.createPaymentMethod({ ...data, id });
  }

  async deletePaymentMethod(id: string): Promise<void> {
    logger.info('Flutterwave delete PM (TEMPLATE)', { id });
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    return this.createPaymentMethod({ id });
  }

  verifyWebhook(payload: string, signature: string): boolean {
    return true; // TODO: Implement actual verification
  }

  parseWebhook(payload: string): WebhookEvent {
    return {
      id: `flw_evt_${Date.now()}`,
      type: 'charge.completed',
      gatewayId: this.getId(),
      gatewayEventId: `flw_evt_${Date.now()}`,
      data: {},
      timestamp: new Date(),
      processed: false,
      retryCount: 0,
    };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async getStatus(): Promise<'active' | 'inactive' | 'maintenance' | 'error'> {
    return 'active';
=======
    return this.executeWithRetry(async () => {
      this.logOperation('refundPayment', {
        transactionId,
        amount,
        reason,
      });

      try {
        // First verify the transaction exists
        const verifyResponse = await this.flw.Transaction.verify({
          id: transactionId,
        });
        if (verifyResponse.status !== 'success') {
          throw new Error('Transaction not found');
        }

        const transaction = verifyResponse.data;
        const refundAmount = amount || transaction.amount;

        // Create refund
        const refundPayload = {
          id: transaction.id,
          amount: refundAmount,
        };

        if (reason) {
          refundPayload.comments = reason;
        }

        const response = await this.flw.Transaction.refund(refundPayload);

        if (response.status !== 'success') {
          throw new Error(response.message || 'Refund creation failed');
        }

        const refundData = response.data;

        const refund: Refund = {
          id: `flw_refund_${refundData.id}`,
          transactionId,
          amount: new Decimal(refundData.amount_refunded),
          currency: transaction.currency,
          reason: reason || 'requested_by_customer',
          status: this.mapFlutterwaveRefundStatus(refundData.status),
          gatewayRefundId: refundData.id.toString(),
          metadata: {
            flutterwaveRefundId: refundData.id,
            refundedBy: refundData.refunded_by,
            refundedAt: refundData.refunded_at,
            comments: refundData.comments,
            settlementId: refundData.settlement_id,
          },
          processedAt:
            refundData.status === 'completed' && refundData.refunded_at
              ? new Date(refundData.refunded_at)
              : undefined,
          createdAt: new Date(refundData.created_at),
          updatedAt: new Date(),
        };

        this.logOperation('refundPayment completed', {
          refundId: refund.id,
          status: refund.status,
        });

        return refund;
      } catch (error) {
        this.logError(
          'refundPayment',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            transactionId,
            amount,
            reason,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'refundPayment'
        );
      }
    }, 'refundPayment');
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('createPaymentMethod', {
        type: data.type,
        userId: data.userId,
      });

      try {
        // Flutterwave doesn't have a direct payment method creation endpoint
        // We'll create a customer and return a placeholder payment method
        const customerPayload = {
          email: data.email || `customer-${data.userId}@example.com`,
          full_name: `${data.firstName || 'Customer'} ${data.lastName || 'User'}`,
          phone_number: data.phone || '',
        };

        const response = await this.flw.Customer.create(customerPayload);

        if (response.status !== 'success') {
          throw new Error(response.message || 'Customer creation failed');
        }

        const customer = response.data;

        const paymentMethod: PaymentMethod = {
          id: `flw_pm_${customer.id}`,
          userId: data.userId,
          type: 'card' as PaymentMethodType,
          provider: 'flutterwave',
          token: customer.id.toString(),
          isDefault: data.isDefault || false,
          metadata: {
            customerId: customer.id,
            email: customer.email,
            fullName: customer.full_name,
            phoneNumber: customer.phone_number,
          } as any,
          isActive: true,
          createdAt: new Date(customer.created_at),
          updatedAt: new Date(),
        };

        this.logOperation('createPaymentMethod completed', {
          paymentMethodId: paymentMethod.id,
          type: paymentMethod.type,
        });

        return paymentMethod;
      } catch (error) {
        this.logError(
          'createPaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            type: data.type,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'createPaymentMethod'
        );
      }
    }, 'createPaymentMethod');
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('updatePaymentMethod', {
        paymentMethodId: id,
      });

      try {
        // Extract customer ID from payment method ID
        const customerId = id.replace('flw_pm_', '');

        const updatePayload: any = {};
        if (data.firstName || data.lastName) {
          updatePayload.full_name =
            `${data.firstName || ''} ${data.lastName || ''}`.trim();
        }
        if (data.phone) updatePayload.phone_number = data.phone;

        const response = await this.flw.Customer.update(
          customerId,
          updatePayload
        );

        if (response.status !== 'success') {
          throw new Error(response.message || 'Customer update failed');
        }

        const customer = response.data;

        const paymentMethod: PaymentMethod = {
          id,
          userId: data.userId || '',
          type: 'card' as PaymentMethodType,
          provider: 'flutterwave',
          token: customer.id.toString(),
          isDefault: data.isDefault || false,
          metadata: {
            customerId: customer.id,
            email: customer.email,
            fullName: customer.full_name,
            phoneNumber: customer.phone_number,
          } as any,
          isActive: true,
          createdAt: new Date(customer.created_at),
          updatedAt: new Date(),
        };

        this.logOperation('updatePaymentMethod completed', {
          paymentMethodId: id,
        });

        return paymentMethod;
      } catch (error) {
        this.logError(
          'updatePaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            paymentMethodId: id,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'updatePaymentMethod'
        );
      }
    }, 'updatePaymentMethod');
  }

  async deletePaymentMethod(id: string): Promise<void> {
    return this.executeWithRetry(async () => {
      this.logOperation('deletePaymentMethod', {
        paymentMethodId: id,
      });

      try {
        // Extract customer ID from payment method ID
        const customerId = id.replace('flw_pm_', '');

        // Flutterwave doesn't have a delete customer endpoint
        // We'll just log the deletion (in a real implementation, you might mark as inactive in your database)
        logger.info('Payment method marked for deletion', {
          gatewayId: this.getId(),
          paymentMethodId: id,
          customerId,
        });

        this.logOperation('deletePaymentMethod completed', {
          paymentMethodId: id,
        });
      } catch (error) {
        this.logError(
          'deletePaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            paymentMethodId: id,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'deletePaymentMethod'
        );
      }
    }, 'deletePaymentMethod');
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('getPaymentMethod', {
        paymentMethodId: id,
      });

      try {
        // Extract customer ID from payment method ID
        const customerId = id.replace('flw_pm_', '');

        const response = await this.flw.Customer.fetch(customerId);

        if (response.status !== 'success') {
          throw new Error(response.message || 'Customer fetch failed');
        }

        const customer = response.data;

        const paymentMethod: PaymentMethod = {
          id,
          userId: '', // This would need to be retrieved from our database
          type: 'card' as PaymentMethodType,
          provider: 'flutterwave',
          token: customer.id.toString(),
          isDefault: false, // This would need to be retrieved from our database
          metadata: {
            customerId: customer.id,
            email: customer.email,
            fullName: customer.full_name,
            phoneNumber: customer.phone_number,
          } as any,
          isActive: true,
          createdAt: new Date(customer.created_at),
          updatedAt: new Date(),
        };

        this.logOperation('getPaymentMethod completed', {
          paymentMethodId: id,
          type: paymentMethod.type,
        });

        return paymentMethod;
      } catch (error) {
        this.logError(
          'getPaymentMethod',
          error instanceof Error ? error : new Error('Unknown error'),
          {
            paymentMethodId: id,
          }
        );
        throw this.createGatewayError(
          error instanceof Error ? error : new Error('Unknown error'),
          'getPaymentMethod'
        );
      }
    }, 'getPaymentMethod');
  }

  verifyWebhook(payload: string, signature: string): boolean {
    try {
      const webhookSecret = this.config.credentials.webhookSecret;
      if (!webhookSecret) {
        logger.error('Webhook secret not configured for Flutterwave gateway', {
          gatewayId: this.getId(),
        });
        return false;
      }

      // Flutterwave uses HMAC SHA256 for webhook verification
      const crypto = require('crypto');
      const hash = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      const isValid = hash === signature;

      if (isValid) {
        logger.debug('Flutterwave webhook signature verified successfully', {
          gatewayId: this.getId(),
        });
      } else {
        logger.error('Flutterwave webhook verification failed', {
          gatewayId: this.getId(),
          expectedHash: hash,
          receivedSignature: signature,
        });
      }

      return isValid;
    } catch (error) {
      logger.error('Flutterwave webhook verification failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  parseWebhook(payload: string): WebhookEvent {
    try {
      const flutterwaveEvent = JSON.parse(payload);

      const webhookEvent: WebhookEvent = {
        id: `flw_${flutterwaveEvent.data?.id || Date.now()}`,
        type: this.mapFlutterwaveEventType(flutterwaveEvent.event),
        gatewayId: this.getId(),
        gatewayEventId:
          flutterwaveEvent.data?.id?.toString() || `unknown_${Date.now()}`,
        data: flutterwaveEvent.data,
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
        metadata: {
          flutterwaveEvent: flutterwaveEvent.event,
          eventType: flutterwaveEvent['event.type'],
        },
      };

      logger.info('Flutterwave webhook parsed successfully', {
        gatewayId: this.getId(),
        eventType: webhookEvent.type,
        flutterwaveEvent: flutterwaveEvent.event,
        eventId: webhookEvent.id,
      });

      return webhookEvent;
    } catch (error) {
      logger.error('Flutterwave webhook parsing failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      logger.debug('Performing Flutterwave health check', {
        gatewayId: this.getId(),
      });

      // Perform a simple API call to check connectivity
      const response = await this.flw.Misc.balance({ currency: 'NGN' });

      const isHealthy = response.status === 'success';

      if (isHealthy) {
        logger.debug('Flutterwave health check completed successfully', {
          gatewayId: this.getId(),
        });
      } else {
        logger.error('Flutterwave health check failed', {
          gatewayId: this.getId(),
          response: response.message,
        });
      }

      return isHealthy;
    } catch (error) {
      logger.error('Flutterwave health check failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async getStatus(): Promise<GatewayStatus> {
    try {
      const isHealthy = await this.healthCheck();
      return isHealthy ? 'active' : 'error';
    } catch (error) {
      logger.error('Failed to get Flutterwave gateway status', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return 'error';
    }
  }

  /**
   * Maps Flutterwave transaction status to our payment status
   */
  private mapFlutterwaveStatus(flutterwaveStatus: string): PaymentStatus {
    switch (flutterwaveStatus) {
      case 'successful':
        return 'succeeded';
      case 'failed':
        return 'failed';
      case 'cancelled':
        return 'cancelled';
      case 'pending':
      default:
        return 'pending';
    }
  }

  /**
   * Maps Flutterwave refund status to our payment status
   */
  private mapFlutterwaveRefundStatus(flutterwaveStatus: string): PaymentStatus {
    switch (flutterwaveStatus) {
      case 'completed':
        return 'succeeded';
      case 'pending':
        return 'processing';
      case 'failed':
        return 'failed';
      default:
        return 'pending';
    }
  }

  /**
   * Maps Flutterwave event types to our webhook event types
   */
  private mapFlutterwaveEventType(flutterwaveEventType: string): string {
    const eventMap: Record<string, string> = {
      'charge.completed': 'payment.succeeded',
      'charge.failed': 'payment.failed',
      'transfer.completed': 'transfer.succeeded',
      'transfer.failed': 'transfer.failed',
      'refund.completed': 'refund.succeeded',
      'refund.failed': 'refund.failed',
      'plan.created': 'subscription.created',
      'subscription.cancelled': 'subscription.cancelled',
      'invoice.created': 'invoice.created',
      'invoice.updated': 'invoice.updated',
    };

    return eventMap[flutterwaveEventType] || flutterwaveEventType;
>>>>>>> 80848195b954cd48b7cf34d46db2de99581cbe03
  }
}
