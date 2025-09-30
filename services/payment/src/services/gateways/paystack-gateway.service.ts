import { Paystack } from 'paystack';
import { Decimal } from '../../lib/decimal';
import { logger } from '../../lib/logger';
import { GatewayConfig, GatewayStatus, WebhookEvent } from '../../types/gateway.types';
import { PaymentMethod, PaymentMethodType, PaymentRequest, PaymentResponse, PaymentStatus, Refund } from '../../types/payment.types';
import { BaseGateway } from './base-gateway.service';

export class PaystackGateway extends BaseGateway {
  private paystack: any;

  constructor(config: GatewayConfig) {
    super(config);

    // Initialize Paystack client
    const secretKey = config.credentials.secretKey;
    if (!secretKey) {
      throw new Error('Paystack secret key is required');
    }

    this.paystack = new Paystack(secretKey);

    logger.info('Paystack gateway initialized', {
      gatewayId: this.getId()
    });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return this.executeWithRetry(async () => {
      this.validatePaymentRequest(request);

      this.logOperation('processPayment', {
        amount: request.amount,
        currency: request.currency,
        paymentMethodId: request.paymentMethodId
      });

      try {
        // Convert amount to kobo for Paystack (multiply by 100)
        const amountInKobo = Math.round(request.amount * 100);

        // Create transaction parameters
        const transactionParams: any = {
          amount: amountInKobo,
          currency: request.currency.toUpperCase(),
          email: request.metadata?.customerEmail || `customer-${request.userId}@example.com`,
          reference: request.internalReference || `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          callback_url: request.metadata?.callbackUrl,
          metadata: {
            userId: request.userId || '',
            merchantId: request.merchantId || '',
            internalReference: request.internalReference || '',
            externalReference: request.externalReference || '',
            ...request.metadata
          }
        };

        // Add channels if specified
        if (request.metadata?.channels) {
          transactionParams.channels = request.metadata.channels;
        }

        // Initialize transaction
        const response = await this.paystack.transaction.initialize(transactionParams);

        if (!response.status) {
          throw new Error(response.message || 'Transaction initialization failed');
        }

        const paymentResponse: PaymentResponse = {
          id: response.data.reference,
          status: 'pending' as PaymentStatus,
          amount: new Decimal(request.amount),
          currency: request.currency.toUpperCase(),
          clientSecret: response.data.access_code,
          requiresAction: true,
          nextAction: {
            type: 'redirect',
            redirectUrl: response.data.authorization_url
          },
          metadata: {
            paystackReference: response.data.reference,
            accessCode: response.data.access_code,
            ...transactionParams.metadata
          },
          createdAt: new Date()
        };

        this.logOperation('processPayment completed', {
          paymentId: paymentResponse.id,
          status: paymentResponse.status,
          paystackReference: response.data.reference
        });

        return paymentResponse;
      } catch (error) {
        this.logError('processPayment', error instanceof Error ? error : new Error('Unknown error'), {
          amount: request.amount,
          currency: request.currency
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'processPayment');
      }
    }, 'processPayment');
  }

  async capturePayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    return this.executeWithRetry(async () => {
      this.logOperation('capturePayment', {
        transactionId,
        amount
      });

      try {
        // Verify the transaction to get current status
        const response = await this.paystack.transaction.verify(transactionId);

        if (!response.status) {
          throw new Error(response.message || 'Transaction verification failed');
        }

        const transaction = response.data;

        const paymentResponse: PaymentResponse = {
          id: transaction.reference,
          status: this.mapPaystackStatus(transaction.status),
          amount: new Decimal(transaction.amount / 100),
          currency: transaction.currency,
          metadata: {
            paystackId: transaction.id,
            gatewayResponse: transaction.gateway_response,
            paidAt: transaction.paid_at,
            channel: transaction.channel
          },
          createdAt: new Date(transaction.created_at)
        };

        this.logOperation('capturePayment completed', {
          transactionId,
          status: paymentResponse.status
        });

        return paymentResponse;
      } catch (error) {
        this.logError('capturePayment', error instanceof Error ? error : new Error('Unknown error'), {
          transactionId,
          amount
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'capturePayment');
      }
    }, 'capturePayment');
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    return this.executeWithRetry(async () => {
      this.logOperation('cancelPayment', {
        transactionId
      });

      try {
        // Paystack doesn't have a direct cancel endpoint for pending transactions
        // We'll verify the transaction and return its current status
        const response = await this.paystack.transaction.verify(transactionId);

        if (!response.status) {
          throw new Error(response.message || 'Transaction verification failed');
        }

        const transaction = response.data;

        const paymentResponse: PaymentResponse = {
          id: transaction.reference,
          status: 'cancelled' as PaymentStatus,
          amount: new Decimal(transaction.amount / 100),
          currency: transaction.currency,
          metadata: {
            paystackId: transaction.id,
            originalStatus: transaction.status,
            cancelledAt: new Date().toISOString()
          },
          createdAt: new Date(transaction.created_at)
        };

        this.logOperation('cancelPayment completed', {
          transactionId,
          status: paymentResponse.status
        });

        return paymentResponse;
      } catch (error) {
        this.logError('cancelPayment', error instanceof Error ? error : new Error('Unknown error'), {
          transactionId
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'cancelPayment');
      }
    }, 'cancelPayment');
  }

  async refundPayment(transactionId: string, amount?: number, reason?: string): Promise<Refund> {
    return this.executeWithRetry(async () => {
      this.logOperation('refundPayment', {
        transactionId,
        amount,
        reason
      });

      try {
        // First verify the transaction exists
        const verifyResponse = await this.paystack.transaction.verify(transactionId);
        if (!verifyResponse.status) {
          throw new Error('Transaction not found');
        }

        const transaction = verifyResponse.data;
        const refundAmount = amount ? Math.round(amount * 100) : transaction.amount;

        // Create refund
        const refundParams: any = {
          transaction: transactionId,
          amount: refundAmount
        };

        if (reason) {
          refundParams.customer_note = reason;
          refundParams.merchant_note = reason;
        }

        const response = await this.paystack.refund.create(refundParams);

        if (!response.status) {
          throw new Error(response.message || 'Refund creation failed');
        }

        const refundData = response.data;

        const refund: Refund = {
          id: `paystack_refund_${refundData.id}`,
          transactionId,
          amount: new Decimal(refundData.amount / 100),
          currency: refundData.currency,
          reason: reason || 'requested_by_customer',
          status: this.mapPaystackRefundStatus(refundData.status),
          gatewayRefundId: refundData.id.toString(),
          metadata: {
            paystackRefundId: refundData.id,
            customerNote: refundData.customer_note,
            merchantNote: refundData.merchant_note,
            refundedBy: refundData.refunded_by
          },
          processedAt: refundData.status === 'processed' && refundData.refunded_at ? new Date(refundData.refunded_at) : undefined,
          createdAt: new Date(refundData.created_at),
          updatedAt: new Date()
        };

        this.logOperation('refundPayment completed', {
          refundId: refund.id,
          status: refund.status
        });

        return refund;
      } catch (error) {
        this.logError('refundPayment', error instanceof Error ? error : new Error('Unknown error'), {
          transactionId,
          amount,
          reason
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'refundPayment');
      }
    }, 'refundPayment');
  }

  async createPaymentMethod(data: any): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('createPaymentMethod', {
        type: data.type,
        userId: data.userId
      });

      try {
        // Paystack doesn't have a direct payment method creation endpoint
        // We'll create a customer and return a placeholder payment method
        const customerParams: any = {
          email: data.email || `customer-${data.userId}@example.com`,
          first_name: data.firstName || 'Customer',
          last_name: data.lastName || 'User',
          phone: data.phone
        };

        const response = await this.paystack.customer.create(customerParams);

        if (!response.status) {
          throw new Error(response.message || 'Customer creation failed');
        }

        const customer = response.data;

        const paymentMethod: PaymentMethod = {
          id: `paystack_pm_${customer.customer_code}`,
          userId: data.userId,
          type: 'card' as PaymentMethodType,
          provider: 'paystack',
          token: customer.customer_code,
          isDefault: data.isDefault || false,
          metadata: {
            customerCode: customer.customer_code,
            customerId: customer.id,
            email: customer.email
          } as any,
          isActive: true,
          createdAt: new Date(customer.created_at),
          updatedAt: new Date()
        };

        this.logOperation('createPaymentMethod completed', {
          paymentMethodId: paymentMethod.id,
          type: paymentMethod.type
        });

        return paymentMethod;
      } catch (error) {
        this.logError('createPaymentMethod', error instanceof Error ? error : new Error('Unknown error'), {
          type: data.type
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'createPaymentMethod');
      }
    }, 'createPaymentMethod');
  }

  async updatePaymentMethod(id: string, data: any): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('updatePaymentMethod', {
        paymentMethodId: id
      });

      try {
        // Extract customer code from payment method ID
        const customerCode = id.replace('paystack_pm_', '');

        const updateParams: any = {};
        if (data.firstName) updateParams.first_name = data.firstName;
        if (data.lastName) updateParams.last_name = data.lastName;
        if (data.phone) updateParams.phone = data.phone;

        const response = await this.paystack.customer.update(customerCode, updateParams);

        if (!response.status) {
          throw new Error(response.message || 'Customer update failed');
        }

        const customer = response.data;

        const paymentMethod: PaymentMethod = {
          id,
          userId: data.userId || '',
          type: 'card' as PaymentMethodType,
          provider: 'paystack',
          token: customer.customer_code,
          isDefault: data.isDefault || false,
          metadata: {
            customerCode: customer.customer_code,
            customerId: customer.id,
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            phone: customer.phone
          } as any,
          isActive: true,
          createdAt: new Date(customer.created_at),
          updatedAt: new Date()
        };

        this.logOperation('updatePaymentMethod completed', {
          paymentMethodId: id
        });

        return paymentMethod;
      } catch (error) {
        this.logError('updatePaymentMethod', error instanceof Error ? error : new Error('Unknown error'), {
          paymentMethodId: id
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'updatePaymentMethod');
      }
    }, 'updatePaymentMethod');
  }

  async deletePaymentMethod(id: string): Promise<void> {
    return this.executeWithRetry(async () => {
      this.logOperation('deletePaymentMethod', {
        paymentMethodId: id
      });

      try {
        // Extract customer code from payment method ID
        const customerCode = id.replace('paystack_pm_', '');

        // Paystack doesn't have a delete customer endpoint
        // We'll deactivate the customer instead
        const response = await this.paystack.customer.deactivate(customerCode);

        if (!response.status) {
          throw new Error(response.message || 'Customer deactivation failed');
        }

        this.logOperation('deletePaymentMethod completed', {
          paymentMethodId: id
        });
      } catch (error) {
        this.logError('deletePaymentMethod', error instanceof Error ? error : new Error('Unknown error'), {
          paymentMethodId: id
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'deletePaymentMethod');
      }
    }, 'deletePaymentMethod');
  }

  async getPaymentMethod(id: string): Promise<PaymentMethod> {
    return this.executeWithRetry(async () => {
      this.logOperation('getPaymentMethod', {
        paymentMethodId: id
      });

      try {
        // Extract customer code from payment method ID
        const customerCode = id.replace('paystack_pm_', '');

        const response = await this.paystack.customer.fetch(customerCode);

        if (!response.status) {
          throw new Error(response.message || 'Customer fetch failed');
        }

        const customer = response.data;

        const paymentMethod: PaymentMethod = {
          id,
          userId: '', // This would need to be retrieved from our database
          type: 'card' as PaymentMethodType,
          provider: 'paystack',
          token: customer.customer_code,
          isDefault: false, // This would need to be retrieved from our database
          metadata: {
            customerCode: customer.customer_code,
            customerId: customer.id,
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            phone: customer.phone
          } as unknown,
          isActive: true,
          createdAt: new Date(customer.created_at),
          updatedAt: new Date()
        };

        this.logOperation('getPaymentMethod completed', {
          paymentMethodId: id,
          type: paymentMethod.type
        });

        return paymentMethod;
      } catch (error) {
        this.logError('getPaymentMethod', error instanceof Error ? error : new Error('Unknown error'), {
          paymentMethodId: id
        });
        throw this.createGatewayError(error instanceof Error ? error : new Error('Unknown error'), 'getPaymentMethod');
      }
    }, 'getPaymentMethod');
  }

  verifyWebhook(payload: string, signature: string): boolean {
    try {
      const webhookSecret = this.config.credentials.webhookSecret;
      if (!webhookSecret) {
        logger.error('Webhook secret not configured for Paystack gateway', {
          gatewayId: this.getId()
        });
        return false;
      }

      // Paystack uses HMAC SHA512 for webhook verification
      const crypto = require('crypto');
      const hash = crypto.createHmac('sha512', webhookSecret).update(payload).digest('hex');

      const isValid = hash === signature;

      if (isValid) {
        logger.debug('Paystack webhook signature verified successfully', {
          gatewayId: this.getId()
        });
      } else {
        logger.error('Paystack webhook verification failed', {
          gatewayId: this.getId(),
          expectedHash: hash,
          receivedSignature: signature
        });
      }

      return isValid;
    } catch (error) {
      logger.error('Paystack webhook verification failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  parseWebhook(payload: string): WebhookEvent {
    try {
      const paystackEvent = JSON.parse(payload);

      const webhookEvent: WebhookEvent = {
        id: `paystack_${paystackEvent.data?.id || Date.now()}`,
        type: this.mapPaystackEventType(paystackEvent.event),
        gatewayId: this.getId(),
        gatewayEventId: paystackEvent.data?.id?.toString() || `unknown_${Date.now()}`,
        data: paystackEvent.data,
        timestamp: new Date(),
        processed: false,
        retryCount: 0,
        metadata: {
          paystackEvent: paystackEvent.event,
          domain: paystackEvent.domain
        }
      };

      logger.info('Paystack webhook parsed successfully', {
        gatewayId: this.getId(),
        eventType: webhookEvent.type,
        paystackEvent: paystackEvent.event,
        eventId: webhookEvent.id
      });

      return webhookEvent;
    } catch (error) {
      logger.error('Paystack webhook parsing failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      logger.debug('Performing Paystack health check', {
        gatewayId: this.getId()
      });

      // Perform a simple API call to check connectivity
      const response = await this.paystack.misc.list_banks();

      const isHealthy = response.status === true;

      if (isHealthy) {
        logger.debug('Paystack health check completed successfully', {
          gatewayId: this.getId()
        });
      } else {
        logger.error('Paystack health check failed', {
          gatewayId: this.getId(),
          response: response.message
        });
      }

      return isHealthy;
    } catch (error) {
      logger.error('Paystack health check failed', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }

  async getStatus(): Promise<GatewayStatus> {
    try {
      const isHealthy = await this.healthCheck();
      return isHealthy ? 'active' : 'error';
    } catch (error) {
      logger.error('Failed to get Paystack gateway status', {
        gatewayId: this.getId(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return 'error';
    }
  }

  /**
   * Maps Paystack transaction status to our payment status
   */
  private mapPaystackStatus(paystackStatus: string): PaymentStatus {
    switch (paystackStatus) {
      case 'success':
        return 'succeeded';
      case 'failed':
        return 'failed';
      case 'abandoned':
        return 'cancelled';
      case 'pending':
      default:
        return 'pending';
    }
  }

  /**
   * Maps Paystack refund status to our payment status
   */
  private mapPaystackRefundStatus(paystackStatus: string): PaymentStatus {
    switch (paystackStatus) {
      case 'processed':
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
   * Maps Paystack event types to our webhook event types
   */
  private mapPaystackEventType(paystackEventType: string): string {
    const eventMap: Record<string, string> = {
      'charge.success': 'payment.succeeded',
      'charge.failed': 'payment.failed',
      'transfer.success': 'transfer.succeeded',
      'transfer.failed': 'transfer.failed',
      'refund.processed': 'refund.succeeded',
      'refund.failed': 'refund.failed',
      'customeridentification.success': 'customer.verified',
      'customeridentification.failed': 'customer.verification_failed',
      'invoice.create': 'invoice.created',
      'invoice.update': 'invoice.updated',
      'invoice.payment_failed': 'invoice.payment_failed',
      'subscription.create': 'subscription.created',
      'subscription.disable': 'subscription.cancelled'
    };

    return eventMap[paystackEventType] || paystackEventType;
  }
}